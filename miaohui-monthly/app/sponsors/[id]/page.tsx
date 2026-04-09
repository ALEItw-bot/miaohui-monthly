import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NotionRenderer } from '@/components/NotionRenderer';
import { getPartnerById, getPartnerSlugs } from '@/lib/notion';
import { SOCIAL_LINKS } from '@/lib/constants';
import './sponsor-detail.css';

export const revalidate = 600;

// ── 動態 SEO meta ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const partner = await getPartnerById(id);
  if (!partner) return { title: '找不到商家｜廟會月報' };

  return {
    title: `${partner.name}｜工商服務｜廟會月報`,
    description:
      partner.features ||
      `${partner.name} — ${partner.category.join('、')}`,
    openGraph: {
      title: `${partner.name}｜工商服務｜廟會月報`,
      description:
        partner.features ||
        `${partner.name} — ${partner.category.join('、')}`,
    },
  };
}

// ── 靜態路徑產生 ──
export async function generateStaticParams() {
  const slugs = await getPartnerSlugs();
  return slugs.map((id) => ({ id }));
}

// ── 頁面主元件 ──
export default async function SponsorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartnerById(id);

  if (!partner) notFound();

  return (
    <>
      {/* Hero — 使用 Notion 封面圖作為背景 */}
      <section
        className="page-hero sponsor-detail-dynamic-hero"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${partner.coverImage || '/hero/sponsors.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <div className="sponsor-detail-tags">
            {partner.category.map((cat) => (
              <span key={cat} className="tag tag--red">
                {cat}
              </span>
            ))}
            {partner.exposureLevel === '精選' && (
              <span className="sponsor-badge-hero">⭐ 精選夥伴</span>
            )}
          </div>
          <h1 className="page-hero-title">{partner.name}</h1>
          {partner.features && (
            <p className="page-hero-subtitle">{partner.features}</p>
          )}
        </div>
      </section>

      {/* 商家資訊 */}
      <section className="sponsor-detail-body">
        <div className="sponsor-detail-content">
          <h2 className="sponsor-detail-h2">📋 商家資訊</h2>
          <div className="info-grid">
            {partner.description && (
              <div className="info-card card">
                <div className="info-card-icon">🎯</div>
                <div className="info-card-label">服務項目</div>
                <div className="info-card-value">{partner.description}</div>
              </div>
            )}
            {partner.phone && (
              <div className="info-card card">
                <div className="info-card-icon">📞</div>
                <div className="info-card-label">電話</div>
                <div className="info-card-value">
                  <a href={`tel:${partner.phone}`}>{partner.phone}</a>
                </div>
              </div>
            )}
            {partner.email && (
              <div className="info-card card">
                <div className="info-card-icon">✉️</div>
                <div className="info-card-label">電子郵件</div>
                <div className="info-card-value">
                  <a href={`mailto:${partner.email}`}>{partner.email}</a>
                </div>
              </div>
            )}
            {partner.website && (
              <div className="info-card card">
                <div className="info-card-icon">🌐</div>
                <div className="info-card-label">官方網站</div>
                <div className="info-card-value">
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    前往官網 →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Notion 頁面內容 */}
          {partner.blocks && partner.blocks.length > 0 && (
            <div className="sponsor-notion-content">
              <NotionRenderer blocks={partner.blocks} />
            </div>
          )}
        </div>
      </section>

      {/* 返回 + CTA */}
      <section className="sponsor-detail-footer">
        <div className="container sponsor-detail-footer-inner">
          <Link href="/sponsors" className="btn-back">
            ← 返回工商服務列表
          </Link>
          <a
            href={SOCIAL_LINKS.line}
            className="btn btn-cta-invert"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 洽談合作
          </a>
        </div>
      </section>
    </>
  );
}