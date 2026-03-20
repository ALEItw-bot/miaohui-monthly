import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "廟會月報｜全台鬧熱，報你知！",
  description: "台灣最完整的廟會活動資訊平台，收錄全台繞境、進香、廟會活動情報。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        {/* Header */}
        <header className="header">
          <div className="container header-inner">
            <a href="/" className="logo">🏮 廟會月報</a>
            <nav className="nav">
              <a href="/#events">近期活動</a>
              <a href="#" className="btn btn-line">＋加入 LINE</a>
            </nav>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <div className="logo" style= color: 'white' >🏮 廟會月報</div>
              <p>全台鬧熱，報你知！</p>
            </div>
            <div className="footer-links">
              <h4>快速連結</h4>
              <a href="/#events">近期活動</a>
            </div>
            <div className="footer-social">
              <h4>追蹤我們</h4>
              <a href="#">LINE 官方帳號</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 廟會月報 MiaoHui Monthly. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}