// ═══════════════════════════════════════════════════════════════
// PICH AI — HomePage.jsx (Final · Production Ready)
// Hero Carousel · Live Stats · Horizontal Filter Rail
// "Urgent Claims" · "What's Happening Now" · How It Works · AI Insights
// Barres Confiance / Réserve · Effet shimmer · Discussions style Perplexity/X
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon, ChartBarIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  ChevronRightIcon, ChevronLeftIcon,
  ShieldCheckIcon, CheckCircleIcon, XCircleIcon,
  CpuChipIcon, FireIcon,
  ArrowPathIcon, ExclamationTriangleIcon, BoltIcon,
  AcademicCapIcon, BuildingLibraryIcon, BanknotesIcon,
  HomeIcon, WifiIcon, UsersIcon, SignalIcon, ArrowRightIcon,
  ChatBubbleLeftRightIcon, ChatBubbleOvalLeftEllipsisIcon,
  SparklesIcon, ClockIcon, GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useEvents } from '../hooks/useApi';
import {
  getMockMode,
  fetchHappening,
  fetchInsights,
  toggleMockData,
  isMockMode as isMockModeApi,
  categoriesAPI,
  discussionsAPI,
  eventsAPI,
} from '../services/api';

// ─── COULEURS CONFIGURABLES POUR LES BARRES ─────────────────────
const BAR_COLORS = {
  confiance: '#2563EB',   // bleu
  reserve:   '#0F1419',   // noir
};

// ─── FIXED SEMANTIC COLORS ──────────────────────────────────────
const SEMANTIC = {
  green: '#059669',
  greenSoft: '#F0FDF9',
  greenBorder: '#A7F3D0',
  red: '#DC2626',
  redSoft: '#FFF5F5',
  redBorder: '#FED7D7',
  amber: '#D97706',
  amberSoft: '#FFFBEB',
  amberBorder: '#FDE68A',
};

// ── HERO SLIDES ─────────────────────────────────────────────────
const SLIDES = [
  { id: 1, eyebrowKey: 'hero.slide1.eyebrow', headlineKey: 'hero.slide1.headline', subKey: 'hero.slide1.sub', ctaKey: 'hero.slide1.cta', ctaHref: '/', accent: '#4A9EFF', bg: '#040C1E', pattern: 'constellation', statValue: '2,400+', statLabelKey: 'hero.slide1.statLabel' },
  { id: 2, eyebrowKey: 'hero.slide2.eyebrow', headlineKey: 'hero.slide2.headline', subKey: 'hero.slide2.sub', ctaKey: 'hero.slide2.cta', ctaHref: '/predictions', accent: '#00D68F', bg: '#020F0A', pattern: 'constellation', statValue: '94%', statLabelKey: 'hero.slide2.statLabel' },
  { id: 3, eyebrowKey: 'hero.slide3.eyebrow', headlineKey: 'hero.slide3.headline', subKey: 'hero.slide3.sub', ctaKey: 'hero.slide3.cta', ctaHref: '/insights', accent: '#A78BFA', bg: '#08040F', pattern: 'constellation', statValue: '12ms', statLabelKey: 'hero.slide3.statLabel' },
  { id: 4, eyebrowKey: 'hero.slide4.eyebrow', headlineKey: 'hero.slide4.headline', subKey: 'hero.slide4.sub', ctaKey: 'hero.slide4.cta', ctaHref: '/dashboard', accent: '#FF6B6B', bg: '#0F0404', pattern: 'constellation', statValue: '38', statLabelKey: 'hero.slide4.statLabel' },
];

// ── PATTERN CONSTELLATION CITOYENNE ──────────────────────────────
const ConstellationPattern = ({ accent }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </radialGradient>
    </defs>
    {[ [150, 80, 380, 180], [380, 180, 620, 100], [620, 100, 860, 240], [860, 240, 1080, 140], [380, 180, 520, 340], [620, 100, 720, 290], [860, 240, 940, 400], [150, 80, 280, 260], [280, 260, 520, 340], [720, 290, 940, 400], [280, 260, 150, 80], [520, 340, 720, 290], [940, 400, 1080, 140], [150, 80, 50, 200], [1080, 140, 1150, 300] ].map(([x1, y1, x2, y2], i) => (
      <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="0.8" opacity="0.3" />
    ))}
    {[ [150, 80], [380, 180], [620, 100], [860, 240], [1080, 140], [280, 260], [520, 340], [720, 290], [940, 400], [50, 200], [1150, 300] ].map(([x, y], i) => (
      <g key={`point-${i}`}>
        <circle cx={x} cy={y} r="3" fill={accent} opacity="0.7" />
        <circle cx={x} cy={y} r="8" fill="url(#glow)" opacity="0.5" />
      </g>
    ))}
    {Array.from({ length: 60 }).map((_, i) => (
      <circle key={`star-${i}`} cx={Math.random() * 1200} cy={Math.random() * 600} r={Math.random() * 1.5 + 0.5} fill={accent} opacity={Math.random() * 0.4 + 0.1} />
    ))}
  </svg>
);

const SlidePattern = ({ type, a }) => {
  if (type === 'constellation') return <ConstellationPattern accent={a} />;
  return null;
};

