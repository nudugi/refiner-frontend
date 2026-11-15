import { Link } from 'react-router-dom';
import ArchiveShell from '../components/ArchiveShell';
import IndexHeader from '../components/IndexHeader';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { artists } from '../data';

export default function ArtistsIndex() {
  useDocumentMeta('작가 | SUNYA', 'SUNYA 아카이브에 기록된 작가들');
  const list = Object.values(artists).sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  return (
    <ArchiveShell>
      <IndexHeader title="작가" />
      <div className="mx-auto max-w-6xl px-6">
        {list.length === 0 && <p className="mt-16 text-sm text-muted">아직 기록된 작가가 없습니다.</p>}
        <ul className="mt-6 list-none p-0">
          {list.map((a) => (
            <li key={a.slug} className="border-b border-ink/10">
              <Link to={a.url} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 text-ink no-underline">
                <span className="text-2xl font-black tracking-tight group-hover:underline sm:text-3xl">
                  {a.name}
                  {a.nameEn && <span className="ml-3 text-sm font-normal tracking-normal text-muted">{a.nameEn}</span>}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {a.mediums.join(' · ')}
                  {a.exhibitions.length > 0 && ` — 전시 ${a.exhibitions.length}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ArchiveShell>
  );
}
