'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="header-wrap">
        <div className="header-blue" />
        <div className="header-white" />
        <div className="header-red">
          <div className="container header-inner">
            <Link href="/" className="header-logo">
              <Image src="/logo.png" alt="廟會月報" height={70} width={210} />
            </Link>

            {/* 桌面版導覽 */}
            <nav className="header-nav header-nav-desktop">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="header-nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 手機版漢堡按鈕 */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="開啟選單"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* 手機版全螢幕選單 */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="關閉選單"
          >
            ✕
          </button>
          <div className="mobile-menu-logo">
            <Image src="/logo.png" alt="廟會月報" height={40} width={120} />
          </div>
          <nav className="mobile-menu-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-social">
            <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer">
              LINE 官方帳號
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
              Facebook 官方粉專
            </a>
          </div>
        </div>
      )}
    </>
  );
}
