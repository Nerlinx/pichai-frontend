// ═══════════════════════════════════════════════════════════════
// PICH AI — HomePage.jsx (Final · Production Ready)
// Hero Carousel · Live Stats · Horizontal Filter Rail · Discussion Previews
// "What's Happening Now" · How It Works · AI Insights · Dark/Light Ready
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon, ChartBarIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  ChevronRightIcon, ChevronLeftIcon,
  ShieldCheckIcon, CheckCircleIcon, XCircleIcon,
  CpuChipIcon, DocumentTextIcon, FireIcon,
  ArrowPathIcon, ExclamationTriangleIcon, BoltIcon,
  AcademicCapIcon, BuildingLibraryIcon, BanknotesIcon,
  HomeIcon, WifiIcon, UsersIcon, SignalIcon, ArrowRightIcon,
  ChatBubbleLeftRightIcon, ChatBubbleOvalLeftEllipsisIcon,
  SparklesIcon, ClockIcon, GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useEvents, useCategories, useDashboard } from '../hooks/useApi';
import {
  getMockMode,
  fetchHappening,
  fetchInsights,
  toggleMockData,
  isMockMode as isMockModeApi,
} from '../services/api';

// ─── FIXED SEMANTIC COLORS (green / red / amber) ─────────────────
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

// ── HERO SLIDES (keys only) ──────────────────────────────────────
const SLIDES = [
  { id: 1, eyebrowKey: 'hero.slide1.eyebrow', headlineKey: 'hero.slide1.headline', subKey: 'hero.slide1.sub', ctaKey: 'hero.slide1.cta', ctaHref: '/', accent: '#4A9EFF', bg: 'linear-gradient(135deg, #040C1E 0%, #071530 50%, #0A1E42 100%)', pattern: 'grid', statValue: '2,400+', statLabelKey: 'hero.slide1.statLabel' },
  { id: 2, eyebrowKey: 'hero.slide2.eyebrow', headlineKey: 'hero.slide2.headline', subKey: 'hero.slide2.sub', ctaKey: 'hero.slide2.cta', ctaHref: '/predictions', accent: '#00D68F', bg: 'linear-gradient(135deg, #020F0A 0%, #041A10 50%, #063020 100%)', pattern: 'nodes', statValue: '94%', statLabelKey: 'hero.slide2.statLabel' },
  { id: 3, eyebrowKey: 'hero.slide3.eyebrow', headlineKey: 'hero.slide3.headline', subKey: 'hero.slide3.sub', ctaKey: 'hero.slide3.cta', ctaHref: '/insights', accent: '#A78BFA', bg: 'linear-gradient(135deg, #08040F 0%, #100520 50%, #180835 100%)', pattern: 'hex', statValue: '12ms', statLabelKey: 'hero.slide3.statLabel' },
  { id: 4, eyebrowKey: 'hero.slide4.eyebrow', headlineKey: 'hero.slide4.headline', subKey: 'hero.slide4.sub', ctaKey: 'hero.slide4.cta', ctaHref: '/dashboard', accent: '#FF6B6B', bg: 'linear-gradient(135deg, #0F0404 0%, #1A0606 50%, #2A0A0A 100%)', pattern: 'pulse', statValue: '38', statLabelKey: 'hero.slide4.statLabel' },
];

