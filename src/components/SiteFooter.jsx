import { Link } from 'react-router-dom';
import { footer } from '../content/siteContent';

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-extrabold tracking-tight text-ink">{footer.brand}</p>
          <p className="mt-1 max-w-xs">{footer.desc}</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <Link to={footer.toolLink.to} className="text-ink no-underline hover:underline">
            {footer.toolLink.label}
          </Link>
          <span className="font-mono text-xs text-muted">{footer.domain}</span>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-4 text-xs leading-relaxed text-muted">
          <p>
            상호: {footer.business.name} | 대표: {footer.business.ceo} | 사업자등록번호:{' '}
            {footer.business.registrationNumber} | 통신판매업 신고번호: {footer.business.mailOrderNumber}
          </p>
          <p>
            주소: {footer.business.address} | 전화: {footer.business.phone} | 이메일: {footer.business.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
