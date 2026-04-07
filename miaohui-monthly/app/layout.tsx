import './styles/notion-article.css';
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

{/* LINE 官方帳號浮動按鈕 */}
<a
  href="https://line.me/R/ti/p/@miaohui"
  className="fab-line"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="加入 LINE 官方帳號"
>
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
</a>

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
                <a href="/announcements" className="header-nav-link">最新消息</a>
                <a href="/brand-story" className="header-nav-link">品牌故事</a>
                <a href="/events" className="header-nav-link">熱鬧資訊</a>
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