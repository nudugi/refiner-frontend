import { Link } from 'react-router-dom';
import Img from './Img';
import { artists } from '../data';
import { artistNames, workThumb } from '../lib';

/** 작품 카드: 이미지 + 표준 캡션(작가, 제목, 연도, 재료, 크기) */
export default function WorkCard({ work, showArtist = true }) {
  const thumb = workThumb(work);
  return (
    <Link to={work.url} className="group block text-ink no-underline">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <Img
          image={thumb}
          sizes="(min-width: 1024px) 300px, 50vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {work.turntable && (
          <span className="absolute left-2 top-2 bg-paper/90 px-1.5 py-1 font-mono text-[10px] leading-none tracking-widest text-ink">
            360°
          </span>
        )}
      </div>
      <Caption work={work} showArtist={showArtist} className="mt-3" />
    </Link>
  );
}

export function Caption({ work, showArtist = true, className = '' }) {
  return (
    <p className={`text-xs leading-relaxed text-muted ${className}`}>
      {showArtist && <span className="text-ink">{artistNames(work.artists, artists).join(', ')}</span>}
      {showArtist && <br />}
      <span className="font-bold text-ink group-hover:underline">〈{work.title}〉</span>
      {work.year && `, ${work.year}`}
      {work.materials && (
        <>
          <br />
          {work.materials}
        </>
      )}
      {work.dimensions && (
        <>
          <br />
          {work.dimensions}
        </>
      )}
    </p>
  );
}
