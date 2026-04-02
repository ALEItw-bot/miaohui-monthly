'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const wrapperStyle = { position: 'relative' as const, width: '100%' };
  const viewportStyle = { overflow: 'hidden', borderRadius: '0 0 16px 16px' };
  const trackStyle = {
    display: 'flex',
    transition: 'transform 0.5s ease',
    transform: `translateX(-${current * 100}%)`,
  };
  const slideStyle = {
    minWidth: '100%',
    aspectRatio: '4 / 3',
  };
  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  };
  const arrowBase = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'background 0.2s',
  };
  const arrowLeft = { ...arrowBase, left: '12px' };
  const arrowRight = { ...arrowBase, right: '12px' };
  const dotsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 0',
  };
  const dotBase = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '0',
  };
  const dotActive = { ...dotBase, background: '#C80000', transform: 'scale(1.2)' };
  const dotInactive = { ...dotBase, background: '#ddd' };
  const counterStyle = {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    zIndex: 2,
  };

  if (total === 0) {
    const emptyStyle = {
      padding: '60px 20px',
      textAlign: 'center' as const,
      color: '#999',
      fontSize: '0.95rem',
    };
    return <div style={emptyStyle}>暫無歷年照片</div>;
  }

  return (
    <div style={wrapperStyle}>
      <div style={viewportStyle}>
        <div style={trackStyle}>
          {photos.map((photo, idx) => (
            <div key={idx} style={slideStyle}>
              <img
                src={photo}
                alt={`${title} 照片 ${idx + 1}`}
                style={imgStyle}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 計數器 */}
      {total > 1 && (
        <div style={counterStyle}>
          {current + 1} / {total}
        </div>
      )}

      {/* 左右箭頭 */}
      {total > 1 && (
        <>
          <button style={arrowLeft} onClick={prev} aria-label="上一張">‹</button>
          <button style={arrowRight} onClick={next} aria-label="下一張">›</button>
        </>
      )}

      {/* 圓點指示器 */}
      {total > 1 && (
        <div style={dotsStyle}>
          {photos.map((_, idx) => (
            <button
              key={idx}
              style={current === idx ? dotActive : dotInactive}
              onClick={() => setCurrent(idx)}
              aria-label={`跳到第 ${idx + 1} 張`}
            />
          ))}
        </div>
      )}
    </div>
  );
}