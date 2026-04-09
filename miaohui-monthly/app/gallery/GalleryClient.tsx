'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GalleryPhoto } from '@/types/notion';
import { SOCIAL_LINKS } from '@/lib/constants';
import './gallery.css';

const ALL = '全部';

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const categories = [
    ALL,
    ...Array.from(new Set(photos.map((p) => p.eventType).filter(Boolean))),
  ];
  const [active, setActive] = useState(ALL);
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const filtered =
    active === ALL ? photos : photos.filter((p) => p.eventType === active);

  return (
    <>
      {/* Hero */}
      <section className="page-hero gallery-hero">
        <div className="container">
          <h1 className="page-hero-title">精彩花絮</h1>
          <p className="page-hero-subtitle">
            廟友投稿的第一手現場照片，用鏡頭記錄信仰的溫度
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="gallery-body">
        <div className="container">
          {/* 篩選 */}
          <div className="filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${active === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 列表標題 */}
          <div className="list-header">
            <h2 className="list-header-title">投稿花絮</h2>
            <span className="list-header-count">共 {filtered.length} 筆</span>
          </div>

          {/* 照片 Grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📷</span>
              <p>目前沒有相關花絮，敬請期待！</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((photo) => (
                <div
                  key={photo.id}
                  className="gallery-card card"
                  onClick={() => setLightbox(photo)}
                >
                  <div className="gallery-card-img">
                    <img
                      src={photo.coverUrl}
                      alt={photo.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="gallery-card-info">
                    <div className="gallery-card-tags">
                      {photo.eventType && (
                        <span className="tag tag--red">
                          {photo.eventType}
                        </span>
                      )}
                    </div>
                    <h3 className="gallery-card-title">{photo.title}</h3>
                    <div className="gallery-card-meta">
                      <span className="gallery-card-contributor">
                        📸 {photo.contributor}
                      </span>
                      <span className="gallery-card-date">{photo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 投稿 CTA */}
      <section className="gallery-cta">
        <div className="container text-center">
          <h2 className="gallery-cta-title">
            📸 你也有精彩的廟會照片嗎？
          </h2>
          <p className="gallery-cta-sub">
            歡迎投稿你的廟會現場照片，經審核後將展示在精彩花絮！<br />
            透過 LINE 官方帳號傳送照片 + 主題名稱 + 您的名字即可。
          </p>
          <a
            href={SOCIAL_LINKS.line}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line gallery-cta-btn"
          >
            📩 我也想投稿
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button
            className="lightbox-close"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox.coverUrl}
            alt={lightbox.title}
            className="lightbox-img"
          />
          <div className="lightbox-info">
            <p className="lightbox-caption">{lightbox.title}</p>
            <p className="lightbox-contributor">
              投稿者：{lightbox.contributor}　‣　{lightbox.date}
            </p>
          </div>
        </div>
      )}
    </>
  );
}