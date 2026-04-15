// src/lib/notion-config.ts
// ==========================================
// Notion 環境變數統一管理
// 所有資料庫 ID、頁面 ID、Token 集中在此
// 切換空間時只需更新 .env.local 和 Vercel 環境變數
// ==========================================

export const NOTION_CONFIG = {
  /** Notion Integration Token */
  token: process.env.NOTION_TOKEN || '',

  /** 資料庫 ID */
  databases: {
    /** 活動主資料庫 */
    events: process.env.NOTION_EVENTS_DB_ID || '',
    /** 最新消息 */
    announcements: process.env.NOTION_ANNOUNCEMENTS_DB_ID || '',
    /** 工商服務合作夥伴 */
    partners: process.env.NOTION_PARTNERS_DB_ID || '',
    /** 投稿收件箱 */
    inbox: process.env.NOTION_INBOX_DB_ID || '',
    /** 周邊推薦店家 */
    nearby: process.env.NOTION_NEARBY_DB_ID || '',
  },

  /** 頁面 ID */
  pages: {
    /** 品牌故事頁面 */
    brandStory: process.env.NOTION_BRAND_STORY_PAGE_ID || '',
  },
} as const;

// ==========================================
// 環境變數驗證（開發時提醒）
// ==========================================

if (process.env.NODE_ENV === 'development') {
  const missing: string[] = [];

  if (!NOTION_CONFIG.token) missing.push('NOTION_TOKEN');
  if (!NOTION_CONFIG.databases.events) missing.push('NOTION_EVENTS_DB_ID');
  if (!NOTION_CONFIG.databases.announcements) missing.push('NOTION_ANNOUNCEMENTS_DB_ID');
  if (!NOTION_CONFIG.databases.partners) missing.push('NOTION_PARTNERS_DB_ID');
  if (!NOTION_CONFIG.databases.inbox) missing.push('NOTION_INBOX_DB_ID');
  if (!NOTION_CONFIG.databases.nearby) missing.push('NOTION_NEARBY_DB_ID');
  if (!NOTION_CONFIG.pages.brandStory) missing.push('NOTION_BRAND_STORY_PAGE_ID');

  if (missing.length > 0) {
    console.warn(
      `[notion-config] ⚠️ 缺少環境變數: ${missing.join(', ')}\n` +
      `請檢查 .env.local 是否設定完整`
    );
  }
}