// ── PATTERNS SVG ─────────────────────────────────────────────────
const PatternGrid = ({ a }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }} preserveAspectRatio="xMidYMid slice">
    <defs><pattern id="pg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke={a} strokeWidth=".6" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#pg)" />
    {[[120, 80], [300, 40], [480, 160], [660, 60], [820, 200], [1000, 100], [1160, 260], [250, 280], [580, 320], [900, 380]].map(([x, y], i) => (
      <g key={i}><circle cx={x} cy={y} r="4" fill="none" stroke={a} strokeWidth="1" opacity=".5" /><circle cx={x} cy={y} r="1.5" fill={a} opacity=".8" /></g>
    ))}
  </svg>
);
const PatternNodes = ({ a }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.17 }} preserveAspectRatio="xMidYMid slice">
    {[[150,80,380,180],[380,180,620,100],[620,100,860,240],[860,240,1080,140],[380,180,520,340],[620,100,720,290],[860,240,940,400],[150,80,280,260],[280,260,520,340],[720,290,940,400]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth="1" opacity=".4"/>)}
    {[[150,80],[380,180],[620,100],[860,240],[1080,140],[280,260],[520,340],[720,290],[940,400]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="10" fill="none" stroke={a} strokeWidth="1" opacity=".28"/><circle cx={x} cy={y} r="3.5" fill={a} opacity=".9"/></g>)}
  </svg>
);
const PatternHex = ({ a }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.11 }} preserveAspectRatio="xMidYMid slice">
    <defs><pattern id="ph" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse"><polygon points="40,4 76,24 76,68 40,88 4,68 4,24" fill="none" stroke={a} strokeWidth=".8"/></pattern></defs>
    <rect width="100%" height="100%" fill="url(#ph)"/>
  </svg>
);
const PatternPulse = ({ a }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.13 }} preserveAspectRatio="xMidYMid slice">
    {[60,130,200,280,360,440,520].map((r,i)=><circle key={i} cx="78%" cy="50%" r={r} fill="none" stroke={a} strokeWidth=".8" opacity={1-i*0.12}/>)}
    <defs><pattern id="pp" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke={a} strokeWidth=".3" opacity=".4"/></pattern></defs>
    <rect width="100%" height="100%" fill="url(#pp)" opacity=".45"/>
  </svg>
);
const SlidePattern = ({ type, a }) => {
  if (type === 'grid') return <PatternGrid a={a} />;
  if (type === 'nodes') return <PatternNodes a={a} />;
  if (type === 'hex') return <PatternHex a={a} />;
  if (type === 'pulse') return <PatternPulse a={a} />;
  return null;
};

