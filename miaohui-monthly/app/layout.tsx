'use client';

import { useState } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="zh-TW">
      <head>
        <title>廟會月報｜全台鬧熱，報你知！</title>
        <meta name="description" content="台灣最完整的廟會活動資訊平台。大甲媽祖遶境、白沙屯媽祖進香、全台廟會活動時間、路線、注意事項一次看！" />
        <meta name="keywords" content="廟會月報,大甲媽祖遶境,白沙屯媽祖,繞境,進香,廟會,媽祖,台灣廟會" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="zh_TW" />
        <meta property="og:url" content="https://miaohui-monthly.vercel.app" />
        <meta property="og:site_name" content="廟會月報" />
        <meta property="og:title" content="廟會月報｜全台鬧熱，報你知！" />
        <meta property="og:description" content="台灣最完整的廟會活動資訊平台。繞境・進香・廟會，第一手情報都在這！" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="廟會月報｜全台鬧熱，報你知！" />
        <meta name="twitter:image" content="/og-image.png" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ===== Header: 藍白紅三層 ===== */}
        <header className="header-wrap">
          <div className="header-blue" />
          <div className="header-white" />
          <div className="header-red">
            <div className="container header-inner">
              <a href="/" className="header-logo">
                <img src="/logo.png" alt="廟會月報" height={40} />
              </a>

              {/* 桌面版導覽（手機版隱藏） */}
              <nav className="header-nav header-nav-desktop">
                <a href="/announcements" className="header-nav-link">最新消息</a>
                <a href="/brand-story" className="header-nav-link">品牌故事</a>
                <a href="/events" className="header-nav-link">熱鬧資訊</a>
                <a href="/gallery" className="header-nav-link">精彩花絮</a>
                <a href="/sponsors" className="header-nav-link">工商服務</a>
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
              <img src="/logo.png" alt="廟會月報" height={36} />
            </div>
            <nav className="mobile-menu-nav">
              <a href="/announcements" onClick={() => setMobileMenuOpen(false)}>最新消息</a>
              <a href="/brand-story" onClick={() => setMobileMenuOpen(false)}>品牌故事</a>
              <a href="/events" onClick={() => setMobileMenuOpen(false)}>熱鬧資訊</a>
              <a href="/gallery" onClick={() => setMobileMenuOpen(false)}>精彩花絮</a>
              <a href="/sponsors" onClick={() => setMobileMenuOpen(false)}>工商服務</a>
            </nav>
            <div className="mobile-menu-social">
              <a href="https://line.me/R/ti/p/@583jmhcd" target="_blank" rel="noopener noreferrer">LINE 官方帳號</a>
              <a href="https://www.facebook.com/MiaoHui.News" target="_blank" rel="noopener noreferrer">Facebook官方粉專</a>
            </div>
          </div>
        )}

        {/* ===== Main ===== */}
        <main>{children}</main>

        {/* ===== Footer ===== */}
        <footer className="footer-wrap">
          <div className="footer-top">
            <div className="container footer-grid">
              <div className="footer-brand">
                <div className="footer-logo">
                  <img src="/logo.png" alt="廟會月報" height={32} />
                </div>
                <p className="footer-desc">台灣最完整的廟會活動資訊平台</p>
                <p className="footer-desc">與你攜手感受台灣廟會之美</p>
              </div>
              <div className="footer-links">
                <h4 className="footer-title">快速連結</h4>
                <a href="/announcements">最新消息</a>
                <a href="/brand-story">品牌故事</a>
                <a href="/events">熱鬧資訊</a>
                <a href="/gallery">精彩花絮</a>
                <a href="/sponsors">工商服務</a>
              </div>
              <div className="footer-social">
                <h4 className="footer-title">關注我們</h4>
                <a href="https://line.me/R/ti/p/@583jmhcd" target="_blank" rel="noopener noreferrer">LINE 官方帳號</a>
                <a href="https://www.facebook.com/MiaoHui.News" target="_blank" rel="noopener noreferrer">Facebook官方粉絲團</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 廟會月報｜MiaoHui Monthly. All rights reserved.</p>
          </div>
        </footer>

        {/* ===== LINE 浮動按鈕（全站右下角） ===== */}
        <a
          href="https://line.me/R/ti/p/@583jmhcd"
          className="fab-line"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="加入 LINE 官方帳號"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </a>
      </body>
    </html>
  );
}