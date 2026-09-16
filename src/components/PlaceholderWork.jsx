export default function PlaceholderWork({ index, title, category, tone = 'light' }) {
  const isDark = tone === 'dark';

  return (
    <div
      className={`group flex aspect-[4/5] flex-col justify-between border p-5 transition-colors duration-200 ${
        isDark
          ? 'border-bone/20 bg-void text-bone hover:bg-bone hover:text-void'
          : 'border-ink/15 bg-paper text-ink hover:bg-ink hover:text-paper'
      }`}
    >
      <span className="font-mono text-xs">{String(index).padStart(2, '0')}</span>
      <div>
        <p className="text-lg font-bold leading-tight">{title}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest opacity-60">{category}</p>
      </div>
    </div>
  );
}
