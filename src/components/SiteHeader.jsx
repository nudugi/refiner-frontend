import { Link, useLocation } from 'react-router-dom';
import { nav } from '../content/siteContent';

export default function SiteHeader() {
  const { pathname } = useLocation();
  const isTool = pathname.startsWith('/refiner');

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-lg font-extrabold tracking-tight text-ink no-underline"
        >
          {nav.brand}
        </Link>

        {!isTool && (
          <Link
            to="/refiner"
            className="rounded-full border border-ink px-4 py-1.5 text-sm font-semibold text-ink no-underline transition-colors hover:bg-ink hover:text-paper"
          >
            {nav.toolCta}
          </Link>
        )}

        {isTool && (
          <Link
            to="/"
            className="text-sm font-medium text-muted no-underline transition-colors hover:text-ink"
          >
            ← {nav.backToHome}
          </Link>
        )}
      </div>
    </header>
  );
}
