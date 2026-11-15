import ArchiveShell from '../components/ArchiveShell';
import IndexHeader from '../components/IndexHeader';
import WorkCard from '../components/WorkCard';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { works } from '../data';

export default function WorksIndex() {
  useDocumentMeta('작품 | SUNYA', 'SUNYA 아카이브에 기록된 작품들');
  const list = Object.values(works).sort((a, b) => String(b.year).localeCompare(String(a.year)));

  return (
    <ArchiveShell>
      <IndexHeader title="작품" />
      <div className="mx-auto max-w-6xl px-6">
        {list.length === 0 && <p className="mt-16 text-sm text-muted">아직 기록된 작품이 없습니다.</p>}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </div>
      </div>
    </ArchiveShell>
  );
}
