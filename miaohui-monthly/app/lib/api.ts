// app/lib/api.ts
// Server-side only — 環境變數不會暴露給瀏覽器端

const GAS_URL = process.env.GAS_DEPLOY_URL || '';
const API_KEY = process.env.GAS_API_KEY || '';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  link: string;
  emoji: string;
  tag: string;
}

// Fallback 假資料（API 掛掉或未設定時使用）
const MOCK_EVENTS: EventItem[] = [
  {
    id: "1",
    title: "2026 大甲媽祖遶境進香",
    date: "2026/04/17（五）",
    location: "臺中市 大甲區",
    tag: "中部",
    emoji: "🏮",
    link: "/events/dajia",
    summary: "九天八夜，跨越中南部四縣市，百萬信眾隨行的年度宗教盛事。",
  },
  {
    id: "2",
    title: "2026 白沙屯媽祖徒步進香",
    date: "2026/04/12（日）",
    location: "苗栗縣 通霄鎮",
    tag: "中部",
    emoji: "⛩️",
    link: "/events/baishatun",
    summary: "路線不固定、全憑媽祖旨意，被封「粉紅超跑」的最有個性媽祖繞境。",
  },
];

// 把任何值安全轉成字串（避免物件直接丟進 React）
function safeString(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  // Notion 日期格式: { start: '2026-04-17', end: '2026-04-26' }
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, string>;
    if (obj.start && obj.end) return obj.start + ' ~ ' + obj.end;
    if (obj.start) return obj.start;
    return JSON.stringify(val);
  }
  return String(val);
}

export async function getEvents(): Promise<EventItem[]> {
  // 如果環境變數沒設定，直接用假資料
  if (!GAS_URL || !API_KEY) {
    console.log('[api] 未設定環境變數，使用假資料');
    return MOCK_EVENTS;
  }

  try {
    const url = GAS_URL + '?action=getEvents&key=' + API_KEY;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // 快取 5 分鐘
    });

    if (!res.ok) {
      console.log('[api] GAS 回應錯誤 ' + res.status);
      return MOCK_EVENTS;
    }

    const data = await res.json();

    // 如果 GAS 回傳成功且有 events 陣列
    if (data.success && Array.isArray(data.events)) {
      return data.events.map((e: Record<string, unknown>) => ({
        id: safeString(e.id),
        title: safeString(e.title),
        date: safeString(e.date),
        location: safeString(e.location),
        summary: safeString(e.summary),
        link: safeString(e.link) || '/events/' + safeString(e.slug || e.id),
        emoji: safeString(e.emoji) || '🏮',
        tag: safeString(e.tag),
      }));
    }

    // 格式不對，用假資料
    console.log('[api] GAS 回傳格式不符預期，使用假資料');
    return MOCK_EVENTS;
  } catch (err) {
    console.error('[api] 取得活動列表失敗:', err);
    return MOCK_EVENTS;
  }
}