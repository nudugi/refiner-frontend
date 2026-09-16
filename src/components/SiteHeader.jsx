import { Link } from 'react-router-dom';
import SunyaWordmark from './SunyaWordmark';
import HamburgerMenu from './HamburgerMenu';

export default function SiteHeader({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky z-40 ${isDark ? 'bg-void text-bone' : 'border-b border-ink/10 bg-paper text-ink'}`}
      style={{ top: 0 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="no-underline" style={{ color: 'inherit' }}>
          <SunyaWordmark size="sm" />
        </Link>
        <HamburgerMenu />
      </div>
    </header>
  );
}
