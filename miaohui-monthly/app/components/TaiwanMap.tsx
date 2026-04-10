'use client';
import React, { useRef, useEffect, useCallback, useState } from 'react';

interface TaiwanMapProps {
  activeRegion: string;
  onRegionClick: (region: string) => void;
}

// ===== 地圖圖片中各區域的像素顏色（RGB 近似值）=====
// 對應圖片：public/taiwan-map-regions.png
const PIXEL_REGION_MAP = [
  { region: '北部', r: 90, g: 200, b: 255 }, // 天藍色
  { region: '中部', r: 240, g: 240, b: 0 }, // 黃色
  { region: '南部', r: 240, g: 155, b: 145 }, // 粉橘色
  { region: '東部', r: 65, g: 160, b: 65 }, // 綠色
  { region: '外島', r: 255, g: 50, b: 220 }, // 洋紅色
];

// ===== Inline style 常數（避免 JSX 雙花括號）=====
const hiddenStyle: React.CSSProperties = { display: 'none' };
const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
};

function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function detectRegionFromPixel(
  r: number,
  g: number,
  b: number,
  a: number,
): string | null {
  if (a < 50) return null; // 透明 = 地圖外
  let best: string | null = null;
  let bestDist = Infinity;
  for (const entry of PIXEL_REGION_MAP) {
    const d = colorDistance(r, g, b, entry.r, entry.g, entry.b);
    if (d < bestDist) {
      bestDist = d;
      best = entry.region;
    }
  }
  // 距離門檻 100：避免誤判白色邊界等區域
  return bestDist < 100 ? best : null;
}

export default function TaiwanMap({ activeRegion, onRegionClick }: TaiwanMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // 預先把圖片畫到隱藏 canvas，方便點擊時讀像素
  useEffect(() => {
    const img = new Image();
    img.src = '/taiwan-map-regions.png';
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      setImgLoaded(true);
    };
  }, []);

  // 區域選取時：overlay canvas 讓非選取區域變暗，突出選取區域
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas || !overlay || !imgLoaded) return;

    const ctx = canvas.getContext('2d');
    const octx = overlay.getContext('2d');
    if (!ctx || !octx) return;

    overlay.width = canvas.width;
    overlay.height = canvas.height;
    octx.clearRect(0, 0, overlay.width, overlay.height);

    if (activeRegion === '全部') return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const overlayData = octx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      if (a < 50) continue;

      let bestDist = Infinity;
      let bestRegion: string | null = null;
      for (const entry of PIXEL_REGION_MAP) {
        const d = colorDistance(r, g, b, entry.r, entry.g, entry.b);
        if (d < bestDist) {
          bestDist = d;
          bestRegion = entry.region;
        }
      }
      // 非選取區域：蓋上半透明黑色
      if (bestDist < 100 && bestRegion !== activeRegion) {
        overlayData.data[i] = 0;
        overlayData.data[i + 1] = 0;
        overlayData.data[i + 2] = 0;
        overlayData.data[i + 3] = 110;
      }
    }

    octx.putImageData(overlayData, 0, 0);
  }, [activeRegion, imgLoaded]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img || !imgLoaded) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = img.naturalWidth / rect.width;
      const scaleY = img.naturalHeight / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
      const region = detectRegionFromPixel(r, g, b, a);

      if (region) onRegionClick(region === activeRegion ? '全部' : region);
    },
    [activeRegion, imgLoaded, onRegionClick],
  );

  return (
    <div className="taiwan-map-container">
      {/* 隱藏 canvas，僅用於像素偵測 */}
      <canvas ref={canvasRef} style={hiddenStyle} />

      {/* 可點擊的地圖圖片 */}
      <div
        className={`taiwan-map-img-wrapper ${activeRegion !== '全部' ? 'has-selection' : ''}`}
        onClick={handleClick}
      >
        <img
          src="/taiwan-map-regions.png"
          alt="台灣地圖區域"
          className="taiwan-map-img"
          draggable={false}
        />
        {/* 非選取區域半透明遮罩 */}
        <canvas ref={overlayCanvasRef} style={overlayStyle} />
      </div>
    </div>
  );
}
