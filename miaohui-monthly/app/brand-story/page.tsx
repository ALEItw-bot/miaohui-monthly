import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '品牌故事',
  description:
    '廟會月報的使命：讓每一場廟會都被看見，讓每一份虔誠都被記錄。認識台灣最有溫度的廟會資訊平台。',
};

export default function BrandStory() {
  return (
    <>
      {/* Hero */}
      <section className="story-hero">
        <div className="story-hero-overlay"></div>
        <div className="story-hero-content">
          <p className="story-hero-tag">ABOUT US</p>
          <h1 className="story-hero-title">
            讓每一場廟會<br />都被看見
          </h1>
          <p className="story-hero-subtitle">
            我們相信，廟會不只是信仰，更是台灣最美的文化風景。
          </p>
        </div>
      </section>

      {/* 使命願景 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">\uD83C\uDFEE 我們的使命</h2>
          <p className="section-subtitle story-intro">
            「廟會月報」誕生於一個簡單的念頭——<br />
            台灣每年有上萬場廟會，卻沒有一個地方能讓你一次看完。
          </p>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">\uD83D\uDCF0</div>
              <h3 className="mission-title">整合資訊</h3>
              <p className="mission-desc">
                把散落在各地宮廟、社群、口耳相傳的活動資訊，整理成一目了然的平台。不再錯過任何一場重要的繞境進香。
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">\uD83D\uDCF1</div>
              <h3 className="mission-title">即時推播</h3>
              <p className="mission-desc">
                透過 LINE 官方帳號，在活動前提醒你、活動中即時更新動態。讓你就算不在現場，也能感受鬧熱氣氛。
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">\u2764\uFE0F</div>
              <h3 className="mission-title">傳承文化</h3>
              <p className="mission-desc">
                用年輕人看得懂的方式，記錄台灣廟會的故事。讓更多人認識這份屬於台灣的獨特文化底蘊。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="section section-dark">
        <div className="container">
          <h2 className="section-title text-white">\uD83D\uDCD6 品牌故事</h2>
          <div className="story-content">
            <div className="story-block">
              <h3 className="story-block-title text-white">從一場繞境開始</h3>
              <p className="story-text">
                2024 年，我們第一次跟著大甲媽祖走了一段路。九天八夜的旅程中，看見了沿途居民準備的免費餐食、素未謀面卻互相照顧的香客、以及那份最純粹的信仰力量。
              </p>
              <p className="story-text">
                我們被這份「鬧熱」深深感動——但也發現，要找到完整的繞境資訊，得翻遍好幾個網站和社群。
              </p>
            </div>
            <div className="story-block">
              <h3 className="story-block-title text-white">所以我們做了這件事</h3>
              <p className="story-text">
                「如果有一個地方，能把全台灣的廟會資訊整理在一起就好了。」
              </p>
              <p className="story-text">
                抱著這個想法，「廟會月報」誕生了。我們用 Notion 管理後台資料、用 LINE 推播即時資訊、用網站呈現完整活動內容。一切從零開始，但每一步都充滿熱情。
              </p>
            </div>
            <div className="story-block">
              <h3 className="story-block-title text-white">未來的路</h3>
              <p className="story-text">
                我們的目標不只是一個資訊平台。我們希望成為台灣廟會文化的數位傳承者——讓年輕一代重新認識這份文化，讓每一場廟會都不被遺忘。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 數字亮點 */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">\uD83D\uDCCA 我們正在做的事</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">2</div>
              <div className="stat-label">大型繞境追蹤中</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">活動資訊持續收錄</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">LINE 即時推播服務</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-cta">
        <div className="container text-center">
          <h2 className="section-title text-white">\uD83D\uDE4F 一起來鬧熱！</h2>
          <p className="cta-text">
            不管你是虔誠的信眾、好奇的旅人、還是熱血的報馬仔，<br />
            廟會月報都歡迎你加入。
          </p>
          <div className="hero-cta">
            <a href="/#events" className="btn btn-primary btn-cta-invert">\uD83D\uDD25 看近期活動</a>
            <a href="#" className="btn btn-line-big">\uD83D\uDCAC 加入 LINE 好友</a>
          </div>
        </div>
      </section>
    </>
  );
}