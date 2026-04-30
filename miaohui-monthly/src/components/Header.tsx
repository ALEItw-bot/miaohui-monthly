'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  MAIN_NAV_LINKS,
  SERVICE_LINKS,
  SOCIAL_LINKS,
} from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isServiceActive =
    pathname?.startsWith('/products') || pathname?.startsWith('/sponsors');

  // 切換路徑時關閉所有選單
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileServiceOpen(false);
  }, [pathname]);

  // 點擊 dropdown 外側關閉（桌機版）
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="header-nav-link"
                >
                  {link.label}
                </Link>
              ))}

              {/* 服務項目（點擊下拉） */}
              <div
                ref={dropdownRef}
                className={`nav-dropdown ${
                  dropdownOpen ? 'nav-dropdown-open' : ''
                } ${isServiceActive ? 'nav-dropdown-active' : ''}`}
              >
                <button
                  type="button"
                  className="header-nav-link nav-dropdown-trigger"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                >
                  服務項目
                  <span className="nav-dropdown-arrow" aria-hidden>
                    ▾
                  </span>
                </button>
                <div className="nav-dropdown-menu" role="menu">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="nav-dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* 手機漢堡鈕 */}
            <button
              type="button"
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

      {/* 手機版全螢幕選單（原本的直列樣式 + 服務項目可展開） */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <Link
              href="/"
              className="mobile-menu-logo"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image src="/logo.png" alt="廟會月報" height={50} width={150} />
            </Link>
            <button
              type="button"
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="關閉選單"
            >
              ✕
            </button>
          </div>

          <nav className="mobile-menu-nav">
            {MAIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-menu-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* 服務項目（點擊展開子項） */}
            <button
              type="button"
              className={`mobile-menu-link mobile-menu-service-toggle ${
                mobileServiceOpen ? 'open' : ''
              }`}
              onClick={() => setMobileServiceOpen((v) => !v)}
              aria-expanded={mobileServiceOpen}
            >
              <span>服務項目</span>
              <span className="mobile-menu-arrow" aria-hidden>
                ▾
              </span>
            </button>

            {mobileServiceOpen && (
              <div className="mobile-menu-submenu">
                {SERVICE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="mobile-menu-subitem"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="mobile-menu-social">
              <a
                href={SOCIAL_LINKS.line}
                target="_blank"
                rel="noopener noreferrer"
              >
                LINE 官方帳號
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook 官方粉專
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}