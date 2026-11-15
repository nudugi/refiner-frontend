# 샘플 데이터 (배포되지 않음)

화면을 로컬에서 시험해 볼 때만 쓰는 가상 데이터입니다. 작가 2명, 공간 1곳, 작품 3점(턴테이블 1점), 전시 1개가 들어 있어요.

켜기:

```bash
cp -r samples/content/* content/
node samples/make-sample-images.mjs
npm run dev -- --host
```

끄기 (커밋하기 전에 꼭):

```bash
git checkout -- content && git clean -fd content public/archive
```
