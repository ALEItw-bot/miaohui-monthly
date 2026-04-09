'use client';

import { useState, useEffect } from 'react';

// ✅ 從 images.json 讀取圖片清單，隨機顯示一張
// ✅ 手機版自動配對：popup-1.jpg → popup-1-m.jpg
// ✅ 如果手機版不存在，自動退回桌機版

function getMobileSrc(desktopSrc: string): string {
  // popup-1.jpg → popup-1-m.jpg
  const dotIndex = desktopSrc.lastIndexOf('.');
  return desktopSrc.slice(0, dotIndex) + '-m' + desktopSrc.slice(dotIndex);
}

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopImg, setDesktopImg] = useState('');
  const [mobileImg, setMobileImg] = useState('');
  const [hasMobileImg, setHasMobileImg] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('popup-dismissed');
    if (dismissed) return;

    // 顯示 popup 的共用函式
    const showPopup = (desktop: string, mobile: string) => {
      setDesktopImg(desktop);
      setMobileImg(mobile);
      setIsOpen(true);
      const img = new Image();
      img.onload = () => setHasMobileImg(true);
      img.onerror = () => setHasMobileImg(false);
      img.src = mobile;
    };

    // 預設圖片（JSON 讀取失敗或格式不對時的保底）
    const fallback = () => showPopup('/popup/popup-1.jpg', '/popup/popup-1-m.jpg');

    fetch('/popup/images.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load images.json');
        return res.json();
      })
      .then((data: unknown) => {
        // 相容多種 JSON 格式
        let raw: unknown[] = [];
        if (Array.isArray(data)) {
          raw = data;
        } else if (data && typeof data === 'object' && 'images' in data) {
          const obj = data as { images?: unknown };
          if (Array.isArray(obj.images)) raw = obj.images;
        }

        // 只保留字串、過濾 -m 手機版、只留圖片副檔名
        const images = raw
          .filter((item): item is string => typeof item === 'string')
          .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
          .filter((f) => !/-m\./i.test(f));

        if (images.length === 0) {
          fallback(); // 解析後沒有可用圖片，用預設
          return;
        }

        const picked = images[Math.floor(Math.random() * images.length)];
        const desktop = picked.startsWith('/') ? picked : `/popup/${picked}`;
        const mobile = getMobileSrc(desktop);
        showPopup(desktop, mobile);
      })
      .catch(fallback);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('popup-dismissed', 'true');
  };

  if (!isOpen || !desktopImg) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div
        className="popup-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-close" onClick={handleClose}>
          ✕
        </button>
        <div className="popup-image-area">
          {hasMobileImg ? (
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={mobileImg}
              />
              <img
                className="popup-img"
                src={desktopImg}
                alt="活動公告"
              />
            </picture>
          ) : (
            <img
              className="popup-img"
              src={desktopImg}
              alt="活動公告"
            />
          )}
        </div>
      </div>
    </div>
  );
}