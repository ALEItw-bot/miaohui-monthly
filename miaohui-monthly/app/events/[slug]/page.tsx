import { getEventBySlug, getAllEventSlugs, extractImagesFromBlocks } from '@/lib/notion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import StarRating from '@/components/StarRating';
import PhotoCarousel from '@/components/PhotoCarousel';
import { THEME_COLOR_MAP } from '@/lib/constants';
import './event-detail.css';

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

  const themeColor = THEME_COLOR_MAP[event.themeColor] || 'var(--red)';
  const coverUrl = event.coverImage?.[0] || '/images/default-hero.jpg';

  // 歷年照片：從活動頁面內容中的 image blocks 抓取
  const pageImages = extractImagesFromBlocks(data.blocks || []);
  const allPhotos = [...new Set([...event.coverImage, ...pageImages])];
  const photos = allPhotos.length > 0 ? allPhotos : ['/images/default-hero.jpg'];

  return (
    <main style={({ minHeight: '100vh' })}>
      {/* Hero 滿版 */}
      <section className="event-detail-hero">
        <div
          className="event-detail-hero-bg"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />
        <div className="event-detail-hero-overlay" />
        <div className="event-detail-hero-content">
          <span className="event-detail-hero-emoji">{event.emoji}</span>
          <h1 className="event-detail-hero-title">{event.title}</h1>
          {event.tagline && (
            <p className="event-detail-hero-tagline">{event.tagline}</p>
          )}
        </div>
        <div className="event-detail-hero-scroll">▼</div>
      </section>

      {/* 兩欄區域 */}
      <div className="event-detail-body">
        {/* 左欄：活動資訊 + 評分 */}
        <div className="event-detail-left">
          <div
            className="event-detail-card"
            style={{ borderTop: `5px solid ${themeColor}` }}
          >
            <h2
              className="event-detail-card-name"
              style={({ color: themeColor })}
            >
              {event.title}
            </h2>
            <div className="event-detail-card-grid">
              <div className="event-detail-card-item">
                <span className="event-detail-card-icon">📅</span>
                <div>
                  <div className="event-detail-card-label">活動日期</div>
                  <div className="event-detail-card-value">
                    {event.date?.start || '待公布'}
                    {event.date?.end && ` ~ ${event.date.end}`}
                    {event.duration && ` （${event.duration}）`}
                  </div>
                </div>
              </div>
              <div className="event-detail-card-item">
                <span className="event-detail-card-icon">🏷️</span>
                <div>
                  <div className="event-detail-card-label">活動類型</div>
                  <div className="event-detail-card-value">
                    {event.eventType || '廟會活動'}
                  </div>
                </div>
              </div>
              <div className="event-detail-card-item">
                <span className="event-detail-card-icon">📍</span>
                <div>
                  <div className="event-detail-card-label">起駕地點</div>
                  <div className="event-detail-card-value">
                    {event.startLocation || '—'}
                  </div>
                </div>
              </div>
              <div className="event-detail-card-item">
                <span className="event-detail-card-icon">🏁</span>
                <div>
                  <div className="event-detail-card-label">目的地</div>
                  <div className="event-detail-card-value">
                    {event.destination || '—'}
                  </div>
                </div>
              </div>
              <div className="event-detail-card-item">
                <span className="event-detail-card-icon">🗺️</span>
                <div>
                  <div className="event-detail-card-label">地區</div>
                  <div className="event-detail-card-value">
                    {[event.city, event.district].filter(Boolean).join(' ') ||
                      event.region ||
                      '—'}
                  </div>
                </div>
              </div>
              <div className="event-detail-card-item">
                <span className="event-detail-card-icon">🔗</span>
                <div>
                  <div className="event-detail-card-label">參考網址</div>
                  <div className="event-detail-card-value">
                    {event.referenceUrl ? (
                      <a
                        href={event.referenceUrl}
                        target="_blank"
                        rel="noopener"
                        style={{
                          color: themeColor,
                          borderBottom: `1px dashed ${themeColor}`,
                        }}
                      >
                        查看官方資訊 →
                      </a>
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
              </div>
            </div>
            {event.summary && (
              <div className="event-detail-card-summary">
                {event.summary}
              </div>
            )}
          </div>

          {/* 評分區塊 */}
          <div className="interact-card">
            <h3 className="interact-card-title">
              🎉 你有多期待這場活動？
            </h3>
            <p className="interact-card-subtitle">
              點擊星星投下你的期待度！
            </p>
            <StarRating eventSlug={event.slug} />
          </div>
        </div>

        {/* 右欄：歷年照片輪播 */}
        <div className="event-detail-right">
          <div className="carousel-card">
            <div className="carousel-card-header">
              📸 歷年活動照片
            </div>
            <PhotoCarousel photos={photos} title={event.title} />
          </div>
        </div>
      </div>
    </main>
  );
}