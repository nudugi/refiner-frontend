import { Link, useParams } from 'react-router-dom';
import ArchiveShell from '../components/ArchiveShell';
import Eyebrow, { SectionHead } from '../components/Eyebrow';
import ExhibitionRows from '../components/ExhibitionRows';
import { ShareBar } from '../components/RecordPanel';
import NotFound from '../../pages/NotFound';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { spaces, exhibitionBySlug } from '../data';

export default function SpacePage() {
  const { slug } = useParams();
  const s = spaces[slug];
  useDocumentMeta(s ? `${s.name} | SUNYA` : 'SUNYA', s ? `${s.city} ${s.type} ${s.name}에서 열린 전시 기록` : undefined);
  if (!s) return <NotFound />;

  const exs = s.exhibitions.map((x) => exhibitionBySlug[x]);

  return (
    <ArchiveShell>
      <header className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
        <Eyebrow>
          <Link to="/exhibitions" className="text-accent no-underline hover:underline">
            Space
          </Link>{' '}
          · {s.type}
        </Eyebrow>
        <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tighter break-keep sm:text-7xl">{s.name}</h1>
        <p className="mt-4 text-base">
          {s.city}
          {s.address && <span className="text-muted"> · {s.address}</span>}
        </p>
        {s.link && (
          <a href={s.link} target="_blank" rel="noreferrer" className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-ink no-underline hover:text-accent">
            Website ↗
          </a>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-6">
        <section className="mt-16">
          <SectionHead index="01" title="이 공간에서 열린 전시" aside={`${exs.length}`} />
          {exs.length > 0 ? (
            <div className="[&>ul]:border-t-0">
              <ExhibitionRows items={exs} hideSpace />
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">아직 기록된 전시가 없습니다.</p>
          )}
        </section>

        <section className="mt-16 border-t border-ink/15 pt-6">
          <ShareBar path={s.url} title={s.name} />
        </section>
      </div>
    </ArchiveShell>
  );
}
