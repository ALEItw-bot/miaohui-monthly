'use client';
import GalleryCarousel from './components/GalleryCarousel';
import SponsorCarousel from './components/SponsorCarousel';
import NewsImageCarousel from './components/NewsImageCarousel';
import PopupModal from './components/PopupModal';
import { useState, useEffect } from 'react';
import Carousel from './components/Carousel';

interface EventItem {
  id: string;
  title: string;
  date: { start: string; end: string };
  eventType: string;
  summary: string;
  status: string;
  region: string;
  district: string;
  coverUrl: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: '2026 大甲媽祖遶境進香',
    date: { start: '2026-04-17', end: '2026-04-26' },
    eventType: '繞境',
    summary: '2026 大甲鎮瀾宮媽祖遶境進香，4/17 起駕、4/26 回鴾，9天8夜徒步300公里。',
    status: '即將開始',
    region: '台中市',
    district: '大甲區',
    coverUrl: '',
  },
  {
    id: '2',
    title: '2026 白沙屯媽祖徒步進香',
    date: { start: '2026-04-12', end: '2026-04-20' },
    eventType: '進香',
    summary: '2026 白沙屯拱天宮媽祖徒步進香，4/12 深夜起駕、4/20 回宮，8天7夜。',
    status: '即將開始',
    region: '苗栗縣',
    district: '通霄鎮',
    coverUrl: '',
  },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '.' + m + '.' + day;
}

function getEventStatus(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return '即將開始';
    return '報名中';
  }
  if (now >= start && now <= end) return '進行中';
  return '已結束';
}

function flat(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    if ('start' in obj) {
      const start = String(obj.start || '');
      const end = obj.end ? String(obj.end) : '';
      return end ? start + ' ~ ' + end : start;
    }
    return JSON.stringify(v);
  }
  return String(v);
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.events) {
          const mapped = data.events.map((e: Record<string, unknown>) => ({
            id: flat(e.id),
            title: flat(e.title),
            date: {
              start: typeof e.date === 'object' && e.date !== null
                ? flat((e.date as Record<string, unknown>).start)
                : flat(e.date),
              end: typeof e.date === 'object' && e.date !== null
                ? flat((e.date as Record<string, unknown>).end)
                : '',
            },
            eventType: flat(e.eventType),
            summary: flat(e.summary),
            status: flat(e.status),
            region: flat(e.region),
            district: flat(e.district),
            coverUrl: flat(e.coverUrl),
          }));
          setEvents(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.announcements) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

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
              {announcements.length > 0 ? announcements.map((item) => (
                <a key={item.id} href="/announcements" className="news-item">
                  <span className="news-date">{item.date.replace(/-/g, '.')}</span>
                  <span className={`news-tag ${
                    item.category === '系統更新' ? 'tag-system' :
                    item.category === '活動資訊' ? 'tag-event' : ''
                  }`}>{item.category}</span>
                  <span className="news-title">{item.title}</span>
                </a>
              )) : events.map((event) => (
                <a
                  key={event.id}
                  href={event.eventType === '繞境' ? '/events/dajia' : '/events/baishatun'}
                  className="news-item"
                >
                  <span className="news-date">{formatDate(event.date.start)}</span>
                  <span className="news-tag">活動資訊</span>
                  <span className="news-title">{event.title}</span>
                </a>
              ))}
              <div className="news-more">
                <a href="/announcements">更多消息 →</a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== 工商服務 + 精彩花絮 ===== */}
      <section className="sponsor-gallery-section">
        <div className="container sg-container">

          {/* 左欄：工商服務輪播圖 */}
          <div className="sg-block">
            <h2 className="sg-heading">🏮 工商服務</h2>
            <p className="sg-desc">感謝以下夥伴熱情贊助，讓廟會文化持續發光</p>
            <div className="sponsor-carousel-wrapper">
              <SponsorCarousel />
            </div>
            <div className="sg-cta">
              <a href="#" className="btn btn-primary">成為合作夥伴</a>
            </div>
          </div>

          {/* 右欄：精彩花絮輪播圖 */}
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
            從 2012 年的一個念頭，到台灣最完整的廟會資訊平台。<br />
            我們用科技傳承文化，讓每一場廟會都被看見。
          </p>
          <a href="/brand-story" className="brand-preview-link">
            了解更多 &rarr;
          </a>
        </div>
      </section>
    </>
  );
}