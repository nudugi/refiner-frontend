import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

/** 아카이브 페이지 공통 틀: 기존 헤더·푸터를 그대로 쓰고, 본문만 밝은 지면(paper)으로 */
export default function ArchiveShell({ children }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader theme="light" />
      <main className="pb-24">{children}</main>
      <SiteFooter />
    </div>
  );
}
