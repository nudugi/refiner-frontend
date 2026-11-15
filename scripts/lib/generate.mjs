// 아카이브 전체 빌드: 콘텐츠 읽기 → 이미지 최적화 → OG·스토리 카드 → QR.
// Vite 플러그인(개발·빌드)과 prerender 스크립트가 같이 쓴다.
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { loadContent } from './content.mjs';
import { optimizeImage, optimizeFrames } from './media.mjs';
import { renderOg, renderStory, cardKey } from './cards.mjs';
import { GEN_DIR, GEN_URL, SITE_URL, ROOT } from './config.mjs';

// 카드·QR 캐시 기록 (배포물에 들어가지 않게 public 밖에 둔다)
const MANIFEST = path.join(ROOT, 'node_modules/.cache/sunya/manifest.json');

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function writeIfChanged(rel, card, renderFn, manifest, stats) {
  const full = path.join(GEN_DIR, rel);
  const key = cardKey(card);
  if (manifest[rel] !== key || !fs.existsSync(full)) {
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, await renderFn(card));
    manifest[rel] = key;
    stats.cards++;
  }
  return `${GEN_URL}/${rel}`;
}

async function writeQr(rel, url, manifest) {
  const full = path.join(GEN_DIR, rel);
  if (manifest[rel] !== url || !fs.existsSync(full)) {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#141311', light: '#ffffff' },
    });
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, svg);
    manifest[rel] = url;
  }
  return `${GEN_URL}/${rel}`;
}

function names(slugs, artists) {
  return slugs.map((s) => artists[s]?.name).filter(Boolean);
}

function joinNames(list, max = 4) {
  if (list.length <= max) return list.join(' · ');
  return `${list.slice(0, max).join(' · ')} 외 ${list.length - max}명`;
}

export async function buildArchive({ log = () => {} } = {}) {
  const started = Date.now();
  const data = loadContent();
  const { artists, spaces, works, exhibitions } = data;
  const stats = { cards: 0 };
  fs.mkdirSync(GEN_DIR, { recursive: true });
  const manifest = readManifest();

  // ---------- 이미지 ----------
  for (const a of Object.values(artists)) a.portrait = await optimizeImage(a.portrait);
  for (const w of Object.values(works)) {
    w.images = await Promise.all(w.images.map(optimizeImage));
    if (w.turntable) {
      const opt = await optimizeFrames(w.turntable.frames);
      w.turntable = { ...w.turntable, ...opt };
    }
  }
  for (const ex of exhibitions) {
    ex.cover = await optimizeImage(ex.cover);
    ex.installationViews = await Promise.all(ex.installationViews.map(optimizeImage));
    ex.floorPlan = await optimizeImage(ex.floorPlan);
  }

  const exBySlug = Object.fromEntries(exhibitions.map((e) => [e.slug, e]));
  const workCardImage = (w) => w.images[0]?.src ?? w.turntable?.frames[0] ?? null;

  // ---------- 카드 · QR ----------
  for (const ex of exhibitions) {
    const sp = spaces[ex.space];
    const card = {
      eyebrow: `SUNYA ARCHIVE · ${ex.type}`,
      title: ex.title,
      subtitle: ex.titleEn,
      lines: [joinNames(names(ex.artists, artists)), ex.dateText, `${sp.name}, ${sp.city}`].filter(Boolean),
      image: ex.cover?.src,
    };
    ex.share = {
      og: await writeIfChanged(`og/exhibitions/${ex.slug}.png`, card, renderOg, manifest, stats),
      story: await writeIfChanged(`story/exhibitions/${ex.slug}.png`, card, renderStory, manifest, stats),
      qr: await writeQr(`qr/exhibitions/${ex.slug}.svg`, SITE_URL + ex.url, manifest),
    };
  }

  for (const w of Object.values(works)) {
    const latest = w.exhibitions.map((s) => exBySlug[s])[0];
    const meta = [w.year, w.materials].filter(Boolean).join(' · ');
    const card = {
      eyebrow: latest ? `「${latest.title}」` : 'SUNYA ARCHIVE',
      title: w.title,
      subtitle: joinNames(names(w.artists, artists)),
      lines: [meta, w.dimensions].filter(Boolean),
      image: workCardImage(w),
    };
    w.share = {
      og: await writeIfChanged(`og/works/${w.slug}.png`, card, renderOg, manifest, stats),
      story: await writeIfChanged(`story/works/${w.slug}.png`, card, renderStory, manifest, stats),
      qr: await writeQr(`qr/works/${w.slug}.svg`, SITE_URL + w.url, manifest),
    };
  }

  for (const a of Object.values(artists)) {
    const firstWork = a.works.map((s) => works[s]).find((w) => workCardImage(w));
    const card = {
      eyebrow: 'SUNYA ARCHIVE · 작가',
      title: a.name,
      subtitle: a.nameEn,
      lines: [a.mediums.join(' · '), a.exhibitions.length ? `참여 전시 ${a.exhibitions.length}` : ''].filter(Boolean),
      image: a.portrait?.src ?? (firstWork ? workCardImage(firstWork) : null),
    };
    a.share = { og: await writeIfChanged(`og/artists/${a.slug}.png`, card, renderOg, manifest, stats) };
  }

  for (const s of Object.values(spaces)) {
    const latest = s.exhibitions.map((x) => exBySlug[x])[0];
    const card = {
      eyebrow: `SUNYA ARCHIVE · ${s.type}`,
      title: s.name,
      subtitle: '',
      lines: [s.city, s.address, s.exhibitions.length ? `기록된 전시 ${s.exhibitions.length}` : ''].filter(Boolean),
      image: latest?.cover?.src,
    };
    s.share = { og: await writeIfChanged(`og/spaces/${s.slug}.png`, card, renderOg, manifest, stats) };
  }

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  log(
    `[sunya] 아카이브: 전시 ${exhibitions.length} · 작가 ${Object.keys(artists).length} · 작품 ${
      Object.keys(works).length
    } · 공간 ${Object.keys(spaces).length} (카드 ${stats.cards}장 새로 생성, ${Date.now() - started}ms)`,
  );
  return data;
}
