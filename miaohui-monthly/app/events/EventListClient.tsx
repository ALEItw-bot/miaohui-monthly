'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { EventItem } from '@/types/notion';

const REGIONS = ['全部', '北部', '中部', '南部', '東部', '外島'] as const;
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

  // 所有 style 用變數
  const heroStyle = {
    background: 'linear-gradient(135deg, #C80000 0%, #8B0000 100%)',
    padding: '80px 20px 60px',
    textAlign: 'center' as const,
    color: '#fff',
  };
  const heroH1 = { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, margin: '0 0 12px' };
  const heroP = { fontSize: '1.1rem', opacity: 0.85, margin: '0' };

  // ✅ 篩選區域：透明背景，不要白底
  const filtersStyle = {
    display: 'flex', justifyContent: 'center', gap: '10px',
    padding: '28px 20px 20px', flexWrap: 'wrap' as const,
    background: 'transparent',
  };
  const filterBtnBase = {
    padding: '8px 20px', borderRadius: '20px', border: '2px solid #ddd',
    background: '#fff', color: '#555', fontSize: '0.95rem',
    fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  };
  const filterBtnActive = {
    ...filterBtnBase, background: '#C80000', borderColor: '#C80000', color: '#fff',
  };
  const listStyle = { maxWidth: '800px', margin: '0 auto', padding: '20px' };
  const countStyle = { textAlign: 'center' as const, padding: '16px 20px 0', color: '#999', fontSize: '0.85rem' };

  // ✅ 每則活動：白底 + 邊框 + 圓角卡片
  const rowStyle = {
    display: 'block', textDecoration: 'none', color: 'inherit',
    padding: '20px 24px',
    marginBottom: '16px',
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s, transform 0.2s',
  };
  const rowTopStyle = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '8px' };
  const dateStyle = { fontSize: '0.85rem', color: '#999', minWidth: '90px' };
  const tagRegion = { display: 'inline-block', padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: '#C80000', color: '#fff' };
  const tagCity = { ...tagRegion, background: '#fff3e0', color: '#e65100' };
  const tagDistrict = { ...tagRegion, background: '#e3f2fd', color: '#1565c0' };
  const tagType = { ...tagRegion, background: '#f3e5f5', color: '#7b1fa2' };
  const titleStyle = { fontSize: '1.15rem', fontWeight: 700, color: '#222', margin: '0 0 4px' };
  const summaryStyle = {
    fontSize: '0.9rem', color: '#777', margin: '0',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
  };
  const pagerStyle = { display: 'flex', justifyContent: 'center', gap: '8px', padding: '32px 20px 60px' };
  const pagerBtnBase = {
    width: '36px', height: '36px', borderRadius: '50%',
    border: '1px solid #ddd', background: '#fff', color: '#555',
    fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const pagerBtnActive = { ...pagerBtnBase, background: '#C80000', borderColor: '#C80000', color: '#fff' };
  const emptyStyle = { textAlign: 'center' as const, padding: '60px 20px', color: '#999', fontSize: '1.1rem' };

  return (
    <main>
      <section style={heroStyle}>
        <h1 style={heroH1}>🔥 熱鬧資訊</h1>
        <p style={heroP}>廟會月報｜全台廟會活動第一手情報</p>
      </section>

      <div style={filtersStyle}>
        {REGIONS.map((region) => (
          <button
            key={region}
            style={activeRegion === region ? filterBtnActive : filterBtnBase}
            onClick={() => handleRegion(region)}
          >
            {region}
          </button>
        ))}
      </div>

      <div style={countStyle}>
        共 {filtered.length} 場活動{activeRegion !== '全部' && `（${activeRegion}）`}
      </div>

      <div style={listStyle}>
        {paged.length === 0 ? (
          <div style={emptyStyle}>😢 目前沒有{activeRegion === '全部' ? '' : activeRegion}的活動資訊</div>
        ) : (
          paged.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} style={rowStyle}>
              <div style={rowTopStyle}>
                <span style={dateStyle}>{event.date?.start || '日期待定'}</span>
                {event.region && <span style={tagRegion}>{event.region}</span>}
                {event.city && <span style={tagCity}>{event.city}</span>}
                {event.district && <span style={tagDistrict}>{event.district}</span>}
                {event.eventType && <span style={tagType}>{event.eventType}</span>}
              </div>
              <h3 style={titleStyle}>{event.emoji} {event.title}</h3>
              {event.summary && <p style={summaryStyle}>{event.summary}</p>}
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div style={pagerStyle}>
          <button style={pagerBtnBase} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} style={page === p ? pagerBtnActive : pagerBtnBase} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button style={pagerBtnBase} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
        </div>
      )}
    </main>
  );
}