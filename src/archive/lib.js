// 앱과 빌드 스크립트(prerender)가 같이 쓰는 순수 함수들. React를 쓰지 않는다.

export const SITE_URL = 'https://2742.store';

/** 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayKST(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export const STATUS_LABEL = { upcoming: '예정', current: '진행 중', ended: '종료' };

/** 전시 상태는 날짜로 계산한다 */
export function exhibitionStatus(ex, today = todayKST()) {
  if (today < ex.startDate) return 'upcoming';
  if (today > (ex.endDate || ex.startDate)) return 'ended';
  return 'current';
}

export function dotDate(iso) {
  return iso ? iso.replaceAll('-', '.') : '';
}

export function artistNames(slugs, artists) {
  return slugs.map((s) => artists[s]?.name).filter(Boolean);
}

/** 작품 표준 캡션: 작가, 〈제목〉, 연도, 재료, 크기 */
export function workCaption(work, artists) {
  return [
    artistNames(work.artists, artists).join(', '),
    `〈${work.title}〉`,
    work.year,
    work.materials,
    work.dimensions,
  ]
    .filter(Boolean)
    .join(', ');
}

/** 인용 형식: 「전시명」, 참여 작가, 장소, 기간, SUNYA, URL (접속일: YYYY.MM.DD) */
export function exhibitionCitation(ex, { artists, spaces }, accessed = todayKST()) {
  const sp = spaces[ex.space];
  const place = sp ? `${sp.name}(${sp.city})` : '';
  const span =
    ex.endDate && ex.endDate !== ex.startDate
      ? `${dotDate(ex.startDate)}–${dotDate(ex.endDate)}`
      : dotDate(ex.startDate);
  return [
    `「${ex.title}」`,
    artistNames(ex.artists, artists).join(', '),
    place,
    span,
    'SUNYA',
    `${SITE_URL}${ex.url} (접속일: ${dotDate(accessed)})`,
  ]
    .filter(Boolean)
    .join(', ');
}

/** 작품 인용: 작가, 〈제목〉, 연도, 재료, 크기, SUNYA, URL (접속일) */
export function workCitation(work, { artists }, accessed = todayKST()) {
  return `${workCaption(work, artists)}, SUNYA, ${SITE_URL}${work.url} (접속일: ${dotDate(accessed)})`;
}

/** 작품의 대표 이미지(없으면 턴테이블 첫 프레임) */
export function workThumb(work) {
  if (work.images[0]) return work.images[0];
  if (work.turntable) {
    return {
      src: work.turntable.frames[0],
      width: work.turntable.width,
      height: work.turntable.height,
      alt: work.title,
    };
  }
  return null;
}
