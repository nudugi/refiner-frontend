import { Link } from 'react-router-dom';
import Img from './Img';
import StatusBadge from './StatusBadge';
import { spaces } from '../data';

/** 전시 목록(행): 작가 방·공간 페이지에서 쓴다. 최신순으로 넘겨줄 것 */
export default function ExhibitionRows({ items, hideSpace = false }) {
  return (
    <ul className="m-0 list-none border-t border-ink p-0">
      {items.map((ex) => (
        <li key={ex.slug} className="border-b border-ink/10">
          <Link to={ex.url} className="group grid grid-cols-[5rem_1fr] items-start gap-4 py-4 text-ink no-underline sm:grid-cols-[7rem_1fr_auto] sm:gap-6">
            <div className="aspect-[4/3] overflow-hidden bg-ink/5">
              <Img image={ex.cover} sizes="112px" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-mono text-[11px] text-muted">{ex.dateText}</p>
              <p className="mt-1 text-lg font-black leading-tight tracking-tight group-hover:underline">{ex.title}</p>
              <p className="mt-1 text-xs text-muted">
                {ex.type}
                {!hideSpace && ` · ${spaces[ex.space].name}, ${spaces[ex.space].city}`}
              </p>
              <StatusBadge exhibition={ex} className="mt-2 sm:hidden" />
            </div>
            <StatusBadge exhibition={ex} className="hidden sm:inline-flex" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
