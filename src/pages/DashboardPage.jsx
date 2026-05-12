// ═══════════════════════════════════════════════════════════════
// PICHAI — DashboardPage.jsx (corrigé · startTransition + Suspense)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChartBarIcon, BoltIcon, EyeIcon, ArrowTrendingUpIcon,
  ClockIcon, SparklesIcon, PencilSquareIcon, BellIcon,
  KeyIcon, TrashIcon, ChevronRightIcon, ExclamationTriangleIcon,
  UserCircleIcon, ArrowUpIcon, ShieldCheckIcon, LightBulbIcon,
  FireIcon, CheckCircleIcon as CheckCircleSolid,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { dashboardAPI, eventsAPI } from '../services/api';
import { useAuth } from '../hooks/useUser';

// ═════════════════════════ DESIGN TOKENS ═══════════════════════
const C = {
  bg: '#FFFFFF', surface: '#F7F7F8', surface2: '#F0F0F2',
  border: '#E8E8EC', borderDark: '#D0D0D8',
  text: '#0A0A0B', textSub: '#52525B', textMuted: '#A1A1AA',
  black: '#0A0A0B', blackHover: '#27272A',
  green: '#059669', greenBg: '#F0FDF4', greenBorder: '#BBF7D0',
  red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
  amber: '#D97706', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
  blue: '#2563EB', blueBg: '#EFF6FF', blueBorder: '#BFDBFE',
  activeBg: '#E2EDFD', activeText: '#0A0A0B',
};

