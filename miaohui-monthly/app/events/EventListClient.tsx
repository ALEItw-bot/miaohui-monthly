'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { EventItem } from '@/types/notion';
import { REGIONS } from '@/lib/constants';
import './events.css';

const PAGE_SIZE = 20;

export default function EventListClient({ events }: { events: EventItem[] }) {
  const [activeRegion, setActiveRegion] = useState<string>('全部');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (activeRegion === '全部') return events;
    return events.filter((e) => e.region === activeRegion);
  }, [events, activeRegion]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRegion = (region: string) => {
    setActiveRegion(region);
    setPage(1);
  };

  return (
    <main>
      {/* Hero */}
      <section className="page-hero events-hero">
        <div className="container">
          <h1 className="page-hero-title">熱鬧資訊</h1>
          <p className="page-hero-subtitle">廟會月報｜全台廟會活動第一手情報</p>
        </div>
      </section>

      {/* 篩選按鈕 */}
      <div className="filter-pills">
        {REGIONS.map((region) => (
          <button
            key={region}
            className={`filter-pill ${activeRegion === region ? 'active' : ''}`}
            onClick={() => handleRegion(region)}
          >
            {region}
          </button>
        ))}
      </div>

      {/* 計數 */}
      <div className="events-count">
        共 {filtered.length} 場活動
        {activeRegion !== '全部' && `（${activeRegion}）`}
      </div>

      {/* 列表 */}
      <div className="events-list">
        {paged.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">😢</span>
            <p>目前沒有{activeRegion === '全部' ? '' : activeRegion}的活動資訊</p>
          </div>
        ) : (
          paged.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="events-row card"
            >
              <div className="events-row-top">
                <span className="events-row-date">
                  {event.date?.start || '日期待定'}
                </span>
                {event.region && (
                  <span className="tag tag--red">{event.region}</span>
                )}
                {event.city && (
                  <span className="tag tag--orange">{event.city}</span>
                )}
                {event.district && (
                  <span className="tag tag--light-blue">{event.district}</span>
                )}
                {event.eventType && (
                  <span className="tag tag--purple">{event.eventType}</span>
                )}
              </div>
              <h3 className="events-row-title">
                {event.emoji} {event.title}
              </h3>
              {event.summary && (
                <p className="events-row-summary">{event.summary}</p>
              )}
            </Link>
          ))
        )}
      </div>

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="events-pager">
          <button
            className="events-pager-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`events-pager-btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="events-pager-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}