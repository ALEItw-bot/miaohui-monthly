'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Announcement } from '@/types/notion';
import './announcements.css';

const TAG_OPTIONS = ['全部', '活動資訊', '系統更新', '廟會快訊'] as const;

function getTagClass(category: string): string {
  switch (category) {
    case '系統更新':
      return 'tag--blue';
    case '廟會快訊':
      return 'tag--green';
    case '活動資訊':
    default:
      return 'tag--red';
  }
}

export default function AnnouncementsClient({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [activeTag, setActiveTag] = useState('全部');

  const filtered =
    activeTag === '全部'
      ? announcements
      : announcements.filter((item) => item.category === activeTag);

  return (
    <>
      {/* Hero */}
      <section className="page-hero announcements-hero">
        <div className="container text-center">
          <h1 className="page-hero-title">最新消息</h1>
          <p className="page-hero-subtitle">
            廟會月報｜第一手廟會資訊都在這
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="announcements-body">
        <div className="container">
          {/* 篩選 */}
          <div className="filter-pills">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                className={`filter-pill ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 列表標題 */}
          <div className="list-header">
            <h2 className="list-header-title">消息列表</h2>
            <span className="list-header-count">
              共 {filtered.length} 則
            </span>
          </div>

          {/* 消息列表 */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📬</span>
              <p>目前沒有相關消息</p>
            </div>
          ) : (
            <div className="announcements-list">
              {filtered.map((item) => (
                <div key={item.id} className="announcements-card card">
                  <div className="announcements-card-top">
                    <span className="announcements-card-date">
                      {item.date}
                    </span>
                    <span className={`tag ${getTagClass(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="announcements-card-title">
                      {item.title}
                    </span>
                  </div>
                  {item.summary && (
                    <p className="announcements-card-summary">
                      {item.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}