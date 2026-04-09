'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function SponsorCarousel() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/sponsor/images.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch(() => {});
  }, []);

  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrent(((index % total) + total) % total);
      setTranslateX(0);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    autoPlayRef.current = setInterval(next, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next, total]);

  const pauseAuto = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const resumeAuto = () => {
    if (total <= 1) return;
    autoPlayRef.current = setInterval(next, 4000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    pauseAuto();
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - startX);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateX > 60) prev();
    else if (translateX < -60) next();
    else setTranslateX(0);
    resumeAuto();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    pauseAuto();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTranslateX(e.touches[0].clientX - startX);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateX > 60) prev();
    else if (translateX < -60) next();
    else setTranslateX(0);
    resumeAuto();
  };

  if (total === 0) {
    return (
      <div className="sponsor-carousel-placeholder">
        <span>🏮 工商服務</span>
      </div>
    );
  }

  const cursorStyle = { cursor: isDragging ? 'grabbing' : 'grab' };
  const trackStyle = {
    display: 'flex',
    width: total * 100 + '%',
    height: '100%',
    transform:
      'translateX(calc(-' + current * (100 / total) + '% + ' + translateX + 'px))',
    transition: isDragging ? 'none' : 'transform 0.4s ease',
  };

  return (
    <div
      className="sponsor-carousel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={cursorStyle}
    >
      <div className="sponsor-carousel-track" style={trackStyle}>
        {images.map((src, i) => {
          const imgStyle = {
            width: 100 / total + '%',
            flexShrink: 0,
            backgroundImage: 'url(' + src + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          };
          return <div key={i} className="sponsor-carousel-slide" style={imgStyle} />;
        })}
      </div>
      {total > 1 && (
        <div className="sponsor-carousel-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={'sponsor-carousel-dot' + (i === current ? ' active' : '')}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
