'use client';

import { useState, useEffect } from 'react';

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 檢查是否已關閉過（sessionStorage，每次開新分頁會再顯示）
    const dismissed = sessionStorage.getItem('popup-dismissed');
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('popup-dismissed', 'true');
  };

  if (!isOpen) return null;

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
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/popup/popup-1-M.jpg"
            />
            <img
              className="popup-img"
              src="/popup/popup-1.jpg"
              alt="活動公告"
            />
          </picture>
        </div>
      </div>
    </div>
  );
}