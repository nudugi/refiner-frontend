// 샘플 데이터용 임시 이미지를 만든다. 실제 전시를 넣을 때 샘플과 함께 지워도 된다.
// 실행: node samples/make-sample-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PUBLIC_DIR } from '../scripts/lib/config.mjs';

const out = (rel) => {
  const full = path.join(PUBLIC_DIR, 'archive', rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  return full;
};

async function save(rel, svg) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 84 }).toFile(out(rel));
}

const grain = `
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/>
  <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.08 0"/></filter>`;

function room({ w, h, wall = '#e9e6df', floor = '#cfcbc2', horizon = 0.72, items = '' }) {
  const y = Math.round(h * horizon);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${grain}
    <linearGradient id="wall" x1="0" x2="1"><stop offset="0" stop-color="${wall}"/><stop offset="1" stop-color="#dcd8cf"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor}"/><stop offset="1" stop-color="#b9b4aa"/></linearGradient>
  </defs>
  <rect width="${w}" height="${y}" fill="url(#wall)"/>
  <rect y="${y}" width="${w}" height="${h - y}" fill="url(#floor)"/>
  <rect y="${y - 6}" width="${w}" height="6" fill="#d2cec5"/>
  ${items}
  <rect width="${w}" height="${h}" filter="url(#g)"/>
</svg>`;
}

// ---------- 전시 이미지 ----------
const EX = 'exhibitions/2027-01-breathing-room';
await save(
  `${EX}/cover.jpg`,
  room({
    w: 2000,
    h: 1333,
    items: `
    <rect x="300" y="300" width="420" height="540" fill="#2b2a27"/><rect x="318" y="318" width="384" height="504" fill="#8b8579"/>
    <rect x="1180" y="560" width="300" height="400" fill="#f4f2ec"/><rect x="1180" y="560" width="300" height="18" fill="#e2dfd7"/>
    <path d="M1250 560 L1330 330 L1420 560 Z" fill="#3a3834"/>
    <ellipse cx="1330" cy="980" rx="230" ry="26" fill="#000" opacity=".12"/>
    <rect x="860" y="380" width="160" height="200" fill="#a8402a" opacity=".85"/>`,
  }),
);
await save(
  `${EX}/install-01.jpg`,
  room({
    w: 1800,
    h: 1200,
    horizon: 0.68,
    items: `
    <rect x="160" y="260" width="300" height="380" fill="#3c3a36"/>
    <rect x="560" y="300" width="220" height="300" fill="#7d776c"/>
    <rect x="880" y="240" width="380" height="420" fill="#cdc8be" stroke="#2b2a27" stroke-width="10"/>
    <rect x="1380" y="320" width="200" height="260" fill="#2b2a27"/>`,
  }),
);
await save(
  `${EX}/install-02.jpg`,
  room({
    w: 1200,
    h: 1500,
    horizon: 0.62,
    items: `
    <rect x="420" y="760" width="360" height="520" fill="#f4f2ec"/><rect x="420" y="760" width="360" height="20" fill="#e2dfd7"/>
    <polygon points="470,760 600,420 730,760" fill="#45423d"/><polygon points="600,420 730,760 640,760" fill="#2a2825"/>
    <ellipse cx="600" cy="1300" rx="260" ry="30" fill="#000" opacity=".12"/>`,
  }),
);
await save(
  `${EX}/install-03.jpg`,
  room({
    w: 1800,
    h: 1200,
    wall: '#dedad2',
    items: `
    <rect x="0" y="0" width="1800" height="70" fill="#c9c4ba"/>
    <rect x="240" y="300" width="1320" height="420" fill="#ece9e2" stroke="#b8b2a7" stroke-width="4"/>
    <g fill="#2b2a27">${Array.from({ length: 9 }, (_, i) => `<rect x="${290 + i * 140}" y="380" width="90" height="${120 + ((i * 53) % 140)}"/>`).join('')}</g>`,
  }),
);

// 평면도
await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <rect width="1600" height="1100" fill="#fbfaf7"/>
  <g fill="none" stroke="#141311" stroke-width="8">
    <path d="M140 140 H1460 V960 H860"/><path d="M700 960 H140 V140"/>
    <path d="M140 560 H560 V960"/>
  </g>
  <path d="M700 960 A160 160 0 0 1 860 960" fill="none" stroke="#141311" stroke-width="3" stroke-dasharray="10 8"/>
  <g fill="#a8402a">
    <circle cx="360" cy="360" r="22"/><circle cx="980" cy="420" r="22"/><circle cx="1220" cy="740" r="22"/>
  </g>
  <g fill="#141311"><rect x="900" y="660" width="160" height="160"/></g>
</svg>`),
)
  .png()
  .toFile(out(`${EX}/floorplan.png`));

