// ═══════════════════════════════════════════════════════════════
// PICH AI — HomePage.jsx (with Hero Carousel)
// Dynamic theme · Uniform card height · i18n ready (fr/ht)
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
} from '@heroicons/react/24/outline';
import { useEvents, useCategories, useDashboard, useUser } from '../hooks/useApi';
import { getMockMode } from '../services/api';

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

// ── SLIDES (keys only, content will be translated) ───────────────
const SLIDES = [
  {
    id: 1,
    eyebrowKey: 'hero.slide1.eyebrow',
    headlineKey: 'hero.slide1.headline',
    subKey: 'hero.slide1.sub',
    ctaKey: 'hero.slide1.cta',
    ctaHref: '/',
    accent: '#4A9EFF',
    bg: 'linear-gradient(135deg, #040C1E 0%, #071530 50%, #0A1E42 100%)',
    pattern: 'grid',
    statValue: '2,400+',
    statLabelKey: 'hero.slide1.statLabel',
  },
  {
    id: 2,
    eyebrowKey: 'hero.slide2.eyebrow',
    headlineKey: 'hero.slide2.headline',
    subKey: 'hero.slide2.sub',
    ctaKey: 'hero.slide2.cta',
    ctaHref: '/predictions',
    accent: '#00D68F',
    bg: 'linear-gradient(135deg, #020F0A 0%, #041A10 50%, #063020 100%)',
    pattern: 'nodes',
    statValue: '94%',
    statLabelKey: 'hero.slide2.statLabel',
  },
  {
    id: 3,
    eyebrowKey: 'hero.slide3.eyebrow',
    headlineKey: 'hero.slide3.headline',
    subKey: 'hero.slide3.sub',
    ctaKey: 'hero.slide3.cta',
    ctaHref: '/ai-insights',
    accent: '#A78BFA',
    bg: 'linear-gradient(135deg, #08040F 0%, #100520 50%, #180835 100%)',
    pattern: 'hex',
    statValue: '12ms',
    statLabelKey: 'hero.slide3.statLabel',
  },
  {
    id: 4,
    eyebrowKey: 'hero.slide4.eyebrow',
    headlineKey: 'hero.slide4.headline',
    subKey: 'hero.slide4.sub',
    ctaKey: 'hero.slide4.cta',
    ctaHref: '/dashboard',
    accent: '#FF6B6B',
    bg: 'linear-gradient(135deg, #0F0404 0%, #1A0606 50%, #2A0A0A 100%)',
    pattern: 'pulse',
    statValue: '38',
    statLabelKey: 'hero.slide4.statLabel',
  },
];

// ── PATTERNS SVG (unchanged) ─────────────────────────────────────
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
    {[[150, 80, 380, 180], [380, 180, 620, 100], [620, 100, 860, 240], [860, 240, 1080, 140], [380, 180, 520, 340], [620, 100, 720, 290], [860, 240, 940, 400], [150, 80, 280, 260], [280, 260, 520, 340], [720, 290, 940, 400]].map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth="1" opacity=".4" />
    ))}
    {[[150, 80], [380, 180], [620, 100], [860, 240], [1080, 140], [280, 260], [520, 340], [720, 290], [940, 400]].map(([x, y], i) => (
      <g key={i}><circle cx={x} cy={y} r="10" fill="none" stroke={a} strokeWidth="1" opacity=".28" /><circle cx={x} cy={y} r="3.5" fill={a} opacity=".9" /></g>
    ))}
  </svg>
);
const PatternHex = ({ a }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.11 }} preserveAspectRatio="xMidYMid slice">
    <defs><pattern id="ph" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse"><polygon points="40,4 76,24 76,68 40,88 4,68 4,24" fill="none" stroke={a} strokeWidth=".8" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#ph)" />
  </svg>
);
const PatternPulse = ({ a }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.13 }} preserveAspectRatio="xMidYMid slice">
    {[60, 130, 200, 280, 360, 440, 520].map((r, i) => (
      <circle key={i} cx="78%" cy="50%" r={r} fill="none" stroke={a} strokeWidth=".8" opacity={1 - i * 0.12} />
    ))}
    <defs><pattern id="pp" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke={a} strokeWidth=".3" opacity=".4" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#pp)" opacity=".45" />
  </svg>
);
const SlidePattern = ({ type, a }) => {
  if (type === 'grid') return <PatternGrid a={a} />;
  if (type === 'nodes') return <PatternNodes a={a} />;
  if (type === 'hex') return <PatternHex a={a} />;
  if (type === 'pulse') return <PatternPulse a={a} />;
  return null;
};