// ── HERO CAROUSEL ───────────────────────────────────────────────
const HeroCarousel = ({ stats, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const [cur, setCur] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const timer = useRef(null);
  const scrollRef = useRef(null);
  const touchStartX = useRef(0);

  const go = useCallback((i) => setCur((i + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => go(cur + 1), [cur, go]);

  useEffect(() => {
    if (!isAuto) return;
    timer.current = setInterval(next, 5800);
    return () => clearInterval(timer.current);
  }, [isAuto, next]);

  const manual = (i) => {
    clearInterval(timer.current);
    setIsAuto(false);
    go(i);
    setTimeout(() => setIsAuto(true), 12000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: cur * slideWidth, behavior: 'smooth' });
    }
  }, [cur]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollPos = el.scrollLeft;
    const slideWidth = el.clientWidth;
    const newIndex = Math.round(scrollPos / slideWidth);
    if (newIndex !== cur) setCur(newIndex);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!scrollRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) manual((cur - 1 + SLIDES.length) % SLIDES.length);
      else manual((cur + 1) % SLIDES.length);
    }
  };

  const s = SLIDES[cur];
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: s.bg, minHeight: 560, display: 'flex', flexDirection: 'column' }} aria-label={t('hero.carousel_label')}>
      <SlidePattern type={s.pattern} a={s.accent} />
      
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="hero-scroll"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flex: 1,
          userSelect: 'none',
          cursor: 'grab',
          scrollBehavior: 'smooth',
        }}
      >
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              padding: '60px 24px 56px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              minHeight: 480,
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22, animation: 'slideUp .55s cubic-bezier(.22,1,.36,1) both' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: slide.accent, boxShadow: `0 0 14px ${slide.accent},0 0 28px ${slide.accent}40` }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.65)', fontFamily: "'Space Mono',monospace", letterSpacing: '.14em', textTransform: 'uppercase' }}>{t(slide.eyebrowKey)}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(38px,5.5vw,70px)', fontWeight: 800, lineHeight: 1.06, color: '#fff', fontFamily: "'Inter',sans-serif", margin: '0 0 20px', letterSpacing: '-.035em', whiteSpace: 'pre-line', animation: 'slideUp .6s cubic-bezier(.22,1,.36,1) .07s both' }}>{t(slide.headlineKey)}</h2>
              <p style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: 'rgba(255,255,255,.58)', lineHeight: 1.72, maxWidth: 500, margin: '0 0 34px', animation: 'slideUp .6s cubic-bezier(.22,1,.36,1) .13s both' }}>{t(slide.subKey)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', animation: 'slideUp .6s cubic-bezier(.22,1,.36,1) .2s both' }}>
                <button onClick={() => navigate(slide.ctaHref)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 7, background: '#fff', color: '#111', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", letterSpacing: '-.01em', boxShadow: '0 4px 20px rgba(0,0,0,.25)', transition: 'all .2s ease' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.35)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.25)'; }} aria-label={t(slide.ctaKey)}>
                  {t(slide.ctaKey)} <ArrowRightIcon style={{ width: 14, height: 14 }} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderRadius: 7, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)', backdropFilter: 'blur(10px)' }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Space Mono',monospace", letterSpacing: '-.02em', lineHeight: 1 }}>{slide.statValue}</span>
                  <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', display: 'block' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{t(slide.statLabelKey)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-controls" style={{ padding: '0 24px 30px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ position: 'relative', flex: '0 1 500px', minWidth: 240 }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,.38)' }} />
            <input type="text" placeholder={t('hero.search_placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: '1px solid rgba(255,255,255,.14)', borderRadius: 8, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,.07)', outline: 'none', fontFamily: "'Inter',sans-serif", backdropFilter: 'blur(10px)', transition: 'border-color .2s,background .2s' }} onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,.38)'; e.target.style.background = 'rgba(255,255,255,.11)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.14)'; e.target.style.background = 'rgba(255,255,255,.07)'; }} aria-label={t('hero.search_label')} />
          </div>
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => manual((cur - 1 + SLIDES.length) % SLIDES.length)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.16)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'} aria-label={t('hero.previous_slide')}><ChevronLeftIcon style={{ width: 14, height: 14 }} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => manual(i)} style={{ padding: 0, border: 'none', cursor: 'pointer', background: 'none', display: 'flex', alignItems: 'center' }} aria-label={`${t('hero.go_to_slide')} ${i + 1}`} aria-current={i === cur ? 'true' : undefined}>
                  <div style={{ width: i === cur ? 28 : 7, height: 7, borderRadius: 4, background: i === cur ? '#fff' : 'rgba(255,255,255,.28)', transition: 'all .35s cubic-bezier(.4,0,.2,1)' }} />
                </button>
              ))}
            </div>
            <button onClick={() => manual((cur + 1) % SLIDES.length)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.16)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'} aria-label={t('hero.next_slide')}><ChevronRightIcon style={{ width: 14, height: 14 }} /></button>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontFamily: "'Space Mono',monospace", letterSpacing: '.08em' }}>{String(cur + 1).padStart(2, '0')}/{String(SLIDES.length).padStart(2, '0')}</span>
          </div>
          <div className="mobile-dots" style={{ display: 'none', justifyContent: 'center', gap: 6, marginTop: 16 }}>
            {SLIDES.map((_, i) => <div key={i} style={{ width: i === cur ? 16 : 6, height: 6, borderRadius: 3, background: i === cur ? '#fff' : 'rgba(255,255,255,.3)', transition: 'all .2s' }} />)}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,.08)' }}><div key={`prog${cur}`} style={{ height: '100%', background: s.accent, animation: isAuto ? 'progress 5.8s linear forwards' : 'none' }} /></div>
    </section>
  );
};

