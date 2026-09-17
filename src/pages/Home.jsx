import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import MarqueeBand from '../components/MarqueeBand';
import PlaceholderWork from '../components/PlaceholderWork';
import useDocumentMeta from '../hooks/useDocumentMeta';
import useMediaQuery from '../hooks/useMediaQuery';
import {
  siteMeta,
  hero,
  marquee,
  worksTeaser,
  aboutTeaser,
  toolsTeaser,
  worksPage,
} from '../content/siteContent';

const TurtleShellsLogo = lazy(() => import('../components/TurtleShellsLogo'));

export default function Home() {
  useDocumentMeta(siteMeta.title, siteMeta.description);
  const canShow3D = useMediaQuery('(min-width: 640px)');

  return (
    <div className="min-h-screen bg-void text-bone">
      <SiteHeader theme="dark" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 top-1/2 h-[65vh] w-[55%] -translate-y-1/2 select-none opacity-90">
          {canShow3D ? (
            <Suspense
              fallback={
                <img
                  src="/brand/mark-white.png"
                  alt=""
                  aria-hidden="true"
                  className="ml-auto h-[65vh] w-auto opacity-[0.07]"
                />
              }
            >
              <TurtleShellsLogo className="h-full w-full opacity-20" />
            </Suspense>
          ) : null}
        </div>

        <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-bone/50">
            {hero.eyebrow}
          </span>
          <h1 className="mt-6 text-6xl font-black uppercase leading-[0.95] tracking-tighter sm:text-8xl md:text-[9rem]">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-sm text-base text-bone/60 sm:text-lg">{hero.subtitle}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to={hero.ctaPrimary.to}
              className="inline-flex items-center gap-2 bg-signal px-6 py-3 text-sm font-bold uppercase tracking-wide text-void no-underline transition-opacity hover:opacity-80"
            >
              {hero.ctaPrimary.label}
              <span aria-hidden>→</span>
            </Link>
            <Link
              to={hero.ctaSecondary.to}
              className="inline-flex items-center gap-2 border border-bone/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-bone no-underline transition-colors hover:border-bone hover:bg-bone hover:text-void"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </section>

      <MarqueeBand text={marquee.text} />

      {/* Works teaser (light break) */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
            <div>
              <span className="font-mono text-xs text-accent">{worksTeaser.eyebrow}</span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tighter sm:text-5xl">
                {worksTeaser.title}
              </h2>
            </div>
            <Link
              to={worksTeaser.cta.to}
              className="text-sm font-bold uppercase tracking-wide text-ink no-underline hover:underline"
            >
              {worksTeaser.cta.label} →
            </Link>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {worksTeaser.desc}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {worksPage.items.slice(0, 4).map((item, i) => (
              <PlaceholderWork
                key={item.title}
                index={i + 1}
                title={item.title}
                category={item.category}
                tone="light"
              />
            ))}
          </div>
        </div>
      </section>

      {/* About teaser (dark) */}
      <section className="bg-void text-bone">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-xs text-signal">{aboutTeaser.eyebrow}</span>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tighter sm:text-5xl">
            {aboutTeaser.title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone/60 sm:text-base">
            {aboutTeaser.desc}
          </p>
          <Link
            to={aboutTeaser.cta.to}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-bone no-underline hover:text-signal"
          >
            {aboutTeaser.cta.label} →
          </Link>
        </div>
      </section>

      {/* Tools teaser (light break) */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-xs text-accent">{toolsTeaser.eyebrow}</span>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tighter sm:text-5xl">
            {toolsTeaser.title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {toolsTeaser.desc}
          </p>
          <Link
            to={toolsTeaser.cta.to}
            className="mt-8 inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper no-underline transition-opacity hover:opacity-80"
          >
            {toolsTeaser.cta.label}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
