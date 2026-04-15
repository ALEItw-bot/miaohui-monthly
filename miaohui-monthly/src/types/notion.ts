// ==========================================
// 活動資料型別（對應 Notion 活動主資料庫）
// ==========================================

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  emoji: string;
  subtitle: string;
  tagline: string;
  summary: string;
  date: { start: string; end: string | null } | null;
  duration: string;
  startLocation: string;
  destination: string;
  themeColor: string;
  eventType: string;
  region: string;
  city: string;
  district: string;
  status: string;
  referenceUrl: string;
  coverImage: string[];
  createdTime: string;
  lastEdited: string;
  // 🔴 新增：GPS 座標（LINE 附近活動搜尋用）
  latitude: number | null;
  longitude: number | null;
}

export interface EventDetailResponse {
  success: boolean;
  event: EventItem;
  blocks: NotionBlock[];
}

export interface EventListResponse {
  success: boolean;
  count: number;
  events: EventItem[];
}

// ==========================================
// 🔴 最新消息（新增）
// ==========================================

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
}

// ==========================================
// 🔴 工商服務（新增）
// ==========================================

export interface Partner {
  id: string;
  name: string;
  category: string[];
  description: string;
  website: string;
  status: string;
  exposureLevel: string;
}

export interface PartnerDetail extends Partner {
  features: string;
  phone: string;
  email: string;
  coverImage: string;
  blocks: NotionBlock[];
}

// ==========================================
// 🔴 精彩花絮（新增）
// ==========================================

export interface GalleryPhoto {
  id: string;
  title: string;        // 照片主題名稱
  coverUrl: string;     // 照片 URL
  contributor: string;  // 投稿者名字
  eventType: string;    // 分類（如：遶境、陣頭、廟宇）
  date: string;         // 拍攝日期
}

// ==========================================
// 🔴 品牌故事（新增）
// ==========================================

export interface PageContent {
  success: boolean;
  blocks: NotionBlock[];
}

// ==========================================
// 🔴 周邊推薦（新增）
// ==========================================

export interface NearbySpot {
  id: string;
  name: string;        // 店家名稱
  category: string;    // 類型（🍜 美食小吃、⛩️ 順路廟宇 等）
  summary: string;     // 店家簡介
  coupon: string;      // 優惠內容（空字串 = 無優惠）
  distance: string;    // 距離活動路線（步行 5 分鐘內 等）
  googleMaps: string;  // Google Maps 連結
  phone: string;       // 電話
  tags: string[];      // 標籤（🔥 在地人推薦 等）
  coverImage: string;  // 店家照片 URL（第一張）
}

// ==========================================
// Notion Block 型別（渲染用）— 原有
// ==========================================

export interface RichText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  href?: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  rich_text?: RichText[];
  children?: NotionBlock[];
  // heading
  is_toggleable?: boolean;
  // to_do
  checked?: boolean;
  // callout
  icon?: string;
  icon_type?: string;
  color?: string;
  // image / video
  url?: string;
  caption?: RichText[];
  // table
  has_column_header?: boolean;
  has_row_header?: boolean;
  table_width?: number;
  // table_row
  cells?: RichText[][];
  // code
  language?: string;
  // list group
  items?: NotionBlock[];
}