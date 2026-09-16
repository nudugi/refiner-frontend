import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { siteMeta, hero, intro, features, process, visual, finalCta } from '../content/siteContent';

function SectionLabel({ children }) {
  return (
    <span className="block font-mono text-xs tracking-widest text-accent">{children}</span>
  );
}

export default function Home() {
  useDocumentMeta(siteMeta.title, siteMeta.description);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 sm:pt-28">
        <SectionLabel>{hero.eyebrow}</SectionLabel>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
          {hero.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-md whitespace-pre-line text-base leading-relaxed text-muted sm:text-lg">
          {hero.subtitle}
        </p>
        <Link
          to={hero.ctaPrimary.to}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper no-underline transition-opacity hover:opacity-80"
        >
          {hero.ctaPrimary.label}
          <span aria-hidden>→</span>
        </Link>
      </section>

      <hr className="mx-auto max-w-5xl border-ink/10" />

      {/* Intro */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-[120px_1fr]">
          <SectionLabel>{intro.eyebrow}</SectionLabel>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{intro.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{intro.body}</p>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-ink/10" />

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-[120px_1fr]">
          <SectionLabel>{features.eyebrow}</SectionLabel>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{features.title}</h2>
            <ul className="mt-8 grid list-none gap-8 sm:grid-cols-3">
              {features.items.map((item, i) => (
                <li key={item.label} className="border-t border-ink/10 pt-4">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2 font-bold">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-ink/10" />

      {/* Process */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-[120px_1fr]">
          <SectionLabel>{process.eyebrow}</SectionLabel>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{process.title}</h2>
            <ol className="mt-8 flex list-none flex-col gap-6 sm:flex-row sm:gap-4">
              {process.steps.map((s) => (
                <li key={s.step} className="flex-1 border-t border-ink/10 pt-4">
                  <span className="font-mono text-xs text-accent">{s.step}</span>
                  <p className="mt-2 font-bold">{s.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-ink/10" />

      {/* Visual / mood */}
      <section className="overflow-hidden bg-ink py-24 text-paper">
        <div className="mx-auto max-w-5xl px-6">
          <SectionLabel>{visual.eyebrow}</SectionLabel>
          <p className="mt-6 whitespace-pre-line text-3xl font-bold leading-snug tracking-tight sm:text-5xl">
            {visual.statement}
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            {visual.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-paper/30 px-4 py-1.5 font-mono text-xs tracking-wide text-paper/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{finalCta.title}</h2>
        <p className="mt-3 text-muted">{finalCta.subtitle}</p>
        <Link
          to={finalCta.cta.to}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper no-underline transition-opacity hover:opacity-80"
        >
          {finalCta.cta.label}
          <span aria-hidden>→</span>
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
