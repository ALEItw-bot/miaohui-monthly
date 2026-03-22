'use client';

import { useState, useEffect } from 'react';



export default function PopupModal() {
  const [visible, setVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [popupImages, setPopupImages] = useState<string[]>([]);

  useEffect(() => {
  fetch('/popup/images.json')
    .then(res => res.json())
    .then(data => {
      if (data.images && data.images.length > 0) {
        setPopupImages(data.images);
        const randomIndex = Math.floor(Math.random() * data.images.length);
        setImageSrc(data.images[randomIndex]);
        setVisible(true);
      }
    })
    .catch(() => {});
}, []);

  if (!visible || popupImages.length === 0) return null;

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