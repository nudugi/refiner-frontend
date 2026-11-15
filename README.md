# SUNYA (2742.store)

스튜디오 SUNYA 사이트와 **SUNYA 아카이브**(작은 전시까지 기록하는 비상업 온라인 전시 아카이브). 기획: [SPEC.md](SPEC.md), 규칙: [CLAUDE.md](CLAUDE.md).

## 로컬 실행

```bash
npm install
npm run dev -- --host
```

터미널에 나오는 `Network:` 주소를 같은 와이파이의 휴대폰에서 열면 QR로 들어온 관객이 보는 화면을 확인할 수 있습니다. `content/`나 `public/archive/`를 고치면 자동으로 새로고침됩니다.

## 새 전시 추가

1. 필요하면 공간·작가·작품부터 만듭니다.
   ```bash
   npm run new:space -- binbang-studio "빈방 작업실"
   npm run new:artist -- kim-haneul 김하늘
   npm run new:work -- slow-turn "느린 회전"
   ```
2. 전시 뼈대를 만듭니다. 질문에 답하면 `content/exhibitions/연도-월-영문제목.md`와 이미지 폴더가 생깁니다.
   ```bash
   npm run new:exhibition
   ```
3. 이미지를 `public/archive/exhibitions/<slug>/`에 넣고, `.md` 파일의 빈칸을 채웁니다. 본문이 서문입니다.
4. 입체 작품은 24~36장 사진을 `public/archive/works/<slug>/turntable/`에 `01.jpg, 02.jpg…` 순서로 넣고 작품 파일에 `turntable: turntable`을 적습니다.
5. `npm run check:content`로 확인합니다. 오류가 있으면 어느 파일의 어느 항목인지 알려줍니다.

OG 이미지, 인스타 스토리 카드(1080×1920), QR(SVG), sitemap, 구조화 데이터는 빌드할 때 자동으로 만들어집니다. 샘플 데이터(빈방 작업실, 김하늘, 박서윤, 숨 쉬는 방)는 실제 전시를 넣을 때 `content/`와 `public/archive/`에서 지우면 됩니다.

## 배포 (무료)

지금처럼 **Vercel**에 연결해 두면 `main`에 푸시할 때마다 자동 배포됩니다. 빌드 명령 `npm run build`, 출력 폴더 `dist`(자동 인식).
Cloudflare Pages로 옮길 때도 같은 빌드 명령·출력 폴더를 쓰면 됩니다(SPA 라우팅은 `public/_redirects`에 `/* /index.html 200` 추가).
