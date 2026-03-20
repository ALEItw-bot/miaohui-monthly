import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 大甲媽祖遶境進香｜廟會月報",
  description: "大甲鎮瀾宮媽祖繞境完整資訊：時間、路線、注意事項一次看！",
};

export default function DajiaEvent() {
  return (
    <>
      <section className="event-hero-detail red">
        <div className="container">
          <p className="subtitle">2026 年度盛事</p>
          <h1>🏮 大甲鎮瀾宮媽祖遶境</h1>
          <p className="subtitle">九天八夜・跨越中南部・百萬信眾隨行</p>
        </div>
      </section>

      <section className="event-body">
        <div className="event-content">
          <h2 style= color: 'var(--red)', borderColor: 'var(--red)' >📋 活動快速資訊</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="icon">📅</div>
              <div className="label">起駕日期</div>
              <div className="value">2026/04/17（五）</div>
            </div>
            <div className="info-card">
              <div className="icon">⏱️</div>
              <div className="label">天數</div>
              <div className="value">九天八夜</div>
            </div>
            <div className="info-card">
              <div className="icon">📍</div>
              <div className="label">起點</div>
              <div className="value">台中大甲鎮瀾宮</div>
            </div>
            <div className="info-card">
              <div className="icon">🎯</div>
              <div className="label">目的地</div>
              <div className="value">嘉義新港奉天宮</div>
            </div>
          </div>

          <h2 style= color: 'var(--red)', borderColor: 'var(--red)' >🗺️ 繞境路線</h2>
          <p>全程約 340 公里，途經台中、彰化、雲林、嘉義四縣市。</p>
          <ul className="route-list">
            <li><span className="day-badge">Day 1</span> 大甲鎮瀾宮 → 彰化天后宮（起駕）</li>
            <li><span className="day-badge">Day 2</span> 彰化 → 西螺福興宮</li>
            <li><span className="day-badge">Day 3</span> 西螺 → 新港奉天宮（祝壽大典）</li>
            <li><span className="day-badge">Day 4</span> 新港奉天宮（駐駕・祈福）</li>
            <li><span className="day-badge">Day 5</span> 新港 → 西螺（回鑾啟程）</li>
            <li><span className="day-badge">Day 6</span> 西螺 → 北斗奠安宮</li>
            <li><span className="day-badge">Day 7</span> 北斗 → 彰化天后宮</li>
            <li><span className="day-badge">Day 8</span> 彰化 → 清水紫雲巖</li>
            <li><span className="day-badge">Day 9</span> 清水 → 大甲鎮瀾宮（回駕安座）</li>
          </ul>
          <p><em>⚠️ 實際路線以鎮瀾宮官方公告為準，此為歷年參考路線。</em></p>

          <h2 style= color: 'var(--red)', borderColor: 'var(--red)' >💡 行前注意事項</h2>
          <ul className="tips-list">
            <li>🦶 <strong>穿好走的鞋</strong> — 每天走 20~40 公里，別穿新鞋上路</li>
            <li>☀️ <strong>防曬 ＋ 雨具</strong> — 四月天氣多變，兩樣都要帶</li>
            <li>🎒 <strong>輕裝出發</strong> — 背包越輕越好，沿途有補給站</li>
            <li>💧 <strong>多喝水</strong> — 脫水是最常見的問題，不要忍</li>
            <li>📱 <strong>手機充飽</strong> — 帶行動電源，方便看路線跟聯繫</li>
            <li>🙏 <strong>尊重信仰</strong> — 經過神轎時保持恭敬，不要從神轎前面橫越</li>
            <li>🏥 <strong>身體不適就休息</strong> — 沿途有醫療站，不要硬撐</li>
          </ul>

          <h2 style= color: 'var(--red)', borderColor: 'var(--red)' >🔗 相關連結</h2>
          <p>📌 <a href="https://www.dajiamazu.org.tw/" target="_blank" style= color: 'var(--red)', fontWeight: 700 >大甲鎮瀾宮官方網站</a></p>
        </div>
      </section>

      <section className="event-cta-section blue-bg">
        <div className="container">
          <h2>💬 想收到繞境即時通知？</h2>
          <p style= color: 'white', opacity: 0.9 >加入 LINE 好友，繞境期間每日推播最新動態！</p>
          <a href="#" className="btn btn-line-big btn-lg">＋加入 LINE 好友</a>
        </div>
      </section>
    </>
  );
}