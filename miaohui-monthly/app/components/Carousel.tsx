'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Carousel() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/carousel/images.json')
      .then((res) => res.json())
      .then((data: string[]) => {
        if (data.length > 0) setImages(data);
      })
      .catch((err) => console.error('Failed to load carousel images:', err));
  }, []);

  const slides = images.length > 0
    ? [images[images.length - 1], ...images, images[0]]
    : [];

  const goTo = useCallback(
    (newIndex: number) => {
      if (isTransitioning || slides.length === 0) return;
      setIsTransitioning(true);
      setIndex(newIndex);
    },
    [isTransitioning, slides.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (images.length <= 1) return;
    autoPlayRef.current = setInterval(next, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next, images.length]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (index === 0) {
      setIndex(images.length);
    } else if (index === images.length + 1) {
      setIndex(1);
    }
  };

  const clampDrag = (offset: number) => {
    const w = containerRef.current?.offsetWidth || 1;
    const max = w * 0.8;
    if (offset > max) return max;
    if (offset < -max) return -max;
    return offset;
  };

  const snapIfNeeded = () => {
    const w = containerRef.current?.offsetWidth || 1;
    const threshold = w * 0.15;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset < 0) next();
      else prev();
    }
    setDragOffset(0);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    setDragOffset(0);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;
    setDragOffset(clampDrag(diff));
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    snapIfNeeded();
    if (images.length > 1) {
      autoPlayRef.current = setInterval(next, 5000);
    }
  };

  if (images.length === 0) return null;

  const wrapperStyle = Object.assign({}, {
    display: 'flex',
    transform: 'translateX(calc(' + (-index * 100) + '% + ' + dragOffset + 'px))',
    transition: isTransitioning && dragOffset === 0 ? 'transform 0.5s ease' : 'none',
    width: (slides.length * 100) + '%',
  });

  return (
    <div className="carousel" ref={containerRef}>
      <div
        style={wrapperStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((src, i) => {
          const slideStyle = Object.assign({}, {
            width: (100 / slides.length) + '%',
            height: '100%',
            backgroundImage: 'url(' + src + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            flexShrink: 0,
            cursor: 'grab',
            userSelect: 'none' as const,
          });
          return <div key={i} className="carousel-slide" style={slideStyle} draggable={false} />;
        })}
      </div>

      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, i) => {
            const isActive = (index === 0 && i === images.length - 1)
              || (index === images.length + 1 && i === 0)
              || i === index - 1;
            const dotStyle = Object.assign({}, {
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              margin: '0 4px',
              cursor: 'pointer',
              background: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              border: 'none',
              padding: 0,
              transition: 'background 0.3s',
            });
            return (
              <button
                key={i}
                style={dotStyle}
                onClick={() => goTo(i + 1)}
                aria-label={'Go to slide ' + (i + 1)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}