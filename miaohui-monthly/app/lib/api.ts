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
    id: '1',
    title: '2026 大甲媽祖遶境進香',
    date: '2026/04/17（五）',
    location: '臺中市 大甲區',
    tag: '中部',
    emoji: '🏮',
    link: '/events/dajia',
    summary: '九天八夜，跨越中南部四縣市，百萬信眾隨行的年度宗教盛事。',
  },
  {
    id: '2',
    title: '2026 白沙屯媽祖徒步進香',
    date: '2026/04/12（日）',
    location: '苗栗縣 通霄鎮',
    tag: '中部',
    emoji: '⛩️',
    link: '/events/baishatun',
    summary: '路線不固定、全憑媽祖旨意，被封「粉紅超跑」的最有個性媽祖繞境。',
  },
];

// 暴力把任何值壓成純字串（GAS 可能回傳物件、陣列、數字等）
function flat(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return val.map(flat).join(', ');
  if (typeof val === 'object') {
    const o = val as Record<string, unknown>;
    // Notion 日期: { start, end }
    if ('start' in o) {
      if (o.end) return flat(o.start) + ' ~ ' + flat(o.end);
      return flat(o.start);
    }
    // Notion select: { name, color }
    if ('name' in o) return flat(o.name);
    // Notion rich_text: { plain_text }
    if ('plain_text' in o) return flat(o.plain_text);
    return JSON.stringify(val);
  }
  return String(val);
}

export async function getEvents(): Promise<EventItem[]> {
  if (!GAS_URL || !API_KEY) {
    console.log('[api] 未設定環境變數，使用假資料');
    return MOCK_EVENTS;
  }

  try {
    const url = GAS_URL + '?action=getEvents&key=' + API_KEY;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.log('[api] GAS 回應錯誤 ' + res.status);
      return MOCK_EVENTS;
    }

    const text = await res.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      console.log('[api] JSON 解析失敗，使用假資料');
      return MOCK_EVENTS;
    }

    if (data.success && Array.isArray(data.events)) {
      return data.events.map((e: Record<string, unknown>) => ({
        id: flat(e.id),
        title: flat(e.title),
        date: flat(e.date),
        location: flat(e.location),
        summary: flat(e.summary),
        link: flat(e.link) || '/events/' + flat(e.slug || e.id),
        emoji: flat(e.emoji) || '🏮',
        tag: flat(e.tag),
      }));
    }

    console.log('[api] GAS 回傳格式不符預期，使用假資料');
    return MOCK_EVENTS;
  } catch (err) {
    console.error('[api] 取得活動列表失敗:', err);
    return MOCK_EVENTS;
  }
}
