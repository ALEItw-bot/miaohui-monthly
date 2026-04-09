'use client';

import { useState, useEffect } from 'react';

interface EventItem {
  id: string;
  title: string;
  date: { start: string; end: string };
  eventType: string;
  summary: string;
  status: string;
  region: string;
  district: string;
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

function statusClass(status: string): string {
  switch (status) {
    case '進行中':
      return 'tag-active';
    case '已結束':
      return 'tag-ended';
    case '即將開始':
      return 'tag-soon';
    default:
      return '';
  }
}

function flat(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    if ('start' in obj) return String(obj.start || '');
    return JSON.stringify(v);
  }
  return String(v);
}

export default function NewsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.events) {
          const mapped = data.events.map((e: Record<string, unknown>) => ({
            id: flat(e.id),
            title: flat(e.title),
            date: {
              start:
                typeof e.date === 'object' && e.date !== null
                  ? flat((e.date as Record<string, unknown>).start)
                  : flat(e.date),
              end:
                typeof e.date === 'object' && e.date !== null
                  ? flat((e.date as Record<string, unknown>).end)
                  : '',
            },
            eventType: flat(e.eventType),
            summary: flat(e.summary),
            status: flat(e.status),
            region: flat(e.region),
            district: flat(e.district),
          }));
          setEvents(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="event-hero">
        <h1>熱鬧資訊</h1>
        <p>全台廟會活動情報，第一手消息都在這</p>
      </section>

      <section className="news-page-content">
        <div className="container">
          {loading ? (
            <p className="news-loading">載入中...</p>
          ) : events.length === 0 ? (
            <p className="news-loading">目前沒有活動資訊</p>
          ) : (
            <div className="event-card-grid">
              {events.map((event) => {
                const status = getEventStatus(event.date.start, event.date.end);
                const link =
                  event.eventType === '繞境' ? '/events/dajia' : '/events/baishatun';
                return (
                  <a key={event.id} href={link} className="event-card">
                    <div className="event-card-header">
                      <span className={`event-card-status ${statusClass(status)}`}>
                        {status}
                      </span>
                      <span className="event-card-type">{event.eventType}</span>
                    </div>
                    <h3 className="event-card-title">{event.title}</h3>
                    <div className="event-card-info">
                      <span>
                        {event.date.start} ~ {event.date.end}
                      </span>
                      <span>
                        {event.region} {event.district}
                      </span>
                    </div>
                    <p className="event-card-summary">{event.summary}</p>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
