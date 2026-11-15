export default function Eyebrow({ children, className = '' }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.3em] text-accent ${className}`}>{children}</p>
  );
}

export function SectionHead({ index, title, aside }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
      <h2 className="flex items-baseline gap-3 text-lg font-bold tracking-tight sm:text-xl">
        {index && <span className="font-mono text-xs font-normal text-accent">{index}</span>}
        {title}
      </h2>
      {aside && <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{aside}</span>}
    </div>
  );
}
