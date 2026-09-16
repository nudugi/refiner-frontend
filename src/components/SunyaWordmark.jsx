const SIZES = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-5xl sm:text-7xl',
  xl: 'text-7xl sm:text-9xl',
};

export default function SunyaWordmark({ size = 'md', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.18em] font-black uppercase leading-none tracking-tighter ${SIZES[size]} ${className}`}
    >
      <span className="inline-block aspect-square h-[0.32em] shrink-0 bg-signal" aria-hidden="true" />
      SUNYA
    </span>
  );
}