// ── HERO CAROUSEL (inchangé) ─────────────────────────────────────
const HeroCarousel = ({ stats, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const [cur, setCur] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const timer = useRef(null);
  const scrollRef = useRef(null);

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

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollPos = el.scrollLeft;
    const slideWidth = el.clientWidth;
    const newIndex = Math.round(scrollPos / slideWidth);
    if (newIndex !== cur) setCur(newIndex);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: cur * slideWidth, behavior: 'smooth' });
    }
  }, [cur]);

  const s = SLIDES[cur];
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: s.bg, minHeight: 520, display: 'flex', flexDirection: 'column', transition: 'background 1s ease' }} aria-label={t('hero.carousel_label')}>
      <SlidePattern type={s.pattern} a={s.accent} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom,transparent,rgba(248,250,252,0.08))', pointerEvents: 'none' }} />
      
      <div ref={scrollRef} onScroll={handleScroll} className="hero-scroll" style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', flex: 1 }} aria-label={t('hero.slides_container')}>
        {SLIDES.map((slide, idx) => (
          <div key={slide.id} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', padding: '60px 24px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }} aria-label={`${t('hero.slide')} ${idx + 1}`}>
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
          ].map((s, i) => (
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

// ── CATEGORY PALETTE ─────────────────────────────────────────────
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

// ── CONSENSUS BAR ────────────────────────────────────────────────
const ConsensusBar = ({ consensus }) => {
  const { t } = useTranslation();
  const p = consensus ?? 0, imp = 100 - p, pos = p >= 50;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Inter', sans-serif", color: pos ? SEMANTIC.green : SEMANTIC.red, letterSpacing: '-.03em', lineHeight: 1 }}>{p}%</span>
          <span style={{ fontSize: 9, color: 'var(--hdr-text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('event.probable_label')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--hdr-text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('event.improbable_label')}</span>
          <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Inter', sans-serif", color: imp > p ? SEMANTIC.red : 'var(--hdr-text-muted)', letterSpacing: '-.03em', lineHeight: 1 }}>{imp}%</span>
        </div>
      </div>
      <div style={{ height: 4, background: 'var(--hdr-surface-alt)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${p}%`, background: pos ? `linear-gradient(to right,${SEMANTIC.green},#34D399)` : `linear-gradient(to right,${SEMANTIC.red},#F87171)`, borderRadius: 2, transition: 'width .9s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  );
};

// ── NOUVELLE DISCUSSION PREVIEW (inspirée X/Perplexity) ──────────
const DiscussionPreview = ({ eventId, discussionCount }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasDiscussions = discussionCount > 0;

  // Mock data avec noms et avatars plus réalistes
  const mockComments = hasDiscussions ? [
    { id: 1, user: 'Marie L.', text: 'Les indicateurs sont au vert, je pense que c\'est probable.', time: '2h', avatar: 'ML', verified: true },
    { id: 2, user: 'EcoAnalyst', text: 'Le consensus surestime un peu, à mon avis.', time: '5h', avatar: 'EA' },
    { id: 3, user: 'PolitiK_Haiti', text: 'À suivre de près la semaine prochaine.', time: '1j', avatar: 'PH' },
  ] : [];

  const goToDiscussion = () => navigate(`/discussions/`);

  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid var(--hdr-border)` }}>
      {hasDiscussions ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChatBubbleLeftRightIcon style={{ width: 15, height: 15, color: 'var(--hdr-text-muted)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif" }}>
                {discussionCount} {t('event.discussions_active')}
              </span>
            </div>
            {discussionCount > 2 && (
              <button onClick={goToDiscussion} style={{ fontSize: 11, color: 'var(--hdr-accent)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }} aria-label={t('event.view_all_discussions')}>
                {t('event.view_all')} <ArrowRightIcon style={{ width: 12, height: 12 }} />
              </button>
            )}
          </div>
          <div onClick={goToDiscussion} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockComments.slice(0, 2).map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', 
                    background: '#E5E7EB', // gris pâle (Tailwind gray-200)
                    color: '#6B7280', // texte plus foncé pour contraste
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                    {c.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif" }}>{c.user}</span>
                      {c.verified && <CheckCircleIcon style={{ width: 12, height: 12, color: SEMANTIC.green }} />}
                      <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--hdr-text-sub)', margin: 0, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button onClick={goToDiscussion} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '10px', borderRadius: 10, border: `1px dashed var(--hdr-border)`, background: 'var(--hdr-surface-alt)', color: 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }} aria-label={t('event.start_discussion')}>
          <ChatBubbleOvalLeftEllipsisIcon style={{ width: 15, height: 15 }} />
          {t('event.start_discussion')}
        </button>
      )}
    </div>
  );
};

// ── EVENT CARD (adaptée avec meilleure gestion de l'espace) ─────
const EventCard = ({ event, userVote, onVote, onDetails, onAnalysis }) => {
  const { t } = useTranslation();
  const getCategoryName = (cat) => {
    if (!cat) return 'general';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object') return cat.name || 'general';
    return 'general';
  };

  const categoryName = getCategoryName(event.category);
  const pal = gcp(categoryName);
  const isVoted = userVote !== undefined && userVote !== null;
  const discussionCount = Math.floor(Math.random() * 15); // Temporaire, à remplacer par vraie donnée

  return (
    <article className="event-card" style={{
      background: 'var(--hdr-surface)',
      borderRadius: 12,
      border: '1px solid var(--hdr-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all .18s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,.02)',
    }}>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", background: pal.bg, color: pal.text, border: `1px solid ${pal.border}` }}>
            {gci(event.category)} {event.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {event.status === 'urgent' && <span style={{ fontSize: 9, fontWeight: 700, color: SEMANTIC.red, fontFamily: "'Inter', sans-serif", letterSpacing: '.04em', display: 'flex', alignItems: 'center', gap: 2 }}><BoltIcon style={{ width: 10, height: 10 }} />{t('event.urgent')}</span>}
            {event.trend === 'up' && <ArrowTrendingUpIcon style={{ width: 14, height: 14, color: SEMANTIC.green }} />}
            {event.trend === 'down' && <ArrowTrendingDownIcon style={{ width: 14, height: 14, color: SEMANTIC.red }} />}
          </div>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: 'var(--hdr-text)', margin: '0 0 8px', fontFamily: "'Inter', sans-serif", letterSpacing: '-.01em' }}>{event.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--hdr-text-sub)', lineHeight: 1.5, margin: '0 0 12px', flex: 1, fontFamily: "'Inter', sans-serif" }}>{event.description}</p>
        <ConsensusBar consensus={event.currentConsensus} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
          {[
            { labelKey: 'event.participants_short', v: fmt(event.participants) },
            { labelKey: 'event.ia_conf_short', v: `${Math.round((event.iaConfidence || 0) * 100)}%` },
            { labelKey: 'event.days_short', v: event.daysLeft ?? '—' }
          ].map(m => (
            <div key={m.labelKey} style={{ background: 'var(--hdr-surface-alt)', borderRadius: 6, padding: '8px 4px', textAlign: 'center', border: `1px solid var(--hdr-border)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: 'var(--hdr-text)', lineHeight: 1 }}>{m.v}</div>
              <div style={{ fontSize: 9, color: 'var(--hdr-text-muted)', marginTop: 2, letterSpacing: '.04em', fontFamily: "'Inter', sans-serif" }}>{t(m.labelKey)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
          <button onClick={() => onVote(event.id, 'yes')} disabled={isVoted} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 4px', borderRadius: 8, border: userVote === 'yes' ? `1.5px solid ${SEMANTIC.greenBorder}` : `1px solid var(--hdr-border)`, background: userVote === 'yes' ? SEMANTIC.greenSoft : 'var(--hdr-surface)', color: userVote === 'yes' ? SEMANTIC.green : 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: isVoted ? 'default' : 'pointer', opacity: isVoted && userVote !== 'yes' ? 0.5 : 1, transition: 'all .15s' }} aria-label={t('event.vote_yes')}>
            <CheckCircleIcon style={{ width: 14, height: 14 }} />{t('event.probable')}
          </button>
          <button onClick={() => onVote(event.id, 'no')} disabled={isVoted} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 4px', borderRadius: 8, border: userVote === 'no' ? `1.5px solid ${SEMANTIC.redBorder}` : `1px solid var(--hdr-border)`, background: userVote === 'no' ? SEMANTIC.redSoft : 'var(--hdr-surface)', color: userVote === 'no' ? SEMANTIC.red : 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: isVoted ? 'default' : 'pointer', opacity: isVoted && userVote !== 'no' ? 0.5 : 1, transition: 'all .15s' }} aria-label={t('event.vote_no')}>
            <XCircleIcon style={{ width: 14, height: 14 }} />{t('event.improbable')}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button onClick={() => onAnalysis(event.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '9px 4px', borderRadius: 8, border: `1px solid var(--hdr-border)`, background: 'var(--hdr-surface-alt)', color: 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'all .15s' }} aria-label={t('event.ai_analysis')}>
            <CpuChipIcon style={{ width: 12, height: 12 }} />{t('event.ai_analysis')}
          </button>
          <button onClick={() => onDetails(event.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '9px 4px', borderRadius: 8, border: `1px solid var(--hdr-border)`, background: 'var(--hdr-surface)', color: 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'all .15s' }} aria-label={t('event.details')}>
            <DocumentTextIcon style={{ width: 12, height: 12 }} />{t('event.details')}
          </button>
        </div>
        {isVoted && <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10, color: SEMANTIC.green, fontFamily: "'Inter', sans-serif", letterSpacing: '.04em' }}>✓ {t('event.vote_recorded')}</div>}
        <DiscussionPreview eventId={event.id} discussionCount={discussionCount} />
      </div>
    </article>
  );
};

// ─── FILTER RAIL (avec top sticky personnalisable) ─────────────────
// Modifiez la valeur ci-dessous pour ajuster la hauteur du bandeau de filtre collé
const STICKY_TOP_OFFSET = 15; // en px (mettre 60 si un header fixe existe)

const FilterRail = ({ categories, filter, setFilter, t }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      {showLeftArrow && (
        <button onClick={() => scroll('left')} className="filter-arrow" style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }} aria-label={t('filter.scroll_left')}>
          <ChevronLeftIcon style={{ width: 16, height: 16 }} />
        </button>
      )}
      <div ref={scrollRef} onScroll={checkScroll} className="filter-rail" style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', paddingBottom: 4, flex: 1 }} role="tablist" aria-label={t('filter.categories')}>
        {categories.map(cat => {
          const pal = gcp(cat.label);
          const active = filter === cat.id;
          return (
            <button key={cat.id} onClick={() => setFilter(cat.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, border: active ? `1.5px solid ${pal.bar}` : '1px solid var(--hdr-border)', background: active ? pal.bg : 'var(--hdr-surface)', color: active ? pal.text : 'var(--hdr-text-sub)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', scrollSnapAlign: 'start', transition: 'all .15s', flexShrink: 0 }} role="tab" aria-selected={active} aria-label={`${cat.label} (${cat.count})`}>
              {cat.icon}
              {cat.label}
              {cat.count > 0 && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 12, background: active ? 'rgba(0,0,0,.06)' : 'var(--hdr-surface-alt)', color: active ? pal.text : 'var(--hdr-text-muted)' }}>{cat.count}</span>}
            </button>
          );
        })}
      </div>
      {showRightArrow && (
        <button onClick={() => scroll('right')} className="filter-arrow" style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }} aria-label={t('filter.scroll_right')}>
          <ChevronRightIcon style={{ width: 16, height: 16 }} />
        </button>
      )}
    </div>
  );
};