// ── STATS STRIP ──────────────────────────────────────────────────
const StatsStrip = ({ stats }) => {
  const { t } = useTranslation();
  const votesThisMonth = stats.votes_this_month ?? 0;
  const aiPrecision    = stats.ai_precision     ?? 0;
  return (
    <div style={{ background: 'var(--hdr-surface)', borderBottom: `1px solid var(--hdr-border)` }}>
      <div className="content-container" style={{ padding: '12px 0' }}>
        <div style={{ fontSize: 11, color: 'var(--hdr-text-muted)', fontFamily: "'Inter',monospace", letterSpacing: '.06em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <GlobeAltIcon style={{ width: 14, height: 14 }} />
          {t('stats.community_state')}
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
          {[
            { labelKey: 'stats.active_events', value: stats.total ?? 0, color: 'var(--hdr-accent)', icon: <FireIcon style={{ width: 16, height: 16 }} /> },
            { labelKey: 'stats.participants', value: stats.totalParticipants ?? 0, color: SEMANTIC.green, icon: <UsersIcon style={{ width: 16, height: 16 }} /> },
            { labelKey: 'stats.avg_consensus', value: stats.averageConsensus ?? 0, color: 'var(--hdr-text-sub)', icon: <ChartBarIcon style={{ width: 16, height: 16 }} />, suffix: '%' },
            { labelKey: 'stats.urgent', value: stats.urgentCount ?? 0, color: SEMANTIC.red, icon: <BoltIcon style={{ width: 16, height: 16 }} /> },
            { labelKey: 'stats.votes_this_month', value: votesThisMonth, color: SEMANTIC.amber, icon: <CheckCircleIcon style={{ width: 16, height: 16 }} /> },
            // { labelKey: 'stats.ai_precision', value: aiPrecision, color: SEMANTIC.green, icon: <CpuChipIcon style={{ width: 16, height: 16 }} />, suffix: '%' },
          ].map((s) => (
            <div key={s.labelKey} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px', flex: '1 1 140px' }}>
              <span style={{ color: s.color }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "'Inter', sans-serif", lineHeight: 1, letterSpacing: '-.02em' }}>
                  {typeof s.value === 'number' ? (s.value === 0 ? '—' : s.value >= 1000 ? `${(s.value/1000).toFixed(1)}k` : s.value) : s.value}{s.suffix}
                </div>
                <div style={{ fontSize: 10, color: 'var(--hdr-text-muted)', marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{t(s.labelKey)}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', marginLeft: 'auto', flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 8px ${SEMANTIC.green}` }} />
            <span style={{ fontSize: 11, color: SEMANTIC.green, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: '.1em' }}>{t('stats.live')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CATEGORY PALETTE ────────────────────────────────────────────
const CAT_PAL = {
  Économie: { text: '#065F46', bg: '#F0FDF9', border: '#A7F3D0', bar: '#059669' }, économie: { text: '#065F46', bg: '#F0FDF9', border: '#A7F3D0', bar: '#059669' },
  Politique: { text: '#1E40AF', bg: '#EFF4FF', border: '#C7D7FD', bar: '#3B82F6' }, politique: { text: '#1E40AF', bg: '#EFF4FF', border: '#C7D7FD', bar: '#3B82F6' },
  Santé: { text: '#991B1B', bg: '#FFF5F5', border: '#FED7D7', bar: '#DC2626' }, santé: { text: '#991B1B', bg: '#FFF5F5', border: '#FED7D7', bar: '#DC2626' },
  Éducation: { text: '#92400E', bg: '#FFFBEB', border: '#FDE68A', bar: '#D97706' }, éducation: { text: '#92400E', bg: '#FFFBEB', border: '#FDE68A', bar: '#D97706' },
  Infrastructure: { text: '#5B21B6', bg: '#F5F3FF', border: '#DDD6FE', bar: '#7C3AED' }, infrastructure: { text: '#5B21B6', bg: '#F5F3FF', border: '#DDD6FE', bar: '#7C3AED' },
  Agriculture: { text: '#3F6212', bg: '#F7FEE7', border: '#D9F99D', bar: '#65A30D' }, agriculture: { text: '#3F6212', bg: '#F7FEE7', border: '#D9F99D', bar: '#65A30D' },
  Société: { text: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE', bar: '#6366F1' }, société: { text: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE', bar: '#6366F1' },
  Sécurité: { text: '#9F1239', bg: '#FFF1F2', border: '#FECDD3', bar: '#E11D48' }, sécurité: { text: '#9F1239', bg: '#FFF1F2', border: '#FECDD3', bar: '#E11D48' },
  Environnement: { text: '#065F46', bg: '#F0FDF4', border: '#BBF7D0', bar: '#10B981' }, environnement: { text: '#065F46', bg: '#F0FDF4', border: '#BBF7D0', bar: '#10B981' },
};
const DEF = { text: 'var(--hdr-text-sub)', bg: 'var(--hdr-surface)', border: 'var(--hdr-border)', bar: 'var(--hdr-text-muted)' };
const gcp = (n) => CAT_PAL[n] || DEF;
const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0);
const gci = (n) => {
  const m = { Économie: <BanknotesIcon className="w-3 h-3" />, économie: <BanknotesIcon className="w-3 h-3" />, Politique: <BuildingLibraryIcon className="w-3 h-3" />, politique: <BuildingLibraryIcon className="w-3 h-3" />, Santé: <ShieldCheckIcon className="w-3 h-3" />, santé: <ShieldCheckIcon className="w-3 h-3" />, Éducation: <AcademicCapIcon className="w-3 h-3" />, éducation: <AcademicCapIcon className="w-3 h-3" />, Infrastructure: <WifiIcon className="w-3 h-3" />, infrastructure: <WifiIcon className="w-3 h-3" />, Agriculture: <HomeIcon className="w-3 h-3" />, agriculture: <HomeIcon className="w-3 h-3" />, Société: <UsersIcon className="w-3 h-3" />, société: <UsersIcon className="w-3 h-3" /> };
  return m[n] || <FireIcon className="w-3 h-3" />;
};

// ═══════════════════════════════════════════════════════════════
// ── HOOK : commentaires ───────────
// ═══════════════════════════════════════════════════════════════
const commentsCache = {};

const useClaimComments = (claimId, { limit = 3 } = {}) => {
  const [comments, setComments]   = useState(commentsCache[claimId] || []);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(!commentsCache[claimId]);

  useEffect(() => {
    if (!claimId) return;
    if (commentsCache[claimId]) {
      setComments(commentsCache[claimId]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    discussionsAPI.getComments(claimId, { sort: 'weight', limit })
      .then(res => {
        if (cancelled) return;
        const data = res?.data || {};
        const list = data.comments || [];
        commentsCache[claimId] = list;
        setComments(list);
        setTotal(data.total || 0);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [claimId, limit]);

  return { comments, total, loading };
};

// ─── HELPER : avatar initiales depuis user_display ────────────────
const getInitials = (userDisplay) => {
  if (!userDisplay) return '?';
  const parts = userDisplay.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
};

// ─── HELPER : "il y a X temps" depuis ISO date ────────────────────
const timeAgo = (isoDate) => {
  if (!isoDate) return '';
  const diff = (Date.now() - new Date(isoDate)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff/60)}min`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}j`;
};

// ═══════════════════════════════════════════════════════════════
// ── EVENT CARD  ────────────────────────
// ═══════════════════════════════════════════════════════════════
const EventCard = ({ event, userVote, onVote, onDetails, onAnalysis, onDiscussion }) => {
  const { t, i18n } = useTranslation();
  const categoryName    = typeof event.category === 'object' ? (event.category?.name || 'general') : (event.category || 'general');
  const pal             = gcp(categoryName);
  const isVoted         = userVote !== undefined && userVote !== null;
  const totalVotes      = event.participants ?? 0;
  const confiancePercent = event.probablePercent ?? 0;   // renommé
  const reservePercent   = event.improbablePercent ?? 0;
  const votesDisplay    = totalVotes >= 1000 ? `${(totalVotes/1000).toFixed(1)}k` : totalVotes;

  const { comments, total: totalComments, loading: commentsLoading } = useClaimComments(event.id, { limit: 3 });

  return (
    <article className="event-card">
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', background: pal.bg, color: pal.text, border: `1px solid ${pal.border}` }}>
            {gci(categoryName)} {categoryName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {event.status === 'urgent' && <span style={{ fontSize: 9, fontWeight: 700, color: SEMANTIC.red, display: 'flex', alignItems: 'center', gap: 2 }}><BoltIcon style={{ width: 10, height: 10 }} />{t('event.urgent')}</span>}
            {event.trend === 'up'   && <ArrowTrendingUpIcon   style={{ width: 14, height: 14, color: SEMANTIC.green }} />}
            {event.trend === 'down' && <ArrowTrendingDownIcon style={{ width: 14, height: 14, color: SEMANTIC.red }} />}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <h3 onClick={() => onDetails(event.slug)} style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: 'var(--hdr-text)', margin: 0, letterSpacing: '-.01em', cursor: 'pointer', flex: '1 1 auto' }}>{event.title}</h3>
          {totalVotes > 0 ? (
            <div style={{ width: '100%' }}>
 
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: BAR_COLORS.confiance, fontWeight: 600, minWidth: 72 }}>
                  {t('event.confiance')}
                </span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#E5E7EB', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${confiancePercent}%`,
                    background: BAR_COLORS.confiance,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: BAR_COLORS.confiance, minWidth: 34, textAlign: 'right' }}>
                  {confiancePercent}%
                </span>
              </div>

            
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: BAR_COLORS.reserve, fontWeight: 600, minWidth: 72 }}>
                  {t('event.reserve')}
                </span>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#E5E7EB', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${reservePercent}%`,
                    background: BAR_COLORS.reserve,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: BAR_COLORS.reserve, minWidth: 34, textAlign: 'right' }}>
                  {reservePercent}%
                </span>
              </div>

              
              <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)' }}>
                {totalVotes.toLocaleString()} participant{totalVotes > 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--hdr-text-muted)' }}>
              {t('event.no_votes_yet')}
            </span>
          )}
        </div>

        <p onClick={() => onDetails(event.slug)} style={{ fontSize: 13, color: 'var(--hdr-text-sub)', lineHeight: 1.5, margin: '0 0 16px', cursor: 'pointer' }}>{event.description}</p>

        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <button onClick={() => onVote(event.id, 'yes')} disabled={isVoted} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 4px', borderRadius: 8, border: userVote === 'yes' ? `1.5px solid ${BAR_COLORS.confiance}` : `1px solid var(--hdr-border)`, background: userVote === 'yes' ? `${BAR_COLORS.confiance}10` : 'var(--hdr-surface)', color: userVote === 'yes' ? BAR_COLORS.confiance : 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 600, cursor: isVoted ? 'default' : 'pointer', opacity: isVoted && userVote !== 'yes' ? 0.5 : 1, transition: 'all .15s' }}>
             {t('event.confiance')}
          </button>
          <button onClick={() => onVote(event.id, 'no')} disabled={isVoted} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 4px', borderRadius: 8, border: userVote === 'no' ? `1.5px solid ${BAR_COLORS.reserve}` : `1px solid var(--hdr-border)`, background: userVote === 'no' ? `${BAR_COLORS.reserve}10` : 'var(--hdr-surface)', color: userVote === 'no' ? BAR_COLORS.reserve : 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 600, cursor: isVoted ? 'default' : 'pointer', opacity: isVoted && userVote !== 'no' ? 0.5 : 1, transition: 'all .15s' }}>
            {t('event.reserve')}
          </button>
        </div>

        {/* Boutons analyse + discussion */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <button onClick={() => onAnalysis(event.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 4px', borderRadius: 8, border: `1px solid var(--hdr-border)`, background: 'var(--hdr-surface-alt)', color: 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
            <CpuChipIcon style={{ width: 12, height: 12 }} />{t('event.ai_analysis')}
          </button>
          <button onClick={() => onDiscussion(event.slug)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 4px', borderRadius: 8, border: `1px solid var(--hdr-border)`, background: 'var(--hdr-surface-alt)', color: 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>
            <ChatBubbleLeftRightIcon style={{ width: 12, height: 12 }} />
            {t('event.discussion')}
            {commentsLoading
              ? <span style={{ fontSize: 10, opacity: .5 }}>…</span>
              : <span>{totalComments > 0 ? totalComments : ''}</span>
            }
          </button>
        </div>

        {/* ── Section commentaires réels ─────────────────────────── */}
        <div style={{ borderTop: `1px solid var(--hdr-border)`, paddingTop: 12 }}>

          {commentsLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2].map(i => (
                <div key={i} className="shimmer" style={{ display: 'flex', gap: 8, height: 28, borderRadius: 8 }} />
              ))}
            </div>
          )}

          {/* Commentaires chargés */}
          {!commentsLoading && comments.length > 0 && comments.slice(0, 3).map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E5E7EB', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {getInitials(c.user_display)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--hdr-text)' }}>{c.user_display || t('comments.anonymous')}</span>
                  {c.comment_type === 'proof' && (
                    <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: SEMANTIC.greenSoft, color: SEMANTIC.green, fontWeight: 700 }}>✓ {t('comments.proof')}</span>
                  )}
                  <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)' }}>{timeAgo(c.created_at)}</span>
                  {c.department && (
                    <span style={{ fontSize: 9, color: 'var(--hdr-text-muted)', padding: '1px 5px', borderRadius: 4, background: 'var(--hdr-surface-alt)' }}>{c.department}</span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: 'var(--hdr-text-sub)', margin: 0, lineHeight: 1.4 }}>
                  {i18n.language === 'ht' && c.content_ht ? c.content_ht : c.content}
                </p>
              </div>
            </div>
          ))}

          {/* Aucun commentaire → CTA */}
          {!commentsLoading && comments.length === 0 && (
            <button onClick={() => onDiscussion(event.slug)} style={{ width: '100%', textAlign: 'center', fontSize: 11, color: 'var(--hdr-accent)', background: 'none', border: 'none', padding: 6, cursor: 'pointer' }}>
              + {t('event.start_discussion')}
            </button>
          )}

          {/* Voir toute la discussion si > 3 commentaires */}
          {!commentsLoading && totalComments > 3 && (
            <button onClick={() => onDiscussion(event.slug)} style={{ marginTop: 4, fontSize: 10, color: 'var(--hdr-text-muted)', background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', textDecoration: 'underline' }}>
              {t('comments.view_all', { count: totalComments })}
            </button>
          )}
        </div>

        {isVoted && <div style={{ marginTop: 12, textAlign: 'center', fontSize: 10, color: SEMANTIC.green, letterSpacing: '.04em' }}>✓ {t('event.vote_recorded')}</div>}
      </div>
    </article>
  );
};

