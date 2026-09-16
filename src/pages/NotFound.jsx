import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader theme="light" />
      <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">페이지를 찾을 수 없습니다</h1>
        <Link to="/" className="mt-6 text-sm font-semibold text-ink underline">
          SUNYA 홈으로
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}
