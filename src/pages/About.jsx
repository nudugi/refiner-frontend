import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { aboutPage, aboutArchive } from '../content/siteContent';

export default function About() {
  useDocumentMeta(`About | SUNYA`, aboutPage.paragraphs[0]);

  return (
    <div className="min-h-screen bg-void text-bone">
      <SiteHeader theme="dark" />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          {aboutPage.eyebrow}
        </span>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl">
          {aboutPage.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-14 flex flex-col gap-8 border-t border-bone/15 pt-10">
          {aboutPage.paragraphs.map((p, i) => (
            <p key={i} className="max-w-2xl text-lg leading-relaxed text-bone/80">
              {p}
            </p>
          ))}
        </div>

        <figure className="mt-16 max-w-md border border-bone/15 p-3 sm:p-4">
          <img
            src="/brand/sketch-head.jpg"
            alt="SUNYA 드로잉 스터디"
            className="block w-full"
          />
          <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-bone/40">
            Study — ink on paper
          </figcaption>
        </figure>

        {/* SUNYA 아카이브 소개 */}
        <div className="mt-24 border-t border-bone/15 pt-10">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
            {aboutArchive.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-tighter sm:text-5xl">
            {aboutArchive.title}
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {aboutArchive.paragraphs.map((p, i) => (
              <p key={i} className="max-w-2xl text-base leading-relaxed text-bone/80 sm:text-lg">
                {p}
              </p>
            ))}
          </div>
          <Link
            to={aboutArchive.cta.to}
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-bone no-underline hover:text-signal"
          >
            {aboutArchive.cta.label} →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
