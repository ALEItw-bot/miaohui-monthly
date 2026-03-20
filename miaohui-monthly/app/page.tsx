import Link from "next/link";

// Mock 假資料（之後換成 GAS API）
const mockEvents = [
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

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">全台鬧熱，報你知！</h1>
          <p className="hero-subtitle">
            台灣最完整的廟會活動資訊平台<br />
            繞境・進香・廟會，第一手情報都在這
          </p>
          <div className="hero-cta">
            <a href="#events" className="btn btn-primary">🔥 看近期活動</a>
            <a href="#" className="btn btn-line-big">💬 加入 LINE 好友</a>
          </div>
        </div>
      </section>

      {/* 近期熱門活動 */}
      <section className="section" id="events">
        <div className="container">
          <h2 className="section-title">🔥 近期熱門活動</h2>
          <p className="section-subtitle">即將到來的廟會盛事，千萬別錯過！</p>
          <div className="events-grid">
            {mockEvents.map((event) => (
              <Link href={event.link} key={event.id} style= textDecoration: 'none' >
                <article className="event-card">
                  <div className="event-card-img">{event.emoji}</div>
                  <div className="event-card-body">
                    <h3 className="event-card-title">{event.title}</h3>
                    <p className="event-card-meta">📅 {event.date}</p>
                    <p className="event-card-meta">📍 {event.location}</p>
                    <p style= fontSize: '0.9rem', color: '#666', marginTop: '8px' >{event.summary}</p>
                    <span className="event-card-tag">{event.tag}</span>
                    <span className="event-card-link">查看詳情 →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 品牌簡介 */}
      <section className="section section-dark">
        <div className="container text-center">
          <h2 className="section-title" style= color: 'white' >🏮 廟會月報是什麼？</h2>
          <p className="brand-intro">
            我們是一群熱愛台灣廟會文化的人，<br />
            致力於把全台灣最鬧熱的廟會資訊，<br />
            用最好懂的方式分享給每一個人。
          </p>
          <a href="#" className="btn btn-outline">📖 閱讀完整故事</a>
        </div>
      </section>

      {/* 報馬仔投稿 CTA */}
      <section className="section section-cta">
        <div className="container text-center">
          <h2 className="section-title" style= color: 'white' >📥 你也有廟會消息？</h2>
          <p className="cta-text">來當報馬仔！把你知道的廟會情報分享給大家</p>
          <a href="#" className="btn btn-primary btn-lg" style= background: 'white', color: 'var(--red)' >💬 到 LINE 投稿</a>
        </div>
      </section>
    </>
  );
}