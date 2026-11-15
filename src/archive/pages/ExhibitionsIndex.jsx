import { useSearchParams } from 'react-router-dom';
import ArchiveShell from '../components/ArchiveShell';
import IndexHeader from '../components/IndexHeader';
import ExhibitionCard from '../components/ExhibitionCard';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { exhibitions } from '../data';

const DESC = '졸전, 과제전, 작업실 오픈, 카페 전시, 하루짜리 팝업까지. 끝나도 사라지지 않는 작은 전시의 기록.';

export default function ExhibitionsIndex() {
  useDocumentMeta('전시 기록 | SUNYA', DESC);
  const [params, setParams] = useSearchParams();
  const type = params.get('type') ?? '';
  const types = [...new Set(exhibitions.map((e) => e.type))];
  const list = type ? exhibitions.filter((e) => e.type === type) : exhibitions;

  const byYear = [];
  for (const ex of list) {
    const y = ex.startDate.slice(0, 4);
    const last = byYear[byYear.length - 1];
    if (last?.year === y) last.items.push(ex);
    else byYear.push({ year: y, items: [ex] });
  }

  const chip = (active) =>
    `border px-3 py-1.5 text-xs transition-colors ${active ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-ink hover:border-ink'}`;

  return (
    <ArchiveShell>
      <IndexHeader title="전시 기록" desc={DESC} />
      <div className="mx-auto max-w-6xl px-6">
        {types.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="유형으로 거르기">
            <button type="button" className={chip(!type)} onClick={() => setParams({})}>
              전체
            </button>
            {types.map((t) => (
              <button key={t} type="button" className={chip(type === t)} onClick={() => setParams({ type: t })}>
                {t}
              </button>
            ))}
          </div>
        )}

        {byYear.length === 0 && <p className="mt-16 text-sm text-muted">해당하는 전시가 없습니다.</p>}

        {byYear.map(({ year, items }, gi) => (
          <section key={year} className="mt-12 grid gap-6 border-t border-ink pt-4 lg:grid-cols-12">
            <h2 className="font-mono text-2xl font-bold tracking-tight lg:col-span-2">{year}</h2>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:col-span-10 lg:grid-cols-3">
              {items.map((ex, i) => (
                <ExhibitionCard key={ex.slug} exhibition={ex} eager={gi === 0 && i < 2} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </ArchiveShell>
  );
}
