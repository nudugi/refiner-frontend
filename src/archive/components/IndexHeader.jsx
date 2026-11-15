import Eyebrow from './Eyebrow';
import ArchiveTabs from './ArchiveTabs';

export default function IndexHeader({ title, desc }) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
      <Eyebrow>SUNYA Archive</Eyebrow>
      <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tighter sm:text-7xl">{title}</h1>
      {desc && <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{desc}</p>}
      <div className="mt-8 border-b border-ink/15">
        <ArchiveTabs />
      </div>
    </header>
  );
}
