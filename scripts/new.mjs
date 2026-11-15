// 새 콘텐츠 뼈대 만들기
//   npm run new:exhibition            (질문에 답하면 파일·폴더 생성)
//   npm run new:exhibition -- 2027-01-breathing-room "숨 쉬는 방"
//   npm run new:artist  -- kim-haneul 김하늘
//   npm run new:work    -- slow-turn "느린 회전"
//   npm run new:space   -- binbang-studio "빈방 작업실"
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { CONTENT_DIR, PUBLIC_DIR, EXHIBITION_TYPES, SPACE_TYPES } from './lib/config.mjs';

const kind = process.argv[2];
const [argSlug, ...rest] = process.argv.slice(3);
const argTitle = rest.join(' ');

const KINDS = ['exhibition', 'artist', 'work', 'space'];
if (!KINDS.includes(kind)) {
  console.error(`사용법: node scripts/new.mjs <${KINDS.join('|')}> [slug] [제목]`);
  process.exit(1);
}

const rl = readline.createInterface({ input: stdin, output: stdout });
const ask = async (q, def = '') => {
  if (!stdin.isTTY) return def;
  const a = (await rl.question(def ? `${q} (${def}): ` : `${q}: `)).trim();
  return a || def;
};

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const today = new Date().toISOString().slice(0, 10);
let slug = argSlug;
let title = argTitle;
let file;
let mediaDir;
let body;

if (kind === 'exhibition') {
  title ||= await ask('전시 제목(한국어)', '제목 없음');
  const titleEn = await ask('영문 제목(slug에 쓰여요)', '');
  const start = await ask('시작일 YYYY-MM-DD', today);
  const end = await ask('종료일 YYYY-MM-DD', start);
  slug ||= `${start.slice(0, 7)}-${slugify(titleEn) || 'untitled'}`;
  file = path.join(CONTENT_DIR, 'exhibitions', `${slug}.md`);
  mediaDir = path.join(PUBLIC_DIR, 'archive', 'exhibitions', slug);
  body = `---
title: ${title}
titleEn: ${titleEn}
type: 단체전   # ${EXHIBITION_TYPES.join(' / ')}
startDate: ${start}
endDate: ${end}
space: 공간-slug        # content/spaces/의 파일 이름
artists:
  - 작가-slug           # content/artists/의 파일 이름
curators: []            # 예: [황지환]
# 이미지는 public/archive/exhibitions/${slug}/ 에 넣고 파일 이름만 적습니다
cover:
  src: cover.jpg
  alt: 전시 전경
installationViews: []
#  - src: install-01.jpg
#    caption: 전시 전경
#    credit: 촬영자 이름
# floorPlan:
#   src: floorplan.png
works: []               # content/works/의 파일 이름 목록
reviews: []
#  - title: 글 제목
#    author: 필자
#    publication: 매체
#    link: https://...
---

여기에 서문을 씁니다. Markdown을 쓸 수 있어요.
`;
} else if (kind === 'artist') {
  title ||= await ask('작가 이름', '');
  slug ||= await ask('slug (영문 소문자-하이픈)', '');
  file = path.join(CONTENT_DIR, 'artists', `${slug}.yaml`);
  mediaDir = path.join(PUBLIC_DIR, 'archive', 'artists', slug);
  body = `name: ${title}
nameEn:
bio:
mediums: []      # 예: [조소, 키네틱]
links: {}
#  instagram: https://instagram.com/...
#  website: https://...
# portrait: portrait.jpg   (public/archive/artists/${slug}/)
`;
} else if (kind === 'work') {
  title ||= await ask('작품 제목', '');
  slug ||= await ask('slug (영문 소문자-하이픈)', '');
  file = path.join(CONTENT_DIR, 'works', `${slug}.yaml`);
  mediaDir = path.join(PUBLIC_DIR, 'archive', 'works', slug);
  body = `title: ${title}
titleEn:
artist: 작가-slug
year: ${today.slice(0, 4)}
materials:
dimensions:
images: []
#  - src: 01.jpg
#    caption: 정면
# 입체 작품이면 24~36장을 public/archive/works/${slug}/turntable/ 에 01.jpg, 02.jpg… 순서로 넣고:
# turntable: turntable
description:
`;
} else {
  title ||= await ask('공간 이름', '');
  slug ||= await ask('slug (영문 소문자-하이픈)', '');
  file = path.join(CONTENT_DIR, 'spaces', `${slug}.yaml`);
  mediaDir = null;
  body = `name: ${title}
type: 갤러리   # ${SPACE_TYPES.join(' / ')}
address:
city:
link:
`;
}
rl.close();

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`slug "${slug}"가 올바르지 않습니다. 영어 소문자·숫자·하이픈만 쓸 수 있어요.`);
  process.exit(1);
}
if (fs.existsSync(file)) {
  console.error(`이미 있습니다: ${path.relative(process.cwd(), file)}`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, body);
if (mediaDir) fs.mkdirSync(mediaDir, { recursive: true });

console.log(`\n만들었습니다:\n  ${path.relative(process.cwd(), file)}`);
if (mediaDir) console.log(`  ${path.relative(process.cwd(), mediaDir)}/   ← 이미지를 여기에`);
console.log(`\n주소: /${kind === 'exhibition' ? 'exhibitions' : kind + 's'}/${slug}`);
