'use client';

import { useState } from 'react';
import './gallery.css';

interface GalleryPhoto {
  id: string;
  title: string;
  coverUrl: string;
  eventType: string;
  date: string;
}

const ALL = '全部';

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const categories = [ALL, ...Array.from(new Set(photos.map((p) => p.eventType).filter(Boolean)))];
  const [active, setActive] = useState(ALL);
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const filtered = active === ALL ? photos : photos.filter((p) => p.eventType === active);

  return (
    <>
      {/* Hero */}
      <section className="gallery-hero">
        <div className="container">
          <h1 className="gallery-hero-title">精彩花絮</h1>
          <p className="gallery-hero-desc">現場直擊，用鏡頭感受廟會的鬧熱與感動</p>
        </div>
      </section>

      {/* Body */}
      <section className="gallery-body">
        <div className="container">

          {/* Filter Tabs — 跟熱鬧資訊的區域按鈕同樣式 */}
          <div className="gallery-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`gallery-filter-btn ${active === cat ? 'active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List Header — 跟熱鬧資訊的標題列同樣式 */}
          <div className="gallery-list-header">
            <h2 className="gallery-list-title">活動花絮</h2>
            <span className="gallery-list-count">共 {filtered.length} 筆</span>
          </div>

          {/* Photo Grid */}
          {filtered.length === 0 ? (
            <div className="gallery-empty">
              <span className="gallery-empty-icon">📷</span>
              <p>目前沒有相關花絮，敬請期待！</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((photo) => (
                <div
                  key={photo.id}
                  className="gallery-card"
                  onClick={() => setLightbox(photo)}
                >
                  <div className="gallery-card-img">
                    <img src={photo.coverUrl} alt={photo.title} loading="lazy" />
                  </div>
                  <div className="gallery-card-info">
                    <div className="gallery-card-tags">
                      {photo.eventType && (
                        <span className="gallery-card-tag">{photo.eventType}</span>
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
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox.coverUrl} alt={lightbox.title} className="lightbox-img" />
          <p className="lightbox-caption">{lightbox.title}</p>
        </div>
      )}
    </>
  );
}