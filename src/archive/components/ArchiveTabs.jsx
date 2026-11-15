import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/exhibitions', label: '전시' },
  { to: '/artists', label: '작가' },
  { to: '/works', label: '작품' },
];

export default function ArchiveTabs() {
  return (
    <nav className="flex gap-5 font-mono text-xs uppercase tracking-widest" aria-label="아카이브">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end
          className={({ isActive }) =>
            `border-b-2 pb-1 no-underline ${isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
