// vite build 다음에 실행: 경로마다 정적 HTML(제목·설명·OG·JSON-LD)을 만든다.
// 카카오톡·인스타그램·검색엔진은 JS를 실행하지 않고 HTML만 읽기 때문에 필요하다.
// 또 sitemap.xml과 예전 주소 → 새 주소 리다이렉트 페이지를 만든다.
import fs from 'node:fs';
import path from 'node:path';
import { buildArchive } from './lib/generate.mjs';
import { ROOT, SITE_URL } from './lib/config.mjs';
import { exhibitionCitation, artistNames, workCaption, workThumb } from '../src/archive/lib.js';
import { siteMeta, worksPage, aboutPage, toolsPage, toolPage } from '../src/content/siteContent.js';

const DIST = path.join(ROOT, 'dist');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (!template.includes('<!--sunya:head-->')) {
  throw new Error('dist/index.html에 <!--sunya:head--> 표시가 없습니다. index.html을 확인하세요.');
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (u) => (u ? (u.startsWith('http') ? u : SITE_URL + u) : undefined);
const clip = (s = '', n = 150) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function head({ title, description, path: p, image, type = 'website', jsonld }) {
  const url = SITE_URL + (p === '/' ? '/' : p);
  const img = abs(image) ?? `${SITE_URL}/brand/sketch-head.jpg`;
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="SUNYA" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    ...(image && image.includes('/og/')
      ? [`<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`]
      : []),
    `<meta property="og:locale" content="ko_KR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  for (const ld of [].concat(jsonld ?? [])) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  return lines.join('\n    ');
}

/** JS 없이도 읽히는 본문 요약(검색엔진용). 화면에는 보이지 않고 React가 뜨면 교체된다 */
function fallback(inner) {
  return `<div id="root"><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${inner}</div></div>`;
}

function writePage(p, meta, body = '') {
  let html = template.replace(/<!--sunya:head-->[\s\S]*?<!--\/sunya:head-->/, head({ ...meta, path: p }));
  if (body) html = html.replace('<div id="root"></div>', fallback(body));
  // /exhibitions/x → dist/exhibitions/x.html (Vercel cleanUrls · Cloudflare Pages · vite preview 모두 이 방식으로 서빙)
  const out = p === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${p}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const data = await buildArchive({ log: console.log });
const { artists, spaces, works, exhibitions, redirects } = data;
const routes = [];
const page = (p, meta, body) => {
  writePage(p, meta, body);
  routes.push(p);
};

// ---------- 기존 스튜디오 페이지 ----------
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SUNYA',
  alternateName: ['스튜디오 슈냐', 'Studio SUNYA'],
  url: SITE_URL,
  logo: `${SITE_URL}/brand/mark-black.png`,
  description: '비어있음에서 형태를 만드는 오브제 스튜디오',
};
page('/', { title: siteMeta.title, description: siteMeta.description, jsonld: ORG });
page('/objects', { title: 'Objects | SUNYA', description: worksPage.desc });
page('/about', { title: 'About | SUNYA', description: aboutPage.paragraphs[0] });
page('/tools', { title: 'Tools | SUNYA', description: toolsPage.desc });
page('/refiner', { title: `${toolPage.title} | SUNYA`, description: toolPage.aboutLines.join(' ') });

// ---------- 아카이브 목록 ----------
page(
  '/exhibitions',
  {
    title: '전시 기록 | SUNYA',
    description: '졸전, 과제전, 작업실 오픈, 카페 전시, 하루짜리 팝업까지. 끝나도 사라지지 않는 작은 전시의 기록.',
  },
  `<h1>전시 기록</h1><ul>${exhibitions
    .map((e) => `<li><a href="${e.url}">${esc(e.title)}</a> ${esc(e.dateText)}</li>`)
    .join('')}</ul>`,
);
page(
  '/artists',
  { title: '작가 | SUNYA', description: 'SUNYA 아카이브에 기록된 작가들' },
  `<h1>작가</h1><ul>${Object.values(artists)
    .map((a) => `<li><a href="${a.url}">${esc(a.name)}</a></li>`)
    .join('')}</ul>`,
);
page(
  '/works',
  { title: '작품 | SUNYA', description: 'SUNYA 아카이브에 기록된 작품들' },
  `<h1>작품</h1><ul>${Object.values(works)
    .map((w) => `<li><a href="${w.url}">${esc(workCaption(w, artists))}</a></li>`)
    .join('')}</ul>`,
);

// ---------- 전시 ----------
const person = (a) => ({
  '@type': 'Person',
  name: a.name,
  ...(a.nameEn ? { alternateName: a.nameEn } : {}),
  url: SITE_URL + a.url,
});
const place = (s) => ({
  '@type': 'Place',
  name: s.name,
  address: { '@type': 'PostalAddress', streetAddress: s.address || undefined, addressLocality: s.city, addressCountry: 'KR' },
  url: SITE_URL + s.url,
});

for (const ex of exhibitions) {
  const sp = spaces[ex.space];
  const names = artistNames(ex.artists, artists);
  const description = clip(
    `${ex.dateText} · ${sp.name}(${sp.city}) · ${names.join(', ')}. ${ex.introText}`.trim(),
  );
  page(
    ex.url,
    {
      title: `${ex.title}${ex.titleEn ? ` (${ex.titleEn})` : ''} | SUNYA`,
      description,
      image: ex.share.og,
      type: 'article',
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'ExhibitionEvent',
        name: ex.title,
        ...(ex.titleEn ? { alternateName: ex.titleEn } : {}),
        description: clip(ex.introText, 300) || undefined,
        startDate: ex.startDate,
        endDate: ex.endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        isAccessibleForFree: true,
        location: place(sp),
        image: [abs(ex.cover?.src), abs(ex.share.og)].filter(Boolean),
        url: SITE_URL + ex.url,
        contributor: ex.artists.map((a) => person(artists[a])),
        ...(ex.curators.length ? { organizer: ex.curators.map((name) => ({ '@type': 'Person', name })) } : {}),
        workFeatured: ex.works.map((w) => ({
          '@type': 'VisualArtwork',
          name: works[w].title,
          url: SITE_URL + works[w].url,
          creator: works[w].artists.map((a) => person(artists[a])),
        })),
      },
    },
    `<h1>${esc(ex.title)}</h1><p>${esc(ex.dateText)} · ${esc(sp.name)}, ${esc(sp.city)}</p><p>${esc(
      names.join(', '),
    )}</p>${ex.introHtml}<ul>${ex.works
      .map((w) => `<li><a href="${works[w].url}">${esc(workCaption(works[w], artists))}</a></li>`)
      .join('')}</ul><p>${esc(exhibitionCitation(ex, data))}</p>`,
  );
}

// ---------- 작품 ----------
for (const w of Object.values(works)) {
  const names = artistNames(w.artists, artists);
  const thumb = workThumb(w);
  page(
    w.url,
    {
      title: `${w.title} — ${names.join(', ')} | SUNYA`,
      description: clip([workCaption(w, artists), w.description].filter(Boolean).join('. ')),
      image: w.share.og,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        name: w.title,
        ...(w.titleEn ? { alternateName: w.titleEn } : {}),
        creator: w.artists.map((a) => person(artists[a])),
        dateCreated: w.year || undefined,
        artMedium: w.materials || undefined,
        size: w.dimensions || undefined,
        description: w.description || undefined,
        image: abs(thumb?.src),
        url: SITE_URL + w.url,
      },
    },
    `<h1>${esc(w.title)}</h1><p>${esc(workCaption(w, artists))}</p><p>${esc(w.description)}</p>`,
  );
}

// ---------- 작가 ----------
for (const a of Object.values(artists)) {
  page(
    a.url,
    {
      title: `${a.name}${a.nameEn ? ` (${a.nameEn})` : ''} | SUNYA`,
      description: clip(a.bio || `${a.name} — ${a.mediums.join(', ')}`),
      image: a.share.og,
      type: 'profile',
      jsonld: { '@context': 'https://schema.org', ...person(a), description: a.bio || undefined, sameAs: Object.values(a.links).filter((l) => l.startsWith('http')) },
    },
    `<h1>${esc(a.name)}</h1><p>${esc(a.bio)}</p><ul>${a.exhibitions
      .map((s) => exhibitions.find((e) => e.slug === s))
      .map((e) => `<li><a href="${e.url}">${esc(e.title)}</a> ${esc(e.dateText)}</li>`)
      .join('')}</ul>`,
  );
}

// ---------- 공간 ----------
for (const s of Object.values(spaces)) {
  page(
    s.url,
    {
      title: `${s.name} | SUNYA`,
      description: `${s.city} ${s.type} ${s.name}에서 열린 전시 기록`,
      image: s.share.og,
      jsonld: { '@context': 'https://schema.org', ...place(s) },
    },
    `<h1>${esc(s.name)}</h1><p>${esc(s.city)} ${esc(s.address)}</p>`,
  );
}

// ---------- 리다이렉트 (예전 주소) ----------
for (const r of redirects) {
  const out = path.join(DIST, `${r.from}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const to = esc(r.to);
  fs.writeFileSync(
    out,
    `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>이동했습니다 | SUNYA</title>` +
      `<link rel="canonical" href="${SITE_URL}${to}"><meta name="robots" content="noindex">` +
      `<meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(r.to)}+location.search+location.hash)</script>` +
      `</head><body><p><a href="${to}">새 주소로 이동</a></p></body></html>`,
  );
}

// ---------- sitemap ----------
const priority = (p) => (p === '/' ? '1.0' : p.split('/').length > 2 ? '0.7' : '0.8');
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((p) => `  <url>\n    <loc>${SITE_URL}${p === '/' ? '/' : p}</loc>\n    <priority>${priority(p)}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`,
);

console.log(`[sunya] 정적 페이지 ${routes.length}개, 리다이렉트 ${redirects.length}개, sitemap.xml 생성`);
