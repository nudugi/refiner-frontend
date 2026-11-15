import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const CONTENT_DIR = path.join(ROOT, 'content');
export const PUBLIC_DIR = path.join(ROOT, 'public');
/** 빌드 산출물(최적화 이미지, OG·스토리 카드, QR). git에 올리지 않는다. */
export const GEN_DIR = path.join(PUBLIC_DIR, '_gen');
export const GEN_URL = '/_gen';

export const SITE_URL = 'https://2742.store';
export const SITE_NAME = 'SUNYA';

export const COLLECTIONS = ['artists', 'spaces', 'works', 'exhibitions'];

export const SPACE_TYPES = ['갤러리', '대안공간', '학교', '카페', '작업실', '기타'];
export const EXHIBITION_TYPES = ['개인전', '단체전', '졸업전', '과제전', '오픈스튜디오', '팝업', '기타'];

/** 일반 이미지 리사이즈 폭(원본보다 큰 폭은 만들지 않는다) */
export const IMAGE_WIDTHS = [640, 1280, 1920];
/** 턴테이블 프레임 폭 */
export const TURNTABLE_WIDTH = 900;
