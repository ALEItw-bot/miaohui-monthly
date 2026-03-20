/* ========================================
   廟會月報 — GAS API 串接模組
   ======================================== */

// ▼▼▼ 換成你的 GAS Web App 網址 ▼▼▼
const GAS_API_URL = 'https://script.google.com/macros/s/你的部署ID/exec';

/**
 * 取得近期活動列表
 * @param {number} limit - 取幾筆（預設 6）
 * @param {string} region - 區域篩選（可選）
 */
async function fetchEvents(limit = 6, region = null) {
  try {
    let url = `${GAS_API_URL}?action=getEvents&limit=${limit}`;
    if (region) url += `&region=${encodeURIComponent(region)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) return data.events;
    console.error('API 錯誤:', data.error);
    return [];
  } catch (err) {
    console.error('fetch 失敗:', err);
    return [];
  }
}

/**
 * 取得單一活動詳情
 * @param {string} pageId - Notion Page ID
 */
async function fetchEventDetail(pageId) {
  try {
    const res = await fetch(`${GAS_API_URL}?action=getEventDetail&pageId=${pageId}`);
    const data = await res.json();

    if (data.success) return data.event;
    console.error('API 錯誤:', data.error);
    return null;
  } catch (err) {
    console.error('fetch 失敗:', err);
    return null;
  }
}

/**
 * 格式化日期顯示
 * 2026-04-17 → 2026/04/17（四）
 */
function formatDate(dateStr) {
  if (!dateStr) return '日期待定';
  const d = new Date(dateStr);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const w = weekdays[d.getDay()];
  return `${y}/${m}/${day}（${w}）`;
}