// ── HERO CAROUSEL (i18n adapted) ─────────────────────────────────
const HeroCarousel = ({ stats, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('home');
  const [cur, setCur] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const timer = useRef(null);

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

  const s = SLIDES[cur];
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: s.bg, minHeight: 520, display: 'flex', flexDirection: 'column', transition: 'background 1s ease' }}>
      <SlidePattern type={s.pattern} a={s.accent} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom,transparent,rgba(248,250,252,0.08))', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '60px 28px 56px', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 720 }}>
          <div key={`ey${cur}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22, animation: 'slideUp .55s cubic-bezier(.22,1,.36,1) both' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.accent, boxShadow: `0 0 14px ${s.accent},0 0 28px ${s.accent}40` }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.65)', fontFamily: "'Space Mono',monospace", letterSpacing: '.14em', textTransform: 'uppercase' }}>
              {t(s.eyebrowKey)}
            </span>
          </div>
          <h2 key={`h${cur}`} style={{ fontSize: 'clamp(38px,5.5vw,70px)', fontWeight: 800, lineHeight: 1.06, color: '#fff', fontFamily: "'Inter',sans-serif", margin: '0 0 20px', letterSpacing: '-.035em', whiteSpace: 'pre-line', animation: 'slideUp .6s cubic-bezier(.22,1,.36,1) .07s both' }}>
            {t(s.headlineKey)}
          </h2>
          <p key={`sub${cur}`} style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: 'rgba(255,255,255,.58)', lineHeight: 1.72, maxWidth: 500, margin: '0 0 34px', animation: 'slideUp .6s cubic-bezier(.22,1,.36,1) .13s both' }}>
            {t(s.subKey)}
          </p>
          <div key={`cta${cur}`} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', animation: 'slideUp .6s cubic-bezier(.22,1,.36,1) .2s both' }}>
            <button onClick={() => navigate(s.ctaHref)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 7, background: '#fff', color: 'var(--hdr-text)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter',sans-serif", letterSpacing: '-.01em', boxShadow: '0 4px 20px rgba(0,0,0,.25)', transition: 'all .2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.25)'; }}>
              {t(s.ctaKey)} <ArrowRightIcon style={{ width: 14, height: 14 }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderRadius: 7, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Space Mono',monospace", letterSpacing: '-.02em', lineHeight: 1 }}>{s.statValue}</span>
              <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)', display: 'block' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{t(s.statLabelKey)}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ position: 'relative', flex: '0 1 500px', minWidth: 240 }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,.38)' }} />
            <input type="text" placeholder={t('hero.search_placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 12, paddingBottom: 12, border: '1px solid rgba(255,255,255,.14)', borderRadius: 8, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,.07)', outline: 'none', fontFamily: "'Inter',sans-serif", backdropFilter: 'blur(10px)', transition: 'border-color .2s,background .2s' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,.38)'; e.target.style.background = 'rgba(255,255,255,.11)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.14)'; e.target.style.background = 'rgba(255,255,255,.07)'; }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => manual((cur - 1 + SLIDES.length) % SLIDES.length)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}>
              <ChevronLeftIcon style={{ width: 14, height: 14 }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => manual(i)} style={{ padding: 0, border: 'none', cursor: 'pointer', background: 'none', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: i === cur ? 28 : 7, height: 7, borderRadius: 4, background: i === cur ? '#fff' : 'rgba(255,255,255,.28)', transition: 'all .35s cubic-bezier(.4,0,.2,1)' }} />
                </button>
              ))}
            </div>
            <button onClick={() => manual((cur + 1) % SLIDES.length)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}>
              <ChevronRightIcon style={{ width: 14, height: 14 }} />
            </button>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontFamily: "'Space Mono',monospace", letterSpacing: '.08em' }}>
              {String(cur + 1).padStart(2, '0')}/{String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,.08)' }}>
        <div key={`prog${cur}`} style={{ height: '100%', background: s.accent, animation: isAuto ? 'progress 5.8s linear forwards' : 'none' }} />
      </div>
    </section>
  );
};

// ── STATS STRIP (i18n) ───────────────────────────────────────────
const StatsStrip = ({ stats }) => {
  const { t } = useTranslation();
  return (
    <div style={{ background: 'var(--hdr-surface)', borderBottom: `1px solid var(--hdr-border)` }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
        {[
          { labelKey: 'stats.active_events', value: stats.total ?? 0, color: 'var(--hdr-accent)', icon: <FireIcon style={{ width: 13, height: 13 }} /> },
          { labelKey: 'stats.participants', value: stats.totalParticipants >= 1000 ? `${(stats.totalParticipants / 1000).toFixed(1)}k` : String(stats.totalParticipants ?? 0), color: SEMANTIC.green, icon: <UsersIcon style={{ width: 13, height: 13 }} /> },
          { labelKey: 'stats.avg_consensus', value: `${stats.averageConsensus ?? 0}%`, color: 'var(--hdr-text-sub)', icon: <ChartBarIcon style={{ width: 13, height: 13 }} /> },
          { labelKey: 'stats.urgent', value: stats.urgentCount ?? 0, color: SEMANTIC.red, icon: <BoltIcon style={{ width: 13, height: 13 }} /> },
        ].map((s, i) => (
          <div key={s.labelKey} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', flex: '1 1 150px', borderRight: i < 3 ? `1px solid var(--hdr-border)` : 'none' }}>
            <span style={{ color: s.color }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "'Space Mono',monospace", lineHeight: 1, letterSpacing: '-.02em' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--hdr-text-muted)', marginTop: 2 }}>{t(s.labelKey)}</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 22px', marginLeft: 'auto', borderLeft: `1px solid var(--hdr-border)`, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: SEMANTIC.green, boxShadow: `0 0 8px ${SEMANTIC.green}` }} />
          <span style={{ fontSize: 9, color: SEMANTIC.green, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: '.1em' }}>{t('stats.live')}</span>
        </div>
      </div>
    </div>
  );
};

// ── CATEGORY PALETTE (fixed colors) ──────────────────────────────
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

// ── CONSENSUS BAR (i18n) ─────────────────────────────────────────
const ConsensusBar = ({ consensus }) => {
  const { t } = useTranslation();
  const p = consensus ?? 0, imp = 100 - p, pos = p >= 50;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Space Mono',monospace", color: pos ? SEMANTIC.green : SEMANTIC.red, letterSpacing: '-.03em', lineHeight: 1 }}>{p}%</span>
          <span style={{ fontSize: 9, color: 'var(--hdr-text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('event.probable_label')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--hdr-text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('event.improbable_label')}</span>
          <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Space Mono',monospace", color: imp > p ? SEMANTIC.red : 'var(--hdr-text-muted)', letterSpacing: '-.03em', lineHeight: 1 }}>{imp}%</span>
        </div>
      </div>
      <div style={{ height: 3, background: 'var(--hdr-surface-alt)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${p}%`, background: pos ? `linear-gradient(to right,${SEMANTIC.green},#34D399)` : `linear-gradient(to right,${SEMANTIC.red},#F87171)`, borderRadius: 2, transition: 'width .9s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  );
};

