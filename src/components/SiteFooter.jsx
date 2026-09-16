import { Link } from 'react-router-dom';
import SunyaWordmark from './SunyaWordmark';
import { footer, nav } from '../content/siteContent';

export default function SiteFooter() {
  return (
    <footer className="bg-void text-bone">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SunyaWordmark size="lg" />
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/60">{footer.desc}</p>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-bone/15 pt-8 font-mono text-xs uppercase tracking-widest">
          {nav.menu.map((item) => (
            <Link key={item.to} to={item.to} className="text-bone/70 no-underline hover:text-signal">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-bone/15 pt-6 text-[11px] leading-relaxed text-bone/40">
          <p>
            상호: {footer.business.name} | 대표: {footer.business.ceo} | 사업자등록번호:{' '}
            {footer.business.registrationNumber} | 통신판매업 신고번호: {footer.business.mailOrderNumber}
          </p>
          <p>
            주소: {footer.business.address} | 전화: {footer.business.phone} | 이메일: {footer.business.email}
          </p>
          <p className="mt-2 font-mono">{footer.domain}</p>
        </div>
      </div>
    </footer>
  );
}