// ═══════════════════════════ CSS ═══════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash {
    font-family: 'Inter', system-ui, sans-serif;
    background: ${C.bg};
    color: ${C.text};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .dash-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }
  @media (max-width: 1024px) {
    .dash-layout { grid-template-columns: 1fr; }
    .sidebar { display: none !important; }
  }

  .sidebar {
    background: ${C.bg};
    border-right: 1px solid ${C.border};
    display: flex; flex-direction: column;
    position: sticky; top: 60px; height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .sidebar-section { padding: 12px; flex: 1; }

  .sidebar-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 9px 10px; border-radius: 8px;
    font-size: 14px; font-weight: 500; color: ${C.textSub};
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    text-align: left; transition: background 0.12s, color 0.12s;
    white-space: nowrap; text-decoration: none;
  }
  .sidebar-btn:hover { background: ${C.surface2}; color: ${C.text}; }
  .sidebar-btn.active {
    background: ${C.activeBg}; color: ${C.activeText}; font-weight: 600;
  }
  .sidebar-btn.active svg { color: ${C.activeText}; }
  .sidebar-btn svg { flex-shrink: 0; width: 18px; height: 18px; color: ${C.textSub}; }

  .sidebar-notif-badge {
    margin-left: auto; min-width: 18px; height: 18px;
    background: ${C.red}; color: #fff; border-radius: 9px;
    font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 5px;
  }

  .mobile-tabs {
    display: none;
    position: sticky; top: 60px; z-index: 45;
    background: ${C.bg};
    border-bottom: 1px solid ${C.border};
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .mobile-tabs::-webkit-scrollbar { display: none; }
  .mobile-tabs-inner {
    display: flex; gap: 2px; padding: 8px 12px;
  }
  .mobile-tab {
    flex-shrink: 0; padding: 7px 14px; border-radius: 8px;
    font-size: 13px; font-weight: 500;
    border: 1px solid transparent; background: none;
    color: ${C.textMuted}; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.12s;
    white-space: nowrap;
  }
  .mobile-tab:hover { background: ${C.surface2}; color: ${C.text}; }
  .mobile-tab.active {
    background: ${C.activeBg}; color: ${C.activeText}; font-weight: 600;
  }
  @media (max-width: 1024px) {
    .mobile-tabs { display: block; }
  }

  .main-content {
    padding: 28px 28px 64px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  @media (max-width: 768px) { .main-content { padding: 16px 16px 48px; } }

  .card {
    background: ${C.bg};
    border: 1px solid ${C.border};
    border-radius: 12px;
    overflow: hidden;
  }
  .card-header {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 18px;
    border-bottom: 1px solid ${C.border};
  }
  .card-title {
    font-size: 13px; font-weight: 700;
    color: ${C.text}; letter-spacing: -0.01em;
  }
  .card-badge {
    margin-left: auto;
    font-size: 11px; color: ${C.textMuted};
    font-weight: 500;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 24px;
  }
  @media (max-width: 1100px) { .metrics-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px)  { .metrics-grid { grid-template-columns: 1fr 1fr; } }

  .metric-tile {
    padding: 18px 20px; border-radius: 12px;
    border: 1px solid ${C.border}; background: ${C.bg};
    transition: box-shadow 0.15s, border-color 0.15s;
  }
  .metric-tile:hover {
    border-color: ${C.borderDark};
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .metric-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
    background: ${C.surface};
  }
  .metric-value {
    font-size: 28px; font-weight: 700; color: ${C.text};
    line-height: 1; margin-bottom: 4px;
    font-feature-settings: "tnum";
  }
  .metric-label {
    font-size: 12px; color: ${C.textMuted}; font-weight: 500;
    margin-bottom: 6px;
  }
  .metric-delta {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 600;
    padding: 2px 7px; border-radius: 20px;
  }
  .delta-up   { background: ${C.greenBg}; color: ${C.green}; }
  .delta-flat { background: ${C.surface}; color: ${C.textMuted}; }
  .delta-down { background: ${C.redBg};   color: ${C.red}; }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 16px;
  }
  @media (max-width: 1100px) { .two-col { grid-template-columns: 1fr; } }

  .feed-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid ${C.border};
    cursor: pointer; transition: background 0.1s;
  }
  .feed-row:last-child { border-bottom: none; }
  .feed-row:hover { background: ${C.surface}; }
  .feed-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; background: ${C.surface};
  }
  .feed-title {
    font-size: 13px; font-weight: 600; color: ${C.text};
    margin-bottom: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .feed-meta {
    display: flex; align-items: center; gap: 8px;
    flex-wrap: wrap;
  }

  .claim-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid ${C.border};
    cursor: pointer; transition: background 0.1s;
  }
  .claim-row:last-child { border-bottom: none; }
  .claim-row:hover { background: ${C.surface}; }
  .claim-row-title {
    font-size: 13px; font-weight: 600; color: ${C.text};
    flex: 1; min-width: 0; padding-right: 12px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .claim-row-foot {
    display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
  }

  .tag {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    text-transform: uppercase; border: 1px solid;
  }
  .tag-green  { background: ${C.greenBg};  color: ${C.green};  border-color: ${C.greenBorder};  }
  .tag-red    { background: ${C.redBg};    color: ${C.red};    border-color: ${C.redBorder};    }
  .tag-amber  { background: ${C.amberBg};  color: ${C.amber};  border-color: ${C.amberBorder};  }
  .tag-blue   { background: ${C.blueBg};   color: ${C.blue};   border-color: ${C.blueBorder};   }
  .tag-neutral{ background: ${C.surface};  color: ${C.textSub};border-color: ${C.border};        }

  .prog-track {
    height: 5px; border-radius: 3px;
    background: ${C.surface2}; overflow: hidden;
  }
  .prog-fill {
    height: 100%; border-radius: 3px;
    transition: width 1.2s cubic-bezier(.22,1,.36,1);
  }

  .btn-black {
    background: ${C.black}; color: #fff;
    border: none; border-radius: 8px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-black:hover { background: ${C.blackHover}; }

  .btn-outline {
    background: transparent; border: 1px solid ${C.border};
    border-radius: 8px; padding: 8px 16px;
    font-size: 13px; color: ${C.textSub}; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.15s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-outline:hover { border-color: ${C.text}; color: ${C.text}; }

  .btn-gray {
    background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 8px; padding: 9px 18px;
    font-size: 13px; font-weight: 600; color: ${C.text};
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .btn-gray:hover { background: ${C.surface2}; }

  .ring-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }

  .tabs { display: flex; gap: 2px; margin-bottom: 16px; flex-wrap: wrap; }
  .tab {
    padding: 7px 14px; border-radius: 7px;
    font-size: 13px; font-weight: 500;
    border: 1px solid transparent; background: none;
    color: ${C.textMuted}; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: all 0.12s;
    white-space: nowrap;
  }
  .tab:hover { background: ${C.surface}; color: ${C.text}; }
  .tab.active {
    background: ${C.activeBg}; color: ${C.activeText}; font-weight: 600;
    border-color: ${C.activeBg};
  }

  .toggle {
    width: 38px; height: 20px; border-radius: 10px;
    position: relative; cursor: pointer; transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle-knob {
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; position: absolute; top: 2px; left: 2px;
    transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .toggle.on .toggle-knob { left: 20px; }

  .inp {
    width: 100%; background: ${C.surface};
    border: 1px solid ${C.border}; border-radius: 8px;
    padding: 10px 14px; font-size: 14px; color: ${C.text};
    font-family: 'Inter', sans-serif; outline: none;
    transition: border-color 0.15s;
  }
  .inp:focus { border-color: ${C.text}; background: ${C.bg}; }
  .inp::placeholder { color: ${C.textMuted}; }
  .inp-label {
    display: block; font-size: 12px; font-weight: 600;
    color: ${C.textSub}; margin-bottom: 6px;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .shimmer {
    animation: shimmer 1.8s infinite linear;
    background: linear-gradient(90deg, ${C.surface} 25%, ${C.surface2} 50%, ${C.surface} 75%);
    background-size: 200% 100%;
    border-radius: 8px;
  }

  .fade-up { animation: fadeUp 0.3s ease both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .space-y > * + * { margin-top: 16px; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal-box {
    background: ${C.bg}; border-radius: 12px; padding: 24px;
    max-width: 440px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bar-body { width: 100%; border-radius: 4px 4px 0 0; background: ${C.black}; min-height: 4px; transition: height 0.8s ease; }
  .bar-body.empty { background: ${C.surface2}; }
  .bar-label { font-size: 10px; color: ${C.textMuted}; text-align: center; white-space: nowrap; }

  /* Grille impact responsive */
  .impact-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  @media (max-width: 768px) {
    .impact-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

// ═══════════════════════ HELPERS ══════════════════════════════
const STATUS_CFG = {
  in_progress: { labelKey: 'status_in_progress', tag: 'tag-blue' },
  pending:     { labelKey: 'status_pending',     tag: 'tag-amber' },
  verified:    { labelKey: 'status_verified',    tag: 'tag-green' },
  rejected:    { labelKey: 'status_rejected',    tag: 'tag-red' },
  unverified:  { labelKey: 'status_unverified',  tag: 'tag-neutral' },
};

const TYPE_CFG = {
  vote:     { emoji: '🗳️', labelKey: 'type_vote',           tag: 'tag-blue' },
  comment:  { emoji: '💬', labelKey: 'type_comment',        tag: 'tag-neutral' },
  proof:    { emoji: '📎', labelKey: 'type_proof',          tag: 'tag-green' },
  question: { emoji: '❓', labelKey: 'type_question_ia',     tag: 'tag-amber' },
};

const normalizeClaim = (c) => {
  if (!c) return c;
  return {
    id: c.id, title: c.title || '',
    category: typeof c.category === 'string' ? c.category : c.category?.name || 'Général',
    status: c.status || 'pending',
    currentConsensus: (c.crowd_confidence_score != null && (c.total_votes || 0) > 0)
      ? Math.round(c.crowd_confidence_score * 100) : null,
    participants: c.total_votes || 0,
    attention_flag: c.attention_flag || false,
  };
};

const ensureArray = (v) => (Array.isArray(v) ? v : v?.data || []);

const relativeTime = (dateStr) => {
  if (!dateStr) return '—';
  const m = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (m < 1) return 'À l\'instant';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} j`;
};

// ═══════════════ COMPOSANTS RÉUTILISABLES ════════════════════
const ScoreRing = ({ pct = 0, size = 80, color = C.black }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (Math.min(Math.max(pct, 0), 100) / 100) * circ;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.surface2} strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s ease' }} />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', fontSize: size * 0.22, fontWeight: 700, color, fontFeatureSettings: '"tnum"' }}>
        {Math.round(pct)}
      </div>
    </div>
  );
};

const Toggle = ({ value, onChange }) => (
  <div className={`toggle ${value ? 'on' : ''}`}
    style={{ background: value ? C.black : C.surface2 }}
    onClick={() => onChange(!value)}>
    <div className="toggle-knob" />
  </div>
);

const Sk = ({ w = '100%', h = 16, r = 8 }) => (
  <div className="shimmer" style={{ width: w, height: h, borderRadius: r }} />
);

// ═══════════════ GRAPHE ACTIVITÉ ════════════════════════════
const ActivityBarChart = ({ activity = [], t }) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleDateString('fr-FR', { month: 'short' }),
      count: 0,
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });
  activity.forEach(a => {
    if (!a.created_at) return;
    const d = new Date(a.created_at);
    const m = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
    if (m) m.count++;
  });
  const max = Math.max(...months.map(m => m.count), 1);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: C.textMuted }}>{t('activity_chart_desc')}</p>
        <span style={{ fontSize: 11, fontWeight: 600 }}>
          {t('activity_total', { count: activity.length })}
        </span>
      </div>
      <div className="bar-chart">
        {months.map((m, i) => {
          const hPct = Math.max((m.count / max) * 100, m.count > 0 ? 5 : 0);
          return (
            <div key={i} className="bar-col">
              <div style={{ fontSize: 10, fontWeight: 600, minHeight: 14 }}>{m.count || '—'}</div>
              <div style={{ flex: 1, width: '100%' }}>
                <div className={`bar-body ${m.count === 0 ? 'empty' : ''}`} style={{ height: `${hPct}%` }} />
              </div>
              <div className="bar-label">{m.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, padding: '10px 14px', background: C.surface2, borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[{ emoji: '🗳️', key: 'votes', type: 'vote' },
            { emoji: '📎', key: 'proofs', type: 'proof' },
            { emoji: '💬', key: 'comments', type: 'comment' },
            { emoji: '❓', key: 'questions_ia', type: 'question' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.textSub }}>
              <span>{s.emoji}</span>
              <span style={{ fontWeight: 600, color: C.text }}>{activity.filter(a => a.type === s.type).length}</span>
              <span>{t(s.key)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════ NAVIGATION ═════════════════════════════════
const NAV_ITEMS = [
  { key: 'overview',  labelKey: 'overview',  Icon: ChartBarIcon },
  { key: 'alerts',    labelKey: 'alerts',    Icon: BoltIcon,     notif: true },
  { key: 'watchlist', labelKey: 'watchlist', Icon: EyeIcon },
  { key: 'impact',    labelKey: 'impact',    Icon: ArrowTrendingUpIcon },
  { key: 'activity',  labelKey: 'activity',  Icon: ClockIcon },
  { key: 'insights',  labelKey: 'insights',  Icon: SparklesIcon },
  { key: 'settings',  labelKey: 'settings',  Icon: PencilSquareIcon },
];

const MobileTabs = ({ activeTab, onTab, t }) => (
  <div className="mobile-tabs">
    <div className="mobile-tabs-inner">
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          className={`mobile-tab ${activeTab === item.key ? 'active' : ''}`}
          onClick={() => onTab(item.key)}
        >
          {t(item.labelKey)}
        </button>
      ))}
    </div>
  </div>
);

const Sidebar = ({ activeTab, onTab, unreadCount, t }) => (
  <aside className="sidebar">
    <nav className="sidebar-section">
      {NAV_ITEMS.map(({ key, labelKey, Icon, notif }) => (
        <button
          key={key}
          className={`sidebar-btn ${activeTab === key ? 'active' : ''}`}
          onClick={() => onTab(key)}
        >
          <Icon />
          {t(labelKey)}
          {notif && unreadCount > 0 && (
            <span className="sidebar-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
      ))}
    </nav>
  </aside>
);

// ═══════════════ ONGLETS ═════════════════════════════════════

// 1. Vue d'ensemble
const OverviewTab = ({ personal, insights, recommendations, activity, navigate, t }) => {
  const trustScore = personal?.user?.trust_score ? Math.round(personal.user.trust_score * 100) : 0;
  const votes = personal?.votes || {};
  const evidence = personal?.evidence || {};
  const contributions = personal?.contributions || {};

  const tiles = [
    { label: t('trust_score'),         value: `${trustScore}%`, delta: t('this_month_change', { value: '+3' }), deltaType: 'up', Icon: ShieldCheckIcon },
    { label: t('votes_submitted'),     value: votes?.total || 0, delta: t('this_month_change', { value: `+${votes?.this_month || 0}` }), deltaType: 'up', Icon: ArrowUpIcon },
    { label: t('validated_proofs'),    value: evidence?.approved || 0, delta: t('total_submitted', { total: evidence?.total || 0 }), deltaType: 'flat', Icon: CheckCircleIcon },
    { label: t('vote_accuracy'),       value: `${contributions?.accuracy_rate || 0}%`, delta: t('accuracy_label'), deltaType: contributions?.accuracy_rate >= 70 ? 'up' : 'flat', Icon: LightBulbIcon },
  ];

  return (
    <div className="fade-up">
      <div className="metrics-grid">
        {tiles.map((tile, i) => (
          <div key={i} className="metric-tile">
            <div className="metric-icon"><tile.Icon style={{ width: 20, height: 20, color: C.black }} /></div>
            <div className="metric-value">{tile.value}</div>
            <div className="metric-label">{tile.label}</div>
            <span className={`metric-delta ${tile.deltaType === 'up' ? 'delta-up' : tile.deltaType === 'down' ? 'delta-down' : 'delta-flat'}`}>
              {tile.deltaType === 'up' && '↑ '}{tile.delta}
            </span>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="space-y">
          <div className="card">
            <div className="card-header">
              <SparklesIcon style={{ width: 16, color: C.black }} />
              <span className="card-title">{t('ia_summary_today')}</span>
              <span className="card-badge">{new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long' })}</span>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <p style={{ fontSize:14, color:C.textSub, lineHeight:1.7 }}>
                {activity?.length ? t('since_last_visit', { count: activity.length }) : t('welcome_message')}
                {insights?.length > 0 && ' ' + t('ia_monitoring', { count: insights.length })}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <ClockIcon style={{ width: 16, color: C.black }} />
              <span className="card-title">{t('last_6_months')}</span>
            </div>
            <div style={{ padding: '16px 18px' }}><ActivityBarChart activity={activity || []} t={t} /></div>
          </div>

          <div className="card">
            <div className="card-header">
              <BoltIcon style={{ width: 16, color: C.black }} />
              <span className="card-title">{t('latest_actions')}</span>
              <span className="card-badge">{activity?.length || 0} {t('entries')}</span>
            </div>
            {activity?.length ? activity.slice(0,6).map((act,i) => {
              const cfg = TYPE_CFG[act.type] || TYPE_CFG.vote;
              return (
                <div key={i} className="feed-row" onClick={() => act.claim_id && navigate(`/event/${act.claim_id}`)}>
                  <div className="feed-icon"><ClockIcon style={{ width:16, color:C.black }} /></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="feed-title">{act.claim_title || '—'}</div>
                    <div className="feed-meta">
                      <span className={`tag ${cfg.tag}`}>{t(cfg.labelKey)}</span>
                      <span style={{ fontSize:11, color:C.textMuted }}>{relativeTime(act.created_at)}</span>
                    </div>
                  </div>
                  <ChevronRightIcon style={{ width:14, color:C.textMuted }} />
                </div>
              );
            }) : (
              <div style={{ padding:'32px 18px', textAlign:'center', color:C.textMuted }}>{t('no_activity')}</div>
            )}
          </div>
        </div>

        <div className="space-y">
          <div className="card" style={{ padding:'20px 18px', textAlign:'center' }}>
            <p style={{ fontSize:12, fontWeight:600, color:C.textSub, marginBottom:14, textTransform:'uppercase' }}>{t('citizen_score')}</p>
            <ScoreRing pct={trustScore} size={88} color={C.black} />
            <p style={{ fontSize:12, color:C.textMuted, marginTop:14 }}>{t('score_description')}</p>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:10 }}>
              {[{ label: t('votes'), value: votes.total||0, max:100 },
                { label: t('proofs_submitted'), value: evidence.total||0, max:20 },
                { label: t('accuracy'), value: contributions.accuracy_rate||0, max:100, unit:'%' },
              ].map((d,i) => (
                <div key={i} style={{ textAlign:'left' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, color:C.textSub }}>{d.label}</span>
                    <span style={{ fontSize:12, fontWeight:600 }}>{d.value}{d.unit||''}</span>
                  </div>
                  <div className="prog-track"><div className="prog-fill" style={{ width:`${Math.min((d.value/d.max)*100,100)}%`, background:C.black }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <FireIcon style={{ width:16, color:C.black }} />
              <span className="card-title">{t('recommended_for_you')}</span>
            </div>
            {recommendations?.length ? recommendations.slice(0,4).map(c => (
              <div key={c.id} className="claim-row" onClick={() => navigate(`/event/${c.id}`)}>
                <div className="claim-row-title">{c.title}</div>
                <div className="claim-row-foot">
                  <span className={`tag ${STATUS_CFG[c.status]?.tag || 'tag-neutral'}`}>{t(STATUS_CFG[c.status]?.labelKey || 'status_unverified')}</span>
                  {c.currentConsensus !== null && <span style={{ fontSize:12, fontWeight:700, color:c.currentConsensus>=50?C.green:C.red }}>{c.currentConsensus}%</span>}
                </div>
              </div>
            )) : (
              <div style={{ padding:'24px 18px', textAlign:'center', color:C.textMuted }}>{t('no_recommendations')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Alertes & signaux
const AlertsTab = ({ followedEvents, insights, navigate, t }) => {
  const [filter, setFilter] = useState('all');
  const allSignals = [
    ...followedEvents.filter(e => e.attention_flag).map(e => ({
      type:'urgent', emoji:'🚨', title:e.title,
      detail: t('alert_claim_change', { consensus: e.currentConsensus ?? t('no_vote') }),
      tag: t('alert_needs_attention'), tagClass:'tag-red', route:`/event/${e.id}`,
    })),
    ...(insights || []).map(ins => ({
      type:'ia', emoji:'🧠', title:ins.title,
      detail: t('alert_ia_confidence', { confidence: ins.confidence, category: ins.category }),
      tag: t('alert_ia_analysis'), tagClass:'tag-blue',
    })),
    ...followedEvents.filter(e => !e.attention_flag).slice(0,5).map(e => ({
      type:'update', emoji:'📊', title:e.title,
      detail: t('alert_update', { votes: e.participants?.toLocaleString()||0, status: t(STATUS_CFG[e.status]?.labelKey || 'status_unverified') }),
      tag: t('alert_update_label'), tagClass:'tag-neutral', route:`/event/${e.id}`,
    })),
  ];

  const shown = filter === 'all' ? allSignals : allSignals.filter(s => s.type === filter);
  const FILTERS = ['all','urgent','ia','update'];

  return (
    <div className="fade-up">
      <div style={{ marginBottom:16, padding:'14px 18px', background:C.surface, borderRadius:10, border:`1px solid ${C.border}` }}>
        <p style={{ fontSize:13, color:C.textSub, lineHeight:1.6 }}>
          <strong style={{ color:C.text }}>{t('alerts_signals')}</strong> — {t('alerts_description')}
        </p>
      </div>
      <div className="tabs">
        {FILTERS.map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? t('all') : f === 'urgent' ? `🚨 ${t('urgent')}` : f === 'ia' ? `🧠 ${t('ia')}` : `📊 ${t('updates')}`}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <BoltIcon style={{ width:16, color:C.black }} />
          <span className="card-title">{t('active_signals')}</span>
          <span className="card-badge">{shown.length} {t('result', { count: shown.length })}</span>
        </div>
        {shown.length ? shown.map((s,i) => (
          <div key={i} className="feed-row" onClick={() => s.route && navigate(s.route)}>
            <div className="feed-icon" style={{ fontSize:16 }}>{s.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="feed-title">{s.title}</div>
              <div className="feed-meta">
                <span className={`tag ${s.tagClass}`}>{s.tag}</span>
                <span style={{ fontSize:11, color:C.textMuted }}>{s.detail}</span>
              </div>
            </div>
            {s.route && <ChevronRightIcon style={{ width:14, color:C.textMuted }} />}
          </div>
        )) : (
          <div style={{ padding:'40px 18px', textAlign:'center' }}>
            <BellIcon style={{ width:32, margin:'0 auto 10px', display:'block', color:C.textMuted, opacity:0.4 }} />
            <p style={{ color:C.textMuted }}>{t('no_signals')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Claims surveillés
const WatchlistTab = ({ followedEvents, navigate, t }) => {
  const urgent = followedEvents.filter(e => e.attention_flag);
  const normal = followedEvents.filter(e => !e.attention_flag);

  return (
    <div className="fade-up space-y">
      {urgent.length > 0 && (
        <div style={{ background:C.redBg, border:`1px solid ${C.redBorder}`, borderLeft:`4px solid ${C.red}`, borderRadius:10, padding:'14px 18px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <BoltIcon style={{ width:16, color:C.red }} />
            <strong style={{ color:C.red }}>{t('urgent_claims_changed', { count: urgent.length })}</strong>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:10 }}>
            {urgent.map(e => (
              <div key={e.id} className="card" style={{ cursor:'pointer', border:`1px solid ${C.redBorder}` }} onClick={() => navigate(`/event/${e.id}`)}>
                <div style={{ padding:'12px 14px' }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>{e.title}</div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span className="tag tag-red">{t('attention_required')}</span>
                    {e.currentConsensus !== null && <span style={{ fontSize:12, fontWeight:700 }}>{e.currentConsensus}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <EyeIcon style={{ width:16, color:C.black }} />
          <span className="card-title">{t('watchlist')}</span>
          <span className="card-badge">{followedEvents.length} {t('total')}</span>
          <button className="btn-outline" style={{ marginLeft:'auto' }} onClick={() => navigate('/')}>
            + {t('follow_new_claim')}
          </button>
        </div>
        {followedEvents.length ? [...urgent, ...normal].map(e => (
          <div key={e.id} className="claim-row" onClick={() => navigate(`/event/${e.id}`)}>
            <div className="claim-row-title">{e.title}</div>
            <div className="claim-row-foot">
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                {e.attention_flag && <span className="tag tag-red">{t('changed')}</span>}
                <span className={`tag ${STATUS_CFG[e.status]?.tag || 'tag-neutral'}`}>
                  {t(STATUS_CFG[e.status]?.labelKey || 'status_unverified')}
                </span>
                <span style={{ fontSize:11, color:C.textMuted }}>{e.participants?.toLocaleString()} {t('votes')}</span>
              </div>
              {e.currentConsensus !== null && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, minWidth:60 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:e.currentConsensus>=50?C.green:C.red }}>{e.currentConsensus}%</span>
                  <div className="prog-track" style={{ width:60 }}>
                    <div className="prog-fill" style={{ width:`${e.currentConsensus}%`, background:e.currentConsensus>=50?C.green:C.red }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div style={{ padding:'40px 18px', textAlign:'center' }}>
            <EyeIcon style={{ width:32, margin:'0 auto 10px', display:'block', color:C.textMuted, opacity:0.4 }} />
            <p style={{ color:C.textMuted, marginBottom:14 }}>{t('no_followed_claims')}</p>
            <button className="btn-black" onClick={() => navigate('/')}>{t('explore_claims')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Mon impact (avec grille responsive)
const ImpactTab = ({ personal, t }) => {
  const { user, votes={}, comments={}, evidence={}, contributions={} } = personal || {};
  const trustScore = user?.trust_score ? Math.round(user.trust_score * 100) : 0;
  const badges = [
    { earned: (votes.total||0)>0,              label: t('badge_first_vote'),       emoji:'🗳️', desc: t('badge_first_vote_desc') },
    { earned: (evidence.total||0)>0,           label: t('badge_first_proof'),      emoji:'📎', desc: t('badge_first_proof_desc') },
    { earned: (comments.total||0)>0,           label: t('badge_active_contributor'), emoji:'💬', desc: t('badge_active_contributor_desc') },
    { earned: (contributions.accuracy_rate||0)>70, label: t('badge_accuracy_analyst'), emoji:'🎯', desc: t('badge_accuracy_analyst_desc') },
    { earned: (votes.total||0)>=10,            label: t('badge_engaged_citizen'),   emoji:'⚡', desc: t('badge_engaged_citizen_desc') },
    { earned: trustScore>=75,                  label: t('badge_reliable_voice'),    emoji:'🏆', desc: t('badge_reliable_voice_desc') },
  ];

  return (
    <div className="fade-up space-y">
      <div className="impact-stats-grid">
        {[ 
          { label:t('votes'), value:votes.total||0, sub:t('this_month',{count:votes.this_month||0}) },
          { label:t('comments'), value:comments.total||0, sub:t('helpful',{count:comments.helpful||0}) },
          { label:t('proofs'), value:evidence.total||0, sub:t('approved',{count:evidence.approved||0}) },
          { label:t('accuracy'), value:`${contributions.accuracy_rate||0}%`, sub:t('predictions') },
          { label:t('trust_score'), value:`${trustScore}%`, sub:t('community_reputation') },
          { label:t('rank'), value:`#${user?.rank||'—'}`, sub:t('global_ranking') },
        ].map((s,i) => (
          <div key={i} className="metric-tile">
            <div className="metric-value" style={{ fontSize:22 }}>{s.value}</div>
            <div className="metric-label">{s.label}</div>
            <span className="metric-delta delta-flat">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span style={{ fontSize:15 }}>🏅</span>
          <span className="card-title">{t('badges_earned')}</span>
          <span className="card-badge">{badges.filter(b=>b.earned).length}/{badges.length}</span>
        </div>
        <div style={{ padding:'16px 18px', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:10 }}>
          {badges.map((b,i) => (
            <div key={i} style={{
              padding:'12px 14px', borderRadius:10,
              border:`1px solid ${b.earned?C.borderDark:C.border}`,
              background:b.earned?C.surface:'',
              opacity:b.earned?1:0.45,
              display:'flex', alignItems:'flex-start', gap:10
            }}>
              <span style={{ fontSize:22 }}>{b.emoji}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{b.label}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{b.desc}</div>
                {b.earned && (
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:6 }}>
                    <CheckCircleIcon style={{ width:12, color:C.green }} />
                    <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>{t('earned')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Mon activité
const ActivityTab = ({ activity, navigate, t }) => {
  const [filter, setFilter] = useState('all');
  const safe = Array.isArray(activity) ? activity : [];
  const shown = filter === 'all' ? safe : safe.filter(a => a.type === filter);

  return (
    <div className="fade-up">
      <div className="tabs">
        {[
          { key:'all',     label: t('all') },
          { key:'vote',    label: `🗳️ ${t('votes')}` },
          { key:'proof',   label: `📎 ${t('proofs')}` },
          { key:'comment', label: `💬 ${t('comments')}` },
          { key:'question',label: `❓ ${t('questions_ia')}` },
        ].map(f => (
          <button key={f.key} className={`tab ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <ClockIcon style={{ width:16, color:C.black }} />
          <span className="card-title">{t('activity_history')}</span>
          <span className="card-badge">{shown.length} {t('actions')}</span>
        </div>
        {shown.length ? shown.map((act,i) => {
          const cfg = TYPE_CFG[act.type] || TYPE_CFG.vote;
          return (
            <div key={i} className="feed-row" onClick={() => act.claim_id && navigate(`/event/${act.claim_id}`)}>
              <div className="feed-icon" style={{ fontSize:14 }}>{cfg.emoji}</div>
              <div style={{ flex:1 }}>
                <div className="feed-title">{act.claim_title || '—'}</div>
                <div className="feed-meta">
                  <span className={`tag ${cfg.tag}`}>{t(cfg.labelKey)}</span>
                  <span style={{ fontSize:11, color:C.textMuted }}>{relativeTime(act.created_at)}</span>
                </div>
              </div>
              <ChevronRightIcon style={{ width:14, color:C.textMuted }} />
            </div>
          );
        }) : (
          <div style={{ padding:'40px 18px', textAlign:'center' }}>
            <ClockIcon style={{ width:32, margin:'0 auto 10px', display:'block', color:C.textMuted, opacity:0.4 }} />
            <p>{t('no_actions')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 6. Analyses IA
const InsightsTab = ({ insights, t }) => (
  <div className="fade-up">
    <div style={{ marginBottom:16, padding:'14px 18px', background:C.blueBg, borderRadius:10, border:`1px solid ${C.blueBorder}` }}>
      <p style={{ fontSize:13, color:C.textSub, lineHeight:1.6 }}>
        <strong style={{ color:C.text }}>{t('ai_analysis')}</strong> — {t('ai_analysis_desc')}
      </p>
    </div>
    <div className="card">
      <div className="card-header">
        <SparklesIcon style={{ width:16, color:C.black }} />
        <span className="card-title">{t('detected_signals')}</span>
        <span className="card-badge">{insights?.length||0} {t('analyses')}</span>
      </div>
      {insights?.length ? insights.map((ins,i) => (
        <div key={i} className="feed-row" style={{ cursor:'default', alignItems:'flex-start' }}>
          <div style={{ minWidth:64, textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, fontFeatureSettings:'"tnum"', color:ins.confidence>=80?C.green:ins.confidence>=60?C.amber:C.red }}>
              {ins.confidence}%
            </div>
            <div style={{ fontSize:10, color:C.textMuted, marginBottom:4 }}>{t('confidence')}</div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width:`${ins.confidence}%`, background:ins.confidence>=80?C.green:ins.confidence>=60?C.amber:C.red }} />
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
              <span className="tag tag-blue">{ins.category}</span>
              {ins.impact_level==='high' && <span className="tag tag-red">{t('high_impact')}</span>}
            </div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{ins.title}</div>
            <div style={{ fontSize:13, color:C.textSub, lineHeight:1.6 }}>{ins.description}</div>
            {ins.sources_count && (
              <div style={{ fontSize:11, color:C.textMuted, marginTop:8 }}>
                {t('based_on_sources', { count: ins.sources_count })}
              </div>
            )}
          </div>
        </div>
      )) : (
        <div style={{ padding:'40px 18px', textAlign:'center' }}>
          <LightBulbIcon style={{ width:32, margin:'0 auto 10px', display:'block', color:C.textMuted, opacity:0.4 }} />
          <p style={{ color:C.textMuted }}>{t('no_analysis')}</p>
        </div>
      )}
    </div>
  </div>
);

// 7. Paramètres
const SettingsTab = ({ user, t }) => {
  const [notifClaims, setNotifClaims] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifAI, setNotifAI] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return (
    <div className="fade-up" style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:24 }}>
      <section className="card">
        <div className="card-header">
          <UserCircleIcon style={{ width:18, color:C.black }} />
          <span className="card-title">{t('profile_info')}</span>
        </div>
        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label className="inp-label">{t('username')}</label><input type="text" defaultValue={user?.username||''} className="inp" /></div>
            <div><label className="inp-label">{t('email')}</label><input type="email" defaultValue={user?.email||''} className="inp" /></div>
          </div>
          <div><label className="inp-label">{t('department')}</label><input type="text" defaultValue={user?.department||''} className="inp" /></div>
          <button className="btn-black" onClick={handleSave}>{saved ? '✓ '+t('saved') : t('save_changes')}</button>
        </div>
      </section>
      <section className="card">
        <div className="card-header">
          <KeyIcon style={{ width:18, color:C.black }} />
          <span className="card-title">{t('change_password')}</span>
        </div>
        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:12 }}>
          <input type="password" placeholder={t('current_password')} className="inp" />
          <input type="password" placeholder={t('new_password')} className="inp" />
          <input type="password" placeholder={t('confirm_new_password')} className="inp" />
          <button className="btn-gray">{t('update_password')}</button>
        </div>
      </section>
      <section className="card">
        <div className="card-header">
          <BellIcon style={{ width:18, color:C.black }} />
          <span className="card-title">{t('notification_prefs')}</span>
        </div>
        <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { label: t('notif_claims_change'), value: notifClaims, set: setNotifClaims },
            { label: t('notif_weekly_summary'), value: notifWeekly, set: setNotifWeekly },
            { label: t('notif_ai_analysis'), value: notifAI, set: setNotifAI },
          ].map((n,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, color:C.textSub }}>{n.label}</span>
              <Toggle value={n.value} onChange={n.set} />
            </div>
          ))}
        </div>
      </section>
      <section className="card" style={{ borderColor:C.redBorder }}>
        <div className="card-header" style={{ borderColor:C.redBorder }}>
          <TrashIcon style={{ width:18, color:C.red }} />
          <span className="card-title" style={{ color:C.red }}>{t('danger_zone')}</span>
        </div>
        <div style={{ padding:'16px 18px' }}>
          <p style={{ fontSize:14, color:C.textMuted, marginBottom:14 }}>{t('delete_warning')}</p>
          <button className="btn-outline" style={{ color:C.red, borderColor:C.redBorder }} onClick={() => setShowDeleteModal(true)}>
            {t('delete_account')}
          </button>
        </div>
      </section>
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom:12 }}>{t('confirm_delete_title')}</h3>
            <p style={{ color:C.textSub, marginBottom:20 }}>{t('confirm_delete_message')}</p>
            <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
              <button className="btn-gray" onClick={() => setShowDeleteModal(false)}>{t('cancel')}</button>
              <button className="btn-black" style={{ background:C.red }} onClick={() => { /* TODO: delete account */ }}>{t('confirm_delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════ SKELETON ════════════════════════════════════
const DashSkeleton = () => (
  <div className="dash">
    <style>{CSS}</style>
    <div className="mobile-tabs"><div style={{ padding:12 }}><Sk w={120} h={28} /></div></div>
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-section" style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[...Array(7)].map((_,i)=><Sk key={i} h={34} />)}
        </div>
      </aside>
      <div className="main-content">
        <div className="metrics-grid">{[...Array(4)].map((_,i)=><Sk key={i} h={100} />)}</div>
        <div className="two-col">
          <div className="space-y"><Sk h={80} /><Sk h={160} /><Sk h={200} /></div>
          <div className="space-y"><Sk h={200} /><Sk h={180} /></div>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════ PAGE PRINCIPALE ═════════════════════════════
const DashboardPage = () => {
  const { t } = useTranslation('dashboard');
  const { user, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    personal: null, followedEvents: [], recommendations: [], aiInsights: [], activity: [],
  });

  // Transition pour changer d'onglet sans erreur de suspension synchrone
  const handleTabChange = (tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [pR, iR, fR, rR] = await Promise.allSettled([
          dashboardAPI.getPersonalDashboard(),
          dashboardAPI.getAIInsights(),
          eventsAPI.getFollowedEvents(),
          eventsAPI.getRecommendedEvents(),
        ]);
        if (cancelled) return;
        const ex = (r, fb) => r.status === 'fulfilled' ? (r.value?.data ?? fb) : fb;
        const personal = ex(pR, {})?.dashboard || ex(pR, {});
        const aiInsights = ex(iR, {})?.insights || [];
        const followedEvents = ensureArray(ex(fR, [])).map(normalizeClaim);
        const recommendations = ensureArray(ex(rR, [])).map(normalizeClaim);
        setData({ personal, aiInsights, followedEvents, recommendations, activity: personal?.recent_activity || [] });
      } catch {
        if (!cancelled) setError(t('load_error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [t]);

  if (loading) return <DashSkeleton />;
  if (error) return (
    <div className="dash" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <style>{CSS}</style>
      <div style={{ textAlign:'center' }}>
        <ExclamationTriangleIcon style={{ width:40, color:C.red, marginBottom:14 }} />
        <p style={{ color:C.textSub, marginBottom:16 }}>{error}</p>
        <button className="btn-black" onClick={() => window.location.reload()}>{t('retry')}</button>
      </div>
    </div>
  );

  const personal = data.personal || {};
  const u = user || personal.user || {};

  return (
    <div className="dash">
      <style>{CSS}</style>
      <MobileTabs activeTab={activeTab} onTab={handleTabChange} t={t} />
      <div className="dash-layout">
        <Sidebar activeTab={activeTab} onTab={handleTabChange} unreadCount={unreadCount||0} t={t} />
        <main className="main-content">
          <React.Suspense fallback={<DashSkeleton />}>
            {activeTab === 'overview'  && <OverviewTab   personal={personal} insights={data.aiInsights} recommendations={data.recommendations} activity={data.activity} navigate={navigate} t={t} />}
            {activeTab === 'alerts'    && <AlertsTab     followedEvents={data.followedEvents} insights={data.aiInsights} navigate={navigate} t={t} />}
            {activeTab === 'watchlist' && <WatchlistTab  followedEvents={data.followedEvents} navigate={navigate} t={t} />}
            {activeTab === 'impact'    && <ImpactTab     personal={personal} t={t} />}
            {activeTab === 'activity'  && <ActivityTab   activity={data.activity} navigate={navigate} t={t} />}
            {activeTab === 'insights'  && <InsightsTab   insights={data.aiInsights} t={t} />}
            {activeTab === 'settings'  && <SettingsTab   user={u} t={t} />}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;