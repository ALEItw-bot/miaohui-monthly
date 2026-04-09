'use client';
import { useState, useEffect, useRef } from 'react';

export default function Carousel() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [animate, setAnimate] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(function () {
    fetch('/carousel/images.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch(function () {});
  }, []);

  const total = images.length;

  const clearAuto = function () {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const startAuto = function () {
    if (total <= 1) return;
    clearAuto();
    autoPlayRef.current = setInterval(function () {
      setAnimate(true);
      setCurrent(function (prev) {
        return prev + 1;
      });
      setDragX(0);
    }, 5000);
  };

  useEffect(
    function () {
      if (total <= 1) return;
      autoPlayRef.current = setInterval(function () {
        setAnimate(true);
        setCurrent(function (prev) {
          return prev + 1;
        });
        setDragX(0);
      }, 5000);
      return function () {
        clearAuto();
      };
    },
    [total],
  );

  // ★ 修正：分頁閒置後 setInterval 失控導致輪播消失
  useEffect(
    function () {
      const handleVisibility = function () {
        if (document.hidden) {
          clearAuto();
        } else {
          setCurrent(function (prev) {
            if (prev <= 0) return 1;
            if (prev > total) return 1;
            return prev;
          });
          setAnimate(false);
          setDragX(0);
          startAuto();
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return function () {
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    },
    [total],
  );

  if (total === 0) {
    const loadingBg = Object.assign(
      {},
      {
        background: 'linear-gradient(135deg, #C80000, #8B0000)',
      },
    );
    const loadingText = Object.assign(
      {},
      {
        color: '#fff',
        fontSize: '24px',
        textAlign: 'center' as const,
        paddingTop: '40vh',
      },
    );
    return (
      <div className="carousel">
        <div className="carousel-slide" style={loadingBg}>
          <div style={loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  const slides = [images[total - 1]].concat(images).concat([images[0]]);
  const slideCount = slides.length;

  const goTo = function (index: number) {
    setAnimate(true);
    setCurrent(index);
    setDragX(0);
  };

  const next = function () {
    goTo(current + 1);
  };
  const prev = function () {
    goTo(current - 1);
  };

  const handleTransitionEnd = function () {
    if (current === 0) {
      setAnimate(false);
      setCurrent(total);
    } else if (current === total + 1) {
      setAnimate(false);
      setCurrent(1);
    }
  };

  const snapIfNeeded = function () {
    if (current === 0) {
      setAnimate(false);
      setCurrent(total);
    } else if (current === total + 1) {
      setAnimate(false);
      setCurrent(1);
    }
  };

  const clampDrag = function (diff: number) {
    const maxDrag = window.innerWidth;
    if (diff > maxDrag) {
      return maxDrag;
    }
    if (diff < -maxDrag) {
      return -maxDrag;
    }
    return diff;
  };

  const handleMouseDown = function (e: React.MouseEvent) {
    setIsDragging(true);
    setStartX(e.clientX);
    clearAuto();
  };
  const handleMouseMove = function (e: React.MouseEvent) {
    if (!isDragging) return;
    setDragX(clampDrag(e.clientX - startX));
  };
  const handleMouseUp = function () {
    if (!isDragging) return;
    setIsDragging(false);
    snapIfNeeded();
    if (dragX > 80) {
      prev();
    } else if (dragX < -80) {
      next();
    } else {
      setDragX(0);
    }
    startAuto();
  };

  const handleTouchStart = function (e: React.TouchEvent) {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    clearAuto();
  };
  const handleTouchMove = function (e: React.TouchEvent) {
    if (!isDragging) return;
    setDragX(clampDrag(e.touches[0].clientX - startX));
  };
  const handleTouchEnd = function () {
    if (!isDragging) return;
    setIsDragging(false);
    snapIfNeeded();
    if (dragX > 80) {
      prev();
    } else if (dragX < -80) {
      next();
    } else {
      setDragX(0);
    }
    startAuto();
  };

  let realIndex = current - 1;
  if (current === 0) {
    realIndex = total - 1;
  } else if (current === total + 1) {
    realIndex = 0;
  }

  const offsetPercent = current * (100 / slideCount);
  const transformValue = 'translateX(calc(-' + offsetPercent + '% + ' + dragX + 'px))';
  const transitionValue = !animate || isDragging ? 'none' : 'transform 0.5s ease';

  const trackStyle = Object.assign(
    {},
    {
      display: 'flex',
      width: slideCount * 100 + '%',
      transform: transformValue,
      transition: transitionValue,
    },
  );

  const cursorStyle = Object.assign(
    {},
    {
      cursor: isDragging ? 'grabbing' : 'grab',
    },
  );

  return (
    <div
      className="carousel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={cursorStyle}
    >
      <div
        className="carousel-track"
        style={trackStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map(function (src, i) {
          const slideStyle = Object.assign(
            {},
            {
              width: 100 / slideCount + '%',
              flexShrink: 0,
              backgroundImage: 'url(' + src + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          );
          return <div key={i} className="carousel-slide" style={slideStyle} />;
        })}
      </div>
      <div className="carousel-dots">
        {images.map(function (_, i) {
          const dotClass = 'carousel-dot' + (i === realIndex ? ' active' : '');
          return (
            <span
              key={i}
              className={dotClass}
              onClick={function () {
                goTo(i + 1);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
