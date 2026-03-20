import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026 白沙屯媽祖徒步進香｜廟會月報",
  description: "最有個性的媽祖繞境！路線不固定、全靠媽祖旨意，完整攻略看這裡",
};

export default function BaishatunEvent() {
  return (
    <>
      <section className="event-hero-detail blue">
        <div className="container">
          <p className="subtitle">最有個性的媽祖繞境</p>
          <h1>⛩️ 白沙屯拱天宮媽祖徒步進香</h1>
          <p className="subtitle">路線不固定・全憑媽祖旨意・徒步往返北港</p>
        </div>
      </section>

      <section className="event-body">
        <div className="event-content">
          <h2 className="event-h2-blue">📋 活動快速資訊</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="icon">📅</div>
              <div className="label">進香日期</div>
              <div className="value">2026/04/12（日）</div>
            </div>
            <div className="info-card">
              <div className="icon">⏱️</div>
              <div className="label">天數</div>
              <div className="value">八天七夜</div>
            </div>
            <div className="info-card">
              <div className="icon">📍</div>
              <div className="label">起點</div>
              <div className="value">苗栗白沙屯拱天宮</div>
            </div>
            <div className="info-card">
              <div className="icon">🎯</div>
              <div className="label">目的地</div>
              <div className="value">雲林北港朝天宮</div>
            </div>
          </div>

          <h2 className="event-h2-blue">✨ 白沙屯繞境的獨特之處</h2>
          <div className="highlight-box">
            <p>🎲 白沙屯媽祖繞境最大特色：<strong>路線完全不固定！</strong> 每年路線全由媽祖神轎指引，轎班人員跟著走，沒有事先規劃，這也是為什麼它被稱為「最有個性的媽祖繞境」。</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon">🎲</div>
              <h3>路線不固定</h3>
              <p>全由媽祖旨意決定，每年都不一樣</p>
            </div>
            <div className="feature-card">
              <div className="icon">🚶</div>
              <h3>全程徒步</h3>
              <p>往返約 400 公里，信眾徒步跟隨</p>
            </div>
            <div className="feature-card">
              <div className="icon">❤️</div>
              <h3>粉紅超跑</h3>
              <p>媽祖鑾轎行進速度極快，被封「粉紅超跑」</p>
            </div>
            <div className="feature-card">
              <div className="icon">🏠</div>
              <h3>沿途善心</h3>
              <p>居民自發提供食物飲水，溫暖人心</p>
            </div>
          </div>

          <h2 className="event-h2-blue">🗺️ 路線概覽</h2>
          <p>白沙屯媽祖從苗栗通霄白沙屯拱天宮出發，徒步前往雲林北港朝天宮進香，全程約 400 公里。</p>
          <p>由於路線不固定，建議你：</p>
          <ul className="tips-list">
            <li>📱 追蹤 <strong>白沙屯媽祖 GPS 即時定位</strong>（官方有提供）</li>
            <li>💬 加入廟會月報 LINE，即時推播媽祖動態</li>
            <li>🗺️ 大方向：白沙屯 → 通霄 → 苑裡 → 大甲 → 彰化 → 雲林北港</li>
          </ul>

          <h2 className="event-h2-blue">💡 行前注意事項</h2>
          <ul className="tips-list">
            <li>🦶 <strong>鞋子超級重要</strong> — 每天可能走 30~50 公里，穿磨合好的運動鞋</li>
            <li>🏃 <strong>體力準備</strong> — 「粉紅超跑」名不虛傳，建議提前鍛鍊體能</li>
            <li>🌧️ <strong>天氣多變</strong> — 備好雨衣（不建議撐傘，人太多不方便）</li>
            <li>🎒 <strong>輕裝 + 行動電源</strong> — 手機要能看 GPS 定位跟路線</li>
            <li>😴 <strong>休息點不固定</strong> — 沿途有善心站，但也要有睡路邊的心理準備</li>
            <li>🙏 <strong>跟著走就對了</strong> — 不用想太多，媽祖帶路就是最好的修行</li>
          </ul>

          <h2 className="event-h2-blue">🔗 相關連結</h2>
          <p>📌 <a href="https://www.baishatun.com.tw/" target="_blank" className="event-link-blue">白沙屯拱天宮官方網站</a></p>
        </div>
      </section>

      <section className="event-cta-section blue-bg">
        <div className="container">
          <h2>💬 跟著粉紅超跑一起走！</h2>
          <p className="text-white-muted">加入 LINE 好友，繞境期間即時推播媽祖 GPS 位置</p>
          <a href="#" className="btn btn-line-big btn-lg">＋加入 LINE 好友</a>
        </div>
      </section>
    </>
  );
}