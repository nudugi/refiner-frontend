import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { nav } from '../content/siteContent';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        aria-expanded={open}
        className={`relative z-[60] flex h-10 w-10 flex-col items-end justify-center gap-[6px] transition-opacity ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <span className="h-[2px] w-8 bg-current transition-all" />
        <span className="h-[2px] w-5 bg-current transition-all" />
      </button>

      <div
        className={`fixed z-50 overflow-y-auto bg-void text-bone transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ top: 0, right: 0, bottom: 0, left: 0 }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
          className="fixed flex h-10 w-10 items-center justify-center text-bone"
          style={{ top: '1.25rem', right: '1.5rem' }}
        >
          <span className="relative block h-5 w-6">
            <span
              className="absolute block h-[2px] w-6 bg-current"
              style={{ top: '50%', left: 0, transform: 'translateY(-50%) rotate(45deg)' }}
            />
            <span
              className="absolute block h-[2px] w-6 bg-current"
              style={{ top: '50%', left: 0, transform: 'translateY(-50%) rotate(-45deg)' }}
            />
          </span>
        </button>

        <nav className="flex min-h-full flex-col justify-center gap-1 px-6 py-20 sm:px-10">
          {nav.menu.map((item, i) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-baseline gap-4 border-b border-bone/10 py-3 no-underline sm:gap-6 sm:py-4 ${
                  active ? 'text-signal' : 'text-bone'
                }`}
              >
                <span className="font-mono text-sm text-bone/40 sm:text-base">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-4xl font-black uppercase leading-none tracking-tighter transition-colors group-hover:text-signal sm:text-6xl">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
