'use client';

import { useState } from 'react';
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
  const pathname = usePathname();

  // 停留於 /products 或 /sponsors 時，trigger 持續高亮
  const isServiceActive =
    pathname?.startsWith('/products') || pathname?.startsWith('/sponsors');

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

              {/* 服務項目（hover 下拉，北港朝天宮 風格） */}
              <div
                className={`nav-dropdown ${
                  isServiceActive ? 'nav-dropdown-active' : ''
                }`}
              >
                <span className="header-nav-link nav-dropdown-trigger">
                  服務項目
                  <span className="nav-dropdown-arrow" aria-hidden>
                    ▾
                  </span>
                </span>
                <div className="nav-dropdown-menu">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="nav-dropdown-item"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
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

      {/* 手機版全螢幕選單（北港朝天宮 風格：2 欄格狀 + 卡其子選單） */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          {/* 頂部 logo + 關閉鈕 */}
          <div className="mobile-menu-header">
            <Link
              href="/"
              className="mobile-menu-logo"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image src="/logo.png" alt="廟會月報" height={50} width={150} />
            </Link>
            <button
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="關閉選單"
            >
              ✕
            </button>
          </div>

          <nav className="mobile-menu-nav">
            {/* 主選單 — 2 欄格狀 */}
            <div className="mobile-menu-grid">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* 服務項目：橫跨兩欄、金色高亮 */}
              <div className="mobile-menu-item mobile-menu-item-highlight">
                服務項目
              </div>
            </div>

            {/* 服務項目子選單（卡其底搭配紅字，視覺上跟主選單區隔） */}
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

            {/* 底部社群連結 */}
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