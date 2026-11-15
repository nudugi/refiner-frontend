// content/ 아래 YAML·Markdown을 읽어 검증하고, 서로 연결된 아카이브 데이터로 만든다.
// 이미지 최적화·카드·QR 생성은 generate.mjs가 이 결과 위에서 한다.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { marked } from 'marked';
import {
  CONTENT_DIR,
  PUBLIC_DIR,
  SITE_URL,
  SPACE_TYPES,
  EXHIBITION_TYPES,
} from './config.mjs';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EXHIBITION_SLUG_RE = /^(\d{4})-(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|avif)$/i;

class ContentErrors extends Error {
  constructor(errors) {
    super(
      `SUNYA 콘텐츠 오류 ${errors.length}건:\n` + errors.map((e) => `  - ${e}`).join('\n'),
    );
    this.name = 'ContentErrors';
    this.errors = errors;
  }
}

function parseYaml(text, file) {
  // CORE_SCHEMA: 2027-01-10 같은 날짜를 Date로 바꾸지 않고 문자열로 둔다.
  return yaml.load(text, { schema: yaml.CORE_SCHEMA, filename: file }) ?? {};
}

function readCollection(name, errors) {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  const entries = [];
  for (const file of fs.readdirSync(dir).sort()) {
    if (file.startsWith('_') || file.startsWith('.')) continue; // _template 등은 건너뜀
    const full = path.join(dir, file);
    const rel = path.relative(CONTENT_DIR, full);
    const ext = path.extname(file);
    if (!['.yaml', '.yml', '.md'].includes(ext)) continue;
    const text = fs.readFileSync(full, 'utf8');
    try {
      let data;
      let body = '';
      if (ext === '.md') {
        const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
        if (!m) {
          errors.push(`${rel}: 맨 위에 --- 로 감싼 frontmatter가 필요합니다.`);
          continue;
        }
        data = parseYaml(m[1], rel);
        body = m[2].trim();
      } else {
        data = parseYaml(text, rel);
      }
      const fileSlug = path.basename(file, ext);
      if (data.slug == null) data.slug = fileSlug;
      if (data.slug !== fileSlug) {
        errors.push(`${rel}: slug(${data.slug})와 파일 이름(${fileSlug})이 달라요. 둘을 맞춰 주세요.`);
      }
      entries.push({ data, body, file: rel });
    } catch (e) {
      errors.push(`${rel}: YAML을 읽을 수 없습니다 — ${e.message.split('\n')[0]}`);
    }
  }
  return entries;
}

function str(v) {
  return v == null ? '' : String(v).trim();
}

