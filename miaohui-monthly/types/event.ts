/** GAS getEvents / getEventDetail 回傳的單筆活動資料 */
export interface EventSummary {
  id: string;
  title: string;           // GAS: getTitle(props['活動名稱'])
  slug: string;
  emoji: string;
  subtitle: string;
  tagline: string;
  summary: string;
  date: { start: string; end: string } | null;  // GAS: getDate(props['日期'])
  duration: string;        // GAS: getRichText(props['天數'])
  startLocation: string;   // GAS: getRichText(props['起點'])
  destination: string;
  themeColor: string;
  eventType: string;
  region: string;
  city: string;
  district: string;
  status: string;
  referenceUrl: string;
  coverImage: string[];    // GAS: getFiles(props['活動封面圖'])
  createdTime: string;
  lastEdited: string;
}

/** GAS getEvents 回傳格式 */
export interface EventsResponse {
  success: boolean;
  count?: number;
  events?: EventSummary[];
  error?: string;
}

/** GAS getEventDetail 回傳格式（含 Notion blocks） */
export interface EventDetailResponse {
  success: boolean;
  event?: EventSummary;
  blocks?: any[];  // NotionBlock[]
  error?: string;
}