// ─── FILTER RAIL ─────────────────────────────────────────────────
const STICKY_TOP_OFFSET = 15;
const FilterRail = ({ categories, filter, setFilter, t }) => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(true);
  const isDesktop = useRef(window.innerWidth >= 768);
  const checkScroll = () => {
    if (!isDesktop.current) return;
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };
  useEffect(() => {
    const onResize = () => { isDesktop.current = window.innerWidth >= 768; checkScroll(); };
    checkScroll();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      {isDesktop.current && showLeft && (
        <button onClick={() => scroll('left')} style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }}><ChevronLeftIcon style={{ width: 16, height: 16 }} /></button>
      )}
      <div ref={scrollRef} onScroll={checkScroll} className="filter-rail" style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', paddingBottom: 4, flex: 1 }} role="tablist">
        {categories.map(cat => {
          const pal    = gcp(cat.label);
          const active = filter === cat.id;
          return (
            <button key={cat.id} onClick={() => setFilter(cat.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, border: active ? `1.5px solid ${pal.bar}` : '1px solid var(--hdr-border)', color: active ? pal.text : 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', scrollSnapAlign: 'start', transition: 'all .15s', flexShrink: 0 }} role="tab" aria-selected={active}>
              {cat.icon}{cat.label}
              {cat.count > 0 && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 12, background: active ? 'rgba(0,0,0,.06)' : 'var(--hdr-surface-alt)', color: active ? pal.text : 'var(--hdr-text-muted)' }}>{cat.count}</span>}
            </button>
          );
        })}
      </div>
      {isDesktop.current && showRight && (
        <button onClick={() => scroll('right')} style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }}><ChevronRightIcon style={{ width: 16, height: 16 }} /></button>
      )}
    </div>
  );
};

