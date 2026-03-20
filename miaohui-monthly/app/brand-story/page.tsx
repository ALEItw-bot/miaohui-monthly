import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '品牌故事',
  description:
    '從2012年的一個念頭，到台灣最完整的廟會資訊平台。認識廟會月報的品牌故事。',
};

export default function BrandStory() {
  return (
    <>
      {/* Hero */}
      <section className="story-hero">
        <div className="story-hero-overlay"></div>
        <div className="story-hero-content">
          <p className="story-hero-tag">OUR STORY</p>
          <h1 className="story-hero-title">
            信仰的溫度<br />科技的傳承
          </h1>
          <p className="story-hero-subtitle">
            從一個簡單的想法，到台灣最完整的廟會資訊平台
          </p>
        </div>
      </section>

      {/* 第一章：起源 */}
      <section className="section">
        <div className="story-content">
          <h2 className="story-chapter-title">起源</h2>
          <p className="story-text-dark">
            「如果台灣熱鬧的廟會，也能像捷運上的報紙一樣，每天陪伴在大家身邊，那該有多好？」
          </p>
          <p className="story-text-dark">
            2012 年的秋天，這個看似天馬行空的念頭，在創辦人阿雷的腦海中萌芽。
          </p>
          <p className="story-text-dark">
            當時，受限於實體印刷的龐大經費，《廟會月報》轉個大彎，以純粹的熱情在臉書上化身為「數位電子報」。沒想到，這個揉合傳統信仰與數位媒介的全新嘗試，在當時引起了巨大的轟動，甚至有許多熱情的粉絲四處詢問：「哪裡才能索取這份實體報紙？」
          </p>
        </div>
      </section>

      {/* 第二章：成長 */}
      <section className="section section-alt">
        <div className="story-content">
          <h2 className="story-chapter-title">從一個人的視角，到一群人的朝聖</h2>
          <p className="story-text-dark">
            隨著時間推移，《廟會月報》不再只是阿雷一個人的工作室產物。
          </p>
          <p className="story-text-dark">
            我們迎來了北中南各地熱血粉絲與小編的加入，大家無私地提供精彩的活動花絮。我們將喧囂的鑼鼓聲、絢麗的陣頭，以及信眾們虔誠的臉龐，化作雲端上的圖文，傳遞給每一個無法親臨現場的同好。
          </p>
          <p className="story-text-dark">
            這份「服務社會」的用心，不僅凝聚了龐大的社群，更獲得了許多工商團體的支持，讓傳承的火種得以延續。
          </p>
        </div>
      </section>

      {/* 第三章：沉澱 */}
      <section className="section">
        <div className="story-content">
          <h2 className="story-chapter-title">勇敢按下暫停鍵</h2>
          <p className="story-text-dark">
            然而，現實的重量有時會讓人不得不暫緩腳步。
          </p>
          <p className="story-text-dark">
            隨著創辦人本業日益繁忙，在無暇兼顧與心力交瘁之下，2023 年的同一天，《廟會月報》艱難地按下了暫停鍵，無預警地向大家告別。
          </p>
          <p className="story-text-dark">
            那是一個充滿不捨的決定，但我們知道，對廟會文化的熱愛，從未在心中真正熄滅。
          </p>
        </div>
      </section>

      {/* 第四章：重生 */}
      <section className="section section-dark">
        <div className="story-content">
          <h2 className="story-chapter-title text-gold">AI 時代的全新篇章</h2>
          <p className="story-text">
            沉澱，帶來了更清晰的視野。
          </p>
          <p className="story-text">
            隨著科技的高速推進與 AI 技術的爆發，我們看見了傳統文化與未來科技接軌的全新可能。如今，智慧型手機讓影像紀錄變得輕而易舉，便捷的交通網更讓全台廟會成為了一日生活圈。
          </p>
          <p className="story-text">
            於是，《廟會月報》決定再次甦醒。
          </p>
          <p className="story-text">
            這一次，我們帶著<strong>「心存善良、傳承文化、創新突破、服務社會」</strong>的不變初衷強勢回歸。我們導入 AI 智能技術，將繁瑣的營運流程自動化、高效化，以更具現代科技感的俐落面貌，重新詮釋台灣傳統信仰。
          </p>
          <p className="story-text">
            我們期望透過創新的載體，讓廟會不再只是老一輩的專屬記憶，而是能與新世代產生強烈共鳴的文化潮流。
          </p>
        </div>
      </section>

      {/* 結語 */}
      <section className="section">
        <div className="story-content text-center">
          <p className="story-closing">
            從過去的像素到現在的 AI 運算，<br />
            從傳統廟埕到雲端數據，<br />
            《廟會月報》將繼續為您遞送<br />
            這份跨越時空、充滿溫度的信仰報表。
          </p>
          <p className="story-welcome">
            歡迎回來，與我們一起見證<br />科技與傳統交織的全新篇章。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-cta">
        <div className="container text-center">
          <h2 className="section-title text-white">一起來鬧熱！</h2>
          <p className="cta-text">
            加入我們的 LINE，成為廟會月報的一份子
          </p>
          <div className="hero-cta">
            <a href="/#events" className="btn btn-primary btn-cta-invert">看近期活動</a>
            <a href="#" className="btn btn-line-big">加入 LINE 好友</a>
          </div>
        </div>
      </section>
    </>
  );
}