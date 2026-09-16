// SUNYA 사이트 전역 카피. 문구 수정은 이 파일에서만 하면 됩니다.

export const siteMeta = {
  title: 'SUNYA | 창작자의 기록을 정리하는 도구',
  description:
    '작업의 배경과 생각을 입력하면 작가노트, 전시 서문, 짧은 글로 정리해 드립니다. 창작자를 위한 기록 도구, SUNYA.',
};

export const nav = {
  brand: 'SUNYA',
  toolCta: '작가노트 만들기',
  backToHome: 'SUNYA',
};

export const hero = {
  eyebrow: 'SUNYA · 창작자를 위한 기록',
  title: ['작업의 언어를', '정리하는 시간'],
  subtitle:
    '전시를 준비하거나 작업을 설명해야 할 때, 생각은 있지만 문장이 되지 않는 순간이 있습니다.\nSUNYA는 그 사이를 정리합니다.',
  ctaPrimary: { label: '작가노트 만들기', to: '/refiner' },
};

export const intro = {
  eyebrow: '01',
  title: '기록되지 않으면, 흩어집니다',
  body: '작품에 대해 하고 싶은 말은 많은데, 막상 글로 정리하려면 어디서부터 시작해야 할지 막막할 때가 있습니다. SUNYA는 전시 제목, 작품 설명, 작업 의도처럼 이미 가지고 있는 정보를 입력하면 그것을 작가노트와 전시 서문의 형태로 다듬어 드리는 도구입니다.',
};

export const features = {
  eyebrow: '02',
  title: '지금 사용할 수 있는 기능',
  items: [
    {
      label: '작가노트 & 전시 서문',
      desc: '전시 제목, 주제, 작품 설명, 전시 의도를 입력하면 작가노트·전시 서문·작품 설명 세 가지를 한 번에 정리합니다.',
    },
    {
      label: '짧은 글 다듬기',
      desc: '시, 에세이, 일기 중 원하는 형식을 골라 이미 쓴 글을 해당 형식에 맞게 다시 씁니다.',
    },
    {
      label: '결과 확인',
      desc: '정리된 글은 화면에 그대로 표시되어, 전시 자료나 포트폴리오에 옮겨 사용할 수 있습니다.',
    },
  ],
};

export const process = {
  eyebrow: '03',
  title: '이용 흐름',
  steps: [
    { step: '01', title: '형식을 고릅니다', desc: '시 / 에세이 / 일기 / 작가노트 & 전시 서문 중 하나를 선택합니다.' },
    { step: '02', title: '내용을 입력합니다', desc: '가지고 있는 글이나 작품 정보, 작업 의도를 입력합니다.' },
    { step: '03', title: '결과를 받습니다', desc: '입력한 내용을 바탕으로 정리된 글을 확인합니다.' },
  ],
};

export const visual = {
  eyebrow: '04',
  statement: '“쓰다 만 생각도,\n기록이 될 수 있습니다.”',
  tags: ['시', '에세이', '일기', '작가노트', '전시 서문', '작품 설명'],
};

export const finalCta = {
  title: '지금, 정리해 볼까요',
  subtitle: '입력은 몇 줄이면 충분합니다.',
  cta: { label: '작가노트 만들기', to: '/refiner' },
};

export const footer = {
  brand: 'SUNYA',
  desc: '창작자의 생각과 작업을 언어로 정리하는 기록 도구입니다.',
  toolLink: { label: '작가노트 생성기', to: '/refiner' },
  domain: '2742.store',
};

export const toolPage = {
  title: '작가노트 생성기',
  subtitle: 'SUNYA의 첫 번째 도구입니다.',
  freeUsesNote: (max) => `무료 사용 ${max}회 제공 · 이후 유료 전환 예정`,
  aboutLines: [
    '이 도구는 예술가와 창작자를 위한 AI 글 정제기입니다.',
    '시 / 에세이 / 일기 / 전시 서문 / 작가노트 등을 정제해줍니다.',
  ],
};
