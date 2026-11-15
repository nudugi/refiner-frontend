// 빌드 때 content/에서 만들어진 아카이브 데이터 (scripts/vite-plugin-archive.mjs)
import archive from 'virtual:sunya-archive';

export const { artists, spaces, works, exhibitions, redirects } = archive;

export const exhibitionBySlug = Object.fromEntries(exhibitions.map((e) => [e.slug, e]));

export const redirectMap = Object.fromEntries(redirects.map((r) => [r.from, r.to]));

export default archive;
