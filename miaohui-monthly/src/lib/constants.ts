// src/lib/constants.ts
// 全站共用常數，集中管理避免散落各處

// 主選單（不包含「服務項目」下拉的子項）
export const MAIN_NAV_LINKS = [
  { href: '/announcements', label: '最新消息' },
  { href: '/brand-story', label: '品牌故事' },
  { href: '/events', label: '熱鬧資訊' },
  { href: '/gallery', label: '精彩花絮' },
] as const;

// 「服務項目」下拉子選單
export const SERVICE_LINKS = [
  { href: '/products', label: '周邊商品' },
  { href: '/sponsors', label: '工商服務' },
] as const;

// 全部連結（Footer、sitemap 依舊可用）
export const NAV_LINKS = [...MAIN_NAV_LINKS, ...SERVICE_LINKS] as const;

export const SOCIAL_LINKS = {
  line: 'https://line.me/R/ti/p/@583jmhcd',
  facebook: 'https://www.facebook.com/MiaoHui.News',
} as const;

export const SITE_CONFIG = {
  name: '廟會月報',
  tagline: '全台鬧熱，報你知！',
  description: '台灣最完整的廟會活動資訊平台。大甲媽祖遶境、白沙屯媽祖進香、全台廟會活動時間、路線、注意事項一次看！',
  url: 'https://miaohui-monthly.vercel.app',
  ogImage: '/og-image.png',
  copyright: '© 2026 廟會月報｜MiaoHui Monthly. All rights reserved.',
} as const;

export const REGIONS = ['全部', '北部', '中部', '南部', '東部', '外島'] as const;

export const SPONSOR_CATEGORIES = [
  '全部', '海報文宣', '平面攝影', '影像紀錄',
  '祭祀用品', '陣頭演出', '文創商品', '活動企劃', '團體服飾',
] as const;

// 活動預設封面圖（當 Notion 未提供封面時使用）
export const DEFAULT_EVENT_COVER = '/images/default-hero.jpg';

// 主題色對應（活動詳情頁用）
export const THEME_COLOR_MAP: Record<string, string> = {
  red: 'var(--red)',
  blue: 'var(--blue)',
  gold: 'var(--gold)',
  green: '#2E7D32',
  purple: '#6A1B9A',
};