import { useCallback, useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 턴테이블 뷰어: 24~36장 이미지를 드래그(마우스)·스와이프(터치)·방향키로 돌려 본다.
 * 화면 근처에 오기 전에는 첫 장만 불러오고(지연 로딩), 보이기 시작하면 나머지를 미리 받는다.
 */
export default function Turntable({ frames, width, height, title }) {
  const n = frames.length;
  const boxRef = useRef(null);
  const drag = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  // 1) 화면 가까이 오면 로딩 시작
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 2) 모든 프레임 미리 받기
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const imgs = frames.map((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => !cancelled && setLoaded((c) => c + 1);
      img.src = src;
      return img;
    });
    return () => {
      cancelled = true;
      imgs.forEach((img) => (img.onload = img.onerror = null));
    };
  }, [visible, frames]);

  const ready = loaded >= n;

  // 3) 다 받았고 아직 손대지 않았으면 천천히 한 바퀴 돌며 "돌릴 수 있다"는 걸 보여준다
  useEffect(() => {
    if (!ready || touched || prefersReducedMotion()) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setIndex((x) => (x + 1) % n);
      if (i >= n) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, [ready, touched, n]);

  const step = useCallback(
    (d) => {
      setTouched(true);
      setIndex((x) => (((x + d) % n) + n) % n);
    },
    [n],
  );

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setTouched(true);
    drag.current = { x: e.clientX, start: index, id: e.pointerId };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const w = boxRef.current?.clientWidth || 300;
    const pxPerFrame = Math.max(4, (w * 1.1) / n); // 폭을 한 번 끌면 대략 한 바퀴
    const delta = Math.round((e.clientX - d.x) / pxPerFrame);
    setIndex((((d.start - delta) % n) + n) % n);
  };
  const onPointerUp = (e) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(-1);
    }
  };

  const angle = Math.round((index / n) * 360);

  return (
    <figure className="select-none">
      <div
        ref={boxRef}
        role="slider"
        tabIndex={0}
        aria-label={`${title} 360도 보기. 좌우로 끌거나 방향키로 돌려보세요.`}
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={angle}
        aria-valuetext={`${angle}도`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative cursor-grab overflow-hidden bg-ink/5 outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing"
        style={{ aspectRatio: `${width} / ${height}`, touchAction: 'pan-y' }}
      >
        <img
          src={visible ? frames[index] : frames[0]}
          width={width}
          height={height}
          alt={`${title}, ${angle}도`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="pointer-events-none block h-full w-full object-contain"
        />

        {visible && !ready && (
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-ink/10">
            <div className="h-full bg-accent transition-[width]" style={{ width: `${(loaded / n) * 100}%` }} />
          </div>
        )}

        <span
          className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-opacity duration-500 ${
            touched ? 'opacity-0' : 'opacity-100'
          }`}
        >
          ← 끌어서 돌려보기 →
        </span>
      </div>

      <figcaption className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
        <span>360° · {n} frames</span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(1)}
            className="px-2 py-1 text-ink hover:text-accent"
            aria-label="왼쪽으로 돌리기"
          >
            ←
          </button>
          <span className="w-10 text-center tabular-nums">{angle}°</span>
          <button
            type="button"
            onClick={() => step(-1)}
            className="px-2 py-1 text-ink hover:text-accent"
            aria-label="오른쪽으로 돌리기"
          >
            →
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