// ─── WHAT'S HAPPENING NOW RAIL ──────────────────────────────────
const HappeningNowRail = ({ happeningItems, loading, navigate }) => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
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
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif", margin: 0 }}>{t('happening.title')}</h2>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 6px ${SEMANTIC.green}` }} />
      </div>
      <SkeletonRail />
    </section>
  );
  if (!happeningItems || happeningItems.length === 0) return (
    <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }} aria-label={t('happening.section_label')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <GlobeAltIcon style={{ width: 16, height: 16, color: SEMANTIC.green }} />
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif", margin: 0 }}>{t('happening.title')}</h2>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 6px ${SEMANTIC.green}` }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--hdr-text-muted)', fontFamily: "'Inter', sans-serif" }}>{t('happening.no_events')}</p>
    </section>
  );
  return (
    <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }} aria-label={t('happening.section_label')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <GlobeAltIcon style={{ width: 16, height: 16, color: SEMANTIC.green }} />
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif", margin: 0 }}>{t('happening.title')}</h2>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 6px ${SEMANTIC.green}` }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showLeftArrow && (
          <button onClick={() => scroll('left')} className="rail-arrow" style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }} aria-label={t('common.scroll_left')}>
            <ChevronLeftIcon style={{ width: 16, height: 16 }} />
          </button>
        )}
        <div ref={scrollRef} onScroll={checkScroll} className="horizontal-rail" style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', paddingBottom: 8, flex: 1 }} aria-label={t('happening.rail_label')}>
          {happeningItems.map(item => (
            <div key={item.id} onClick={() => navigate(`/event/${item.id}`)} className="happening-card" style={{ background: 'var(--hdr-surface)', borderRadius: 12, border: '1px solid var(--hdr-border)', padding: '14px 18px', minWidth: 240, maxWidth: 300, flexShrink: 0, scrollSnapAlign: 'start', cursor: 'pointer', transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hdr-accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hdr-border)'} role="button" tabIndex={0} aria-label={`${item.title} - ${item.currentConsensus}% ${t('event.probable_short')}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/event/${item.id}`); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <ClockIcon style={{ width: 12, height: 12, color: 'var(--hdr-text-muted)' }} />
                <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)', fontFamily: "'Inter', sans-serif" }}>{item.timeAgo || t('common.just_now')}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--hdr-text)', margin: '0 0 8px', lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>{item.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: SEMANTIC.green, fontFamily: "'Inter', sans-serif" }}>{item.currentConsensus}% {t('event.probable_short')}</span>
                <span style={{ fontSize: 11, color: 'var(--hdr-text-muted)', fontFamily: "'Inter', sans-serif" }}>{fmt(item.participants)} {t('event.participants_short')}</span>
              </div>
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button onClick={() => scroll('right')} className="rail-arrow" style={{ background: 'var(--hdr-surface)', border: '1px solid var(--hdr-border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hdr-text-sub)', flexShrink: 0 }} aria-label={t('common.scroll_right')}>
            <ChevronRightIcon style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </section>
  );
};

