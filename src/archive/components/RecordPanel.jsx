import { useEffect, useRef, useState } from 'react';
import { copyText } from './copy';
import { SITE_URL } from '../lib';
import { SectionHead } from './Eyebrow';

function useFlash() {
  const [on, setOn] = useState(false);
  const t = useRef();
  useEffect(() => () => clearTimeout(t.current), []);
  return [
    on,
    () => {
      setOn(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setOn(false), 1800);
    },
  ];
}

const btn =
  'inline-flex items-center justify-center gap-2 border border-ink px-4 py-2.5 text-xs font-bold tracking-wide text-ink no-underline transition-colors hover:bg-ink hover:text-paper';

/** 링크 복사 · 공유하기 · (선택) 스토리 카드 내려받기 */
export function ShareBar({ path, title, story, storyName }) {
  const url = SITE_URL + path;
  const [copied, flash] = useFlash();
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={btn} onClick={async () => (await copyText(url)) && flash()}>
        {copied ? '복사했어요 ✓' : '링크 복사'}
      </button>
      {canShare && (
        <button
          type="button"
          className={btn}
          onClick={() => navigator.share({ title: `${title} | SUNYA`, url }).catch(() => {})}
        >
          공유하기
        </button>
      )}
      {story && (
        <a className={btn} href={story} download={storyName}>
          스토리 카드 ↓
        </a>
      )}
    </div>
  );
}

export function Citation({ text }) {
  const [copied, flash] = useFlash();
  return (
    <div>
      <p className="border-l-2 border-accent bg-ink/[0.03] px-4 py-3 text-sm leading-relaxed break-keep">{text}</p>
      <button
        type="button"
        className={`${btn} mt-3`}
        onClick={async () => (await copyText(text)) && flash()}
      >
        {copied ? '복사했어요 ✓' : '인용 형식 복사'}
      </button>
    </div>
  );
}

export function QrDownload({ qr, path, fileName }) {
  return (
    <div className="flex items-start gap-4">
      <img src={qr} alt="이 페이지로 연결되는 QR 코드" width={112} height={112} className="h-28 w-28 border border-ink/15 bg-white" />
      <div className="text-xs leading-relaxed text-muted">
        <p>
          인쇄물·캡션에 붙이면 휴대폰으로 바로 이 페이지가 열립니다.
          <br />
          <span className="break-all font-mono text-ink">{SITE_URL.replace('https://', '') + path}</span>
        </p>
        <a className={`${btn} mt-3`} href={qr} download={fileName}>
          QR 내려받기 (SVG)
        </a>
      </div>
    </div>
  );
}

/** 페이지 하단 '기록 · 공유' 묶음 */
export default function RecordPanel({ index, path, title, share, citation, slug, kind }) {
  return (
    <section className="mt-20">
      <SectionHead index={index} title="기록 · 공유" aside="Permanent link" />
      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">인용 형식</h3>
          <div className="mt-3">
            <Citation text={citation} />
          </div>
          <h3 className="mt-8 font-mono text-[11px] uppercase tracking-widest text-muted">공유</h3>
          <div className="mt-3">
            <ShareBar path={path} title={title} story={share?.story} storyName={`sunya-${slug}-story.png`} />
          </div>
        </div>
        {share?.qr && (
          <div className="lg:col-span-5">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">QR</h3>
            <div className="mt-3">
              <QrDownload qr={share.qr} path={path} fileName={`sunya-${kind}-${slug}-qr.svg`} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
