import { exhibitionStatus, STATUS_LABEL } from '../lib';

const STYLE = {
  current: 'border-accent bg-accent text-paper',
  upcoming: 'border-ink text-ink',
  ended: 'border-ink/20 text-muted',
};

export default function StatusBadge({ exhibition, className = '' }) {
  const s = exhibitionStatus(exhibition);
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[10px] uppercase leading-none tracking-widest ${STYLE[s]} ${className}`}
    >
      {s === 'current' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper" aria-hidden />}
      {STATUS_LABEL[s]}
    </span>
  );
}
