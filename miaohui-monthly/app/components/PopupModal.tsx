'use client';

import { useState, useEffect } from 'react';

const popupImages = [
  '/popup/popup-1.jpg',
  '/popup/popup-2.jpg',
  '/popup/popup-3.jpg',
];

export default function PopupModal() {
  const [visible, setVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * popupImages.length);
    setImageSrc(popupImages[randomIndex]);
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={() => setVisible(false)}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={() => setVisible(false)}>
          ✕
        </button>
        <div className="popup-image-area">
          {imageSrc && (
            <img src={imageSrc} alt="廟會月報最新資訊" className="popup-img" />
          )}
        </div>
        <div className="popup-bottom-bar">
          <div className="popup-bar-red"></div>
          <div className="popup-bar-white"></div>
          <div className="popup-bar-blue"></div>
        </div>
      </div>
    </div>
  );
}