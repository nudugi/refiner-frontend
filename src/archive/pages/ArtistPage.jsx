import { Link, useParams } from 'react-router-dom';
import ArchiveShell from '../components/ArchiveShell';
import Eyebrow, { SectionHead } from '../components/Eyebrow';
import Img from '../components/Img';
import WorkCard from '../components/WorkCard';
import ExhibitionRows from '../components/ExhibitionRows';
import { ShareBar } from '../components/RecordPanel';
import NotFound from '../../pages/NotFound';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { artists, works, exhibitionBySlug } from '../data';

const LINK_LABEL = { instagram: 'Instagram', website: 'Website', email: 'Email', youtube: 'YouTube', blog: 'Blog' };

function linkHref(key, value) {
  if (key === 'email' && !value.startsWith('mailto:')) return `mailto:${value}`;
  return value;
}

export default function ArtistPage() {
  const { slug } = useParams();
  const a = artists[slug];
  useDocumentMeta(a ? `${a.name} | SUNYA` : 'SUNYA', a?.bio);
  if (!a) return <NotFound />;

  const exs = a.exhibitions.map((s) => exhibitionBySlug[s]);
  const ws = a.works.map((s) => works[s]);

  return (
    <ArchiveShell>
      <header className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow>
              <Link to="/artists" className="text-accent no-underline hover:underline">
                Artist
              </Link>
            </Eyebrow>
            <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tighter sm:text-7xl md:text-8xl">{a.name}</h1>
            {a.nameEn && <p className="mt-2 text-lg text-muted sm:text-xl">{a.nameEn}</p>}
            {a.mediums.length > 0 && (
              <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                {a.mediums.map((m) => (
                  <li key={m} className="border border-ink/20 px-2 py-1 font-mono text-[11px] tracking-wider">
                    {m}
                  </li>
                ))}
              </ul>
            )}
            {a.bio && <p className="mt-6 max-w-2xl text-base leading-relaxed break-keep sm:text-lg">{a.bio}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {Object.entries(a.links).map(([k, v]) => (
                <a
                  key={k}
                  href={linkHref(k, v)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-ink no-underline hover:text-accent"
                >
                  {LINK_LABEL[k] ?? k} ↗
                </a>
              ))}
            </div>
          </div>
          {a.portrait && (
            <figure className="lg:col-span-4">
              <Img image={a.portrait} eager sizes="(min-width: 1024px) 360px, 100vw" className="h-auto w-full" />
            </figure>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6">
        {exs.length > 0 && (
          <section className="mt-16">
            <SectionHead index="01" title="참여 전시" aside={`${exs.length}`} />
            <div className="mt-0 [&>ul]:border-t-0">
              <ExhibitionRows items={exs} />
            </div>
          </section>
        )}

        {ws.length > 0 && (
          <section className="mt-16">
            <SectionHead index="02" title="작품" aside={`${ws.length}`} />
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {ws.map((w) => (
                <WorkCard key={w.slug} work={w} showArtist={false} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 border-t border-ink/15 pt-6">
          <ShareBar path={a.url} title={a.name} />
        </section>
      </div>
    </ArchiveShell>
  );
}
