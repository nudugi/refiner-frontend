export default function MarqueeBand({ text }) {
  return (
    <div className="overflow-hidden border-y border-bone/20 bg-void py-3">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="font-mono text-sm uppercase tracking-widest text-bone/70 sm:text-base"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
