/* ========================================
   廟會月報 — 主要互動邏輯
   ======================================== */

// 頁面載入後執行
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
});

/**
 * 載入近期活動卡片
 */
async function loadEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading">🏮 載入中...</div>';

  const events = await fetchEvents(6);

  if (!events || events.length === 0) {
    grid.innerHTML = '<div class="loading">目前沒有近期活動，請稍後再來看看！</div>';
    return;
  }

  grid.innerHTML = events.map(event => createEventCard(event)).join('');
}

/**
 * 建立活動卡片 HTML
 */
function createEventCard(event) {
  const coverImg = event.coverImage && event.coverImage.length > 0
    ? `<img src="${event.coverImage[0]}" alt="${event.title}">`
    : `🏮`;

  const dateDisplay = event.date
    ? formatDate(event.date.start)
    : '日期待定';

  const location = [event.city, event.district].filter(Boolean).join(' ');

  // 決定活動詳情頁連結
  let detailLink = '#';
  if (event.title.includes('大甲')) {
    detailLink = 'pages/event-dajia.html';
  } else if (event.title.includes('白沙屯')) {
    detailLink = 'pages/event-baishatun.html';
  }

  return `
    <article class="event-card">
      <div class="event-card-img">${coverImg}</div>
      <div class="event-card-body">
        <h3 class="event-card-title">${event.title}</h3>
        <p class="event-card-meta">📅 ${dateDisplay}</p>
        ${location ? `<p class="event-card-meta">📍 ${location}</p>` : ''}
        ${event.region ? `<span class="event-card-tag">${event.region}</span>` : ''}
        <a href="${detailLink}" class="event-card-link">查看詳情 →</a>
      </div>
    </article>
  `;
}

/**
 * 手機版選單切換
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}