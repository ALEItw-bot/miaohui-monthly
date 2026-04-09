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

    // 讀取 images.json，隨機選一張
    fetch('/popup/images.json')
      .then((res) => res.json())
      .then((data: string[] | { images?: string[] }) => {
        // 相容兩種 JSON 格式：["a.jpg"] 或 { images: ["a.jpg"] }
        const list = Array.isArray(data) ? data : (data.images ?? []);
        // 過濾手機版檔名（含 -m. 的），只保留桌機版
        const images = list.filter((f) => !/-m\./i.test(f));
        if (images.length === 0) return;
        const picked = images[Math.floor(Math.random() * images.length)];
        const desktop = picked.startsWith('/') ? picked : `/popup/${picked}`;
        const mobile = getMobileSrc(desktop);

        setDesktopImg(desktop);
        setMobileImg(mobile);
        setIsOpen(true);

        // 檢查手機版是否存在
        const img = new Image();
        img.onload = () => setHasMobileImg(true);
        img.onerror = () => setHasMobileImg(false);
        img.src = mobile;
      })
      .catch(() => {
        // JSON 讀取失敗時用預設圖片
        setDesktopImg('/popup/popup-1.jpg');
        setMobileImg('/popup/popup-1-m.jpg');
        setIsOpen(true);
      });
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