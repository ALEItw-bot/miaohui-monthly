import { getEventBySlug, getAllEventSlugs } from '@/lib/notion';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import StarRating from '@/components/StarRating';
import PhotoCarousel from '@/components/PhotoCarousel';
import { extractImagesFromBlocks } from '@/lib/notion';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEventBySlug(slug);
  if (!data.success || !data.event) return { title: '找不到活動' };

  const { event } = data;
  return {
    title: `${event.title}｜廟會月報`,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      images: event.coverImage.length ? [event.coverImage[0]] : [],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);

  if (!data.success || !data.event) {
    notFound();
  }

  const { event } = data;

  const themeColorMap: Record<string, string> = {
    red: '#C80000',
    blue: '#0000A5',
    gold: '#B8860B',
    green: '#2E7D32',
    purple: '#6A1B9A',
  };
  const themeColor = themeColorMap[event.themeColor] || '#C80000';
  const coverUrl = event.coverImage?.[0] || '/images/default-hero.jpg';

  // ---- 所有 inline style 用變數 ----
  const mainStyle = { minHeight: '100vh' };
  const heroBgStyle = {
    backgroundImage: `url(${coverUrl})`,
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
    position: 'absolute' as const,
    inset: '0',
  };
  const heroOverlayStyle = {
    position: 'absolute' as const,
    inset: '0',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)',
    zIndex: 1,
  };
  const heroContentStyle = {
    position: 'relative' as const,
    zIndex: 2,
    textAlign: 'center' as const,
    color: '#fff',
    padding: '0 20px 60px',
    maxWidth: '800px',
  };
  const cardBorderStyle = { borderTop: `5px solid ${themeColor}` };
  const cardNameStyle = { color: themeColor };
  const linkStyle = { color: themeColor, borderBottom: `1px dashed ${themeColor}` };

  // 歷年照片：從活動頁面內容中的 image blocks 抓取
  const pageImages = extractImagesFromBlocks(data.blocks || []);
  // 合併封面圖 + 頁面內圖片，去重複
  const allPhotos = [...new Set([...event.coverImage, ...pageImages])];
  const photos = allPhotos.length > 0 ? allPhotos : ['/images/default-hero.jpg'];

  return (
    <>
      <style>{`
        .event-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 500px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .event-hero__emoji { font-size: 4rem; display: block; margin-bottom: 12px; }
        .event-hero__title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          margin: 0 0 8px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .event-hero__tagline { font-size: 1.2rem; opacity: 0.9; margin: 0; }
        .event-hero__scroll {
          position: absolute; bottom: 20px; left: 50%;
          transform: translateX(-50%); z-index: 2;
          color: #fff; opacity: 0.7; font-size: 1.5rem;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        /* ===== 兩欄佈局 ===== */
        .event-body {
          max-width: 1200px;
          margin: -40px auto 0;
          padding: 0 20px 60px;
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .event-body {
            grid-template-columns: 1fr;
          }
        }

        /* ===== 左欄：資訊卡 + 評分 ===== */
        .event-left { display: flex; flex-direction: column; gap: 24px; }
        .event-card {
          background: #fff; border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12); padding: 36px 32px;
        }
        .event-card__name { font-size: 1.8rem; font-weight: 800; margin: 0 0 20px; text-align: center; }
        .event-card__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
        @media (max-width: 560px) { .event-card__grid { grid-template-columns: 1fr; } }
        .event-card__item { display: flex; align-items: flex-start; gap: 10px; }
        .event-card__icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
        .event-card__label { font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .event-card__value { font-size: 1rem; color: #333; font-weight: 500; word-break: break-word; }
        .event-card__value a { text-decoration: none; }
        .event-card__value a:hover { opacity: 0.7; }
        .event-card__summary { margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; font-size: 1rem; line-height: 1.8; color: #555; }
        .interact-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); padding: 32px; text-align: center; }
        .interact-card__title { font-size: 1.2rem; font-weight: 700; color: #333; margin: 0 0 8px; }
        .interact-card__subtitle { font-size: 0.9rem; color: #999; margin: 0 0 20px; }

        /* ===== 右欄：照片輪播 ===== */
        .event-right { position: sticky; top: 24px; }
        .carousel-card {
          background: #fff; border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          overflow: hidden;
        }
        .carousel-card__header {
          padding: 20px 24px 12px;
          font-size: 1.1rem; font-weight: 700; color: #333;
        }
      `}</style>

      <main style={mainStyle}>
        {/* Hero 滿版 */}
        <section className="event-hero">
          <div style={heroBgStyle} />
          <div style={heroOverlayStyle} />
          <div style={heroContentStyle}>
            <span className="event-hero__emoji">{event.emoji}</span>
            <h1 className="event-hero__title">{event.title}</h1>
            {event.tagline && <p className="event-hero__tagline">{event.tagline}</p>}
          </div>
          <div className="event-hero__scroll">▼</div>
        </section>

        {/* 兩欄區域 */}
        <div className="event-body">
          {/* 左欄：活動資訊 + 評分 */}
          <div className="event-left">
            <div className="event-card" style={cardBorderStyle}>
              <h2 className="event-card__name" style={cardNameStyle}>{event.title}</h2>
              <div className="event-card__grid">
                <div className="event-card__item">
                  <span className="event-card__icon">📅</span>
                  <div>
                    <div className="event-card__label">活動日期</div>
                    <div className="event-card__value">
                      {event.date?.start || '待公布'}
                      {event.date?.end && ` ~ ${event.date.end}`}
                      {event.duration && ` （${event.duration}）`}
                    </div>
                  </div>
                </div>
                <div className="event-card__item">
                  <span className="event-card__icon">🏷️</span>
                  <div>
                    <div className="event-card__label">活動類型</div>
                    <div className="event-card__value">{event.eventType || '廟會活動'}</div>
                  </div>
                </div>
                <div className="event-card__item">
                  <span className="event-card__icon">📍</span>
                  <div>
                    <div className="event-card__label">起駕地點</div>
                    <div className="event-card__value">{event.startLocation || '—'}</div>
                  </div>
                </div>
                <div className="event-card__item">
                  <span className="event-card__icon">🏁</span>
                  <div>
                    <div className="event-card__label">目的地</div>
                    <div className="event-card__value">{event.destination || '—'}</div>
                  </div>
                </div>
                <div className="event-card__item">
                  <span className="event-card__icon">🗺️</span>
                  <div>
                    <div className="event-card__label">地區</div>
                    <div className="event-card__value">
                      {[event.city, event.district].filter(Boolean).join(' ') || event.region || '—'}
                    </div>
                  </div>
                </div>
                <div className="event-card__item">
                  <span className="event-card__icon">🔗</span>
                  <div>
                    <div className="event-card__label">參考網址</div>
                    <div className="event-card__value">
                      {event.referenceUrl ? (
                        <a href={event.referenceUrl} target="_blank" rel="noopener" style={linkStyle}>
                          查看官方資訊 →
                        </a>
                      ) : '—'}
                    </div>
                  </div>
                </div>
              </div>
              {event.summary && (
                <div className="event-card__summary">{event.summary}</div>
              )}
            </div>

            {/* 評分區塊 */}
            <div className="interact-card">
              <h3 className="interact-card__title">🎉 你有多期待這場活動？</h3>
              <p className="interact-card__subtitle">點擊星星投下你的期待度！</p>
              <StarRating eventSlug={event.slug} />
            </div>
          </div>

          {/* 右欄：歷年照片輪播 */}
          <div className="event-right">
            <div className="carousel-card">
              <div className="carousel-card__header">📸 歷年活動照片</div>
              <PhotoCarousel photos={photos} title={event.title} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}