function list(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/** 이미지 경로 해석: '/...'나 'http'는 그대로, 아니면 public/archive/<collection>/<slug>/ 기준 */
function resolveMedia(p, collection, slug) {
  const s = str(p);
  if (!s) return '';
  if (s.startsWith('/') || /^https?:\/\//.test(s)) return s;
  return `/archive/${collection}/${slug}/${s.replace(/^\.\//, '')}`;
}

function checkLocalFile(url, where, errors) {
  if (!url || /^https?:\/\//.test(url)) return;
  const full = path.join(PUBLIC_DIR, decodeURI(url));
  if (!fs.existsSync(full)) errors.push(`${where}: 파일이 없습니다 → public${url}`);
}

function normalizeImage(raw, collection, slug, where, errors) {
  const obj = typeof raw === 'string' ? { src: raw } : raw ?? {};
  const src = resolveMedia(obj.src, collection, slug);
  if (!src) {
    errors.push(`${where}: 이미지 src가 비어 있습니다.`);
    return null;
  }
  checkLocalFile(src, where, errors);
  return {
    src,
    caption: str(obj.caption),
    alt: str(obj.alt) || str(obj.caption),
    credit: str(obj.credit),
  };
}

function requireFields(data, fields, file, errors) {
  for (const f of fields) {
    if (data[f] == null || str(data[f]) === '') errors.push(`${file}: ${f} 항목이 필요합니다.`);
  }
}

function checkSlug(slug, file, errors) {
  if (!SLUG_RE.test(String(slug))) {
    errors.push(`${file}: slug "${slug}"는 영어 소문자·숫자·하이픈(-)만 쓸 수 있어요.`);
  }
}

function formatSpan(start, end) {
  const [y1, m1, d1] = start.split('-');
  if (!end || end === start) return `${y1}.${m1}.${d1}`;
  const [y2, m2, d2] = end.split('-');
  if (y1 !== y2) return `${y1}.${m1}.${d1} – ${y2}.${m2}.${d2}`;
  return `${y1}.${m1}.${d1} – ${m2}.${d2}`;
}

export function loadContent() {
  const errors = [];
  const raw = {
    artists: readCollection('artists', errors),
    spaces: readCollection('spaces', errors),
    works: readCollection('works', errors),
    exhibitions: readCollection('exhibitions', errors),
  };

  // ---------- artists ----------
  const artists = {};
  for (const { data, file, body } of raw.artists) {
    requireFields(data, ['name'], file, errors);
    checkSlug(data.slug, file, errors);
    const links = data.links ?? {};
    artists[data.slug] = {
      ...data, // 나중에 넣을 필드(예: 관람 도장, 소장 기록 등)를 막지 않도록 그대로 통과
      slug: data.slug,
      name: str(data.name),
      nameEn: str(data.nameEn),
      bio: str(data.bio) || body,
      mediums: list(data.mediums).map(str).filter(Boolean),
      links: Object.fromEntries(
        Object.entries(links)
          .filter(([, v]) => str(v))
          .map(([k, v]) => [k, str(v)]),
      ),
      portrait: data.portrait
        ? normalizeImage(data.portrait, 'artists', data.slug, `${file} portrait`, errors)
        : null,
      url: `/artists/${data.slug}`,
    };
  }

  // ---------- spaces ----------
  const spaces = {};
  for (const { data, file } of raw.spaces) {
    requireFields(data, ['name', 'type', 'city'], file, errors);
    checkSlug(data.slug, file, errors);
    if (data.type && !SPACE_TYPES.includes(data.type)) {
      errors.push(`${file}: type "${data.type}"은(는) ${SPACE_TYPES.join('/')} 중 하나여야 합니다.`);
    }
    spaces[data.slug] = {
      ...data,
      slug: data.slug,
      name: str(data.name),
      type: str(data.type),
      address: str(data.address),
      city: str(data.city),
      link: str(data.link),
      url: `/spaces/${data.slug}`,
    };
  }

  // ---------- works ----------
  const works = {};
  for (const { data, file, body } of raw.works) {
    requireFields(data, ['title', 'artist'], file, errors);
    checkSlug(data.slug, file, errors);
    const artistSlugs = list(data.artist).map(str);
    for (const a of artistSlugs) {
      if (!artists[a]) errors.push(`${file}: artist "${a}"를 content/artists에서 찾을 수 없습니다.`);
    }
    let turntable = null;
    if (data.turntable) {
      const dirUrl = resolveMedia(data.turntable, 'works', data.slug).replace(/\/$/, '');
      const dirFull = path.join(PUBLIC_DIR, dirUrl);
      if (!fs.existsSync(dirFull)) {
        errors.push(`${file}: turntable 폴더가 없습니다 → public${dirUrl}`);
      } else {
        const frames = fs
          .readdirSync(dirFull)
          .filter((f) => IMAGE_EXT_RE.test(f))
          .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
          .map((f) => `${dirUrl}/${f}`);
        if (frames.length < 12) {
          errors.push(`${file}: turntable 이미지가 ${frames.length}장입니다. 24~36장을 권장해요(최소 12장).`);
        }
        turntable = { dir: dirUrl, frames };
      }
    }
    works[data.slug] = {
      ...data,
      slug: data.slug,
      title: str(data.title),
      titleEn: str(data.titleEn),
      artists: artistSlugs,
      year: str(data.year),
      materials: str(data.materials),
      dimensions: str(data.dimensions),
      description: str(data.description) || body,
      images: list(data.images)
        .map((img, i) => normalizeImage(img, 'works', data.slug, `${file} images[${i}]`, errors))
        .filter(Boolean),
      turntable,
      url: `/works/${data.slug}`,
    };
  }

  // ---------- exhibitions ----------
  const exhibitions = [];
  for (const { data, file, body } of raw.exhibitions) {
    requireFields(data, ['title', 'type', 'startDate', 'space', 'cover'], file, errors);
    const m = EXHIBITION_SLUG_RE.exec(String(data.slug));
    if (!m) {
      errors.push(`${file}: 전시 slug는 "연도-월-영문제목" 형식이어야 해요 (예: 2027-01-breathing-room).`);
    }
    const startDate = str(data.startDate);
    const endDate = str(data.endDate) || startDate;
    if (startDate && !DATE_RE.test(startDate)) errors.push(`${file}: startDate는 YYYY-MM-DD 형식이어야 합니다.`);
    if (endDate && !DATE_RE.test(endDate)) errors.push(`${file}: endDate는 YYYY-MM-DD 형식이어야 합니다.`);
    if (startDate && endDate && endDate < startDate) errors.push(`${file}: endDate가 startDate보다 빠릅니다.`);
    if (m && DATE_RE.test(startDate) && `${m[1]}-${m[2]}` !== startDate.slice(0, 7)) {
      errors.push(`${file}: slug의 연도-월(${m[1]}-${m[2]})이 startDate(${startDate.slice(0, 7)})와 다릅니다.`);
    }
    if (data.type && !EXHIBITION_TYPES.includes(data.type)) {
      errors.push(`${file}: type "${data.type}"은(는) ${EXHIBITION_TYPES.join('/')} 중 하나여야 합니다.`);
    }
    const space = str(data.space);
    if (space && !spaces[space]) errors.push(`${file}: space "${space}"를 content/spaces에서 찾을 수 없습니다.`);
    const exArtists = list(data.artists).map(str);
    for (const a of exArtists) {
      if (!artists[a]) errors.push(`${file}: artists의 "${a}"를 content/artists에서 찾을 수 없습니다.`);
    }
    const exWorks = list(data.works).map(str);
    for (const w of exWorks) {
      if (!works[w]) errors.push(`${file}: works의 "${w}"를 content/works에서 찾을 수 없습니다.`);
    }
    const slug = data.slug;
    exhibitions.push({
      ...data,
      slug,
      title: str(data.title),
      titleEn: str(data.titleEn),
      type: str(data.type),
      startDate,
      endDate,
      dateText: startDate ? formatSpan(startDate, endDate) : '',
      space,
      artists: exArtists,
      curators: list(data.curators).map(str).filter(Boolean),
      cover: data.cover ? normalizeImage(data.cover, 'exhibitions', slug, `${file} cover`, errors) : null,
      installationViews: list(data.installationViews)
        .map((img, i) =>
          normalizeImage(img, 'exhibitions', slug, `${file} installationViews[${i}]`, errors),
        )
        .filter(Boolean),
      floorPlan: data.floorPlan
        ? normalizeImage(data.floorPlan, 'exhibitions', slug, `${file} floorPlan`, errors)
        : null,
      works: exWorks,
      reviews: list(data.reviews).map((r) => ({
        title: str(r?.title),
        author: str(r?.author),
        link: str(r?.link),
        publication: str(r?.publication),
      })),
      introHtml: body ? marked.parse(body) : '',
      introText: body
        ? body
            .replace(/[#>*_`[\]()!-]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
        : '',
      url: `/exhibitions/${slug}`,
    });
  }

  // ---------- redirects ----------
  let redirects = [];
  const redirectsFile = path.join(CONTENT_DIR, 'redirects.yaml');
  if (fs.existsSync(redirectsFile)) {
    try {
      redirects = list(parseYaml(fs.readFileSync(redirectsFile, 'utf8'), 'redirects.yaml').redirects)
        .map((r) => ({ from: str(r?.from).replace(/\/$/, ''), to: str(r?.to) }))
        .filter((r) => r.from && r.to);
      for (const r of redirects) {
        if (!r.from.startsWith('/') || !r.to.startsWith('/')) {
          errors.push(`redirects.yaml: from/to는 /로 시작하는 경로여야 합니다 (${r.from} → ${r.to}).`);
        }
      }
    } catch (e) {
      errors.push(`redirects.yaml: ${e.message.split('\n')[0]}`);
    }
  }

  if (errors.length) throw new ContentErrors(errors);

  // ---------- 관계 연결 (작가 방·공간 페이지가 저절로 채워지게) ----------
  exhibitions.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));

  for (const a of Object.values(artists)) {
    a.exhibitions = [];
    a.works = [];
  }
  for (const s of Object.values(spaces)) s.exhibitions = [];
  for (const w of Object.values(works)) w.exhibitions = [];

  for (const w of Object.values(works)) {
    for (const a of w.artists) artists[a].works.push(w.slug);
  }
  for (const ex of exhibitions) {
    spaces[ex.space].exhibitions.push(ex.slug);
    const involved = new Set(ex.artists);
    for (const w of ex.works) {
      works[w].exhibitions.push(ex.slug);
      for (const a of works[w].artists) involved.add(a);
    }
    for (const a of involved) artists[a].exhibitions.push(ex.slug);
  }
  // 작가 작품은 최신 연도 순
  for (const a of Object.values(artists)) {
    a.works.sort((x, y) => String(works[y].year).localeCompare(String(works[x].year)));
  }

  return { siteUrl: SITE_URL, artists, spaces, works, exhibitions, redirects };
}

export { ContentErrors };
