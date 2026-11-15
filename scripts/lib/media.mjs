// 이미지 최적화: 원본(public/archive/...)에서 WebP 여러 폭을 public/_gen/img/...에 만든다.
// 원본이 바뀌지 않았으면 다시 만들지 않는다.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PUBLIC_DIR, GEN_DIR, GEN_URL, IMAGE_WIDTHS, TURNTABLE_WIDTH } from './config.mjs';

function isLocal(url) {
  return url && url.startsWith('/') && !url.startsWith('//');
}

function upToDate(out, srcStat) {
  try {
    return fs.statSync(out).mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
}

const metaCache = new Map();

async function readMeta(full) {
  const stat = fs.statSync(full);
  const key = `${full}:${stat.mtimeMs}`;
  if (!metaCache.has(key)) {
    const m = await sharp(full).rotate().metadata();
    // EXIF 회전이 있으면 가로·세로가 바뀐다
    const swap = m.orientation && m.orientation >= 5;
    metaCache.set(key, { width: swap ? m.height : m.width, height: swap ? m.width : m.height });
  }
  return { stat, ...metaCache.get(key) };
}

async function makeVariant(full, stat, outFull, width) {
  if (upToDate(outFull, stat)) return;
  fs.mkdirSync(path.dirname(outFull), { recursive: true });
  await sharp(full).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outFull);
}

function variantPath(url, width) {
  const noExt = url.replace(/\.[^.\/]+$/, '');
  return { rel: `img${noExt}-${width}.webp`, url: `${GEN_URL}/img${noExt}-${width}.webp` };
}

/** image 객체({src, caption, ...})에 width, height, srcset을 채운다 */
export async function optimizeImage(image) {
  if (!image || !isLocal(image.src)) return image;
  const full = path.join(PUBLIC_DIR, decodeURI(image.src));
  const { stat, width, height } = await readMeta(full);
  const widths = IMAGE_WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]));
  const uniq = [...new Set(widths)];
  const srcset = [];
  for (const w of uniq) {
    const v = variantPath(image.src, w);
    await makeVariant(full, stat, path.join(GEN_DIR, v.rel), w);
    srcset.push(`${v.url} ${w}w`);
  }
  return {
    ...image,
    width,
    height,
    srcset: srcset.join(', '),
    // 가장 작은 변형: 카드 썸네일 등 작은 자리용
    thumb: variantPath(image.src, uniq[0]).url,
  };
}

/** 턴테이블 프레임을 한 가지 폭으로 줄인다 */
export async function optimizeFrames(frames) {
  const out = [];
  let size = null;
  for (const url of frames) {
    if (!isLocal(url)) {
      out.push(url);
      continue;
    }
    const full = path.join(PUBLIC_DIR, decodeURI(url));
    const { stat, width, height } = await readMeta(full);
    const w = Math.min(width, TURNTABLE_WIDTH);
    const v = variantPath(url, w);
    await makeVariant(full, stat, path.join(GEN_DIR, v.rel), w);
    out.push(v.url);
    if (!size) size = { width: w, height: Math.round((height * w) / width) };
  }
  return { frames: out, ...(size ?? { width: 1, height: 1 }) };
}

/** 카드(OG·스토리) 합성용: 원본을 지정 크기로 잘라 data URI로 */
export async function imageDataUri(url, width, height) {
  if (!isLocal(url)) return null;
  const full = path.join(PUBLIC_DIR, decodeURI(url));
  if (!fs.existsSync(full)) return null;
  const buf = await sharp(full)
    .rotate()
    .resize({ width, height, fit: 'cover' })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}
