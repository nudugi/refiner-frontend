import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import PlaceholderWork from '../components/PlaceholderWork';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { worksPage } from '../content/siteContent';

export default function Works() {
  useDocumentMeta(`Works | SUNYA`, worksPage.desc);

  return (
    <div className="min-h-screen bg-void text-bone">
      <SiteHeader theme="dark" />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          {worksPage.eyebrow}
        </span>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl">
          {worksPage.title}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone/60 sm:text-base">
          {worksPage.desc}
        </p>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {worksPage.items.map((item, i) => (
            <PlaceholderWork
              key={item.title}
              index={i + 1}
              title={item.title}
              category={item.category}
              tone="dark"
            />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
