import Link from "next/link";
import { getEvents } from "./lib/api";

// 跳過 build 時的靜態預渲染，改成每次請求時才抓資料
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Server Component — 在伺服器端取得資料
  const events = await getEvents();

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
            {events.map((event) => (
              <Link href={event.link} key={event.id} className="no-decoration">
                <article className="event-card">
                  <div className="event-card-img">{event.emoji}</div>
                  <div className="event-card-body">
                    <h3 className="event-card-title">{event.title}</h3>
                    <p className="event-card-meta">📅 {event.date}</p>
                    <p className="event-card-meta">📍 {event.location}</p>
                    <p className="event-summary-text">{event.summary}</p>
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
          <h2 className="section-title text-white">🏮 廟會月報是什麼？</h2>
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
          <h2 className="section-title text-white">📥 你也有廟會消息？</h2>
          <p className="cta-text">來當報馬仔！把你知道的廟會情報分享給大家</p>
          <a href="#" className="btn btn-primary btn-lg btn-cta-invert">💬 到 LINE 投稿</a>
        </div>
      </section>
    </>
  );
}