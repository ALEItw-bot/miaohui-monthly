import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS, SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import SiteStats from './SiteStats';

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Image src="/logo.png" alt="廟會月報" height={60} width={180} />
            </div>
            <p className="footer-desc">台灣最完整的廟會活動資訊平台</p>
            <p className="footer-desc">與你攜手感受台灣廟會之美</p>
          </div>
          <div className="footer-links">
            <h4 className="footer-title">快速連結</h4>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer-social">
            <h4 className="footer-title">關注我們</h4>
            <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer">
              LINE 官方帳號
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
              Facebook 官方粉絲團
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        {/* ✅ 瀏覽統計：白色小字，顯示在 copyright 上方 */}
        <SiteStats />
        <p>{SITE_CONFIG.copyright}</p>
      </div>
    </footer>
  );
}