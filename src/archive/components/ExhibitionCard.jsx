import { Link } from 'react-router-dom';
import Img from './Img';
import StatusBadge from './StatusBadge';
import { spaces } from '../data';

export default function ExhibitionCard({ exhibition: ex, eager = false }) {
  const sp = spaces[ex.space];
  return (
    <Link to={ex.url} className="group block text-ink no-underline">
      <div className="aspect-[4/3] overflow-hidden bg-ink/5">
        <Img
          image={ex.cover}
          eager={eager}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <StatusBadge exhibition={ex} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{ex.type}</span>
      </div>
      <h3 className="mt-2 text-xl font-black leading-tight tracking-tight group-hover:underline sm:text-2xl">
        {ex.title}
      </h3>
      {ex.titleEn && <p className="mt-0.5 text-sm text-muted">{ex.titleEn}</p>}
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {ex.dateText}
        {sp && ` · ${sp.name}, ${sp.city}`}
      </p>
    </Link>
  );
}
