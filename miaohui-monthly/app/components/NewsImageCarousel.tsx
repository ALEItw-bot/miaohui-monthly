'use client';
import { useState, useEffect, useCallback } from 'react';

export default function NewsImageCarousel() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/news/images.json')
      .then((res) => res.json())
      .then((data: string[]) => {
        if (data.length > 0) setImages(data);
      })
      .catch((err) => console.error('Failed to load news images:', err));
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, images.length]);

  if (images.length === 0) return null;

  const containerStyle = Object.assign({}, {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '8px',
  });

  return (
    <div style={containerStyle}>
      {images.map((src, i) => {
        const imgStyle = Object.assign({}, {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover' as const,
          opacity: i === index ? 1 : 0,
          transition: 'opacity 0.8s ease',
        });
        return <img key={i} src={src} alt={'News ' + (i + 1)} style={imgStyle} />;
      })}

      {images.length > 1 && (
        <div style={Object.assign({}, {
          position: 'absolute' as const,
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
        })}>
          {images.map((_, i) => {
            const dotStyle = Object.assign({}, {
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'background 0.3s',
            });
            return (
              <button
                key={i}
                style={dotStyle}
                onClick={() => setIndex(i)}
                aria-label={'News image ' + (i + 1)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}