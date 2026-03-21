'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Carousel() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/images?folder=carousel')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  const totalSlides = images.length;

  const goTo = useCallback((index: number) => {
    if (totalSlides === 0) return;
    setCurrent(((index % totalSlides) + totalSlides) % totalSlides);
    setTranslateX(0);
  }, [totalSlides]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    autoPlayRef.current = setInterval(next, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next, totalSlides]);

  const pauseAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const resumeAutoPlay = () => {
    if (totalSlides <= 1) return;
    autoPlayRef.current = setInterval(next, 5000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    pauseAutoPlay();
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - startX);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateX > 80) prev();
    else if (translateX < -80) next();
    else setTranslateX(0);
    resumeAutoPlay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    pauseAutoPlay();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setTranslateX(e.touches[0].clientX - startX);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateX > 80) prev();
    else if (translateX < -80) next();
    else setTranslateX(0);
    resumeAutoPlay();
  };

  const loadingBg = { background: 'linear-gradient(135deg, #C80000, #8B0000)' };
  const loadingText = { color: '#fff', fontSize: '24px', textAlign: 'center' as const, paddingTop: '40vh' };
  const cursorStyle = { cursor: isDragging ? 'grabbing' : 'grab' };

  if (totalSlides === 0) {
    return (
      <div className="carousel">
        <div className="carousel-slide" style={loadingBg}>
          <div style={loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  const trackStyle = {
    display: 'flex',
    width: totalSlides * 100 + '%',
    transform: 'translateX(calc(-' + (current * (100 / totalSlides)) + '% + ' + translateX + 'px))',
    transition: isDragging ? 'none' : 'transform 0.5s ease',
  };

  return (
    <div
      className="carousel"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={cursorStyle}
    >
      <div className="carousel-track" style={trackStyle}>
        {images.map((src, i) => {
          const slideStyle = {
            width: (100 / totalSlides) + '%',
            flexShrink: 0,
            backgroundImage: 'url(' + src + ')',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            };
          return <div key={i} className="carousel-slide" style={slideStyle} />;
        })}
      </div>
      <div className="carousel-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={'carousel-dot' + (i === current ? ' active' : '')}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}