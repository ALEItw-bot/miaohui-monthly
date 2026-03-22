'use client';
import { useState, useEffect, useCallback } from 'react';

export default function PopupModal() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/popup/images.json')
      .then((res) => res.json())
      .then((data: string[]) => {
        if (data.length > 0) {
          setImages(data);
          setVisible(true);
        }
      })
      .catch((err) => console.error('Failed to load popup images:', err));
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, images.length]);

  if (!visible || images.length === 0) return null;

  const overlayStyle = Object.assign({}, {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  });

  const modalStyle = Object.assign({}, {
    position: 'relative' as const,
    maxWidth: '90vw',
    maxHeight: '80vh',
  });

  const imgStyle = Object.assign({}, {
    width: '100%',
    height: 'auto',
    maxHeight: '80vh',
    objectFit: 'contain' as const,
    borderRadius: '8px',
  });

  const closeBtnStyle = Object.assign({}, {
    position: 'absolute' as const,
    top: '-12px',
    right: '-12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    color: '#333',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  });

  const arrowStyle = (side: 'left' | 'right') =>
    Object.assign({}, {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      [side]: '-40px',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.8)',
      color: '#333',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

  return (
    <div style={overlayStyle} onClick={() => setVisible(false)}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={() => setVisible(false)}>✕</button>

        <img src={images[index]} alt={'Popup ' + (index + 1)} style={imgStyle} />

        {images.length > 1 && (
          <>
            <button style={arrowStyle('left')} onClick={prev}>‹</button>
            <button style={arrowStyle('right')} onClick={next}>›</button>
          </>
        )}
      </div>
    </div>
  );
}