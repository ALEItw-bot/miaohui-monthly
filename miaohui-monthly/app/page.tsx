import Link from 'next/link';
import { getEvents, getAnnouncements } from '@/lib/notion';
import { formatDate } from '@/lib/utils';
import Carousel from './components/Carousel';
import PopupModal from './components/PopupModal';
import NewsImageCarousel from './components/NewsImageCarousel';
import SponsorCarousel from './components/SponsorCarousel';
import GalleryCarousel from './components/GalleryCarousel';

export const revalidate = 60;

export default async function HomePage() {
  const [eventsData, announcementsData] = await Promise.all([
    getEvents({ limit: 10 }),
    getAnnouncements({ limit: 8 }),
  ]);

  const events = eventsData.events;
  const announcements = announcementsData.announcements;

  return (
    <>
      <PopupModal />

      {/* 輪播 */}
      <Carousel />

      {/* 最新消息區塊 */}
      <section className="news-section" id="events">
        <div className="container">
          <div className="news-layout">
            {/* 左側：輪播圖 */}
            <div className="news-image">
              <NewsImageCarousel />
            </div>

            {/* 右側：消息列表 */}
            <div className="news-list">
              <h2 className="news-list-title">最新消息</h2>
              {announcements.length > 0
                ? announcements.map((item) => (
                    <Link key={item.id} href="/announcements" className="news-item">
                      <span className="news-date">{item.date.replace(/-/g, '.')}</span>
                      <span
                        className={`tag ${
                          item.category === '系統更新' ? 'tag--blue' : 'tag--red'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="news-title">{item.title}</span>
                    </Link>
                  ))
                : events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="news-item"
                    >
                      <span className="news-date">{formatDate(event.date.start)}</span>
                      <span className="tag tag--red">活動資訊</span>
                      <span className="news-title">{event.title}</span>
                    </Link>
                  ))}
              <div className="news-more">
                <Link href="/announcements">更多消息 →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 工商服務 + 精彩花絮 */}
      <section className="sponsor-gallery-section">
        <div className="container sg-container">
          <div className="sg-block">
            <h2 className="sg-heading">🏮 工商服務</h2>
            <p className="sg-desc">感謝以下夥伴熱情贊助，讓廟會文化持續發光</p>
            <div className="sponsor-carousel-wrapper">
              <SponsorCarousel />
            </div>
            <div className="sg-cta">
              <Link href="/sponsors" className="btn btn-primary">
                成為合作夥伴
              </Link>
            </div>
          </div>

          <div className="sg-block">
            <h2 className="sg-heading">📸 精彩花絮</h2>
            <p className="sg-desc">現場直擊，用鏡頭感受廟會的鬧熱與感動</p>
            <div className="gallery-carousel-wrapper">
              <GalleryCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 品牌故事簡介 */}
      <section className="brand-preview">
        <div className="container brand-preview-inner">
          <h2 className="brand-preview-title">信仰的溫度，科技的傳承</h2>
          <p className="brand-preview-text">
            從 2012 年的一個念頭，到台灣最完整的廟會資訊平台。
            <br />
            我們用科技傳承文化，讓每一場廟會都被看見。
          </p>
          <Link href="/brand-story" className="brand-preview-link">
            了解更多 →
          </Link>
        </div>
      </section>
    </>
  );
}
