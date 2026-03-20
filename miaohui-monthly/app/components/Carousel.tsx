'use client';

import { useState, useEffect, useCallback } from 'react';

interface Slide {
  title: string;
  subtitle: string;
  bgClass: string;
  link: string;
}

const slides: Slide[] = [
  {
    title: '2026 大甲媽祖遶境進香',
    subtitle: '4/17 起駕・9天8夜・徒步300公里',
    bgClass: 'slide-dajia',
    link: '/events/dajia',
  },
  {
    title: '2026 白沙屯媽祖徒步進香',
    subtitle: '4/12 深夜起駕・8天7夜・路線不固定',
    bgClass: 'slide-baishatun',
    link: '/events/baishatun',
  },
  {
    title: '廟會月報',
    subtitle: '全台鬧熱，報你知！',
    bgClass: 'slide-brand',
    link: '/brand-story',
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="carousel">
      <div
        className="carousel-track"
        data-offset={current}
      >
        {slides.map((slide, i) => (
          <a
            key={i}
            href={slide.link}
            className={`carousel-slide ${slide.bgClass}`}
          >
            <div className="carousel-overlay" />
            <div className="carousel-text">
              <h2 className="carousel-title">{slide.title}</h2>
              <p className="carousel-subtitle">{slide.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`第 ${i + 1} 張`}
          />
        ))}
      </div>
    </section>
  );
}