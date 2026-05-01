// ═══════════════════════════════════════════════════════════════
// PICH AI — LivePage.jsx (Version améliorée)
// Radar du pays : ce qui bouge maintenant
// ═══════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BoltIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';

// ─── STYLES GLOBAUX (injectés via le composant) ─────────────────
const injectGlobalStyles = () => {
  if (!document.getElementById('live-page-styles')) {
    const style = document.createElement('style');
    style.id = 'live-page-styles';
    style.innerHTML = `
      @keyframes pulse-signal {
        0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
        70% { box-shadow: 0 0 0 8px rgba(5, 150, 105, 0); }
        100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
      }
      .live-signal-dot {
        animation: pulse-signal 1.8s infinite;
      }
      .trending-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }
      .trending-card:hover {
        transform: scale(1.01);
        box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        border-color: var(--hdr-accent) !important;
      }
      .trending-card:active {
        transform: scale(0.99);
      }
      .horizontal-scroll {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      .horizontal-scroll::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }
};

// ─── MOCK DATA ───────────────────────────────────────────────────
const MOCK_TRENDING = [
  { id: 1, title: 'Réforme constitutionnelle', category: 'Politique', consensus: 72, change: +5, participants: 1240, comments: 87, isHot: true },
  { id: 2, title: 'Prix du carburant à la hausse', category: 'Économie', consensus: 88, change: +12, participants: 890, comments: 54, isHot: true },
  { id: 3, title: 'Nouveau programme de logements', category: 'Société', consensus: 91, change: -2, participants: 1780, comments: 32, isHot: false },
  { id: 4, title: 'Sécurité dans la capitale', category: 'Sécurité', consensus: 45, change: +8, participants: 2300, comments: 156, isHot: true },
  { id: 5, title: 'Investissements étrangers', category: 'Économie', consensus: 79, change: +3, participants: 560, comments: 18, isHot: false },
  { id: 6, title: 'Récolte agricole 2026', category: 'Agriculture', consensus: 64, change: -7, participants: 920, comments: 41, isHot: false },
];

const MOCK_TOP_DISCUSSIONS = [
  { id: 1, title: 'Le prix du riz va-t-il augmenter ?', comments: 145, activeNow: 23 },
  { id: 2, title: 'Élections sénatoriales : recomposition en vue', comments: 89, activeNow: 12 },
  { id: 3, title: 'Insécurité grandissante à Martissant', comments: 210, activeNow: 34 },
];

// ─── COMPOSANTS ─────────────────────────────────────────────────
const FilterRail = ({ categories, active, setActive, t }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          style={{
            background: 'var(--hdr-surface)',
            border: '1px solid var(--hdr-border)',
            borderRadius: 30,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--hdr-text)',
            flexShrink: 0,
          }}
          aria-label={t('common.scroll_left')}
        >
          <ChevronLeftIcon style={{ width: 18, height: 18 }} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="horizontal-scroll"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          paddingBottom: 4,
          flex: 1,
        }}
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              borderRadius: 30,
              border: active === cat.id ? '2px solid var(--hdr-accent)' : '1px solid var(--hdr-border)',
              background: active === cat.id ? 'var(--hdr-accent-soft)' : 'var(--hdr-surface)',
              color: active === cat.id ? 'var(--hdr-accent)' : 'var(--hdr-text)',
              fontWeight: 600,
              fontSize: 13,
              whiteSpace: 'nowrap',
              scrollSnapAlign: 'start',
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
      {showRight && (
        <button
          onClick={() => scroll('right')}
          style={{
            background: 'var(--hdr-surface)',
            border: '1px solid var(--hdr-border)',
            borderRadius: 30,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--hdr-text)',
            flexShrink: 0,
          }}
          aria-label={t('common.scroll_right')}
        >
          <ChevronRightIcon style={{ width: 18, height: 18 }} />
        </button>
      )}
    </div>
  );
};

const TrendingCard = ({ event, onClick, onDiscuss }) => {
  const { t } = useTranslation();
  const formatNumber = (num) => (num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num);

  return (
    <div
      className="trending-card"
      style={{
        background: 'var(--hdr-surface)',
        borderRadius: 16,
        border: '1px solid var(--hdr-border)',
        padding: 18,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div onClick={onClick} style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--hdr-text-muted)', fontWeight: 500 }}>{event.category}</span>
          {event.isHot && <FireIcon style={{ width: 16, color: '#DC2626' }} />}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
          {event.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: event.consensus >= 50 ? '#059669' : '#DC2626', fontFamily: "'Space Mono', monospace" }}>
            {event.consensus}%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: event.change > 0 ? '#059669' : '#DC2626', fontSize: 13, fontWeight: 600 }}>
            {event.change > 0 ? <ArrowTrendingUpIcon style={{ width: 14 }} /> : <ArrowTrendingDownIcon style={{ width: 14 }} />}
            {event.change > 0 ? '+' : ''}{event.change}%
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--hdr-text-muted)' }}>
            💬 {formatNumber(event.comments)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--hdr-text-muted)' }}>
            👥 {formatNumber(event.participants)}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDiscuss(event.id); }}
        style={{
          marginTop: 16,
          padding: '10px 12px',
          borderRadius: 30,
          border: '1px solid var(--hdr-border)',
          background: 'var(--hdr-surface-alt)',
          color: 'var(--hdr-text)',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: 'pointer',
          transition: 'all 0.15s',
          fontFamily: "'Inter', sans-serif",
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--hdr-accent-soft)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--hdr-surface-alt)'}
      >
        <ChatBubbleOvalLeftEllipsisIcon style={{ width: 16, height: 16 }} /> {t('live.discuss')}
      </button>
    </div>
  );
};

// ─── PAGE ───────────────────────────────────────────────────────
const LivePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [trending] = useState(MOCK_TRENDING);
  const [topDiscussions] = useState(MOCK_TOP_DISCUSSIONS);
  const [signalValue, setSignalValue] = useState(120); // pour animation future

  useEffect(() => {
    injectGlobalStyles();
    // Simulation de variation du signal (optionnel)
    const interval = setInterval(() => {
      setSignalValue(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', label: t('filter.all'), icon: <FireIcon style={{ width: 14 }} /> },
    { id: 'economy', label: 'Économie', icon: null },
    { id: 'politics', label: 'Politique', icon: null },
    { id: 'security', label: 'Sécurité', icon: null },
    { id: 'society', label: 'Société', icon: null },
  ];

  const filtered = activeCategory === 'all'
    ? trending
    : trending.filter(e => e.category.toLowerCase().includes(activeCategory));

  const goToEvent = (id) => navigate(`/event/${id}`);
  const goToDiscussion = (id) => navigate(`/event/${id}`); // redirige vers la page discussion

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)' }}>
      <div className="content-container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <FireIcon style={{ width: 28, height: 28, color: '#DC2626' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Inter', sans-serif", margin: 0, color: 'var(--hdr-text)' }}>
            {t('live.title')}
          </h1>
        </div>

        {/* Signal temps réel animé */}
        <div style={{
          background: 'var(--hdr-surface)',
          borderRadius: 20,
          border: '1px solid var(--hdr-border)',
          padding: '16px 20px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="live-signal-dot"
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#059669',
                boxShadow: '0 0 12px #059669',
              }}
            />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--hdr-text)' }}>
              +{signalValue} votes dans les 10 dernières minutes
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BoltIcon style={{ width: 18, color: '#D97706' }} />
              <span style={{ fontSize: 14, color: 'var(--hdr-text-muted)' }}>Activité en hausse +35%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UsersIcon style={{ width: 18, color: 'var(--hdr-text-muted)' }} />
              <span style={{ fontSize: 14, color: 'var(--hdr-text-muted)' }}>1,240 participants actifs</span>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <FilterRail categories={categories} active={activeCategory} setActive={setActiveCategory} t={t} />

        {/* Grille d'événements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 48,
        }}>
          {filtered.map(event => (
            <TrendingCard
              key={event.id}
              event={event}
              onClick={() => goToEvent(event.id)}
              onDiscuss={goToDiscussion}
            />
          ))}
        </div>

        {/* Top discussions actives */}
        <section style={{ marginTop: 20, borderTop: '1px solid var(--hdr-border)', paddingTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--hdr-text)' }}>
            <ChatBubbleLeftRightIcon style={{ width: 24, height: 24 }} /> {t('live.top_discussions')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topDiscussions.map(disc => (
              <div
                key={disc.id}
                onClick={() => navigate(`/event/${disc.id}`)}
                style={{
                  padding: '18px 20px',
                  background: 'var(--hdr-surface)',
                  borderRadius: 16,
                  border: '1px solid var(--hdr-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hdr-accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hdr-border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {disc.activeNow > 20 && <span style={{ fontSize: 20 }}>🔥</span>}
                  <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--hdr-text)' }}>{disc.title}</span>
                </div>
                <div style={{ display: 'flex', gap: 20, color: 'var(--hdr-text-muted)', fontSize: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    💬 {disc.comments}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ClockIcon style={{ width: 16 }} /> {disc.activeNow} actifs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            onClick={() => navigate('/submit-event')}
            style={{
              padding: '16px 40px',
              borderRadius: 40,
              border: 'none',
              background: 'var(--cta-button-bg, #111827)',
              color: 'var(--cta-button-text, #FFFFFF)',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--cta-button-hover, #374151)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--cta-button-bg, #111827)'}
          >
            {t('live.join_national_discussion')}
          </button>
          <p style={{ fontSize: 14, color: 'var(--hdr-text-muted)', marginTop: 12 }}>
            {t('live.cta_subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LivePage;