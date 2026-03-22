'use client';
import { useState, useEffect, useRef } from 'react';

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // 當滾過一個畫面高度（約輪播圖高度）且往下滾時隱藏
        if (currentY > viewportHeight * 0.6 && currentY > lastScrollY.current) {
          setHidden(true);
        } else {
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const wrapStyle = {
    transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
    transition: 'transform 0.35s ease-in-out',
  };

  return (
    <div className="header-wrap" style={wrapStyle}>
      {children}
    </div>
  );
}