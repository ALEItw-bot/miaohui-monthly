'use client';

import { useState, useEffect } from 'react';

interface StarRatingProps {
  eventSlug: string;
}

export default function StarRating({ eventSlug }: StarRatingProps) {
  const storageKey = `star-rating-${eventSlug}`;
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [average, setAverage] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRating(parseInt(saved));
      setSubmitted(true);
    }
  }, [storageKey]);

  const handleClick = async (star: number) => {
    if (submitted || loading) return;
    setLoading(true);
    setRating(star);

    try {
      const res = await fetch(`/api/events/${eventSlug}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: star }),
      });
      const data = await res.json();
      if (data.success) {
        setAverage(data.average);
        setTotalCount(data.count);
      }
    } catch (err) {
      console.error('Rating submit failed:', err);
    }

    setSubmitted(true);
    setLoading(false);
    localStorage.setItem(storageKey, String(star));
  };

  const labels = ['', '還好', '有點期待', '期待', '很期待', '超級期待！'];

  const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
  };
  const btnBase = {
    background: 'none',
    border: 'none',
    fontSize: '2.5rem',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
    transition: 'transform 0.15s',
  };
  const disabledBtn = { ...btnBase, cursor: 'default' };
  const labelStyle = { fontSize: '1rem', color: '#666', minHeight: '1.5em' };
  const thanksStyle = { marginTop: '8px', fontSize: '0.85rem', color: '#999' };
  const statsStyle = {
    marginTop: '12px',
    fontSize: '0.85rem',
    color: '#C80000',
    fontWeight: 600,
  };

  return (
    <>
      <div style={rowStyle}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            style={submitted ? disabledBtn : btnBase}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !submitted && setHover(star)}
            onMouseLeave={() => !submitted && setHover(0)}
            aria-label={`${star} 星`}
          >
            {star <= (hover || rating) ? '★' : '☆'}
          </button>
        ))}
      </div>
      <div style={labelStyle}>
        {loading
          ? '⏳ 提交中...'
          : submitted
            ? `你的評分：${rating} 顆星 — ${labels[rating]}`
            : hover > 0
              ? labels[hover]
              : '點擊星星來評分'}
      </div>
      {submitted && <div style={thanksStyle}>感謝你的參與！🙏</div>}
      {submitted && average !== null && totalCount !== null && (
        <div style={statsStyle}>
          📊 目前平均 {average} 分（{totalCount} 人評分）
        </div>
      )}
    </>
  );
}