// ─── SKELETON RAIL ───────────────────────────────────────────────
const SkeletonRail = () => (
  <div style={{ display: 'flex', gap: 12, overflow: 'hidden', paddingBottom: 8 }}>
    {[1,2,3].map(i => (
      <div key={i} style={{ minWidth: 240, maxWidth: 300, background: 'var(--hdr-surface)', borderRadius: 12, border: '1px solid var(--hdr-border)', padding: '14px 18px', flexShrink: 0, animation: 'skeletonPulse 1.5s infinite' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><div style={{ width: 12, height: 12, background: 'var(--hdr-border)', borderRadius: '50%' }} /><div style={{ width: 40, height: 10, background: 'var(--hdr-border)', borderRadius: 4 }} /></div>
        <div style={{ height: 20, width: '80%', background: 'var(--hdr-border)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 8 }}><div style={{ width: 50, height: 16, background: 'var(--hdr-border)', borderRadius: 4 }} /><div style={{ width: 40, height: 12, background: 'var(--hdr-border)', borderRadius: 4 }} /></div>
      </div>
    ))}
  </div>
);

// ─── HOW IT WORKS ─────────────────────────────────────────────────
const HowItWorks = ({ t, navigate }) => {
  const steps = [
    { icon: <CheckCircleIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step1', path: '/how-it-works' },
    { icon: <ChatBubbleLeftRightIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step2', path: '/how-it-works' },
    { icon: <CpuChipIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step3', path: '/how-it-works' },
    { icon: <SparklesIcon style={{ width: 18, height: 18 }} />, labelKey: 'how.step4', path: '/how-it-works' },
  ];
  return (
    <section style={{ marginTop: 48, padding: '24px 0', borderTop: '1px solid var(--hdr-border)', borderBottom: '1px solid var(--hdr-border)' }} aria-label={t('how.section_label')}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif", margin: '0 0 16px 0' }}>{t('how.title')}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate(step.path)} role="button" tabIndex={0} aria-label={t(step.labelKey)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(step.path); }}>
            <span style={{ color: 'var(--hdr-text-muted)' }}>{step.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif" }}>{t(step.labelKey)}</span>
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
  @keyframes skeletonPulse{0%{opacity:.6}50%{opacity:.3}100%{opacity:.6}}
  *{box-sizing:border-box}
  body{background:var(--hdr-bg)!important; color:var(--hdr-text); font-family:'Inter',sans-serif;}
  /* MARGES HORIZONTALES : réglez ces valeurs pour ajuster l'espace latéral de tout le contenu après le hero */
  .content-container{max-width:1440px; margin:0 auto; padding-left:16px; padding-right:16px;} /* mobile par défaut 16px */
  @media(min-width:768px){.content-container{padding-left:24px; padding-right:24px;}}   /* desktop 24px */
  .filter-rail::-webkit-scrollbar{display:none}
  .horizontal-rail::-webkit-scrollbar{display:none}
  .hero-scroll::-webkit-scrollbar{display:none}
  @media(max-width:767px){
    .event-card{border:none!important; box-shadow:none!important; border-radius:0!important;}
    .happening-card{border:none!important; box-shadow:none!important;}
    .desktop-nav{display:none!important;}
    .mobile-dots{display:flex!important;}
    .rail-arrow{display:none!important;}
  }
  @media(min-width:768px){.mobile-dots{display:none!important;}}
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

// ─── SKELETON CARD ───────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{ background: 'var(--hdr-surface)', borderRadius: 12, border: '1px solid var(--hdr-border)', padding: 16, height: '100%', animation: 'skeletonPulse 1.5s infinite' }}>
    <div style={{ height: 24, width: '30%', background: 'var(--hdr-border)', borderRadius: 6, marginBottom: 12 }} />
    <div style={{ height: 20, width: '90%', background: 'var(--hdr-border)', borderRadius: 6, marginBottom: 8 }} />
    <div style={{ height: 20, width: '80%', background: 'var(--hdr-border)', borderRadius: 6, marginBottom: 16 }} />
    <div style={{ height: 6, background: 'var(--hdr-border)', borderRadius: 3, marginBottom: 12 }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
      <div style={{ height: 48, background: 'var(--hdr-border)', borderRadius: 6 }} />
      <div style={{ height: 48, background: 'var(--hdr-border)', borderRadius: 6 }} />
      <div style={{ height: 48, background: 'var(--hdr-border)', borderRadius: 6 }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
      <div style={{ height: 40, background: 'var(--hdr-border)', borderRadius: 8 }} />
      <div style={{ height: 40, background: 'var(--hdr-border)', borderRadius: 8 }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
      <div style={{ height: 40, background: 'var(--hdr-border)', borderRadius: 8 }} />
      <div style={{ height: 40, background: 'var(--hdr-border)', borderRadius: 8 }} />
    </div>
  </div>
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

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    stats,
    refresh: refreshEvents,
    submitVote,
  } = useEvents({ category: filter !== 'all' ? filter : undefined, limit: 100, autoRefresh: false });
  const { categories: apiCategories } = useCategories();
  const { dashboard: _, loading: dashboardLoading } = useDashboard();

  // Changement de langue → recharger les événements, happening, insights
  useEffect(() => {
    refreshEvents();
    loadHappening();
    loadInsights();
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHappening = async () => {
    setHappeningLoading(true);
    try {
      const data = await fetchHappening();
      setHappeningItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Happening fetch error:', e);
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
      console.error('Insights fetch error:', e);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setVisibleLimit(24);
  }, [filter, sortBy, searchQuery]);

  // Catégories avec traduction immédiate
  const categories = [
    { id: 'all', label: t('filter.all'), icon: <FireIcon className="w-3 h-3" />, count: stats.total },
    ...apiCategories.map(cat => ({
      id: cat.id.toString(),
      label: t(`categories.${cat.slug}`, { defaultValue: cat.name.toUpperCase() }),
      icon: gci(cat.name),
      count: events.filter(e => e.category === cat.name).length,
    })),
  ];

  const handleVote = async (eventId, vote) => {
    setUserVotes(p => ({ ...p, [eventId]: vote }));
    try {
      const ok = await submitVote(eventId, vote);
      if (!ok) setUserVotes(p => { const n = { ...p }; delete n[eventId]; return n; });
    } catch {
      setUserVotes(p => { const n = { ...p }; delete n[eventId]; return n; });
    }
  };

  const filtered = events
    .filter(e => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'consensus') return b.currentConsensus - a.currentConsensus;
      if (sortBy === 'participants') return b.participants - a.participants;
      if (sortBy === 'urgency') return (b.status === 'urgent' ? 1 : 0) - (a.status === 'urgent' ? 1 : 0);
      if (sortBy === 'trending') {
        const score = (t) => t === 'up' ? 1 : t === 'down' ? -1 : 0;
        return score(b.trend) - score(a.trend);
      }
      return 0;
    });

  const visibleEvents = filtered.slice(0, visibleLimit);
  const hasMore = visibleLimit < filtered.length;
  const loadMore = () => setVisibleLimit(prev => Math.min(prev + 24, filtered.length));

  if (eventsLoading && events.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{globalCSS}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 26, height: 26, border: '2px solid var(--hdr-border)', borderTopColor: 'var(--hdr-text)', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ fontSize: 12, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif" }}>{t('common.loading')}</p>
      </div>
    </div>
  );
  if (eventsError && events.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{globalCSS}</style>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <ExclamationTriangleIcon style={{ width: 28, height: 28, color: SEMANTIC.red, margin: '0 auto 12px' }} />
        <p style={{ fontSize: 12, color: 'var(--hdr-text-muted)', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>{eventsError}</p>
        <button onClick={refreshEvents} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--hdr-accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }} aria-label={t('common.retry')}>{t('common.retry')}</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)' }}>
      <style>{globalCSS}</style>

      {isMockMode && (
        <div style={{ background: SEMANTIC.amberSoft, borderBottom: `1px solid ${SEMANTIC.amberBorder}`, padding: '5px 0' }}>
          <div className="content-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: SEMANTIC.amber, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Inter', sans-serif" }}>
              <ExclamationTriangleIcon style={{ width: 12, height: 12 }} />{t('common.mock_mode')}
            </span>
            <button onClick={() => { toggleMockData(false); window.location.reload(); }} style={{ fontSize: 11, color: SEMANTIC.amber, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Inter', sans-serif" }} aria-label={t('common.switch_to_real')}>
              {t('common.switch_to_real')}
            </button>
          </div>
        </div>
      )}

      <HeroCarousel stats={stats} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <StatsStrip stats={stats} />

      <main style={{ paddingBottom: 60 }}>
        <div className="content-container">
          {/* Sticky filter – réglez STICKY_TOP_OFFSET ci-dessus pour décaler la barre si nécessaire */}
          <div style={{ position: 'sticky', top: STICKY_TOP_OFFSET, zIndex: 10, background: 'var(--hdr-bg)', padding: '12px 0 4px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--hdr-text-muted)', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                {t('filter.filter_by')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: '1px solid var(--hdr-border)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--hdr-text)', background: 'var(--hdr-surface)', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }} aria-label={t('filter.sort_by')}>
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
            <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : visibleEvents.length > 0 ? (
            <>
              <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {visibleEvents.map((event, i) => (
                  <div key={event.id} style={{ animation: `cardIn .4s ease ${i * 0.03}s both` }}>
                    <EventCard event={event} userVote={userVotes[event.id]} onVote={handleVote} onDetails={id => navigate(`/event/${id}`)} onAnalysis={id => navigate(`/ai-analysis/${id}`)} />
                  </div>
                ))}
              </div>
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button onClick={loadMore} style={{ padding: '10px 32px', borderRadius: 30, border: '1px solid var(--hdr-border)', background: 'var(--hdr-surface)', color: 'var(--hdr-text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all .15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hdr-surface-alt)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--hdr-surface)'} aria-label={t('common.load_more')}>
                    {t('common.load_more')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '72px 20px', background: 'var(--hdr-surface)', borderRadius: 12, border: '1px solid var(--hdr-border)' }}>
              <MagnifyingGlassIcon style={{ width: 32, height: 32, color: 'var(--hdr-text-muted)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--hdr-text)', marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{searchQuery ? t('common.no_results') : t('common.no_events')}</p>
              <p style={{ fontSize: 13, color: 'var(--hdr-text-muted)', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>{searchQuery ? t('common.modify_criteria') : t('common.events_soon')}</p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--hdr-border)', background: 'var(--hdr-text)', color: 'var(--hdr-bg)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }} aria-label={t('common.clear_search')}>
                  {t('common.clear')}
                </button>
              )}
            </div>
          )}

          <HappeningNowRail happeningItems={happeningItems} loading={happeningLoading} navigate={navigate} />
          <HowItWorks t={t} navigate={navigate} />

          {/* INSIGHTS SECTION – 2 colonnes sur mobile personnalisable */}
          {insightLoading ? (
            <section style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif", margin: 0 }}>{t('insights.title')}</h2>
              </div>
              <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background: 'var(--hdr-surface)', borderRadius: 10, border: '1px solid var(--hdr-border)', padding: '16px', animation: 'skeletonPulse 1.5s infinite' }}>
                    <div style={{ height: 20, width: '40%', background: 'var(--hdr-border)', borderRadius: 4, marginBottom: 12 }} />
                    <div style={{ height: 24, width: '80%', background: 'var(--hdr-border)', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 40, width: '100%', background: 'var(--hdr-border)', borderRadius: 4 }} />
                  </div>
                ))}
              </div>
            </section>
          ) : insightItems.length > 0 ? (
            <section style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--hdr-border)' }} aria-label={t('insights.section_label')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Inter', sans-serif", margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CpuChipIcon style={{ width: 16, height: 16, color: 'var(--hdr-accent)' }} />{t('insights.title')}
                </h2>
                <button onClick={() => navigate('/insights')} style={{ fontSize: 11, color: 'var(--hdr-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontFamily: "'Inter', sans-serif" }} aria-label={t('insights.view_all')}>
                  {t('insights.view_all')}<ChevronRightIcon style={{ width: 12, height: 12 }} />
                </button>
              </div>
              {/* Grille responsive : 2 colonnes sur mobile, auto-fill ensuite */}
              <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                {insightItems.slice(0, 3).map(insight => (
                  <div key={insight.id} style={{ background: 'var(--hdr-surface)', borderRadius: 10, border: '1px solid var(--hdr-border)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, fontFamily: "'Inter', sans-serif", background: insight.impact_level === 'high' ? SEMANTIC.redSoft : insight.impact_level === 'medium' ? SEMANTIC.amberSoft : 'var(--hdr-accent-soft)', color: insight.impact_level === 'high' ? SEMANTIC.red : insight.impact_level === 'medium' ? SEMANTIC.amber : 'var(--hdr-accent)' }}>
                        {insight.category?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--hdr-text-muted)', fontFamily: "'Inter', sans-serif" }}>{insight.confidence}% {t('insights.confidence')}</span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)', margin: '0 0 6px', lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>{insight.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--hdr-text-sub)', margin: '0 0 12px', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{insight.description}</p>
                    <div style={{ fontSize: 10, color: 'var(--hdr-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif" }}>
                      <SignalIcon style={{ width: 12, height: 12 }} />
                      {t('insights.based_on', { count: insight.sources_count || 3 })} · {t('insights.cross_sources')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--hdr-border)', textAlign: 'center' }}>
            <button onClick={() => navigate('/submit-event')} style={{ padding: '12px 32px', borderRadius: 30, border: 'none', background: 'var(--cta-button-bg, #111827)', color: 'var(--cta-button-text, #FFFFFF)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif", transition: 'all .2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--cta-button-hover, #374151)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--cta-button-bg, #111827)'} aria-label={t('cta.propose_event')}>
              <FireIcon style={{ width: 14, height: 14 }} />{t('cta.propose_event')}
            </button>
            <p style={{ fontSize: 11, color: 'var(--hdr-text-muted)', marginTop: 8, fontFamily: "'Inter', sans-serif" }}>{t('cta.subtitle')}</p>
          </section>
        </div>
      </main>

      <style>{`
        @media(max-width:1024px){
          .events-grid{grid-template-columns:repeat(2,1fr)!important;}
        }
        @media(max-width:640px){
          .events-grid{grid-template-columns:1fr!important;}
          /* Force 2 colonnes pour les insights sur mobile */
          .insights-grid{grid-template-columns:repeat(2,1fr)!important;}
        }
      `}</style>
    </div>
  );
};

export default HomePage;