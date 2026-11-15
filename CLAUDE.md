# SUNYA — 프로젝트 규칙

2742.store 하나의 사이트에 두 영역이 함께 있다. 전체 기획은 `SPEC.md`.

| 영역 | 경로 | 성격 |
|---|---|---|
| 스튜디오 | `/`, `/objects`, `/about`, `/tools`, `/refiner` | 오리지널 오브제(판매 예정), 작가노트 생성기(refiner-backend 연동) |
| 아카이브 | `/exhibitions`, `/artists`, `/works`, `/spaces` | 비상업 전시 기록 |

## 절대 규칙

1. **아카이브 페이지(전시·작가·작품·공간)에는 가격, 구매 버튼, 광고를 두지 않는다.** 판매는 `/objects` 등 스튜디오 영역에서만.
2. **영구 주소를 바꾸지 않는다.** `/exhibitions/[slug]`, `/artists/[slug]`, `/works/[slug]`, `/spaces/[slug]`.
   - 전시 slug는 `연도-월-영문제목` (예: `2027-01-breathing-room`).
   - slug를 바꿔야 하면 `content/redirects.yaml`에 예전 주소 → 새 주소를 추가한다. 한 번 공개한 주소(QR로 인쇄된 주소 포함)는 목록에서 지우지 않는다.
   - `/works/[slug]`는 나중에 실물 QR·소장 기록이 연결될 자리다.
3. **기존 기능을 지우지 않는다.** 오브제 영역, 작가노트 생성기(`/refiner`, `https://refiner-backend.onrender.com`), 사업자 정보 푸터, 3D 로고.
4. **기존 디자인을 크게 바꾸지 않는다.** 색은 `src/index.css`의 `@theme` 토큰(void/bone/signal, paper/ink/accent/muted)만 쓴다. 아카이브는 밝은 지면(paper) + 은은한 포인트(accent).

## Phase 1 범위

- 하지 않는 것: 로그인, 회원가입, DB, 댓글, 아카이브 결제.
- 나중에 넣을 것(데이터 구조가 막지 않게 유지): 관람 도장, 작품 걸기, 소장 기록, 전시 캘린더·지도, 작가 직접 업로드.
  - 콘텐츠 로더는 모르는 필드를 지우지 않고 그대로 통과시킨다(`scripts/lib/content.mjs`의 `...data`). 새 필드는 YAML에 먼저 추가해도 된다.

## 구조

- `content/` — 데이터(YAML·Markdown). 전시 본문 Markdown이 서문.
- `public/archive/<collection>/<slug>/` — 원본 이미지. 콘텐츠에서는 파일 이름만 적으면 이 폴더 기준으로 찾는다.
- `scripts/vite-plugin-archive.mjs` — `virtual:sunya-archive` 모듈 제공, 개발 중 변경 감지.
- `scripts/lib/` — 로드·검증(`content.mjs`), 이미지 최적화(`media.mjs`), OG·스토리 카드(`cards.mjs`), 전체 빌드(`generate.mjs`).
- `scripts/prerender.mjs` — 빌드 후 경로별 정적 HTML(메타·OG·JSON-LD), sitemap, 리다이렉트 페이지.
- `public/_gen/` — 생성물(git 제외).
- `src/archive/` — 아카이브 화면. `lib.js`는 빌드 스크립트와 공유하는 순수 함수(상태 계산, 인용 형식).

## 확인

- `npm run check:content` — 콘텐츠 검증(없는 참조, slug 형식, 날짜, 파일 존재).
- `npm run build` — 빌드 + 프리렌더. 빌드 에러는 대부분 콘텐츠 오류 메시지이니 그대로 읽고 고친다.