// ---------- 작품 이미지 ----------
await save(
  'works/fold/01.jpg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1750" viewBox="0 0 1400 1750">
  <defs>${grain}</defs>
  <rect width="1400" height="1750" fill="#ebe8e1"/>
  <polygon points="300,1400 700,300 1100,1400" fill="#d8d3c9"/>
  <polygon points="700,300 1100,1400 760,1400" fill="#b4ada1"/>
  <polygon points="430,1400 700,620 960,1400" fill="#2f2d29"/>
  <polygon points="700,620 960,1400 740,1400" fill="#1b1a18"/>
  <ellipse cx="700" cy="1430" rx="460" ry="34" fill="#000" opacity=".12"/>
  <rect width="1400" height="1750" filter="url(#g)"/></svg>`,
);
await save(
  'works/fold/02.jpg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1750" viewBox="0 0 1400 1750">
  <defs>${grain}</defs>
  <rect width="1400" height="1750" fill="#e4e0d8"/>
  <polygon points="380,1380 650,560 760,1380" fill="#26241f"/>
  <polygon points="650,560 1020,1380 760,1380" fill="#4a4740"/>
  <ellipse cx="700" cy="1400" rx="420" ry="30" fill="#000" opacity=".12"/>
  <rect width="1400" height="1750" filter="url(#g)"/></svg>`,
);
await save(
  'works/window-afternoon/01.jpg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <defs>${grain}
    <linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5f1e6"/><stop offset="1" stop-color="#a39b8b"/></linearGradient></defs>
  <rect width="1600" height="1200" fill="#8f877a"/>
  <polygon points="420,180 1040,180 1300,1020 520,1020" fill="url(#l)"/>
  <rect x="700" y="180" width="18" height="840" fill="#8f877a" transform="skewX(9)"/>
  <rect x="420" y="560" width="760" height="16" fill="#8f877a"/>
  <rect x="0" y="1060" width="1600" height="140" fill="#5f594f"/>
  <rect width="1600" height="1200" filter="url(#g)"/></svg>`,
);

// ---------- 턴테이블: 회전하는 입체 36프레임 ----------
const FRAMES = 36;
const W = 1200;
const H = 1200;
const box = { x: 0.32, y: 0.78, z: 0.2 };
const verts = [];
for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) verts.push([sx * box.x, sy * box.y, sz * box.z]);
const idx = (sx, sy, sz) => ((sx > 0) << 2) | ((sy > 0) << 1) | (sz > 0 ? 1 : 0);
const faces = [
  { v: [idx(1, -1, -1), idx(1, 1, -1), idx(1, 1, 1), idx(1, -1, 1)], n: [1, 0, 0], tone: 0.55 },
  { v: [idx(-1, -1, -1), idx(-1, -1, 1), idx(-1, 1, 1), idx(-1, 1, -1)], n: [-1, 0, 0], tone: 0.4 },
  { v: [idx(-1, -1, 1), idx(1, -1, 1), idx(1, 1, 1), idx(-1, 1, 1)], n: [0, 0, 1], tone: 0.82 },
  { v: [idx(-1, -1, -1), idx(-1, 1, -1), idx(1, 1, -1), idx(1, -1, -1)], n: [0, 0, -1], tone: 0.12, accent: true },
  { v: [idx(-1, 1, -1), idx(-1, 1, 1), idx(1, 1, 1), idx(1, 1, -1)], n: [0, 1, 0], tone: 0.9 },
];
const pitch = (16 * Math.PI) / 180;
function project([x, y, z], a) {
  // y축 회전 → x축 기울임 → 원근
  const x1 = x * Math.cos(a) + z * Math.sin(a);
  const z1 = -x * Math.sin(a) + z * Math.cos(a);
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
  const f = 3.2 / (3.2 - z2);
  return { x: W / 2 + x1 * f * 520, y: H * 0.47 - y2 * f * 520, z: z2 };
}
function rotN([x, y, z], a) {
  const x1 = x * Math.cos(a) + z * Math.sin(a);
  const z1 = -x * Math.sin(a) + z * Math.cos(a);
  return [x1, y * Math.cos(pitch) - z1 * Math.sin(pitch), y * Math.sin(pitch) + z1 * Math.cos(pitch)];
}
const shade = (t) => {
  const v = Math.round(30 + t * 200);
  return `rgb(${v},${v - 3},${v - 8})`;
};
for (let i = 0; i < FRAMES; i++) {
  const a = (i / FRAMES) * Math.PI * 2;
  const polys = faces
    .map((f) => {
      const n = rotN(f.n, a);
      if (n[2] <= 0.01) return null;
      const pts = f.v.map((k) => project(verts[k], a));
      const light = Math.max(0, n[0] * -0.5 + n[2] * 0.8 + n[1] * 0.3);
      const fill = f.accent ? '#8f3a27' : shade(f.tone * 0.6 + light * 0.4);
      const z = pts.reduce((s, p) => s + p.z, 0) / pts.length;
      return { z, svg: `<polygon points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${fill}"/>` };
    })
    .filter(Boolean)
    .sort((p, q) => p.z - q.z)
    .map((p) => p.svg)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#efede8"/>
    <ellipse cx="${W / 2}" cy="${H * 0.83}" rx="330" ry="44" fill="#000" opacity=".1"/>
    ${polys}</svg>`;
  await save(`works/slow-turn/turntable/${String(i + 1).padStart(2, '0')}.jpg`, svg);
}

console.log('샘플 이미지를 public/archive/에 만들었습니다.');
