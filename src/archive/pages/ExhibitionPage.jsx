import { Link, useParams } from 'react-router-dom';
import ArchiveShell from '../components/ArchiveShell';
import Eyebrow, { SectionHead } from '../components/Eyebrow';
import Img from '../components/Img';
import StatusBadge from '../components/StatusBadge';
import Turntable from '../components/Turntable';
import WorkCard, { Caption } from '../components/WorkCard';
import RecordPanel from '../components/RecordPanel';
import NotFound from '../../pages/NotFound';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { artists, spaces, works, exhibitionBySlug } from '../data';
import { exhibitionCitation } from '../lib';

function InfoRow({ label, children }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-ink/10 py-3 text-sm">
      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</dt>
      <dd className="m-0 leading-relaxed">{children}</dd>
    </div>
  );
}

function PeopleLinks({ slugs }) {
  return slugs.map((s, i) => (
    <span key={s}>
      {i > 0 && ', '}
      <Link to={artists[s].url} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-accent">
        {artists[s].name}
      </Link>
    </span>
  ));
}

export default function ExhibitionPage() {
  const { slug } = useParams();
  const ex = exhibitionBySlug[slug];
  useDocumentMeta(ex ? `${ex.title} | SUNYA` : 'SUNYA', ex?.introText?.slice(0, 120));
  if (!ex) return <NotFound />;

  const sp = spaces[ex.space];
  const exWorks = ex.works.map((w) => works[w]);
  const spinning = exWorks.filter((w) => w.turntable);
  const still = exWorks.filter((w) => !w.turntable);
  let n = 0;
  const idx = () => String(++n).padStart(2, '0');

  return (
    <ArchiveShell>
      {/* 3초 안에 "무슨 전시인지": 제목 · 기간 · 장소 · 작가를 첫 화면에 */}
      <header className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>
            <Link to="/exhibitions" className="text-accent no-underline hover:underline">
              Exhibition
            </Link>{' '}
            · {ex.type}
          </Eyebrow>
          <StatusBadge exhibition={ex} />
        </div>
        <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tighter break-keep sm:text-7xl md:text-8xl">
          {ex.title}
        </h1>
        {ex.titleEn && <p className="mt-2 text-lg text-muted sm:text-xl">{ex.titleEn}</p>}
        <p className="mt-6 text-base font-bold sm:text-lg">
          {ex.dateText}
          <span className="font-normal text-muted"> · </span>
          <Link to={sp.url} className="text-ink no-underline hover:underline">
            {sp.name}
          </Link>
          <span className="font-normal text-muted">, {sp.city}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          <PeopleLinks slugs={ex.artists} />
        </p>
      </header>

      {ex.cover && (
        <figure className="mx-auto mt-8 max-w-6xl px-0 sm:px-6">
          <Img image={ex.cover} eager sizes="(min-width: 1152px) 1104px, 100vw" className="h-auto w-full" />
          {ex.cover.caption && <figcaption className="mt-2 px-6 text-xs text-muted sm:px-0">{ex.cover.caption}</figcaption>}
        </figure>
      )}

      <div className="mx-auto max-w-6xl px-6">
        {/* 기본 정보 + 서문 */}
        <section className="mt-14 grid gap-10 lg:grid-cols-12">
          <dl className="m-0 border-t border-ink lg:col-span-4 lg:self-start">
            <InfoRow label="기간">{ex.dateText}</InfoRow>
            <InfoRow label="장소">
              <Link to={sp.url} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-accent">
                {sp.name}
              </Link>
              {sp.address && <span className="block text-xs text-muted">{sp.address}</span>}
            </InfoRow>
            <InfoRow label="작가">
              <PeopleLinks slugs={ex.artists} />
            </InfoRow>
            <InfoRow label="기획">{ex.curators.join(', ')}</InfoRow>
            <InfoRow label="유형">{ex.type}</InfoRow>
          </dl>
          {ex.introHtml && (
            <div className="lg:col-span-8">
              <SectionHead index={idx()} title="서문" />
              <div className="sunya-prose mt-6" dangerouslySetInnerHTML={{ __html: ex.introHtml }} />
            </div>
          )}
        </section>

        {/* 설치 전경 */}
        {ex.installationViews.length > 0 && (
          <section className="mt-20">
            <SectionHead index={idx()} title="설치 전경" aside={`${ex.installationViews.length} views`} />
            <div className="mt-6 grid gap-x-4 gap-y-8 sm:grid-cols-2">
              {ex.installationViews.map((img, i) => (
                <figure key={img.src} className={i === 0 ? 'sm:col-span-2' : ''}>
                  <Img
                    image={img}
                    sizes={i === 0 ? '(min-width: 1152px) 1104px, 100vw' : '(min-width: 1152px) 544px, (min-width: 640px) 50vw, 100vw'}
                    className="h-auto w-full"
                  />
                  {(img.caption || img.credit) && (
                    <figcaption className="mt-2 text-xs text-muted">
                      {img.caption}
                      {img.credit && <span className="ml-2 font-mono">© {img.credit}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* 평면도 */}
        {ex.floorPlan && (
          <section className="mt-20">
            <SectionHead index={idx()} title="평면도" />
            <figure className="mt-6 max-w-3xl">
              <Img image={ex.floorPlan} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" />
              {ex.floorPlan.caption && <figcaption className="mt-2 text-xs text-muted">{ex.floorPlan.caption}</figcaption>}
            </figure>
          </section>
        )}

        {/* 출품작 */}
        {exWorks.length > 0 && (
          <section className="mt-20">
            <SectionHead index={idx()} title="출품작" aside={`${exWorks.length} works`} />
            {spinning.map((w) => (
              <div key={w.slug} className="mt-8 grid gap-6 border-b border-ink/10 pb-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <Turntable frames={w.turntable.frames} width={w.turntable.width} height={w.turntable.height} title={w.title} />
                </div>
                <div className="lg:col-span-5 lg:pt-2">
                  <Link to={w.url} className="group block text-ink no-underline">
                    <Caption work={w} className="text-sm" />
                  </Link>
                  {w.description && <p className="mt-4 text-sm leading-relaxed text-ink/80">{w.description}</p>}
                  <Link to={w.url} className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest text-accent no-underline hover:underline">
                    작품 페이지 →
                  </Link>
                </div>
              </div>
            ))}
            {still.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
                {still.map((w) => (
                  <WorkCard key={w.slug} work={w} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 리뷰 */}
        {ex.reviews.length > 0 && (
          <section className="mt-20">
            <SectionHead index={idx()} title="리뷰 · 글" />
            <ul className="mt-2 list-none p-0">
              {ex.reviews.map((r) => (
                <li key={r.title} className="border-b border-ink/10 py-4">
                  <a
                    href={r.link || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-ink no-underline hover:underline"
                  >
                    {r.title} {r.link && <span aria-hidden>↗</span>}
                  </a>
                  <p className="mt-1 text-xs text-muted">{[r.author, r.publication].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <RecordPanel
          index={idx()}
          path={ex.url}
          title={ex.title}
          share={ex.share}
          citation={exhibitionCitation(ex, { artists, spaces })}
          slug={ex.slug}
          kind="exhibition"
        />
      </div>
    </ArchiveShell>
  );
}
