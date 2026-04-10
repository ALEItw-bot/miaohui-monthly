import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  // 資安：隱藏 X-Powered-By header，不讓攻擊者知道技術棧
  poweredByHeader: false,

  // 資安：全站安全 Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 防止點擊劫持（Clickjacking）
          { key: 'X-Frame-Options', value: 'DENY' },
          // 防止 MIME 嘲探
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 強制 HTTPS（含子網域）
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // 控制 Referrer 資訊洩漏
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // 禁用不必要的瀏覽器功能
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // 內容安全政策（CSP）
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' https: data:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.notion.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;