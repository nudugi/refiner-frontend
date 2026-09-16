import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { toolsPage } from '../content/siteContent';

export default function Tools() {
  useDocumentMeta(`Tools | SUNYA`, toolsPage.desc);

  return (
    <div className="min-h-screen bg-void text-bone">
      <SiteHeader theme="dark" />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          {toolsPage.eyebrow}
        </span>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl">
          {toolsPage.title}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone/60 sm:text-base">
          {toolsPage.desc}
        </p>

        <div className="mt-14 flex flex-col gap-4">
          {toolsPage.items.map((item, i) => (
            <Link
              key={item.title}
              to={item.to}
              className="group flex flex-col justify-between gap-4 border border-bone/20 p-6 no-underline transition-colors hover:bg-bone hover:text-void sm:flex-row sm:items-center sm:p-8"
            >
              <div>
                <span className="font-mono text-xs text-bone/40 group-hover:text-void/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-2xl font-black uppercase tracking-tight">{item.title}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60 group-hover:text-void/70">
                  {item.desc}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold uppercase tracking-wide">열기 →</span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
