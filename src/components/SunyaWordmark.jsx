const SIZES = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-5xl sm:text-7xl',
  xl: 'text-7xl sm:text-9xl',
};

export default function SunyaWordmark({ size = 'md', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.12em] font-black uppercase leading-none tracking-tighter ${SIZES[size]} ${className}`}
    >
      <img
        src="/brand/mark-signal.png"
        alt=""
        aria-hidden="true"
        className="h-[0.85em] w-auto shrink-0 object-contain"
      />
      SUNYA
    </span>
  );
}
