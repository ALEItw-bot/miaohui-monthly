import type { Metadata } from 'next';
import { Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LineFloatingButton from '@/components/LineFloatingButton';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

const serifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-title',
  display: 'swap',
});

const sansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: `${SITE_CONFIG.name}｜${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  keywords: '廟會月報,大甲媽祖遶境,白沙屯媽祖,繞境,進香,廟會,媽祖,台灣廟會',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name}｜${SITE_CONFIG.tagline}`,
    description: '台灣最完整的廟會活動資訊平台。繞境・進香・廟會,第一手情報都在這!',
    images: [SITE_CONFIG.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name}｜${SITE_CONFIG.tagline}`,
    images: [SITE_CONFIG.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" className={`${serifTC.variable} ${sansTC.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <LineFloatingButton />
      </body>
    </html>
  );
}