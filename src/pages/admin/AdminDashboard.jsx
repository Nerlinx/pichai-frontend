// ═══════════════════════════════════════════════════════════════
// EXPAND — AdminDashboard.jsx
// Design : neutre, minimal — style Perplexity / Claude / Grok
// Connecté aux vrais endpoints backend
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// API & AUTH
// ============================================================
const API = 'http://localhost:8000';
const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API + path, { headers: headers(), ...opts });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API] ${path} failed:`, err.message);
    return null;
  }
}

// ============================================================
// THEME (Neutral, minimal)
// ============================================================
const T = {
  bg: '#FBFBFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F8FA',
  border: '#EAECF0',
  borderSub: '#F1F2F4',
  text: '#11181C',
  textSub: '#687076',
  textMuted: '#A0A7B0',
  accent: '#1F2A3A',
  accentSoft: '#F4F5F7',
  blue: '#2C6E9F',
  blueSoft: '#EFF6FF',
  green: '#2F855A',
  greenSoft: '#F0FDF4',
  red: '#C2412C',
  redSoft: '#FEF2F2',
  amber: '#B25E2C',
  amberSoft: '#FFFBEB',
  purple: '#6C4E9E',
  purpleSoft: '#F5F3FF',
};

// ============================================================
// ICONS (same as second version)
// ============================================================
const Svg = ({ d, size = 18, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  users: [
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
    'M23 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
    'M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  ],
  file: [
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    'M14 2v6h6',
    'M16 13H8',
    'M16 17H8',
    'M10 9H8',
  ],
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  tag: [
    'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
    'M7 7h.01',
  ],
  chart: 'M18 20V10M12 20V4M6 20v-6',
  crown: 'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14',
  clock: [
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 6v6l4 2',
  ],
  cog: [
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  ],
  bell: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  search: ['M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  edit: [
    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
    'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  ],
  trash: ['M3 6h18', 'M19 6l-1 14H6L5 6', 'M8 6V4h8v2'],
  eye: [
    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  ],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  sun: [
    'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
    'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  ],
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'],
  trend: 'M23 6l-9.5 9.5-5-5L1 18',
  db: [
    'M12 2C6.48 2 2 4.24 2 7s4.48 5 10 5 10-2.24 10-5-4.48-5-10-5z',
    'M2 7v5c0 2.76 4.48 5 10 5s10-2.24 10-5V7',
    'M2 12v5c0 2.76 4.48 5 10 5s10-2.24 10-5v-5',
  ],
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================
const Spin = () => (
  <div
    style={{
      width: 16,
      height: 16,
      border: `2px solid ${T.border}`,
      borderTopColor: T.blue,
      borderRadius: '50%',
      animation: 'spin .7s linear infinite',
      flexShrink: 0,
    }}
  />
);

const Badge = ({ children, bg = T.surfaceAlt, color = T.textMuted }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      background: bg,
      color,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: 24,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)',
      ...style,
    }}
  >
    {children}
  </div>
);

const TrustBar = ({ score, label = '' }) => {
  const pct = Math.round(score * 100);
  const color = score >= 0.7 ? T.green : score >= 0.4 ? T.amber : T.red;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 99,
          background: T.borderSub,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 99,
            background: color,
            transition: 'width .4s',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color: T.textMuted,
          width: 28,
          textAlign: 'right',
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        {pct}%
      </span>
    </div>
  );
};

const MiniStat = ({ label, value, color }) => (
  <div
    style={{
      textAlign: 'center',
      padding: '16px 12px',
      borderRadius: 10,
      background: T.surfaceAlt,
      border: `1px solid ${T.border}`,
    }}
  >
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color,
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: -1,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, fontWeight: 500 }}>
      {label}
    </div>
  </div>
);

// ============================================================
// PAGE COMPONENTS (each receives data and refresh callback)
// ============================================================

// Overview page – similar to second version but with real data
const PageOverview = ({ stats, claims, categories, logs }) => {
  const maxClaims = Math.max(...(categories?.map(c => c.total_claims || 0) || [1]), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14 }}>
        {[
          { label: 'Utilisateurs', val: stats?.users?.total?.toLocaleString() ?? '—', sub: `+${stats?.users?.new_today ?? 0} aujourd'hui`, color: T.blue, icon: I.users },
          { label: 'Claims', val: stats?.claims?.total ?? '—', sub: `${stats?.claims?.pending ?? 0} en attente`, color: T.accent, icon: I.file },
          { label: 'Prédictions', val: stats?.predictions?.total?.toLocaleString() ?? '—', sub: `${stats?.predictions?.accuracy ?? 0}% précision`, color: T.green, icon: I.trend },
          { label: 'Modération', val: stats?.moderation?.pending ?? '—', sub: `${stats?.moderation?.flagged ?? 0} urgents`, color: T.amber, icon: I.flag },
          { label: 'Sessions IA', val: stats?.ai_sessions?.today ?? '—', sub: `${stats?.ai_sessions?.avg_messages ?? 0} msg/session`, color: T.purple, icon: I.zap },
          { label: 'Preuves', val: stats?.evidence?.total?.toLocaleString() ?? '—', sub: `${stats?.evidence?.pending ?? 0} en attente`, color: '#2C6E9F', icon: I.db },
        ].map(({ label, val, sub, color, icon }) => (
          <div
            key={label}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -8,
                top: -8,
                opacity: 0.06,
                color,
              }}
            >
              <Svg d={icon} size={64} />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {label}
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color,
                }}
              >
                <Svg d={icon} size={15} />
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: T.text,
                letterSpacing: -1,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {val}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
                Activité — 14 derniers jours
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                Participants + nouvelles prédictions
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                ['#2C6E9F', 'Utilisateurs'],
                ['#2F855A', 'Claims'],
              ].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.textSub }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100 }}>
            {(stats?.activity ?? []).slice(0, 14).map((v, i) => {
              const max = Math.max(...(stats?.activity ?? []), 1);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(to top, #1d4ed8, #2C6E9F)`,
                      height: `${(v / max) * 85}%`,
                      minHeight: 4,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      width: '70%',
                      borderRadius: '3px 3px 0 0',
                      background: `linear-gradient(to top, #2F855A, #3A9B6C)`,
                      height: `${(v / max) * 55}%`,
                      minHeight: 3,
                      opacity: 0.7,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 10,
              color: T.textMuted,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            <span>1 Jan</span>
            <span>7 Jan</span>
            <span>14 Jan</span>
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 18 }}>
            Claims par statut
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Vérifiés', val: stats?.claims?.verified ?? 0, total: stats?.claims?.total ?? 1, color: T.green },
              { label: 'En cours', val: stats?.claims?.in_progress ?? 0, total: stats?.claims?.total ?? 1, color: T.blue },
              { label: 'En attente', val: stats?.claims?.pending ?? 0, total: stats?.claims?.total ?? 1, color: T.amber },
              { label: 'Contestés', val: stats?.claims?.controversial ?? 0, total: stats?.claims?.total ?? 1, color: T.red },
            ].map(({ label, val, total, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: T.textSub }}>{label}</span>
                  <span
                    style={{
                      color: T.text,
                      fontWeight: 700,
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {val}
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: T.border, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 99,
                      background: color,
                      width: `${(val / total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 16 }}>
            Alertes système
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: I.db, color: T.amber, bg: T.amberSoft, title: 'Stockage 85% utilisé', sub: 'Nettoyage des logs recommandé' },
              { icon: I.clock, color: T.blue, bg: T.blueSoft, title: 'Sauvegarde automatique dans 2h', sub: 'Dernière: il y a 22h' },
              { icon: I.activity, color: T.green, bg: T.greenSoft, title: 'API: 120ms moyen ✓', sub: 'Performance optimale' },
              { icon: I.shield, color: T.red, bg: T.redSoft, title: `${stats?.moderation?.pending ?? 0} signalements`, sub: 'Révision manuelle requise' },
            ].map(({ icon, color, bg, title, sub }) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: bg,
                  border: `1px solid ${color}22`,
                }}
              >
                <div style={{ color, flexShrink: 0 }}>
                  <Svg d={icon} size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{title}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 16 }}>
            Activité récente
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(logs ?? []).slice(0, 6).map((log, i) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < 5 ? `1px solid ${T.border}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 99,
                    background: log.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.textSub,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {log.desc}
                  </div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{log.user}</div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: T.textMuted,
                    fontFamily: "'IBM Plex Mono', monospace",
                    flexShrink: 0,
                  }}
                >
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Users page
const PageUsers = ({ users, rolesPerms, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const inp = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: T.surfaceAlt,
    color: T.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const filtered = (users || []).filter(
    u =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const createUser = async () => {
    if (!form.username || !form.email || !form.password) return;
    await apiFetch('/api/v1/users/', { method: 'POST', body: JSON.stringify(form) });
    setModal(false);
    setForm({ username: '', email: '', password: '', role: 'user' });
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Utilisateurs</h2>
          <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
            {users?.length ?? 0} inscrits · actifs: {users?.filter(u => u.active).length ?? 0} · suspendus:{' '}
            {users?.filter(u => !u.active).length ?? 0}
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 9,
            background: T.accent,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Svg d={I.plus} size={15} />
          Nouvel utilisateur
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: T.textMuted,
            }}
          >
            <Svg d={I.search} size={15} />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{ ...inp, paddingLeft: 34 }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ ...inp, width: 'auto', cursor: 'pointer' }}
        >
          <option value="all">Tous les rôles</option>
          {Object.entries(rolesPerms || {}).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {['Utilisateur', 'Rôle', 'Score confiance', 'Dernière connexion', 'Statut', ''].map(h => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 18px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const rCfg = rolesPerms?.[u.role] || { label: u.role, color: T.textMuted };
              return (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.surfaceAlt)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 800,
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{u.username}</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <Badge bg={`${rCfg.color}22`} color={rCfg.color}>
                      {rCfg.label}
                    </Badge>
                  </td>
                  <td style={{ padding: '13px 18px', minWidth: 140 }}>
                    <TrustBar score={u.trust} />
                  </td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: T.textSub }}>{u.lastLogin}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <Badge bg={u.active ? T.greenSoft : T.redSoft} color={u.active ? T.green : T.red}>
                      {u.active ? 'Actif' : 'Suspendu'}
                    </Badge>
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[I.edit, I.eye, u.active ? I.x : I.check].map((ic, idx) => (
                        <button
                          key={idx}
                          style={{
                            padding: 6,
                            borderRadius: 7,
                            border: 'none',
                            background: 'transparent',
                            color: T.textMuted,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = T.surfaceAlt;
                            e.currentTarget.style.color = T.text;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = T.textMuted;
                          }}
                        >
                          <Svg d={ic} size={14} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {modal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 20px 60px rgba(0,0,0,.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Créer un utilisateur</span>
              <button
                onClick={() => setModal(false)}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: 'none',
                  background: T.surfaceAlt,
                  color: T.textMuted,
                  cursor: 'pointer',
                }}
              >
                <Svg d={I.x} size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Nom d\'utilisateur', 'username', 'text', 'jean_dupont'],
                ['Email', 'email', 'email', 'user@expand.ht'],
                ['Mot de passe', 'password', 'password', '••••••••'],
              ].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.textMuted,
                      marginBottom: 5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={inp}
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Rôle
                </label>
                <select
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  style={{ ...inp, cursor: 'pointer' }}
                >
                  {Object.entries(rolesPerms || {}).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setModal(false)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 9,
                  border: `1px solid ${T.border}`,
                  background: 'transparent',
                  color: T.textSub,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Annuler
              </button>
              <button
                onClick={createUser}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 9,
                  border: 'none',
                  background: T.accent,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Claims page
const PageClaims = ({ claims, categories, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const statusMap = {
    pending: { label: 'En attente', bg: T.amberSoft, color: T.amber },
    verified: { label: 'Vérifié', bg: T.greenSoft, color: T.green },
    in_progress: { label: 'En cours', bg: T.blueSoft, color: T.blue },
    completed: { label: 'Complété', bg: T.greenSoft, color: T.green },
    failed: { label: 'Échoué', bg: T.redSoft, color: T.red },
    cancelled: { label: 'Annulé', bg: T.surfaceAlt, color: T.textMuted },
  };
  const filteredClaims = (claims || []).filter(
    c =>
      (filter === 'all' || c.status === filter) &&
      (c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.claimant?.toLowerCase().includes(search.toLowerCase()))
  );

  const approveClaim = async id => {
    await apiFetch(`/api/v1/claims/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'verified' }) });
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Claims & Engagements</h2>
          <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
            {claims?.length ?? 0} claims ·{' '}
            {claims?.filter(c => c.status === 'pending').length ?? 0} en attente
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 9,
            background: T.accent,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Svg d={I.plus} size={15} />
          Nouveau claim
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: T.textMuted,
            }}
          >
            <Svg d={I.search} size={15} />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.surfaceAlt,
              color: T.text,
              fontSize: 12,
              outline: 'none',
            }}
          />
        </div>
        {['all', 'pending', 'in_progress', 'verified', 'completed', 'failed'].map(s => {
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                border: `1px solid ${active ? T.accent : T.border}`,
                background: active ? T.accent : 'transparent',
                color: active ? '#fff' : T.textSub,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all .15s',
              }}
            >
              {s === 'all' ? 'Tous' : statusMap[s]?.label || s}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredClaims.map(claim => {
          const status = statusMap[claim.status] || statusMap.pending;
          const cat = categories?.find(c => c.id === claim.category_id);
          const catColor = cat?.color || T.accent;
          return (
            <Card key={claim.id} style={{ padding: '18px 22px', borderLeft: `3px solid ${claim.review ? T.amber : 'transparent'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <Badge bg={status.bg} color={status.color}>
                      {status.label}
                    </Badge>
                    <Badge bg={`${catColor}22`} color={catColor}>
                      {cat?.name || '—'}
                    </Badge>
                    {claim.review && (
                      <Badge bg={T.amberSoft} color={T.amber}>
                        ⚠ Révision requise
                      </Badge>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 5, lineHeight: 1.4 }}>
                    {claim.title}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    Par <strong style={{ color: T.textSub }}>{claim.claimant}</strong> · {new Date(claim.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[I.eye, I.edit, I.check, I.trash].map((ic, i) => {
                    if (ic === I.check && claim.status !== 'pending') return null;
                    return (
                      <button
                        key={i}
                        onClick={() => ic === I.check && approveClaim(claim.id)}
                        style={{
                          padding: 7,
                          borderRadius: 8,
                          border: `1px solid ${T.border}`,
                          background: 'transparent',
                          color: T.textMuted,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = T.surfaceAlt;
                          e.currentTarget.style.color = T.text;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = T.textMuted;
                        }}
                      >
                        <Svg d={ic} size={13} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      marginBottom: 5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Confiance IA
                  </div>
                  <TrustBar score={claim.ai_confidence_score ?? 0} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      marginBottom: 5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Consensus collectif
                  </div>
                  <TrustBar score={claim.crowd_confidence_score ?? 0} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Moderation page
const PageModeration = ({ moderation, onRefresh }) => {
  const approve = async id => {
    await apiFetch(`/api/v1/moderation/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) });
    onRefresh();
  };
  const reject = async id => {
    await apiFetch(`/api/v1/moderation/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) });
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Modération des contenus</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
          {moderation?.filter(m => m.status === 'pending').length ?? 0} éléments en attente
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
        <MiniStat label="En attente" value={moderation?.filter(m => m.status === 'pending').length ?? 0} color={T.amber} />
        <MiniStat label="Urgents" value={moderation?.filter(m => m.severity === 'high' && m.status === 'pending').length ?? 0} color={T.red} />
        <MiniStat label="Résolus aujourd'hui" value={moderation?.filter(m => m.resolved_today).length ?? 0} color={T.green} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(moderation || [])
          .filter(m => m.status === 'pending')
          .map(item => {
            const sevColor = item.severity === 'high' ? T.red : item.severity === 'medium' ? T.amber : T.green;
            const sevBg = item.severity === 'high' ? T.redSoft : item.severity === 'medium' ? T.amberSoft : T.greenSoft;
            return (
              <Card key={item.id} style={{ padding: '18px 22px', borderLeft: `3px solid ${sevColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <Badge bg={sevBg} color={sevColor}>
                        {item.severity === 'high' ? '🔴 Urgent' : item.severity === 'medium' ? '🟡 Moyen' : '🟢 Faible'}
                      </Badge>
                      <Badge bg={T.surfaceAlt} color={T.textSub}>
                        {item.type}
                      </Badge>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>
                      Signalé par <strong style={{ color: T.textSub }}>{item.reporter}</strong> · {item.reason} · {item.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => approve(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 14px',
                        borderRadius: 8,
                        border: `1px solid ${T.green}44`,
                        background: T.greenSoft,
                        color: T.green,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <Svg d={I.check} size={13} />
                      Approuver
                    </button>
                    <button
                      onClick={() => reject(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 14px',
                        borderRadius: 8,
                        border: `1px solid ${T.red}44`,
                        background: T.redSoft,
                        color: T.red,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <Svg d={I.x} size={13} />
                      Rejeter
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

// Categories page
const PageCategories = ({ categories, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#2C6E9F' });
  const inp = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: T.surfaceAlt,
    color: T.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };
  const maxClaims = Math.max(...(categories || []).map(c => c.total_claims || 0), 1);

  const createCategory = async () => {
    if (!form.name) return;
    await apiFetch('/api/v1/categories/', { method: 'POST', body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ name: '', slug: '', description: '', color: '#2C6E9F' });
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Catégories</h2>
          <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
            {categories?.length ?? 0} catégories actives dans le système
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 9,
            background: T.accent,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Svg d={I.plus} size={15} />
          Nouvelle catégorie
        </button>
      </div>

      {showForm && (
        <Card style={{ borderColor: `${T.blue}55` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>
            Créer une catégorie
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Nom', 'name', 'Sécurité'],
              ['Slug', 'slug', 'securite'],
              ['Description', 'description', 'Sécurité publique...'],
            ].map(([l, k, ph]) => (
              <div key={k} style={{ gridColumn: k === 'description' ? '1/-1' : 'auto' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {l}
                </label>
                <input
                  placeholder={ph}
                  value={form[k]}
                  onChange={e =>
                    setForm(p => ({
                      ...p,
                      [k]: e.target.value,
                      ...(k === 'name'
                        ? {
                            slug: e.target.value
                              .toLowerCase()
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, ''),
                          }
                        : {}),
                    }))
                  }
                  style={inp}
                />
              </div>
            ))}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.textMuted,
                  marginBottom: 5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Couleur
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  style={{
                    width: 42,
                    height: 36,
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.surfaceAlt,
                    cursor: 'pointer',
                    padding: 2,
                  }}
                />
                <input
                  value={form.color}
                  onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  style={{ ...inp, flex: 1 }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                border: `1px solid ${T.border}`,
                background: 'transparent',
                color: T.textSub,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Annuler
            </button>
            <button
              onClick={createCategory}
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                border: 'none',
                background: T.accent,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Créer
            </button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {(categories || []).map(cat => (
          <Card key={cat.id} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 12,
                    height: 36,
                    borderRadius: 4,
                    background: cat.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{cat.name}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: T.textMuted,
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    /{cat.slug}
                  </div>
                </div>
              </div>
              <button
                style={{
                  padding: 6,
                  borderRadius: 7,
                  border: `1px solid ${T.border}`,
                  background: 'transparent',
                  color: T.textMuted,
                  cursor: 'pointer',
                }}
              >
                <Svg d={I.edit} size={13} />
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                paddingTop: 12,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>Claims</div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: T.text,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {cat.total_claims ?? 0}
                </div>
                <div style={{ marginTop: 6, height: 3, borderRadius: 99, background: T.border, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 99,
                      background: cat.color,
                      width: `${((cat.total_claims ?? 0) / maxClaims) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 6 }}>Confiance moy.</div>
                <TrustBar score={cat.avg_confidence ?? 0} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Analytics page
const PageAnalytics = ({ stats, categories }) => {
  const maxClaims = Math.max(...(categories || []).map(c => c.total_claims || 0), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Analytiques</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
          Performance globale de la plateforme EXPAND
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
        {[
          { l: 'Utilisateurs actifs', v: stats?.users?.active?.toLocaleString() ?? '—', c: T.blue },
          { l: 'Sessions IA ce mois', v: stats?.ai_sessions?.total?.toLocaleString() ?? '—', c: T.purple },
          { l: 'Précision globale', v: `${stats?.predictions?.accuracy ?? 0}%`, c: T.green },
          { l: 'Satisfaction IA', v: `${stats?.ai_sessions?.satisfaction ?? 0}/5`, c: T.amber },
        ].map(({ l, v, c }) => (
          <div
            key={l}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: '16px 18px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: T.textMuted,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              {l}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: c,
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: -1,
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 18 }}>
            Claims par catégorie
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...(categories || [])]
              .sort((a, b) => (b.total_claims || 0) - (a.total_claims || 0))
              .map(cat => (
                <div key={cat.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: T.textSub }}>{cat.name}</span>
                    <span
                      style={{
                        color: T.text,
                        fontWeight: 700,
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      {cat.total_claims || 0}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: T.border, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 99,
                        background: cat.color,
                        width: `${((cat.total_claims || 0) / maxClaims) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 18 }}>
            Métriques plateforme
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { l: "Taux d'activation", v: stats?.users?.activation_rate ?? 0, c: T.blue },
              { l: 'Taux de vérification', v: stats?.claims?.verification_rate ?? 0, c: T.purple },
              { l: 'Engagement préd.', v: stats?.predictions?.engagement ?? 0, c: T.green },
              { l: 'Rétention 30 jours', v: stats?.users?.retention_30d ?? 0, c: T.amber },
              { l: 'Précision prédictions', v: stats?.predictions?.accuracy ?? 0, c: T.accent },
            ].map(({ l, v, c }) => (
              <div key={l}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: T.textSub }}>{l}</span>
                  <span
                    style={{
                      color: T.text,
                      fontWeight: 700,
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {v}%
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: T.border, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 99,
                      background: c,
                      width: `${v}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Roles page
const PageRoles = ({ rolesPerms }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Rôles & Permissions</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
          Hiérarchie des accès et permissions par rôle
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(rolesPerms || {}).map(([role, { label, color, perms }]) => (
          <Card key={role} style={{ padding: '16px 22px', borderLeft: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge bg={`${color}22`} color={color}>
                  {label}
                </Badge>
              </div>
              <button
                style={{
                  padding: 6,
                  borderRadius: 7,
                  border: `1px solid ${T.border}`,
                  background: 'transparent',
                  color: T.textMuted,
                  cursor: 'pointer',
                }}
              >
                <Svg d={I.edit} size={13} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {perms.map(p => (
                <span
                  key={p}
                  style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 6,
                    background: T.surfaceAlt,
                    color: T.textSub,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Logs page
const PageLogs = ({ logs }) => {
  const [search, setSearch] = useState('');
  const inp = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: T.surfaceAlt,
    color: T.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };
  const filtered = (logs || []).filter(
    l => l.desc?.toLowerCase().includes(search.toLowerCase()) || l.user?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Logs système</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
          Historique complet des activités
        </p>
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: '50%',
            transform: 'translateY(-50%)',
            color: T.textMuted,
          }}
        >
          <Svg d={I.search} size={15} />
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filtrer les logs..."
          style={{ ...inp, paddingLeft: 34 }}
        />
      </div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.map((log, i) => (
          <div
            key={log.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 20px',
              borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = T.surfaceAlt)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                background: log.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: T.textMuted,
                width: 40,
                fontFamily: "'IBM Plex Mono', monospace",
                flexShrink: 0,
              }}
            >
              {log.time}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, color: T.textSub }}>{log.desc}</span>
            </div>
            <span style={{ fontSize: 11, color: T.textMuted, flexShrink: 0 }}>{log.user}</span>
            <span
              style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 5,
                background: T.surfaceAlt,
                color: T.textMuted,
                border: `1px solid ${T.border}`,
                flexShrink: 0,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {log.type.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// Settings page
const PageSettings = ({ settings, meUser }) => {
  const inp = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: `1px solid ${T.border}`,
    background: T.surfaceAlt,
    color: T.text,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const saveSettings = async (section, data) => {
    await apiFetch('/api/v1/settings/', { method: 'POST', body: JSON.stringify({ section, data }) });
    // Optionally refresh
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Configuration</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: '4px 0 0' }}>
          Paramètres globaux de la plateforme EXPAND
        </p>
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 14 }}>
          Compte administrateur
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 14px',
            background: T.surfaceAlt,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: T.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {(meUser?.username || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{meUser?.username || 'Admin'}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>
              {meUser?.email || 'admin@expand.ht'} · {meUser?.role || 'admin'}
            </div>
          </div>
          <Badge bg={T.greenSoft} color={T.green}>
            Connecté
          </Badge>
        </div>
      </Card>

      {[
        {
          title: 'Général',
          fields: [
            { l: 'Nom de la plateforme', key: 'platform_name', type: 'text', default: settings?.platform_name ?? 'EXPAND' },
            { l: 'Email de contact', key: 'contact_email', type: 'email', default: settings?.contact_email ?? 'admin@expand.ht' },
            { l: 'Langue par défaut', key: 'default_language', type: 'select', opts: ['fr', 'ht', 'en'], default: settings?.default_language ?? 'fr' },
          ],
        },
        {
          title: 'Sécurité',
          fields: [
            { l: 'Score confiance minimum', key: 'min_trust_score', type: 'number', default: settings?.min_trust_score ?? 0.3 },
            { l: 'Tentatives login max', key: 'max_login_attempts', type: 'number', default: settings?.max_login_attempts ?? 5 },
            { l: 'Durée session (min)', key: 'session_duration', type: 'number', default: settings?.session_duration ?? 60 },
          ],
        },
        {
          title: 'IA & Modération',
          fields: [
            { l: 'Seuil auto-approuver', key: 'auto_approve_threshold', type: 'number', default: settings?.auto_approve_threshold ?? 0.9 },
            { l: 'Modèle IA par défaut', key: 'default_ai_model', type: 'text', default: settings?.default_ai_model ?? 'claude-sonnet-4-6' },
            { l: 'Auto-résolution (jours)', key: 'auto_resolution_days', type: 'number', default: settings?.auto_resolution_days ?? 30 },
          ],
        },
        {
          title: 'Notifications',
          fields: [
            { l: 'Email alertes admin', key: 'alert_email', type: 'email', default: settings?.alert_email ?? 'alerts@expand.ht' },
            { l: 'Seuil alerte modération', key: 'moderation_alert_threshold', type: 'number', default: settings?.moderation_alert_threshold ?? 10 },
          ],
        },
      ].map(section => (
        <Card key={section.title}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>
            {section.title}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
            {section.fields.map(f => (
              <div key={f.key}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {f.l}
                </label>
                {f.type === 'select' ? (
                  <select defaultValue={f.default} style={{ ...inp, cursor: 'pointer' }}>
                    {f.opts?.map(o => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type={f.type} defaultValue={f.default} style={inp} />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              // Gather values from inputs and save
              const data = {};
              section.fields.forEach(f => {
                const input = document.querySelector(`[data-key="${f.key}"]`);
                if (input) data[f.key] = input.value;
              });
              saveSettings(section.title, data);
            }}
            style={{
              marginTop: 16,
              padding: '9px 20px',
              borderRadius: 9,
              border: 'none',
              background: T.accent,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Sauvegarder {section.title}
          </button>
        </Card>
      ))}
    </div>
  );
};

// ============================================================
// NAVIGATION
// ============================================================
const NAV = [
  { id: 'overview', label: "Vue d'ensemble", icon: I.grid },
  { id: 'users', label: 'Utilisateurs', icon: I.users },
  { id: 'claims', label: 'Claims', icon: I.file },
  { id: 'moderation', label: 'Modération', icon: I.shield },
  { id: 'categories', label: 'Catégories', icon: I.tag },
  { id: 'analytics', label: 'Analytiques', icon: I.chart },
  { id: 'roles', label: 'Rôles', icon: I.crown },
  { id: 'logs', label: 'Logs système', icon: I.clock },
  { id: 'settings', label: 'Configuration', icon: I.cog },
];

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
export default function AdminDashboard() {
  const [page, setPage] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [data, setData] = useState({
    stats: null,
    users: [],
    claims: [],
    categories: [],
    moderation: [],
    rolesPerms: {},
    logs: [],
    settings: null,
    meUser: null,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const [stats, users, claims, categories, moderation, rolesPerms, logs, settings, me] = await Promise.all([
      apiFetch('/api/v1/analytics/stats'),
      apiFetch('/api/v1/users/'),
      apiFetch('/api/v1/claims/'),
      apiFetch('/api/v1/categories/'),
      apiFetch('/api/v1/moderation/'),
      apiFetch('/api/v1/roles/'),
      apiFetch('/api/v1/logs/'),
      apiFetch('/api/v1/settings/'),
      apiFetch('/api/v1/auth/me'),
    ]);
    setData({
      stats: stats || null,
      users: users?.users || users || [],
      claims: claims?.claims || claims || [],
      categories: categories?.categories || categories || [],
      moderation: moderation?.moderation || moderation || [],
      rolesPerms: rolesPerms?.roles || rolesPerms || {},
      logs: logs?.logs || logs || [],
      settings: settings?.settings || settings || null,
      meUser: me?.user || me || null,
    });
    setLastSync(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = () => loadData();

  const pages = {
    overview: <PageOverview stats={data.stats} claims={data.claims} categories={data.categories} logs={data.logs} />,
    users: <PageUsers users={data.users} rolesPerms={data.rolesPerms} onRefresh={refresh} />,
    claims: <PageClaims claims={data.claims} categories={data.categories} onRefresh={refresh} />,
    moderation: <PageModeration moderation={data.moderation} onRefresh={refresh} />,
    categories: <PageCategories categories={data.categories} onRefresh={refresh} />,
    analytics: <PageAnalytics stats={data.stats} categories={data.categories} />,
    roles: <PageRoles rolesPerms={data.rolesPerms} />,
    logs: <PageLogs logs={data.logs} />,
    settings: <PageSettings settings={data.settings} meUser={data.meUser} />,
  };

  const activeNav = NAV.find(n => n.id === page);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        inset: 0,
        background: T.bg,
        color: T.text,
        fontFamily: "'DM Sans', 'Sora', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: 54,
          flexShrink: 0,
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          zIndex: 200,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              padding: 7,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: T.textMuted,
              cursor: 'pointer',
            }}
          >
            <Svg d={I.menu} size={17} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: T.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg d={I.shield} size={14} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: '0.05em' }}>
              EXPAND
            </span>
            <span style={{ fontSize: 11, color: T.border }}>|</span>
            <span style={{ fontSize: 12, color: T.textMuted }}>Administration</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading && <Spin />}
          {lastSync && !loading && (
            <span style={{ fontSize: 10, color: T.textMuted }}>
              {lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={refresh}
            style={{
              padding: 6,
              borderRadius: 6,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.textMuted,
              cursor: 'pointer',
            }}
          >
            <Svg d={I.clock} size={14} />
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 10px',
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.surfaceAlt,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 800,
                color: '#fff',
              }}
            >
              {(data.meUser?.username || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
                {data.meUser?.username || 'Admin'}
              </div>
              <div style={{ fontSize: 9, color: T.textMuted }}>{data.meUser?.role || 'admin'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: collapsed ? 52 : 212,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: T.surface,
            borderRight: `1px solid ${T.border}`,
            transition: 'width .2s ease',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
            {NAV.map(item => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? 0 : 9,
                    padding: collapsed ? '10px 0' : '8px 11px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: 1,
                    background: active ? T.accentSoft : 'transparent',
                    color: active ? T.text : T.textMuted,
                    borderLeft: active ? `2px solid ${T.accent}` : '2px solid transparent',
                    transition: 'all .12s',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = T.surfaceAlt;
                      e.currentTarget.style.color = T.textSub;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = T.textMuted;
                    }
                  }}
                >
                  <Svg d={item.icon} size={16} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        fontSize: 12.5,
                        fontWeight: active ? 700 : 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Profile bottom */}
          <div style={{ borderTop: `1px solid ${T.borderSub}`, padding: '10px 6px' }}>
            {!collapsed && (
              <div
                style={{
                  padding: '7px 11px',
                  borderRadius: 8,
                  background: T.surfaceAlt,
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: T.text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {data.meUser?.username || 'Admin'}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: T.textMuted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {data.meUser?.email || 'admin@expand.ht'}
                </div>
              </div>
            )}
            <button
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 8,
                padding: collapsed ? '9px 0' : '7px 11px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: T.textMuted,
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all .15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = T.red;
                e.currentTarget.style.background = T.redSoft;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = T.textMuted;
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Svg d={I.logout} size={15} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: T.bg }}>
          {loading && page === 'overview' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                gap: 10,
                color: T.textMuted,
                fontSize: 13,
              }}
            >
              <Spin />
              <span>Chargement…</span>
            </div>
          ) : (
            pages[page]
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: 38,
          flexShrink: 0,
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          fontSize: 11,
          color: T.textMuted,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontWeight: 700, color: T.textMuted }}>EXPAND Admin v1.0</span>
          <span>·</span>
          <span>© 2024 EXPAND</span>
          <span>·</span>
          <span>Tous droits réservés</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: 99, background: T.green }} />
            <span style={{ color: T.textMuted }}>API connectée</span>
          </div>
          <span>·</span>
          <span style={{ color: T.textMuted }}>Sync {lastSync ? lastSync.toLocaleTimeString('fr-FR') : '—'}</span>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * {
          box-sizing: border-box;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${T.border};
          border-radius: 99px;
        }
        input::placeholder {
          color: ${T.textMuted};
        }
        button {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}