// ── EVENT CARD (i18n) ────────────────────────────────────────────
const EventCard = ({ event, userVote, onVote, onDetails, onAnalysis }) => {
  const { t } = useTranslation();
  const pal = gcp(event.category), isVoted = userVote !== undefined;
  return (
    <article style={{
      background: 'var(--hdr-surface)',
      borderRadius: 10,
      border: `1px solid var(--hdr-border)`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all .18s ease',
      boxShadow: '0 1px 4px rgba(10,15,30,.04)'
    }}>
      <div style={{ padding: '14px 14px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', fontFamily: "'Space Mono',monospace", background: pal.bg, color: pal.text, border: `1px solid ${pal.border}` }}>
            {gci(event.category)} {event.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {event.status === 'urgent' && <span style={{ fontSize: 8, fontWeight: 700, color: SEMANTIC.red, fontFamily: "'Space Mono',monospace", letterSpacing: '.08em', display: 'flex', alignItems: 'center', gap: 2 }}><BoltIcon style={{ width: 8, height: 8 }} />{t('event.urgent')}</span>}
            {event.trend === 'up' && <ArrowTrendingUpIcon style={{ width: 13, height: 13, color: SEMANTIC.green }} />}
            {event.trend === 'down' && <ArrowTrendingDownIcon style={{ width: 13, height: 13, color: SEMANTIC.red }} />}
          </div>
        </div>
        <h3 style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.48, color: 'var(--hdr-text)', margin: '0 0 7px', fontFamily: "'Inter', system-ui, sans-serif", display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-.01em' }}>{event.title}</h3>
        <p style={{ fontSize: 12, color: 'var(--hdr-text-sub)', lineHeight: 1.6, margin: '0 0 10px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
        <ConsensusBar consensus={event.currentConsensus} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 10 }}>
          {[
            { labelKey: 'event.participants_short', v: fmt(event.participants) },
            { labelKey: 'event.ia_conf_short', v: `${Math.round((event.iaConfidence || 0) * 100)}%` },
            { labelKey: 'event.days_short', v: event.daysLeft ?? '—' }
          ].map(m => (
            <div key={m.labelKey} style={{ background: 'var(--hdr-surface-alt)', borderRadius: 5, padding: '6px 4px', textAlign: 'center', border: `1px solid var(--hdr-border)` }}>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono',monospace", color: 'var(--hdr-text)', lineHeight: 1 }}>{m.v}</div>
              <div style={{ fontSize: 8, color: 'var(--hdr-text-muted)', marginTop: 2, letterSpacing: '.06em', fontFamily: "'Space Mono',monospace" }}>{t(m.labelKey)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 5 }}>
          <button onClick={() => onVote(event.id, 'yes')} disabled={isVoted} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px 4px', borderRadius: 6, border: userVote === 'yes' ? `1.5px solid ${SEMANTIC.greenBorder}` : `1px solid var(--hdr-border)`, background: userVote === 'yes' ? SEMANTIC.greenSoft : 'var(--hdr-surface)', color: userVote === 'yes' ? SEMANTIC.green : 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", cursor: isVoted ? 'default' : 'pointer', opacity: isVoted && userVote !== 'yes' ? 0.4 : 1, letterSpacing: '.04em', transition: 'all .15s' }}>
            <CheckCircleIcon style={{ width: 12, height: 12 }} />{t('event.probable')}
          </button>
          <button onClick={() => onVote(event.id, 'no')} disabled={isVoted} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '8px 4px', borderRadius: 6, border: userVote === 'no' ? `1.5px solid ${SEMANTIC.redBorder}` : `1px solid var(--hdr-border)`, background: userVote === 'no' ? SEMANTIC.redSoft : 'var(--hdr-surface)', color: userVote === 'no' ? SEMANTIC.red : 'var(--hdr-text-sub)', fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", cursor: isVoted ? 'default' : 'pointer', opacity: isVoted && userVote !== 'no' ? 0.4 : 1, letterSpacing: '.04em', transition: 'all .15s' }}>
            <XCircleIcon style={{ width: 12, height: 12 }} />{t('event.improbable')}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          <button onClick={() => onAnalysis(event.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px 4px', borderRadius: 6, border: `1px solid var(--hdr-accent-border)`, background: 'var(--hdr-accent-soft)', color: 'var(--hdr-accent)', fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", cursor: 'pointer', letterSpacing: '.04em', transition: 'all .15s' }}>
            <CpuChipIcon style={{ width: 11, height: 11 }} />{t('event.ai_analysis')}
          </button>
          <button onClick={() => onDetails(event.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px 4px', borderRadius: 6, border: `1px solid var(--hdr-border)`, background: 'transparent', color: 'var(--hdr-text-sub)', fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", cursor: 'pointer', letterSpacing: '.04em', transition: 'all .15s' }}>
            <DocumentTextIcon style={{ width: 11, height: 11 }} />{t('event.details')}
          </button>
        </div>
        {isVoted && <div style={{ marginTop: 8, textAlign: 'center', fontSize: 9, color: SEMANTIC.green, fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '.08em' }}>✓ {t('event.vote_recorded')}</div>}
      </div>
    </article>
  );
};

// ─── GLOBAL STYLES (unchanged) ───────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes progress{from{width:0%}to{width:100%}}
  @keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  *{box-sizing:border-box}
  body{background:var(--hdr-bg)!important; color:var(--hdr-text);}
  input::placeholder{color:rgba(255,255,255,.3)}
  select option{background:var(--hdr-surface); color:var(--hdr-text);}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:var(--hdr-surface-alt)}
  ::-webkit-scrollbar-thumb{background:var(--hdr-border); border-radius:3px}
`;

// ─── MAIN COMPONENT ──────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('consensus');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const [isMockMode, setIsMockMode] = useState(false);

  const { events, loading: eventsLoading, error: eventsError, stats, refresh: refreshEvents, submitVote } =
    useEvents({ category: filter !== 'all' ? filter : undefined, limit: 24, autoRefresh: false });
  const { categories: apiCategories } = useCategories();
  const { dashboard } = useDashboard();

  useEffect(() => {
    setIsMockMode(getMockMode());
    const id = setInterval(refreshEvents, 120000);
    return () => clearInterval(id);
  }, [refreshEvents]);

  useEffect(() => {
    const id = setTimeout(() => { if (searchQuery.trim()) refreshEvents(); }, 500);
    return () => clearTimeout(id);
  }, [searchQuery, refreshEvents]);

  const categories = [
    { id: 'all', label: t('filter.all'), icon: <FireIcon className="w-3 h-3" />, count: stats.total },
    ...apiCategories.map(cat => ({
      id: cat.id.toString(),
      label: cat.name.toUpperCase(),
      icon: gci(cat.name),
      count: events.filter(e => e.category === cat.name).length
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
    .filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'consensus') return b.currentConsensus - a.currentConsensus;
      if (sortBy === 'participants') return b.participants - a.participants;
      if (sortBy === 'urgency') return (b.status === 'urgent' ? 1 : 0) - (a.status === 'urgent' ? 1 : 0);
      if (sortBy === 'trending') return (b.trend === 'up' ? 1 : b.trend === 'down' ? -1 : 0) - (a.trend === 'up' ? 1 : a.trend === 'down' ? -1 : 0);
      return 0;
    });

  if (eventsLoading && events.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{globalCSS}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 26, height: 26, border: `2px solid var(--hdr-border)`, borderTopColor: 'var(--hdr-accent)', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ fontSize: 10, color: 'var(--hdr-text-muted)', fontFamily: "'Space Mono',monospace", letterSpacing: '.06em' }}>{t('common.loading')}</p>
      </div>
    </div>
  );

  if (eventsError && events.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{globalCSS}</style>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <ExclamationTriangleIcon style={{ width: 28, height: 28, color: SEMANTIC.red, margin: '0 auto 12px' }} />
        <p style={{ fontSize: 11, color: 'var(--hdr-text-muted)', marginBottom: 16, fontFamily: "'Space Mono',monospace" }}>{eventsError}</p>
        <button onClick={refreshEvents} style={{ padding: '8px 20px', borderRadius: 6, border: `1px solid var(--hdr-accent)`, background: 'var(--hdr-accent)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono',monospace" }}>{t('common.retry')}</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{globalCSS}</style>

      {isMockMode && (
        <div style={{ background: SEMANTIC.amberSoft, borderBottom: `1px solid ${SEMANTIC.amberBorder}`, padding: '5px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: SEMANTIC.amber, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Space Mono',monospace", letterSpacing: '.06em' }}>
            <ExclamationTriangleIcon style={{ width: 11, height: 11 }} />{t('common.mock_mode')}
          </span>
          <button onClick={() => { localStorage.setItem('use_mock_data', 'false'); window.location.reload(); }} style={{ fontSize: 10, color: SEMANTIC.amber, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'Space Mono',monospace" }}>
            {t('common.switch_to_real')}
          </button>
        </div>
      )}

      <HeroCarousel stats={stats} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <StatsStrip stats={stats} />

      <main style={{ width: '100%', padding: '0 28px 60px' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '18px 0', marginBottom: 20, borderBottom: `1px solid var(--hdr-border)` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 8, color: 'var(--hdr-text-muted)', marginRight: 4, fontFamily: "'Space Mono',monospace", letterSpacing: '.1em' }}>{t('filter.filter_by')}</span>
            {categories.map(cat => {
              const pal = gcp(cat.label);
              const active = filter === cat.id;
              return (
                <button key={cat.id} onClick={() => setFilter(cat.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '4px 10px', borderRadius: 5, border: active ? `1.5px solid ${pal.bar}` : `1px solid var(--hdr-border)`, background: active ? pal.bg : 'transparent', color: active ? pal.text : 'var(--hdr-text-muted)', fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono',monospace", letterSpacing: '.06em', transition: 'all .15s' }}>
                  {cat.icon}{cat.label}
                  {cat.count > 0 && <span style={{ fontSize: 8, padding: '0 3px', borderRadius: 2, background: active ? 'rgba(0,0,0,.08)' : 'var(--hdr-surface-alt)', color: active ? pal.text : 'var(--hdr-text-muted)' }}>{cat.count}</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 8, color: 'var(--hdr-text-muted)', fontFamily: "'Space Mono',monospace", letterSpacing: '.1em' }}>{t('filter.sort_by')}</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: `1px solid var(--hdr-border)`, borderRadius: 5, padding: '4px 9px', fontSize: 10, color: 'var(--hdr-text)', background: 'var(--hdr-surface)', cursor: 'pointer', outline: 'none', fontFamily: "'Space Mono',monospace" }}>
              <option value="consensus">{t('filter.consensus')}</option>
              <option value="participants">{t('filter.participants')}</option>
              <option value="urgency">{t('filter.urgency')}</option>
              <option value="trending">{t('filter.trending')}</option>
            </select>
            <button onClick={refreshEvents} style={{ padding: '4px 7px', borderRadius: 5, border: `1px solid var(--hdr-border)`, background: 'transparent', cursor: 'pointer', color: 'var(--hdr-text-muted)', display: 'flex', alignItems: 'center', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--hdr-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--hdr-text-muted)'}>
              <ArrowPathIcon style={{ width: 13, height: 13, animation: eventsLoading ? 'spin .8s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Events grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(268px,1fr))', gap: 14 }}>
            {filtered.map((event, i) => (
              <div key={event.id} style={{ animation: `cardIn .4s ease ${i * 0.03}s both` }}>
                <EventCard event={event} userVote={userVotes[event.id]} onVote={handleVote} onDetails={id => navigate(`/event/${id}`)} onAnalysis={id => navigate(`/ai-analysis/${id}`)} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '72px 20px', background: 'var(--hdr-surface)', borderRadius: 10, border: `1px solid var(--hdr-border)` }}>
            <MagnifyingGlassIcon style={{ width: 32, height: 32, color: 'var(--hdr-text-muted)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--hdr-text)', marginBottom: 6, fontFamily: "'Inter',sans-serif" }}>{searchQuery ? t('common.no_results') : t('common.no_events')}</p>
            <p style={{ fontSize: 12, color: 'var(--hdr-text-muted)', marginBottom: 16 }}>{searchQuery ? t('common.modify_criteria') : t('common.events_soon')}</p>
            {searchQuery && <button onClick={() => setSearchQuery('')} style={{ padding: '7px 16px', borderRadius: 6, border: `1px solid var(--hdr-border)`, background: 'var(--hdr-text)', color: 'var(--hdr-bg)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Space Mono',monospace" }}>{t('common.clear')}</button>}
          </div>
        )}

        {/* AI Insights */}
        {dashboard?.insights?.insights?.length > 0 && (
          <section style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid var(--hdr-border)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--hdr-text)', fontFamily: "'Space Mono',monospace", margin: 0, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '.06em' }}>
                <CpuChipIcon style={{ width: 14, height: 14, color: 'var(--hdr-accent)' }} />{t('insights.title')}
              </h2>
              <button onClick={() => navigate('/ai-insights')} style={{ fontSize: 9, color: 'var(--hdr-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: '.06em' }}>
                {t('insights.view_all')}<ChevronRightIcon style={{ width: 11, height: 11 }} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
              {dashboard.insights.insights.slice(0, 3).map(insight => (
                <div key={insight.id} style={{ background: 'var(--hdr-surface)', borderRadius: 8, border: `1px solid var(--hdr-border)`, padding: '14px', boxShadow: '0 1px 4px rgba(10,15,30,.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, fontFamily: "'Space Mono',monospace", letterSpacing: '.06em', background: insight.impact_level === 'high' ? SEMANTIC.redSoft : insight.impact_level === 'medium' ? SEMANTIC.amberSoft : 'var(--hdr-accent-soft)', color: insight.impact_level === 'high' ? SEMANTIC.red : insight.impact_level === 'medium' ? SEMANTIC.amber : 'var(--hdr-accent)' }}>
                      {insight.category?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--hdr-text-muted)', fontFamily: "'Space Mono',monospace" }}>{insight.confidence}% {t('insights.confidence')}</span>
                  </div>
                  <h4 style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--hdr-text)', margin: '0 0 6px', lineHeight: 1.45, fontFamily: "'Inter',sans-serif", letterSpacing: '-.01em' }}>{insight.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--hdr-text-sub)', margin: '0 0 10px', lineHeight: 1.55 }}>{insight.description}</p>
                  <div style={{ fontSize: 9, color: 'var(--hdr-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Space Mono',monospace" }}>
                    <SignalIcon style={{ width: 10, height: 10 }} />{insight.sources_count || 0} {t('insights.sources')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid var(--hdr-border)`, textAlign: 'center' }}>
          <button onClick={() => navigate('/submit-event')}
            style={{ padding: '11px 28px', borderRadius: 8, border: `1.5px solid var(--hdr-accent)`, background: 'var(--hdr-accent)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'Space Mono',monospace", letterSpacing: '.06em', boxShadow: '0 4px 16px rgba(0,80,230,.25)', transition: 'all .2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--hdr-accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,80,230,.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--hdr-accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,80,230,.25)'; }}>
            <FireIcon style={{ width: 13, height: 13 }} />{t('cta.propose_event')}
          </button>
          <p style={{ fontSize: 10, color: 'var(--hdr-text-muted)', marginTop: 8, fontFamily: "'Space Mono',monospace" }}>{t('cta.subtitle')}</p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;