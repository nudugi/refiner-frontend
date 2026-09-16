// SUNYA 사이트 전역 카피. 문구 수정은 이 파일에서만 하면 됩니다.

export const siteMeta = {
  title: 'SUNYA',
  description: '비어있음에서 형태를 만드는 스튜디오, SUNYA.',
};

export const nav = {
  brand: 'SUNYA',
  menu: [
    { label: 'Home', to: '/' },
    { label: 'Works', to: '/works' },
    { label: 'About', to: '/about' },
    { label: 'Tools', to: '/tools' },
  ],
};

export const marquee = {
  text: 'SUNYA — FORM FROM EMPTINESS — OBJECTS & LANGUAGE — SUNYA —',
};

export const hero = {
  eyebrow: 'SUNYA STUDIO',
  title: ['비어있음에서', '형태를 만든다'],
  subtitle: '군더더기 없는 사물, 군더더기 없는 언어.',
  ctaPrimary: { label: 'Works 보기', to: '/works' },
  ctaSecondary: { label: 'Studio 소개', to: '/about' },
};

export const worksTeaser = {
  eyebrow: '01',
  title: 'WORKS',
  desc: '아직 세상에 나오지 않은 오브제들을 준비하고 있습니다. 지금은 자리만 먼저 만들어 둡니다.',
  cta: { label: '전체 보기', to: '/works' },
};

export const worksPage = {
  eyebrow: 'WORKS',
  title: '준비 중인 것들',
  desc: 'SUNYA의 오브제는 아직 공개 전입니다. 아래는 앞으로 채워질 자리입니다.',
  items: [
    { title: 'Object 01', category: 'Coming soon' },
    { title: 'Object 02', category: 'Coming soon' },
    { title: 'Object 03', category: 'Coming soon' },
    { title: 'Object 04', category: 'Coming soon' },
    { title: 'Object 05', category: 'Coming soon' },
    { title: 'Object 06', category: 'Coming soon' },
  ],
};

export const aboutTeaser = {
  eyebrow: '02',
  title: 'ABOUT',
  desc: 'SUNYA는 비어있음을 뜻합니다. 아무것도 없는 상태에서, 사물이든 문장이든 하나의 형태를 만들어내는 작업을 합니다.',
  cta: { label: 'Studio 소개', to: '/about' },
};

export const aboutPage = {
  eyebrow: 'ABOUT',
  title: ['비어있음(空)에서', '시작합니다'],
  paragraphs: [
    'SUNYA는 비어있음을 뜻하는 말에서 이름을 가져왔습니다. 아무것도 정해지지 않은 상태를, 무언가 만들어질 수 있는 가능성으로 봅니다.',
    '오브제를 만들 때도, 글을 정리할 때도 방식은 같습니다. 손에 잡히지 않는 생각과 재료를 붙잡아, 하나의 분명한 형태로 옮기는 일입니다.',
    '지금은 오브제 라인을 준비하는 동시에, 창작자의 글을 정리하는 작은 도구 하나를 함께 운영하고 있습니다. 앞으로 만들어질 것들도 같은 태도에서 출발합니다.',
  ],
};

export const toolsTeaser = {
  eyebrow: '03',
  title: 'TOOLS',
  desc: '형태를 만드는 여러 방법 중 하나. 지금은 글을 위한 도구 하나가 있습니다.',
  cta: { label: '작가노트 생성기 열기', to: '/refiner' },
};

export const toolsPage = {
  eyebrow: 'TOOLS',
  title: 'SUNYA의 도구',
  desc: '오브제 외에, SUNYA가 지금 운영 중인 도구입니다.',
  items: [
    {
      title: '작가노트 생성기',
      desc: '전시 제목, 작품 설명, 작업 의도를 입력하면 작가노트와 전시 서문으로 정리합니다.',
      to: '/refiner',
    },
  ],
};

export const footer = {
  brand: 'SUNYA',
  desc: '비어있음에서 형태를 만드는 스튜디오입니다.',
  domain: '2742.store',
  business: {
    name: '이십칠점사이',
    ceo: '황지환',
    registrationNumber: '699-27-02047',
    mailOrderNumber: '2025-강원강릉-0376',
    address: '강원 강릉시 구정면 정등로 24-32',
    phone: '010-5576-1951',
    email: 'thekeaon0509@naver.com',
  },
};

export const toolPage = {
  title: '작가노트 생성기',
  subtitle: 'SUNYA의 도구 중 하나입니다.',
  freeUsesNote: (max) => `무료 사용 ${max}회 제공 · 이후 유료 전환 예정`,
  aboutLines: [
    '이 도구는 예술가와 창작자를 위한 AI 글 정제기입니다.',
    '시 / 에세이 / 일기 / 전시 서문 / 작가노트 등을 정제해줍니다.',
  ],
};