const UrgentClaimCard = ({ event, userVote, onVote, onDetails, onDiscussion, t }) => {
  const totalVotes = event.participants ?? 0;
  const confiancePercent = event.probablePercent ?? 0;
  const reservePercent   = event.improbablePercent ?? 0;
  const { total: totalComments } = useClaimComments(event.id, { limit: 1 });

  return (
    <div style={{ background: 'var(--hdr-surface)', borderRadius: 12, border: `1px solid var(--hdr-border)`, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: SEMANTIC.red, background: SEMANTIC.redSoft, padding: '2px 8px', borderRadius: 20 }}>Urgent</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: confiancePercent >= 50 ? BAR_COLORS.confiance : BAR_COLORS.reserve }}>{confiancePercent}%</span>
          <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)' }}>· {fmt(totalVotes)}</span>
        </div>
      </div>
      <h4 onClick={() => onDetails(event.slug)} style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: 'var(--hdr-text)', cursor: 'pointer' }}>{event.title}</h4>
      <p style={{ fontSize: 12, color: 'var(--hdr-text-sub)', margin: '0 0 12px', lineHeight: 1.4 }}>{event.description?.slice(0, 90)}...</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => onVote(event.id, 'yes')} style={{ flex: 1, padding: '6px', borderRadius: 6, border: '1px solid var(--hdr-border)', background: 'var(--hdr-surface)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          {t('event.confiance')}
        </button>
        <button onClick={() => onVote(event.id, 'no')} style={{ flex: 1, padding: '6px', borderRadius: 6, border: '1px solid var(--hdr-border)', background: 'var(--hdr-surface)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          {t('event.reserve')}
        </button>
      </div>
      <button onClick={() => onDiscussion(event.slug)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: 'none', background: 'var(--hdr-accent-soft, #EFF4FF)', color: 'var(--hdr-accent)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <ChatBubbleLeftRightIcon style={{ width: 12, height: 12 }} /> Discussion {totalComments > 0 ? totalComments : ''}
      </button>
    </div>
  );
};

// ─── URGENT CLAIMS RAIL ──────────────────────────────────────────
const UrgentClaimsRail = ({ events, userVotes, onVote, onDetails, onDiscussion, t }) => {
  const [filterUrgent, setFilterUrgent] = useState('all');
  const urgentEvents = events.filter(e => e.status === 'urgent');
  const uniqueCategories = [...new Set(urgentEvents.map(e => (e.category || '').toLowerCase()))];
  const filtered = filterUrgent === 'all' ? urgentEvents : urgentEvents.filter(e => (e.category || '').toLowerCase() === filterUrgent);
  if (urgentEvents.length === 0) return null;
  return (
    <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BoltIcon style={{ width: 20, height: 20, color: SEMANTIC.red }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--hdr-text)', margin: 0 }}>{t('urgent.claims_chauds')}</h2>
          <span style={{ fontSize: 12, background: SEMANTIC.redSoft, color: SEMANTIC.red, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{urgentEvents.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setFilterUrgent('all')} style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid var(--hdr-border)', background: filterUrgent === 'all' ? 'var(--hdr-accent)' : 'var(--hdr-surface)', color: filterUrgent === 'all' ? '#fff' : 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{t('filter.all')}</button>
          {uniqueCategories.map(cat => (
            <button key={cat} onClick={() => setFilterUrgent(cat)} style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid var(--hdr-border)', background: filterUrgent === cat ? 'var(--hdr-accent)' : 'var(--hdr-surface)', color: filterUrgent === cat ? '#fff' : 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{cat}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.slice(0, 4).map(event => (
          <UrgentClaimCard
            key={event.id}
            event={event}
            userVote={userVotes[event.id]}
            onVote={onVote}
            onDetails={onDetails}
            onDiscussion={onDiscussion}
            t={t}
          />
        ))}
      </div>
    </section>
  );
};

// ─── WHAT'S HAPPENING NOW RAIL ───────────────────────────────────
const HappeningNowRail = ({ happeningItems, loading, navigate }) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const isDesktop = useRef(window.innerWidth >= 768);

  const checkScroll = () => {
    if (!isDesktop.current) return;
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const handleResize = () => {
      isDesktop.current = window.innerWidth >= 768;
      checkScroll();
    };
    checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  if (loading) return (
    <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <GlobeAltIcon style={{ width: 16, height: 16, color: SEMANTIC.green }} />
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', margin: 0 }}>{t('happening.title')}</h2>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 6px ${SEMANTIC.green}` }} />
      </div>
      <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
        {[1,2,3].map(i => <div key={i} className="shimmer" style={{ minWidth: 240, height: 100, borderRadius: 12 }} />)}
      </div>
    </section>
  );
  if (!happeningItems || happeningItems.length === 0) return null;
  return (
    <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }} aria-label={t('happening.section_label')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <GlobeAltIcon style={{ width: 16, height: 16, color: SEMANTIC.green }} />
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', margin: 0 }}>{t('happening.title')}</h2>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 6px ${SEMANTIC.green}` }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isDesktop.current && showLeftArrow && (
          <button onClick={() => scroll('left')} className="rail-arrow" style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }} aria-label={t('common.scroll_left')}>
            <ChevronLeftIcon style={{ width: 16, height: 16 }} />
          </button>
        )}
        <div ref={scrollRef} onScroll={checkScroll} className="horizontal-rail" style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', paddingBottom: 8, flex: 1 }} aria-label={t('happening.rail_label')}>
          {happeningItems.map(item => (
            <div key={item.id} onClick={() => navigate(`/event/${item.slug}`)} className="happening-card" style={{ background: 'var(--hdr-surface)', borderRadius: 12, border: '1px solid var(--hdr-border)', padding: '14px 18px', minWidth: 240, maxWidth: 300, flexShrink: 0, scrollSnapAlign: 'start', cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hdr-accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hdr-border)'} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/event/${item.slug}`); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <ClockIcon style={{ width: 12, height: 12, color: 'var(--hdr-text-muted)' }} />
                <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)' }}>{item.timeAgo || t('common.just_now')}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--hdr-text)', margin: '0 0 8px', lineHeight: 1.4 }}>{item.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: SEMANTIC.green }}>{item.currentConsensus}% {t('event.confiance')}</span>
                <span style={{ fontSize: 11, color: 'var(--hdr-text-muted)' }}>{fmt(item.participants)} {t('event.participants_short')}</span>
              </div>
            </div>
          ))}
        </div>
        {isDesktop.current && showRightArrow && (
          <button onClick={() => scroll('right')} className="rail-arrow" style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }} aria-label={t('common.scroll_right')}>
            <ChevronRightIcon style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </section>
  );
};

