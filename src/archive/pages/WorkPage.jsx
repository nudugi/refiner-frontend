import { Link, useParams } from 'react-router-dom';
import ArchiveShell from '../components/ArchiveShell';
import Eyebrow, { SectionHead } from '../components/Eyebrow';
import Img from '../components/Img';
import Turntable from '../components/Turntable';
import StatusBadge from '../components/StatusBadge';
import RecordPanel from '../components/RecordPanel';
import NotFound from '../../pages/NotFound';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { artists, spaces, works, exhibitionBySlug } from '../data';
import { workCitation, workThumb } from '../lib';

// 작품 페이지는 나중에 실물 QR·소장 기록이 연결될 자리다. 주소(/works/[slug])를 바꾸지 말 것.
export default function WorkPage() {
  const { slug } = useParams();
  const w = works[slug];
  useDocumentMeta(w ? `${w.title} | SUNYA` : 'SUNYA', w?.description?.slice(0, 120));
  if (!w) return <NotFound />;

  const history = w.exhibitions.map((s) => exhibitionBySlug[s]);
  const others = artists[w.artists[0]]?.works.filter((s) => s !== w.slug).map((s) => works[s]) ?? [];

  return (
    <ArchiveShell>
      <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* 이미지 */}
          <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-7">
            {w.turntable && (
              <Turntable frames={w.turntable.frames} width={w.turntable.width} height={w.turntable.height} title={w.title} />
            )}
            {w.images.map((img, i) => (
              <figure key={img.src}>
                <Img image={img} eager={i === 0 && !w.turntable} sizes="(min-width: 1024px) 640px, 100vw" className="h-auto w-full" />
                {img.caption && <figcaption className="mt-2 text-xs text-muted">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>

          {/* 캡션 */}
          <aside className="order-1 lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Eyebrow>
                <Link to="/works" className="text-accent no-underline hover:underline">
                  Work
                </Link>
              </Eyebrow>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tighter break-keep sm:text-6xl">{w.title}</h1>
              {w.titleEn && <p className="mt-2 text-lg text-muted">{w.titleEn}</p>}
              <p className="mt-5 text-base font-bold">
                {w.artists.map((a, i) => (
                  <span key={a}>
                    {i > 0 && ', '}
                    <Link to={artists[a].url} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-accent">
                      {artists[a].name}
                    </Link>
                  </span>
                ))}
              </p>
              <dl className="m-0 mt-6 border-t border-ink text-sm">
                {[
                  ['연도', w.year],
                  ['재료', w.materials],
                  ['크기', w.dimensions],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-ink/10 py-3">
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">{k}</dt>
                      <dd className="m-0">{v}</dd>
                    </div>
                  ))}
              </dl>
              {w.description && <p className="mt-6 text-sm leading-relaxed text-ink/80">{w.description}</p>}

              {history.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">전시 이력</h2>
                  <ul className="mt-2 list-none p-0">
                    {history.map((ex) => (
                      <li key={ex.slug} className="border-b border-ink/10 py-3">
                        <Link to={ex.url} className="text-sm font-bold text-ink no-underline hover:underline">
                          「{ex.title}」
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span>
                            {ex.dateText} · {spaces[ex.space].name}
                          </span>
                          <StatusBadge exhibition={ex} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>

        <RecordPanel
          index="01"
          path={w.url}
          title={w.title}
          share={w.share}
          citation={workCitation(w, { artists })}
          slug={w.slug}
          kind="work"
        />

        {others.length > 0 && (
          <section className="mt-20">
            <SectionHead index="02" title={`${artists[w.artists[0]].name}의 다른 작품`} />
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {others.map((o) => (
                <Link key={o.slug} to={o.url} className="block text-ink no-underline">
                  <div className="aspect-[4/5] overflow-hidden bg-ink/5">
                    <Img
                      image={workThumb(o)}
                      sizes="(min-width: 1024px) 270px, 50vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs">
                    <span className="font-bold">〈{o.title}〉</span>, {o.year}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </ArchiveShell>
  );
}
