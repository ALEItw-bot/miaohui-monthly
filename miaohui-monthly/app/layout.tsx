import type { Metadata } from 'next';
import './globals.css';
import HeaderWrapper from './components/HeaderWrapper';

export const metadata: Metadata = {
  title: {
    default: '廟會月報｜全台鬧熱，報你知！',
    template: '%s｜廟會月報',
  },
  description:
    '台灣最完整的廟會活動資訊平台。大甲媽祖遣境、白沙屯媽祖進香、全台廟會活動時間、路線、注意事項一次看！',
  keywords: [
    '廟會月報', '大甲媽祖遣境', '白沙屯媽祖',
    '繞境', '進香', '廟會', '媽祖', '台灣廟會',
  ],
  authors: [{ name: '廟會月報團隊' }],
  creator: '廟會月報',
  publisher: '廟會月報',
  metadataBase: new URL('https://miaohui-monthly.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://miaohui-monthly.vercel.app',
    siteName: '廟會月報',
    title: '廟會月報｜全台鬧熱，報你知！',
    description: '台灣最完整的廟會活動資訊平台。繞境・進香・廟會，第一手情報都在這！',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '廟會月報' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '廟會月報｜全台鬧熱，報你知！',
    description: '台灣最完整的廟會活動資訊平台',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ===== Header: 藍白紅三層 + Auto-Hide ===== */}
        <HeaderWrapper>
          <div className="header-blue" />
          <div className="header-white" />
          <div className="header-red">
            <div className="container header-inner">
              <a href="/" className="header-logo">
                廟會月報
              </a>
              <nav className="header-nav">
                <a href="/#events" className="header-nav-link">最新消息</a>
                <a href="/brand-story" className="header-nav-link">品牌故事</a>
                <a href="/#news" className="header-nav-link">熱鬧資訊</a>
              </nav>
            </div>
          </div>
        </HeaderWrapper>

        {/* ===== Main ===== */}
        <main>{children}</main>

        {/* ===== Footer ===== */}
        <footer className="footer-wrap">
          <div className="footer-top">
            <div className="container footer-grid">
              <div className="footer-brand">
                <div className="footer-logo">廟會月報</div>
                <p className="footer-desc">台灣最完整的廟會活動資訊平台</p>
                <p className="footer-desc">與你攜手感受台灣廟會之美</p>
              </div>
              <div className="footer-links">
                <h4 className="footer-title">快速連結</h4>
                <a href="/announcements" className="header-nav-link">最新消息</a>
                <a href="/brand-story">品牌故事</a>
              </div>
              <div className="footer-social">
                <h4 className="footer-title">關注我們</h4>
                <a href="#">LINE 官方帳號</a>
                <a href="#">Facebook 粉專</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 廟會月報｜MiaoHui Monthly. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}