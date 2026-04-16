'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
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

// 照片尺寸加大，讓畫面更豐富
const SIZES = [280, 340, 400, 460, 520];

// 隨機數工具
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 產生一組隨機漂浮位置（每次呼叫都會不同）
function generateFloatingStyles(count: number, round: number): FloatingStyle[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = (index + 1) * 137.508 + round * 97.31;
    const top = (seededRandom(seed * 1.1) * 80) + 2;
    const left = (seededRandom(seed * 2.3) * 82) + 2;
    const width = SIZES[Math.floor(seededRandom(seed * 3.7) * SIZES.length)];
    const rotate = (seededRandom(seed * 4.9) * 16) - 8; // -8° ~ +8°
    const z = Math.floor((seededRandom(seed * 5.1) * 200) - 100); // -100 ~ 100
    const delay = seededRandom(seed * 6.3) * 8;
    const duration = 14 + seededRandom(seed * 7.7) * 12; // 14s ~ 26s
    return { top: `${top}%`, left: `${left}%`, width, rotate, z, delay, duration };
  });
}

// ==========================================
// 主元件
// ==========================================

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [styles, setStyles] = useState<FloatingStyle[]>([]);
  const wallRef = useRef<HTMLDivElement>(null);

  // 初始化 + 每 5 秒隨機重新排列位置（平滑過場）
  useEffect(() => {
    let round = 0;
    setStyles(generateFloatingStyles(photos.length, round));

    const timer = setInterval(() => {
      round++;
      setStyles(generateFloatingStyles(photos.length, round));
    }, 5000);

    return () => clearInterval(timer);
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


  return (
    <>
      {/* ========== 標準 Hero（與其他分頁一致） ========== */}
      <section className="page-hero gallery-hero">
        <div className="container">
          <h1 className="page-hero-title">精彩花絮</h1>
          <p className="page-hero-subtitle">
            來自全台報馬仔的第一手紀錄<br />
            點擊照片放大觀賞
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
              <Image
                src={photo.coverUrl}
                alt={photo.title}
                width={s.width}
                height={Math.round(s.width * 0.75)}
                quality={75}
                sizes="(max-width: 768px) 50vw, 400px"
                draggable={false}
                style=
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  aspectRatio: '4/3',
                
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
          <Image
            src={activePhoto.coverUrl}
            alt={activePhoto.title}
            width={1200}
            height={900}
            quality={90}
            priority
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
            style=
              width: 'auto',
              height: 'auto',
              maxWidth: '85vw',
              maxHeight: '75vh',
              objectFit: 'contain',
            
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

          </div>
        </div>
      )}
    </>
  );
}