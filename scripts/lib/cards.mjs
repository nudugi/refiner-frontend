// 공유용 이미지 생성: Open Graph(1200×630), 인스타 스토리(1080×1920). satori → resvg → PNG.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ROOT, PUBLIC_DIR } from './config.mjs';
import { imageDataUri } from './media.mjs';

const C = {
  paper: '#fbfaf7',
  ink: '#141311',
  muted: '#6b6862',
  accent: '#a8402a',
  void: '#0a0a0a',
  bone: '#f2f0ea',
};

let fontsPromise;
function fonts() {
  fontsPromise ??= Promise.resolve().then(() => {
    const dir = path.join(ROOT, 'node_modules/pretendard/dist/public/static');
    const load = (w, file) => ({
      name: 'Pretendard',
      weight: w,
      style: 'normal',
      data: fs.readFileSync(path.join(dir, file)),
    });
    return [load(400, 'Pretendard-Regular.otf'), load(700, 'Pretendard-Bold.otf'), load(900, 'Pretendard-Black.otf')];
  });
  return fontsPromise;
}

function h(type, style, ...children) {
  const kids = children.flat().filter((c) => c != null && c !== false && c !== '');
  return { type, props: { style: { display: 'flex', ...style }, children: kids.length === 1 ? kids[0] : kids } };
}

function titleSize(text, base, min) {
  const len = [...text].length;
  if (len <= 8) return base;
  if (len <= 14) return Math.round(base * 0.8);
  if (len <= 22) return Math.round(base * 0.64);
  return Math.max(min, Math.round(base * 0.5));
}

async function render(tree, width, height) {
  const svg = await satori(tree, { width, height, fonts: await fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

function placeholder(style) {
  return h('div', { background: '#d9d6cf', ...style });
}

/**
 * @param {{eyebrow:string,title:string,subtitle?:string,lines:string[],image?:string}} card
 */
export async function renderOg(card) {
  const img = card.image ? await imageDataUri(card.image, 560, 630) : null;
  const tree = h(
    'div',
    { width: 1200, height: 630, background: C.paper, fontFamily: 'Pretendard', color: C.ink },
    img
      ? { type: 'img', props: { src: img, width: 560, height: 630, style: { objectFit: 'cover' } } }
      : placeholder({ width: 560, height: 630 }),
    h(
      'div',
      { flexDirection: 'column', justifyContent: 'space-between', width: 640, padding: '56px 56px 48px' },
      h('div', { fontSize: 22, letterSpacing: 3, color: C.accent, fontWeight: 700 }, card.eyebrow),
      h(
        'div',
        { flexDirection: 'column' },
        h(
          'div',
          { fontSize: titleSize(card.title, 76, 40), fontWeight: 900, lineHeight: 1.05, letterSpacing: -2 },
          card.title,
        ),
        card.subtitle ? h('div', { marginTop: 14, fontSize: 26, color: C.muted }, card.subtitle) : null,
      ),
      h(
        'div',
        { flexDirection: 'column', borderTop: `2px solid ${C.ink}`, paddingTop: 20 },
        ...card.lines.map((l) => h('div', { fontSize: 24, lineHeight: 1.45 }, l)),
        h(
          'div',
          { marginTop: 18, justifyContent: 'space-between', fontSize: 20, color: C.muted },
          h('div', { fontWeight: 900, color: C.ink, letterSpacing: 2 }, 'SUNYA'),
          h('div', {}, '2742.store'),
        ),
      ),
    ),
  );
  return render(tree, 1200, 630);
}

/**
 * @param {{eyebrow:string,title:string,subtitle?:string,lines:string[],image?:string}} card
 */
export async function renderStory(card) {
  const img = card.image ? await imageDataUri(card.image, 1080, 1300) : null;
  const tree = h(
    'div',
    { width: 1080, height: 1920, flexDirection: 'column', background: C.void, color: C.bone, fontFamily: 'Pretendard' },
    img
      ? { type: 'img', props: { src: img, width: 1080, height: 1300, style: { objectFit: 'cover' } } }
      : placeholder({ width: 1080, height: 1300 }),
    h(
      'div',
      { flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, padding: '56px 72px 80px' },
      h(
        'div',
        { flexDirection: 'column' },
        h('div', { fontSize: 30, color: 'rgba(242,240,234,0.55)', letterSpacing: 2 }, card.eyebrow),
        h(
          'div',
          { marginTop: 18, fontSize: titleSize(card.title, 104, 56), fontWeight: 900, lineHeight: 1.04, letterSpacing: -3 },
          card.title,
        ),
        card.subtitle ? h('div', { marginTop: 14, fontSize: 36, color: 'rgba(242,240,234,0.7)' }, card.subtitle) : null,
      ),
      h(
        'div',
        { flexDirection: 'column' },
        ...card.lines.map((l) => h('div', { fontSize: 34, lineHeight: 1.45, color: 'rgba(242,240,234,0.85)' }, l)),
        h(
          'div',
          {
            marginTop: 36,
            paddingTop: 28,
            borderTop: '2px solid rgba(242,240,234,0.25)',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          },
          h('div', { fontSize: 56, fontWeight: 900, letterSpacing: 4 }, 'SUNYA'),
          h('div', { fontSize: 28, color: 'rgba(242,240,234,0.55)' }, '2742.store'),
        ),
      ),
    ),
  );
  return render(tree, 1080, 1920);
}

/** 입력이 같으면 다시 그리지 않는다 */
export function cardKey(card) {
  let mtime = 0;
  if (card.image && card.image.startsWith('/')) {
    try {
      mtime = fs.statSync(path.join(PUBLIC_DIR, decodeURI(card.image))).mtimeMs;
    } catch {
      /* 없음 */
    }
  }
  return crypto.createHash('sha1').update(JSON.stringify({ card, mtime, v: 1 })).digest('hex');
}
