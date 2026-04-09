// src/lib/utils.ts
// 全站共用工具函式

/**
 * 將日期字串格式化為 YYYY.MM.DD
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/**
 * 計算活動狀態（倒數、進行中、已結束）
 */
export function getEventStatus(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return '即將開始';
    return '報名中';
  }
  if (now >= start && now <= end) return '進行中';
  return '已結束';
}

/**
 * 將 Notion API 回傳的未知值安全轉為字串
 */
export function flat(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    if ('start' in obj) {
      const start = String(obj.start || '');
      const end = obj.end ? String(obj.end) : '';
      return end ? `${start} ~ ${end}` : start;
    }
    return JSON.stringify(v);
  }
  return String(v);
}
