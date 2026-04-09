'use client';

import { useState, useEffect, useCallback } from 'react';
import './photo-carousel.css';

interface PhotoCarouselProps {
  photos: string[];
  title?: string;
  autoPlay?: boolean;
  interval?: number;
}

export default function PhotoCarousel({
  photos,
  title = '活動照片',
  autoPlay = true,
  interval = 4000,
}: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = photos.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // 自動輪播
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, total]);

  if (total === 0) {
    return <div className="photo-carousel-empty">暫無歷年照片</div>;
  }

  return (
    <div className="photo-carousel">
      <div className="photo-carousel-viewport">
        <div
          className="photo-carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {photos.map((photo, idx) => (
            <div key={idx} className="photo-carousel-slide">
              <img
                src={photo}
                alt={`${title} 照片 ${idx + 1}`}
                className="photo-carousel-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 計數器 */}
      {total > 1 && (
        <div className="photo-carousel-counter">
          {current + 1} / {total}
        </div>
      )}

      {/* 左右箭頭 */}
      {total > 1 && (
        <>
          <button
            className="photo-carousel-arrow photo-carousel-arrow-left"
            onClick={prev}
            aria-label="上一張"
          >
            ‹
          </button>
          <button
            className="photo-carousel-arrow photo-carousel-arrow-right"
            onClick={next}
            aria-label="下一張"
          >
            ›
          </button>
        </>
      )}

      {/* 圓點指示器 */}
      {total > 1 && (
        <div className="photo-carousel-dots">
          {photos.map((_, idx) => (
            <button
              key={idx}
              className={`photo-carousel-dot ${current === idx ? 'active' : ''}`}
              onClick={() => setCurrent(idx)}
              aria-label={`跳到第 ${idx + 1} 張`}
            />
          ))}
        </div>
      )}
    </div>
  );
}