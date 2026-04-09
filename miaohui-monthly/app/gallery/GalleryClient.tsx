'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryPhoto } from '@/types/notion';
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
            現場直擊，用鏡頭感受廟會的鬧熱與感動
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
            <h2 className="list-header-title">活動花絮</h2>
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
                    <span className="gallery-card-date">{photo.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <p className="lightbox-caption">{lightbox.title}</p>
        </div>
      )}
    </>
  );
}