// ─── HOW IT WORKS ────────────────────────────────────────────────
const HowItWorks = ({ t, navigate }) => {
  const steps = [
    { icon: <CheckCircleIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step1', path: '/how-it-works' },
    { icon: <ChatBubbleLeftRightIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step2', path: '/how-it-works' },
    { icon: <CpuChipIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step3', path: '/how-it-works' },
    { icon: <SparklesIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step4', path: '/how-it-works' },
  ];
  return (
    <section style={{ marginTop: 48, padding: '24px 0', borderTop: '1px solid var(--hdr-border)', borderBottom: '1px solid var(--hdr-border)' }} aria-label={t('how.section_label')}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--hdr-text)', margin: '0 0 16px 0' }}>{t('how.title')}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate(step.path)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(step.path); }}>
            <span style={{ color: 'var(--hdr-text-muted)' }}>{step.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--hdr-text)' }}>{t(step.labelKey)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes progress{from{width:0%}to{width:100%}}
  @keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .shimmer {
    animation: shimmer 1.5s infinite linear;
    background: linear-gradient(90deg, var(--hdr-border) 25%, var(--hdr-surface) 37%, var(--hdr-border) 63%);
    background-size: 200% 100%;
  }
  *{box-sizing:border-box}
  body{background:var(--hdr-bg)!important; color:var(--hdr-text); font-family:'Inter',sans-serif;}
  .content-container{max-width:1440px; margin:0 auto; padding-left:16px; padding-right:16px;}
  @media(min-width:768px){.content-container{padding-left:24px; padding-right:24px;}}
  .filter-rail::-webkit-scrollbar{display:none}
  .horizontal-rail::-webkit-scrollbar{display:none}
  .hero-scroll::-webkit-scrollbar{display:none}
  
  .events-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    align-items: stretch;
  }
  
  .event-card {
    background: var(--hdr-surface);
    border: 1px solid var(--hdr-border);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: background 0.2s, border-color 0.2s;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  @media(max-width:1024px){
    .events-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  @media(max-width:640px){
    .events-grid {
      grid-template-columns: 1fr !important;
    }
  }
  
  @media(max-width:767px){
    .event-card {
      border: none !important;
      border-radius: 12px !important;
      box-shadow: none !important;
    }
    .happening-card {
      border: none !important;
      box-shadow: none !important;
    }
    .desktop-nav{display:none!important;}
    .mobile-dots{display:flex!important;}
    .rail-arrow{display:none!important;}
    .insights-grid {
      grid-template-columns: 1fr !important;
    }
  }
  
  @media(min-width:768px){
    .mobile-dots{display:none!important;}
    .insights-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    }
  }
  
  :root {
    --cta-button-bg: #111827;
    --cta-button-text: #FFFFFF;
    --cta-button-hover: #374151;
  }
  .dark {
    --cta-button-bg: #F3F4F6;
    --cta-button-text: #111827;
    --cta-button-hover: #E5E7EB;
  }
`;

const SkeletonCard = () => (
  <div className="shimmer" style={{ borderRadius: 12, border: '1px solid var(--hdr-border)', height: '100%', minHeight: 300 }} />
);

// ─── MAIN COMPONENT (HomePage) ──────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('consensus');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const [visibleLimit, setVisibleLimit] = useState(24);
  const [isMockMode, setIsMockMode] = useState(false);

  const [happeningItems, setHappeningItems] = useState([]);
  const [happeningLoading, setHappeningLoading] = useState(true);
  const [insightItems, setInsightItems] = useState([]);
  const [insightLoading, setInsightLoading] = useState(true);
  const [categoryItems, setCategoryItems] = useState([]);

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    stats,
    refresh: refreshEvents,
    submitVote,
  } = useEvents({ category: filter !== 'all' ? filter : undefined, limit: 100, autoRefresh: false });

  const loadCategories = useCallback(async () => {
    try {
      const res = await categoriesAPI.getAllCategories();
      const cats = res?.categories || res?.data?.categories || [];
      setCategoryItems(cats);
    } catch (err) {
      // console.error('Erreur chargement catégories:', err);
      setCategoryItems([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories, i18n.language]);

  useEffect(() => {
    refreshEvents();
    loadHappening();
    loadInsights();
  }, [i18n.language]);

  const loadHappening = async () => {
    setHappeningLoading(true);
    try {
      const data = await fetchHappening();
      setHappeningItems(Array.isArray(data) ? data : []);
    } catch (e) {
      // console.error('Happening fetch error:', e);
      setHappeningItems([]);
    } finally {
      setHappeningLoading(false);
    }
  };

  const loadInsights = async () => {
    setInsightLoading(true);
    try {
      const data = await fetchInsights();
      setInsightItems(Array.isArray(data) ? data : []);
    } catch (e) {
      // console.error('Insights fetch error:', e);
      setInsightItems([]);
    } finally {
      setInsightLoading(false);
    }
  };

  useEffect(() => {
    setIsMockMode(isMockModeApi());
    const id = setInterval(refreshEvents, 120000);
    loadHappening();
    loadInsights();
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setVisibleLimit(24);
  }, [filter, sortBy, searchQuery]);

  const categories = useMemo(() => {
    const allCat = { id: 'all', label: t('filter.all'), icon: <FireIcon className="w-3 h-3" />, count: stats.total };
    const otherCats = categoryItems.map(cat => ({
      id: cat.id.toString(),
      label: cat.name,
      icon: gci(cat.name),
      count: events.filter(e => e.category?.name === cat.name || e.category === cat.name).length,
    }));
    return [allCat, ...otherCats];
  }, [t, stats.total, categoryItems, events]);

  const handleVote = async (eventId, vote) => {
    setUserVotes(p => ({ ...p, [eventId]: vote }));
    try {
      const ok = await submitVote(eventId, vote);
      if (!ok) {
        setUserVotes(p => { const n = { ...p }; delete n[eventId]; return n; });
      } else {
        await refreshEvents();
      }
    } catch {
      setUserVotes(p => { const n = { ...p }; delete n[eventId]; return n; });
    }
  };

  const filteredEvents = events
    .filter(e => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'consensus') return (b.currentConsensus || 0) - (a.currentConsensus || 0);
      if (sortBy === 'participants') return b.participants - a.participants;
      if (sortBy === 'urgency') return (b.status === 'urgent' ? 1 : 0) - (a.status === 'urgent' ? 1 : 0);
      if (sortBy === 'trending') {
        const score = (t) => t === 'up' ? 1 : t === 'down' ? -1 : 0;
        return score(b.trend) - score(a.trend);
      }
      return 0;
    });

  const visibleEvents = filteredEvents.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredEvents.length;
  const loadMore = () => setVisibleLimit(prev => Math.min(prev + 24, filteredEvents.length));

  if (eventsLoading && events.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{globalCSS}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 26, height: 26, border: '2px solid var(--hdr-border)', borderTopColor: 'var(--hdr-text)', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ fontSize: 12, color: 'var(--hdr-text)' }}>{t('common.loading')}</p>
      </div>
    </div>
  );
  if (eventsError && events.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{globalCSS}</style>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <ExclamationTriangleIcon style={{ width: 28, height: 28, color: SEMANTIC.red, margin: '0 auto 12px' }} />
        <p style={{ fontSize: 12, color: 'var(--hdr-text-muted)', marginBottom: 16 }}>{eventsError}</p>
        <button onClick={refreshEvents} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--hdr-accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} aria-label={t('common.retry')}>{t('common.retry')}</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)' }}>
      <style>{globalCSS}</style>

      {isMockMode && (
        <div style={{ background: SEMANTIC.amberSoft, borderBottom: `1px solid ${SEMANTIC.amberBorder}`, padding: '5px 0' }}>
          <div className="content-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: SEMANTIC.amber, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExclamationTriangleIcon style={{ width: 12, height: 12 }} />{t('common.mock_mode')}
            </span>
            <button onClick={() => { toggleMockData(false); window.location.reload(); }} style={{ fontSize: 11, color: SEMANTIC.amber, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} aria-label={t('common.switch_to_real')}>
              {t('common.switch_to_real')}
            </button>
          </div>
        </div>
      )}

      <HeroCarousel stats={stats} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <StatsStrip stats={stats} />

      <main style={{ paddingBottom: 60 }}>
        <div className="content-container">
          <div style={{ position: 'sticky', top: STICKY_TOP_OFFSET, zIndex: 10, background: 'var(--hdr-bg)', padding: '12px 0 4px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--hdr-text-muted)', fontWeight: 500 }}>
                {t('filter.filter_by')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: '1px solid var(--hdr-border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--hdr-text)', background: 'var(--hdr-surface)', cursor: 'pointer', outline: 'none' }} aria-label={t('filter.sort_by')}>
                  <option value="consensus">{t('filter.consensus')}</option>
                  <option value="participants">{t('filter.participants')}</option>
                  <option value="urgency">{t('filter.urgency')}</option>
                  <option value="trending">{t('filter.trending')}</option>
                </select>
                <button onClick={refreshEvents} style={{ padding: 6, borderRadius: 8, border: '1px solid var(--hdr-border)', background: 'var(--hdr-surface)', cursor: 'pointer', color: 'var(--hdr-text-muted)', display: 'flex', alignItems: 'center' }} aria-label={t('common.refresh')}>
                  <ArrowPathIcon style={{ width: 16, height: 16, animation: eventsLoading ? 'spin .8s linear infinite' : 'none' }} />
                </button>
              </div>
            </div>
            <FilterRail categories={categories} filter={filter} setFilter={setFilter} t={t} />
          </div>

          {eventsLoading && events.length === 0 ? (
            <div className="events-grid">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : visibleEvents.length > 0 ? (
            <>
              <div className="events-grid">
                {visibleEvents.map((event, i) => (
                  <div key={event.id} style={{ animation: `cardIn .4s ease ${i * 0.03}s both` }}>
                    <EventCard
                      event={event}
                      userVote={userVotes[event.id]}
                      onVote={handleVote}
                      onDetails={id => navigate(`/event/${event.slug}`)}
                      onAnalysis={id => navigate(`/ai-analysis/${event.slug}`)}
                      onDiscussion={id => navigate(`/discussions/${event.slug}`)}
                    />
                  </div>
                ))}
              </div>
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button onClick={loadMore} style={{ padding: '10px 32px', borderRadius: 30, border: '1px solid var(--hdr-border)', background: 'var(--hdr-surface)', color: 'var(--hdr-text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hdr-surface-alt)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--hdr-surface)'} aria-label={t('common.load_more')}>
                    {t('common.load_more')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '72px 20px', background: 'var(--hdr-surface)', borderRadius: 12, border: '1px solid var(--hdr-border)' }}>
              <MagnifyingGlassIcon style={{ width: 32, height: 32, color: 'var(--hdr-text-muted)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--hdr-text)', marginBottom: 6 }}>{searchQuery ? t('common.no_results') : t('common.no_events')}</p>
              <p style={{ fontSize: 13, color: 'var(--hdr-text-muted)', marginBottom: 16 }}>{searchQuery ? t('common.modify_criteria') : t('common.events_soon')}</p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--hdr-border)', background: 'var(--hdr-text)', color: 'var(--hdr-bg)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }} aria-label={t('common.clear_search')}>
                  {t('common.clear')}
                </button>
              )}
            </div>
          )}

          <UrgentClaimsRail
            events={events}
            userVotes={userVotes}
            onVote={handleVote}
            onDetails={claim => navigate(`/event/${claim.slug}`)}
            onDiscussion={claim => navigate(`/discussions/${claim.slug}`)}
            t={t}
          />

          <HappeningNowRail happeningItems={happeningItems} loading={happeningLoading} navigate={navigate} />
          <HowItWorks t={t} navigate={navigate} />

          {insightLoading ? (
            <section style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--hdr-text)', margin: 0 }}>{t('insights.title')}</h2>
              </div>
              <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 140, borderRadius: 10 }} />)}
              </div>
            </section>
          ) : insightItems.length > 0 ? (
            <section style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }} aria-label={t('insights.section_label')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--hdr-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CpuChipIcon style={{ width: 16, height: 16, color: 'var(--hdr-accent)' }} />{t('insights.title')}
                </h2>
                <button onClick={() => navigate('/insights')} style={{ fontSize: 11, color: 'var(--hdr-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  {t('insights.view_all')}<ChevronRightIcon style={{ width: 12, height: 12 }} />
                </button>
              </div>
              <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {insightItems.slice(0, 3).map(insight => (
                  <div key={insight.id} style={{ background: 'var(--hdr-surface)', borderRadius: 10, border: '1px solid var(--hdr-border)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: insight.impact_level === 'high' ? SEMANTIC.redSoft : insight.impact_level === 'medium' ? SEMANTIC.amberSoft : 'var(--hdr-accent-soft)', color: insight.impact_level === 'high' ? SEMANTIC.red : insight.impact_level === 'medium' ? SEMANTIC.amber : 'var(--hdr-accent)' }}>
                        {i18n.language === 'ht' && insight.category_ht ? insight.category_ht.toUpperCase() : (insight.category?.toUpperCase() || '')}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)' }}>{insight.confidence}% {t('insights.confidence')}</span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', margin: '0 0 6px', lineHeight: 1.4 }}>{insight.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--hdr-text-sub)', margin: '0 0 12px', lineHeight: 1.5 }}>{insight.description}</p>
                    <div style={{ fontSize: 10, color: 'var(--hdr-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <SignalIcon style={{ width: 12, height: 12 }} />
                      {t('insights.based_on', { count: insight.sources_count || 3 })} · {t('insights.cross_sources')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--hdr-border)', textAlign: 'center' }}>
            <button onClick={() => navigate('/submit-event')} style={{ padding: '12px 32px', borderRadius: 30, border: 'none', background: 'var(--cta-button-bg, #111827)', color: 'var(--cta-button-text, #FFFFFF)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all .2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--cta-button-hover, #374151)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--cta-button-bg, #111827)'} aria-label={t('cta.propose_event')}>
              <FireIcon style={{ width: 14, height: 14 }} />{t('cta.propose_event')}
            </button>
            <p style={{ fontSize: 11, color: 'var(--hdr-text-muted)', marginTop: 8 }}>{t('cta.subtitle')}</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;