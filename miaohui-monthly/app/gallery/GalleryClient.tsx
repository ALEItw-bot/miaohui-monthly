'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GalleryPhoto } from '@/types/notion';
import { SOCIAL_LINKS } from '@/lib/constants';
import './gallery.css';

// ==========================================
// 工具：隨機產生照片的漂浮屬性
// ==========================================

interface FloatingStyle {
  top: string;
  left: string;
  width: number;
  rotate: number;
  z: number;
  delay: number;
  duration: number;
}

const SIZES = [180, 220, 260, 300, 360];

function generateFloatingStyle(index: number, total: number): FloatingStyle {
  const seed = index * 137.508; // 黃金角分布，避免群聚
  const top = ((seed * 0.618) % 85) + 2;
  const left = ((seed * 1.618) % 88) + 2;
  const width = SIZES[index % SIZES.length];
  const rotate = (Math.sin(seed) * 16) - 8; // -8° ~ +8°
  const z = Math.floor(Math.sin(seed * 0.5) * 100); // -100 ~ 100
  const delay = (index * 0.8) % 12;
  const duration = 16 + (index % 5) * 4; // 16s ~ 32s
  return { top: `${top}%`, left: `${left}%`, width, rotate, z, delay, duration };
}

// ==========================================
// 主元件
// ==========================================

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [styles, setStyles] = useState<FloatingStyle[]>([]);
  const wallRef = useRef<HTMLDivElement>(null);

  // 初始化漂浮位置（client-side only，避免 SSR hydration mismatch）
  useEffect(() => {
    setStyles(photos.map((_, i) => generateFloatingStyle(i, photos.length)));
  }, [photos]);

  // 開啟 Lightbox
  const openLightbox = useCallback((photo: GalleryPhoto) => {
    setActivePhoto(photo);
    setInfoVisible(false);
    document.body.style.overflow = 'hidden';
    // 延遲顯示資訊（等放大動畫完成）
    setTimeout(() => setInfoVisible(true), 350);
  }, []);

  // 關閉 Lightbox
  const closeLightbox = useCallback(() => {
    setInfoVisible(false);
    setTimeout(() => {
      setActivePhoto(null);
      document.body.style.overflow = '';
    }, 200);
  }, []);

  // ESC 鍵關閉
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePhoto) closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePhoto, closeLightbox]);

  // 組合地點字串
  const formatLocation = (photo: GalleryPhoto) => {
    if (photo.city && photo.district) return `${photo.city} ${photo.district}`;
    if (photo.city) return photo.city;
    return '';
  };

  return (
    <>
      {/* ========== 標準 Hero（與其他分頁一致） ========== */}
      <section className="page-hero gallery-hero">
        <div className="container">
          <h1 className="page-hero-title">精彩花絮</h1>
          <p className="page-hero-subtitle">
            來自全台報馬仔的第一手紀錄　·　點擊照片放大觀賞
          </p>
        </div>
      </section>

      {/* ========== 互動照片牆（品牌紅色底） ========== */}
      <div className="photo-wall" ref={wallRef}>
        {/* 漂浮照片 */}
        {photos.map((photo, i) => {
          const s = styles[i];
          if (!s) return null;
          return (
            <div
              key={photo.id}
              className="photo-card"
              style={{
                top: s.top,
                left: s.left,
                width: s.width,
                '--rotate': `${s.rotate}deg`,
                '--z': `${s.z}px`,
                '--delay': `${s.delay}s`,
                '--duration': `${s.duration}s`,
                zIndex: 10 + Math.floor(s.z),
              } as React.CSSProperties}
              onClick={() => openLightbox(photo)}
            >
              <img
                src={photo.coverUrl}
                alt={photo.title}
                loading="lazy"
                draggable={false}
              />
            </div>
          );
        })}

        {/* 空狀態 */}
        {photos.length === 0 && (
          <div className="photo-wall-empty">
            <span>📷</span>
            <p>目前還沒有花絮照片，敲碗等待中…</p>
          </div>
        )}
      </div>

      {/* ========== 底部 CTA ========== */}
      <section className="gallery-cta">
        <div className="container text-center">
          <h2 className="gallery-cta-title">
            📸 你也有精彩的廟會照片嗎？
          </h2>
          <p className="gallery-cta-sub">
            透過 LINE 官方帳號傳送照片 + 主題名稱 + 您的名字，<br />
            經審核後將展示在精彩花絮！
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

      {/* ========== Lightbox 彈窗 ========== */}
      {activePhoto && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          {/* 關閉按鈕 */}
          <button
            className="lightbox-close"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="關閉"
          >
            ✕
          </button>

          {/* 照片 */}
          <img
            src={activePhoto.coverUrl}
            alt={activePhoto.title}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 投稿者資訊（延遲淡入） */}
          <div
            className={`lightbox-info ${infoVisible ? 'visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="lightbox-theme">
              🏮 {activePhoto.title}
            </p>
            <p className="lightbox-meta">
              👤 {activePhoto.contributor}
              {activePhoto.date && (
                <span>　·　📅 {activePhoto.date}</span>
              )}
            </p>
            {formatLocation(activePhoto) && (
              <p className="lightbox-location">
                📍 {formatLocation(activePhoto)}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}