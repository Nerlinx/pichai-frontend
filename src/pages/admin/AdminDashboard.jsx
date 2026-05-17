// ═══════════════════════════════════════════════════════════════
// PichAI — AdminDashboard.jsx (version complète – police Inter)
// Connecté à : adminAPI, claimsAdminAPI, categoriesAdminAPI,
//               evidenceAPI, translationsAPI, authAPI, categoriesAPI
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useAuth } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  adminAPI,
  claimsAdminAPI,
  categoriesAdminAPI,
  evidenceAPI,
  translationsAPI,
  authAPI,
  categoriesAPI,
} from '../../services/api';

import logoLight from '../../assets/log_pichAI_black.png';
import logoDark from '../../assets/log_pichAI_white.png';

// ── Rôles par défaut ──────────────────────────────────────────
const DEFAULT_ROLES = {
  super_admin: { label: 'Super Administrateur', color: '#6C4E9E', perms: ['Accès total', 'Configuration système', 'Gérer tous les rôles', 'Supprimer des données critiques'] },
  admin: { label: 'Administrateur', color: '#C2412C', perms: ['Gérer les utilisateurs', 'Gérer les claims', 'Voir les logs', 'Gérer les catégories'] },
  moderator: { label: 'Modérateur', color: '#B25E2C', perms: ['Modérer les commentaires', 'Approuver les preuves', 'Voir les logs'] },
  editor: { label: 'Éditeur', color: '#2C6E9F', perms: ['Créer des claims', 'Modifier les claims', 'Gérer les catégories'] },
  contributor: { label: 'Contributeur', color: '#2F855A', perms: ['Soumettre des preuves', 'Créer des claims', 'Voter'] },
  verified_user: { label: 'Utilisateur vérifié', color: '#0E7490', perms: ['Voter', 'Commenter', 'Soumettre des preuves'] },
  user: { label: 'Utilisateur', color: '#687076', perms: ['Voter', 'Commenter'] },
};

// ── API étendue ──────────────────────────────────────────────
const extendedAdminAPI = {
  ...adminAPI,
  getRoles: () => api.get('/api/v1/admin/roles').catch(() => ({ data: { roles: DEFAULT_ROLES } })),
  getLogs: () => api.get('/api/v1/admin/logs').catch(() => ({ data: { logs: [] } })),
  getSettings: () => api.get('/api/v1/admin/settings').catch(() => ({ data: { settings: {} } })),
  updateSettings: (data) => api.post('/api/v1/admin/settings', data),
};

// ═══════════════════════════════════════════════════════════════
// THÈMES CLAIR & SOMBRE
// ═══════════════════════════════════════════════════════════════
const LIGHT_COLORS = {
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

const DARK_COLORS = {
  bg: '#0B0E14',
  surface: '#11161F',
  surfaceAlt: '#1A212C',
  border: '#2A323F',
  borderSub: '#1E2530',
  text: '#F0F3F8',
  textSub: '#9AA6B9',
  textMuted: '#6C7A8E',
  accent: '#3B82F6',
  accentSoft: '#1E293B',
  blue: '#60A5FA',
  blueSoft: '#1E3A5F',
  green: '#34D399',
  greenSoft: '#064E3B',
  red: '#F87171',
  redSoft: '#7F1D1D',
  amber: '#FBBF24',
  amberSoft: '#78350F',
  purple: '#A78BFA',
  purpleSoft: '#4C1D95',
};

// ── Contexte du thème admin ─────────────────────────────────
const AdminThemeContext = createContext({
  colors: LIGHT_COLORS,
  isDark: false,
});

const useAdminTheme = () => useContext(AdminThemeContext);

// ── Hook de détection du thème global ───────────────────────
const useAdminColors = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('pichai-theme') || 'light');

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'pichai-theme') setTheme(e.newValue || 'light');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isDark = theme === 'dark';
  return { colors: isDark ? DARK_COLORS : LIGHT_COLORS, isDark };
};

// ═══════════════════════════════════════════════════════════════
// ICONS SVG
// ═══════════════════════════════════════════════════════════════
const Svg = ({ d, size = 18, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
    strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  users: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75','M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  tag: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  chart: 'M18 20V10M12 20V4M6 20v-6',
  crown: 'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14',
  clock: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 6v6l4 2'],
  cog: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  bell: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  search: ['M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  edit: ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash: ['M3 6h18','M19 6l-1 14H6L5 6','M8 6V4h8v2'],
  eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  menu: 'M3 12h18M3 6h18M3 18h18',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z','M4 22v-7'],
  trend: 'M23 6l-9.5 9.5-5-5L1 18',
  db: ['M12 2C6.48 2 2 4.24 2 7s4.48 5 10 5 10-2.24 10-5-4.48-5-10-5z','M2 7v5c0 2.76 4.48 5 10 5s10-2.24 10-5V7','M2 12v5c0 2.76 4.48 5 10 5s10-2.24 10-5v-5'],
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  translate: ['M5 8l4 4M3 12l4-4','M12 4h7','M12 8h7','M8 16l4-4'],
};

// ═══════════════════════════════════════════════════════════════
// COMPOSANTS GÉNÉRIQUES (thématisés)
// ═══════════════════════════════════════════════════════════════
const Spin = () => {
  const { colors } = useAdminTheme();
  return (
    <div style={{ width: 16, height: 16, border: `2px solid ${colors.border}`, borderTopColor: colors.blue,
      borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
  );
};

const Badge = ({ children, bg, color }) => {
  const { colors } = useAdminTheme();
  const finalBg = bg || colors.surfaceAlt;
  const finalColor = color || colors.textMuted;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, background: finalBg, color: finalColor, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

const Card = ({ children, style = {} }) => {
  const { colors } = useAdminTheme();
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14,
      padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)', ...style }}>
      {children}
    </div>
  );
};

const TrustBar = ({ score }) => {
  const { colors } = useAdminTheme();
  const pct = Math.round(score * 100);
  const barColor = score >= 0.7 ? colors.green : score >= 0.4 ? colors.amber : colors.red;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: colors.borderSub, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: barColor, transition: 'width .4s' }} />
      </div>
      <span style={{ fontSize: 11, color: colors.textMuted, width: 28, textAlign: 'right', fontFamily: "'Inter', sans-serif" }}>{pct}%</span>
    </div>
  );
};

const MiniStat = ({ label, value, color }) => {
  const { colors } = useAdminTheme();
  return (
    <div style={{ textAlign: 'center', padding: '16px 12px', borderRadius: 10, background: colors.surfaceAlt, border: `1px solid ${colors.border}` }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "'Inter', sans-serif", letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
};

// ── Skeleton Shimmer adaptatif ──────────────────────────────
const SkeletonBlock = ({ width = '100%', height = 16, borderRadius = 6, style = {} }) => {
  const { colors } = useAdminTheme();
  return (
    <div style={{
      width, height, borderRadius,
      background: `linear-gradient(90deg, ${colors.borderSub} 25%, ${colors.surfaceAlt} 50%, ${colors.borderSub} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
};

// ── Toast ───────────────────────────────────────────────────
const Toast = ({ message, type = 'success', onClose }) => {
  const { colors } = useAdminTheme();
  const bg = type === 'success' ? colors.greenSoft : type === 'error' ? colors.redSoft : colors.amberSoft;
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : colors.amber;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: bg, border: `1px solid ${color}44`, borderRadius: 12, padding: '12px 18px',
      display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      fontSize: 13, fontWeight: 500, color: colors.text,
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: 2 }}>✕</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGES DE L'ADMINISTRATION
// ═══════════════════════════════════════════════════════════════

// ─── VUE D'ENSEMBLE ─────────────────────────────────────────
const PageOverview = ({ stats, claims, categories, logs, loading }) => {
  const { colors } = useAdminTheme();

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14 }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 18 }}>
            <SkeletonBlock height={14} width="60%" style={{ marginBottom: 12 }} />
            <SkeletonBlock height={28} width="40%" style={{ marginBottom: 8 }} />
            <SkeletonBlock height={10} width="80%" />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card><SkeletonBlock height={140} /></Card>
        <Card><SkeletonBlock height={140} /></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card><SkeletonBlock height={100} /></Card>
        <Card><SkeletonBlock height={100} /></Card>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14 }}>
        {[
          { label: 'Utilisateurs', val: stats?.users?.total?.toLocaleString() ?? '—', sub: `+${stats?.users?.new_today ?? 0} aujourd'hui`, color: colors.blue, icon: I.users },
          { label: 'Claims', val: stats?.claims?.total ?? '—', sub: `${stats?.claims?.pending ?? 0} en attente`, color: colors.accent, icon: I.file },
          { label: 'Prédictions', val: stats?.predictions?.total?.toLocaleString() ?? '—', sub: `${stats?.predictions?.accuracy ?? 0}% précision`, color: colors.green, icon: I.trend },
          { label: 'Modération', val: stats?.moderation?.pending ?? '—', sub: `${stats?.moderation?.flagged ?? 0} urgents`, color: colors.amber, icon: I.flag },
          { label: 'Sessions IA', val: stats?.ai_sessions?.today ?? '—', sub: `${stats?.ai_sessions?.avg_messages ?? 0} msg/session`, color: colors.purple, icon: I.zap },
          { label: 'Preuves', val: stats?.evidence?.total?.toLocaleString() ?? '—', sub: `${stats?.evidence?.pending ?? 0} en attente`, color: '#2C6E9F', icon: I.db },
        ].map(({ label, val, sub, color, icon }) => (
          <div key={label} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -8, top: -8, opacity: 0.06, color }}><Svg d={icon} size={64} /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}><Svg d={icon} size={15} /></div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.text, letterSpacing: -1, fontFamily: "'Inter', sans-serif" }}>{val}</div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>Activité — 14 derniers jours</div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Participants + nouvelles prédictions</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['#2C6E9F', 'Utilisateurs'], ['#2F855A', 'Claims']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: colors.textSub }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 100 }}>
            {(stats?.activity ?? []).slice(0, 14).map((v, i) => {
              const max = Math.max(...(stats?.activity ?? []), 1);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: 'linear-gradient(to top, #1d4ed8, #2C6E9F)', height: `${(v / max) * 85}%`, minHeight: 4, opacity: 0.85 }} />
                  <div style={{ width: '70%', borderRadius: '3px 3px 0 0', background: 'linear-gradient(to top, #2F855A, #3A9B6C)', height: `${(v / max) * 55}%`, minHeight: 3, opacity: 0.7 }} />
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 18 }}>Claims par statut</div>
          {[
            { label: 'Vérifiés', val: stats?.claims?.verified ?? 0, total: stats?.claims?.total ?? 1, color: colors.green },
            { label: 'En cours', val: stats?.claims?.in_progress ?? 0, total: stats?.claims?.total ?? 1, color: colors.blue },
            { label: 'En attente', val: stats?.claims?.pending ?? 0, total: stats?.claims?.total ?? 1, color: colors.amber },
            { label: 'Contestés', val: stats?.claims?.controversial ?? 0, total: stats?.claims?.total ?? 1, color: colors.red },
          ].map(({ label, val, total, color }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: colors.textSub }}>{label}</span>
                <span style={{ color: colors.text, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{val}</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: colors.border, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, background: color, width: `${(val / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Alertes système</div>
          {[
            { icon: I.db, color: colors.amber, bg: colors.amberSoft, title: 'Stockage 85% utilisé', sub: 'Nettoyage des logs recommandé' },
            { icon: I.clock, color: colors.blue, bg: colors.blueSoft, title: 'Sauvegarde automatique dans 2h', sub: 'Dernière: il y a 22h' },
            { icon: I.activity, color: colors.green, bg: colors.greenSoft, title: 'API: 120ms moyen ✓', sub: 'Performance optimale' },
            { icon: I.shield, color: colors.red, bg: colors.redSoft, title: `${stats?.moderation?.pending ?? 0} signalements`, sub: 'Révision manuelle requise' },
          ].map(({ icon, color, bg, title, sub }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: bg, border: `1px solid ${color}22`, marginBottom: 10 }}>
              <div style={{ color, flexShrink: 0 }}><Svg d={icon} size={16} /></div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{title}</div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Activité récente</div>
          {(logs ?? []).slice(0, 6).map((log, i) => (
            <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 5 ? `1px solid ${colors.border}` : 'none' }}>
              <div style={{ width: 7, height: 7, borderRadius: 99, background: log.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: colors.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.desc}</div>
                <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 1 }}>{log.user}</div>
              </div>
              <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>{log.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── UTILISATEURS ────────────────────────────────────────────
const PageUsers = ({ users, rolesPerms, onRefresh, showToast }) => {
  const { colors } = useAdminTheme();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [saving, setSaving] = useState(false);
  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' };

  const filtered = (users || []).filter(u => {
    const userRole = Array.isArray(u.roles) ? u.roles[0] : u.role;
    return (roleFilter === 'all' || userRole === roleFilter) &&
      (u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  });

  const createUser = async () => {
    if (!form.username || !form.email || !form.password) return;
    setSaving(true);
    try {
      await api.post('/api/v1/admin/users/create', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setModal(false);
      setForm({ username: '', email: '', password: '', role: 'user' });
      onRefresh();
      showToast('Utilisateur créé avec succès', 'success');
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Erreur', 'error');
    } finally { setSaving(false); }
  };

  const changeStatus = async (userId, action) => {
    try {
      await extendedAdminAPI.updateUserStatus(userId, action);
      onRefresh();
      showToast(`Statut mis à jour : ${action}`, 'success');
    } catch (err) { showToast(err?.message || 'Erreur', 'error'); }
  };

  if (!users) return <SkeletonBlock height={300} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Utilisateurs</h2>
          <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>
            {users.length} inscrits · actifs: {users.filter(u => u.active).length} · suspendus: {users.filter(u => !u.active).length}
          </p>
        </div>
        <button onClick={() => setModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, background: colors.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Svg d={I.plus} size={15} /> Nouvel utilisateur
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }}><Svg d={I.search} size={15} /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ ...inp, paddingLeft: 34 }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inp, width: 'auto', cursor: 'pointer' }}>
          <option value="all">Tous les rôles</option>
          {Object.entries(rolesPerms || {}).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            {['Utilisateur', 'Rôle', 'Score confiance', 'Dernière connexion', 'Statut', ''].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((u, i) => {
              const userRole = Array.isArray(u.roles) ? u.roles[0] : u.role;
              const rCfg = rolesPerms?.[userRole] || { label: userRole || 'user', color: colors.textMuted };
              return (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.surfaceAlt}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.blue}, ${colors.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{u.username[0].toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{u.username}</div>
                        <div style={{ fontSize: 11, color: colors.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px' }}><Badge bg={`${rCfg.color}22`} color={rCfg.color}>{rCfg.label}</Badge></td>
                  <td style={{ padding: '13px 18px', minWidth: 140 }}><TrustBar score={u.trust_score ?? 0} /></td>
                  <td style={{ padding: '13px 18px', fontSize: 12, color: colors.textSub }}>{u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('fr-FR') : '—'}</td>
                  <td style={{ padding: '13px 18px' }}><Badge bg={u.is_active ? colors.greenSoft : colors.redSoft} color={u.is_active ? colors.green : colors.red}>{u.is_active ? 'Actif' : 'Suspendu'}</Badge></td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => changeStatus(u.id, u.is_active ? 'suspend' : 'activate')} style={{ padding: 6, borderRadius: 7, border: 'none', background: 'transparent', color: colors.textMuted, cursor: 'pointer' }}><Svg d={u.is_active ? I.x : I.check} size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>Créer un utilisateur</span>
              <button onClick={() => setModal(false)} style={{ padding: 6, borderRadius: 8, border: 'none', background: colors.surfaceAlt, color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.x} size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Nom d\'utilisateur', 'username', 'text', 'jean_dupont'], ['Email', 'email', 'email', 'user@gmail.com'], ['Mot de passe', 'password', 'password', '••••••••']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rôle</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  {Object.entries(rolesPerms || {}).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px 0', borderRadius: 9, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSub, cursor: 'pointer', fontSize: 13 }}>Annuler</button>
              <button onClick={createUser} disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', background: colors.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{saving ? <Spin /> : 'Créer le compte'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CLAIMS ───────────────────────────────────────────────────
const PageClaims = ({ claims, categories, onRefresh, showToast }) => {
  const { colors } = useAdminTheme();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', claimant: '', claimant_type: '',
    claim_date: new Date().toISOString().split('T')[0],
    category_id: '', department: '', municipality: '', geographic_scope: '',
  });
  const [saving, setSaving] = useState(false);
  const statusMap = {
    pending: { label: 'En attente', bg: colors.amberSoft, color: colors.amber },
    verified: { label: 'Vérifié', bg: colors.greenSoft, color: colors.green },
    in_progress: { label: 'En cours', bg: colors.blueSoft, color: colors.blue },
    rejected: { label: 'Rejeté', bg: colors.redSoft, color: colors.red },
    archived: { label: 'Archivé', bg: colors.surfaceAlt, color: colors.textMuted },
  };

  const filteredClaims = (claims || []).filter(c =>
    (filter === 'all' || c.status === filter) &&
    (c.title?.toLowerCase().includes(search.toLowerCase()) || c.claimant?.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => {
    setForm({
      title: '', description: '', claimant: '', claimant_type: '',
      claim_date: new Date().toISOString().split('T')[0],
      category_id: '', status: 'pending', department: '',
      municipality: '', geographic_scope: '',
      title_ht: '', claimant_ht: '', description_ht: '', short_description_ht: '',
    });
    setModal('create');
  };
  const openEdit = (claim) => {
    setForm({
      title: claim.title || '', description: claim.description || '',
      claimant: claim.claimant || '', claimant_type: claim.claimant_type || '',
      claim_date: claim.claim_date || new Date().toISOString().split('T')[0],
      category_id: claim.category_id || '',
      status: claim.status || 'pending', department: claim.department || '',
      municipality: claim.municipality || '', geographic_scope: claim.geographic_scope || '',
      title_ht: claim.title_ht || '',
      claimant_ht: claim.claimant_ht || '',
      description_ht: claim.description_ht || '',
      short_description_ht: claim.short_description_ht || '',
    });
    setModal({ action: 'edit', claim });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        claimant: form.claimant,
        claimant_type: form.claimant_type,
        claim_date: form.claim_date || new Date().toISOString().split('T')[0],
        category_id: form.category_id ? Number(form.category_id) : null,
        department: form.department || null,
        municipality: form.municipality || null,
        title_ht: form.title_ht || null,
        geographic_scope: form.geographic_scope || null,
        claimant_ht: form.claimant_ht || null,
        description_ht: form.description_ht || null,
        short_description_ht: form.short_description_ht || null,
      };

      if (modal === 'create') {
        await claimsAdminAPI.createClaim(payload);
        showToast('Claim créé', 'success');
      } else if (modal?.action === 'edit') {
        await claimsAdminAPI.updateClaim(modal.claim.id, payload);
        showToast('Claim modifié', 'success');
      }
      setModal(null);
      onRefresh();
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Erreur', 'error');
    } finally { setSaving(false); }
  };

  const deleteClaim = async (id) => {
    if (!window.confirm('Supprimer ce claim ?')) return;
    try {
      await claimsAdminAPI.deleteClaim(id);
      showToast('Claim supprimé', 'success');
      onRefresh();
    } catch (err) { showToast(err?.message || 'Erreur', 'error'); }
  };

  const changeStatus = async (id, status) => {
    try {
      await claimsAdminAPI.updateClaimStatus(id, status);
      showToast(`Statut changé : ${status}`, 'success');
      onRefresh();
    } catch (err) { showToast(err?.message || 'Erreur', 'error'); }
  };

  const translate = async () => {
    if (!form.title && !form.description) return;
    try {
      const result = await translationsAPI.translateClaim(form);
      setForm(prev => ({ ...prev, ...result }));
      showToast('Traduction générée', 'success');
    } catch (err) { showToast('Erreur de traduction', 'error'); }
  };

  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' };

  if (!claims) return <SkeletonBlock height={300} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Claims & Engagements</h2>
          <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>{claims.length} claims · {claims.filter(c => c.status === 'pending').length} en attente</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, background: colors.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Svg d={I.plus} size={15} /> Nouveau claim
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }}><Svg d={I.search} size={15} /></div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ ...inp, paddingLeft: 34 }} />
        </div>
        {['all', 'pending', 'in_progress', 'verified', 'rejected', 'archived'].map(s => {
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${active ? colors.accent : colors.border}`, background: active ? colors.accent : 'transparent', color: active ? '#fff' : colors.textSub, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .15s' }}>{s === 'all' ? 'Tous' : statusMap[s]?.label || s}</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredClaims.map(claim => {
          const status = statusMap[claim.status] || statusMap.pending;
          const cat = categories?.find(c => c.id === claim.category_id);
          const catColor = cat?.color || colors.accent;
          return (
            <Card key={claim.id} style={{ padding: '18px 22px', borderLeft: `3px solid ${claim.review ? colors.amber : 'transparent'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <Badge bg={status.bg} color={status.color}>{status.label}</Badge>
                    <Badge bg={`${catColor}22`} color={catColor}>{cat?.name || '—'}</Badge>
                    {claim.review && <Badge bg={colors.amberSoft} color={colors.amber}>⚠ Révision requise</Badge>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 5, lineHeight: 1.4 }}>{claim.title}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Par <strong style={{ color: colors.textSub }}>{claim.claimant}</strong> · {new Date(claim.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(claim)} style={{ padding: 6, borderRadius: 7, border: 'none', background: 'transparent', color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.edit} size={13} /></button>
                  <button onClick={() => deleteClaim(claim.id)} style={{ padding: 6, borderRadius: 7, border: 'none', background: 'transparent', color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.trash} size={13} /></button>
                  <select value={claim.status} onChange={e => changeStatus(claim.id, e.target.value)} style={{ ...inp, width: 'auto', padding: '4px 8px', fontSize: 11 }}>
                    {Object.keys(statusMap).map(s => <option key={s} value={s}>{statusMap[s].label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
                <div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Confiance IA</div>
                  <TrustBar score={claim.ai_confidence_score ?? 0} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consensus collectif</div>
                  <TrustBar score={claim.crowd_confidence_score ?? 0} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>{modal === 'create' ? 'Nouveau claim' : 'Modifier le claim'}</span>
              <button onClick={() => setModal(null)} style={{ padding: 6, borderRadius: 8, border: 'none', background: colors.surfaceAlt, color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.x} size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Titre', 'Description', 'Institution', 'Département'].map((label, i) => {
                const keys = ['title', 'description', 'claimant', 'department'];
                return (
                  <div key={keys[i]}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    {i === 1
                      ? <textarea rows={3} value={form[keys[i]]} onChange={e => setForm(p => ({ ...p, [keys[i]]: e.target.value }))} style={{ ...inp, resize: 'vertical' }} />
                      : <input value={form[keys[i]]} onChange={e => setForm(p => ({ ...p, [keys[i]]: e.target.value }))} style={inp} />}
                  </div>
                );
              })}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type d'institution</label>
                <select value={form.claimant_type} onChange={e => setForm(p => ({ ...p, claimant_type: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">-- Choisir --</option>
                  <option value="gouvernement">Gouvernement</option>
                  <option value="institution">Institution</option>
                  <option value="politique">Politique</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="media">Média</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Catégorie</label>
                  <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">-- Choisir --</option>
                    {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date du claim</label>
                  <input type="date" value={form.claim_date} onChange={e => setForm(p => ({ ...p, claim_date: e.target.value }))} style={inp} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Municipalité</label>
                  <input value={form.municipality || ''} onChange={e => setForm(p => ({ ...p, municipality: e.target.value }))} style={inp} placeholder="Port-au-Prince" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Portée géographique</label>
                  <select value={form.geographic_scope || ''} onChange={e => setForm(p => ({ ...p, geographic_scope: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">-- Choisir --</option>
                    <option value="national">National</option>
                    <option value="departemental">Départemental</option>
                    <option value="communal">Communal</option>
                    <option value="local">Local</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Statut</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  {Object.entries(statusMap).map(([val, { label }]) => <option key={val} value={val}>{label}</option>)}
                </select>
              </div>
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 14, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>🇭🇹 Traductions Kreyòl</span>
                  <button type="button" onClick={translate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${colors.blue}44`, background: colors.blueSoft, color: colors.blue, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    <Svg d={I.translate} size={12} /> Traduire automatiquement
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Titre (Kreyòl)</label>
                    <input value={form.title_ht || ''} onChange={e => setForm(p => ({ ...p, title_ht: e.target.value }))} placeholder="Traduction kreyòl du titre..." style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description (Kreyòl)</label>
                    <input value={form.claimant_ht || ''} onChange={e => setForm(p => ({ ...p, claimant_ht: e.target.value }))} placeholder="Traduction kreyòl de l'institution..." style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description courte (Kreyòl)</label>
                    <input value={form.short_description_ht || ''} onChange={e => setForm(p => ({ ...p, short_description_ht: e.target.value }))} placeholder="Traduction kreyòl de la description courte..." style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description complète (Kreyòl)</label>
                    <textarea rows={3} value={form.description_ht || ''} onChange={e => setForm(p => ({ ...p, description_ht: e.target.value }))} placeholder="Traduction kreyòl de la description..." style={{ ...inp, resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 9, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSub, cursor: 'pointer', fontSize: 13 }}>Annuler</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', background: colors.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{saving ? <Spin /> : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MODÉRATION ──────────────────────────────────────────────
const PageModeration = ({ moderation, onRefresh, showToast }) => {
  const { colors } = useAdminTheme();
  const approve = async (id) => {
    try {
      await extendedAdminAPI.moderateComment(id, 'approve');
      showToast('Commentaire approuvé', 'success');
      onRefresh();
    } catch (err) { showToast(err?.message || 'Erreur', 'error'); }
  };
  const reject = async (id) => {
    try {
      await extendedAdminAPI.moderateComment(id, 'reject');
      showToast('Commentaire rejeté', 'success');
      onRefresh();
    } catch (err) { showToast(err?.message || 'Erreur', 'error'); }
  };

  if (!moderation) return <SkeletonBlock height={300} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Modération des contenus</h2>
        <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>{moderation.filter(m => m.status === 'pending').length} éléments en attente</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
        <MiniStat label="En attente" value={moderation.filter(m => m.status === 'pending').length} color={colors.amber} />
        <MiniStat label="Urgents" value={moderation.filter(m => m.severity === 'high' && m.status === 'pending').length} color={colors.red} />
        <MiniStat label="Résolus aujourd'hui" value={moderation.filter(m => m.resolved_today).length} color={colors.green} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {moderation.filter(m => m.status === 'pending').map(item => {
          const sevColor = item.severity === 'high' ? colors.red : item.severity === 'medium' ? colors.amber : colors.green;
          const sevBg = item.severity === 'high' ? colors.redSoft : item.severity === 'medium' ? colors.amberSoft : colors.greenSoft;
          return (
            <Card key={item.id} style={{ padding: '18px 22px', borderLeft: `3px solid ${sevColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <Badge bg={sevBg} color={sevColor}>{item.severity === 'high' ? '🔴 Urgent' : item.severity === 'medium' ? '🟡 Moyen' : '🟢 Faible'}</Badge>
                    <Badge bg={colors.surfaceAlt} color={colors.textSub}>{item.type}</Badge>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 5 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Signalé par <strong>{item.reporter}</strong> · {item.reason} · {item.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => approve(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${colors.green}44`, background: colors.greenSoft, color: colors.green, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><Svg d={I.check} size={13} /> Approuver</button>
                  <button onClick={() => reject(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${colors.red}44`, background: colors.redSoft, color: colors.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><Svg d={I.x} size={13} /> Rejeter</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── CATÉGORIES ──────────────────────────────────────────────
const PageCategories = ({ categories, onRefresh, showToast }) => {
  const { colors } = useAdminTheme();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#2C6E9F', name_ht: '', description_ht: '' });
  const [saving, setSaving] = useState(false);
  const maxClaims = Math.max(...(categories || []).map(c => c.total_claims || 0), 1);
  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' };

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', color: '#2C6E9F', name_ht: '', description_ht: '' });
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      color: cat.color || '#2C6E9F',
      name_ht: cat.name_ht || '',
      description_ht: cat.description_ht || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editId) {
        await categoriesAdminAPI.updateCategory(editId, form);
        showToast('Catégorie modifiée', 'success');
      } else {
        await categoriesAdminAPI.createCategory(form);
        showToast('Catégorie créée', 'success');
      }
      setShowForm(false);
      onRefresh();
    } catch (err) {
      showToast(err?.message || 'Erreur', 'error');
    } finally { setSaving(false); }
  };

  if (!categories) return <SkeletonBlock height={300} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Catégories</h2>
          <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>{categories.length} catégories</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, background: colors.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Svg d={I.plus} size={15} /> Nouvelle catégorie
        </button>
      </div>
      {showForm && (
        <Card style={{ borderColor: `${colors.blue}55` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 16 }}>{editId ? 'Modifier' : 'Créer'} une catégorie</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['Nom', 'Slug', 'Description'].map((l, i) => {
              const k = ['name', 'slug', 'description'][i];
              return (
                <div key={k} style={{ gridColumn: k === 'description' ? '1/-1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</label>
                  {i === 2 ? <textarea rows={2} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ ...inp, resize: 'vertical' }} /> :
                    <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value, ...(k === 'name' && !editId ? { slug: e.target.value.toLowerCase().normalize('NFD').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {}) }))} style={inp} />}
                </div>
              );
            })}
            <div style={{ gridColumn: '1/-1', borderTop: `1px solid ${colors.border}`, paddingTop: 12, marginTop: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>🇭🇹 Traductions Kreyòl</span>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom (Kreyòl)</label>
              <input value={form.name_ht || ''} onChange={e => setForm(p => ({ ...p, name_ht: e.target.value }))} placeholder="Traduction kreyòl du nom..." style={inp} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description (Kreyòl)</label>
              <textarea rows={2} value={form.description_ht || ''} onChange={e => setForm(p => ({ ...p, description_ht: e.target.value }))} placeholder="Traduction kreyòl de la description..." style={{ ...inp, resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Couleur</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={{ width: 42, height: 36, borderRadius: 8, border: `1px solid ${colors.border}`, cursor: 'pointer', padding: 2 }} />
                <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={{ ...inp, flex: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 9, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textSub, cursor: 'pointer', fontSize: 13 }}>Annuler</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: colors.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{saving ? <Spin /> : 'Enregistrer'}</button>
          </div>
        </Card>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {categories.map(cat => (
          <Card key={cat.id} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 36, borderRadius: 4, background: cat.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{cat.name}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: "'Inter', sans-serif" }}>/{cat.slug}</div>
                </div>
              </div>
              <button onClick={() => openEdit(cat)} style={{ padding: 6, borderRadius: 7, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.edit} size={13} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
              <div>
                <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 2 }}>Claims</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: colors.text, fontFamily: "'Inter', sans-serif" }}>{cat.total_claims ?? 0}</div>
                <div style={{ marginTop: 6, height: 3, borderRadius: 99, background: colors.border, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: cat.color, width: `${((cat.total_claims ?? 0) / maxClaims) * 100}%` }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>Confiance moy.</div>
                <TrustBar score={cat.avg_confidence ?? 0} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── ANALYTICS ────────────────────────────────────────────────
const PageAnalytics = ({ stats, categories, loading }) => {
  const { colors } = useAdminTheme();
  if (loading) return <Card><SkeletonBlock height={300} /></Card>;
  const maxClaims = Math.max(...(categories || []).map(c => c.total_claims || 0), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Analytiques</h2>
        <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>Performance globale de la plateforme PichAI</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
        {[
          { l: 'Utilisateurs actifs', v: stats?.users?.active?.toLocaleString() ?? '—', c: colors.blue },
          { l: 'Sessions IA ce mois', v: stats?.ai_sessions?.total?.toLocaleString() ?? '—', c: colors.purple },
          { l: 'Précision globale', v: `${stats?.predictions?.accuracy ?? 0}%`, c: colors.green },
          { l: 'Satisfaction IA', v: `${stats?.ai_sessions?.satisfaction ?? 0}/5`, c: colors.amber },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c, fontFamily: "'Inter', sans-serif", letterSpacing: -1 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 18 }}>Claims par catégorie</div>
          {[...(categories || [])].sort((a, b) => (b.total_claims || 0) - (a.total_claims || 0)).map(cat => (
            <div key={cat.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: colors.textSub }}>{cat.name}</span>
                <span style={{ color: colors.text, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{cat.total_claims || 0}</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: colors.border, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, background: cat.color, width: `${((cat.total_claims || 0) / maxClaims) * 100}%` }} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 18 }}>Métriques plateforme</div>
          {[
            { l: "Taux d'activation", v: stats?.users?.activation_rate ?? 0, c: colors.blue },
            { l: 'Taux de vérification', v: stats?.claims?.verification_rate ?? 0, c: colors.purple },
            { l: 'Engagement préd.', v: stats?.predictions?.engagement ?? 0, c: colors.green },
            { l: 'Rétention 30 jours', v: stats?.users?.retention_30d ?? 0, c: colors.amber },
            { l: 'Précision prédictions', v: stats?.predictions?.accuracy ?? 0, c: colors.accent },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: colors.textSub }}>{l}</span>
                <span style={{ color: colors.text, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{v}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: colors.border, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 99, background: c, width: `${v}%` }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── RÔLES ───────────────────────────────────────────────────
const PageRoles = ({ rolesPerms, loading }) => {
  const { colors } = useAdminTheme();
  if (loading) return <Card><SkeletonBlock height={200} /></Card>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Rôles & Permissions</h2>
        <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>Hiérarchie des accès</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(rolesPerms || {}).map(([role, { label, color, perms }]) => (
          <Card key={role} style={{ padding: '16px 22px', borderLeft: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Badge bg={`${color}22`} color={color}>{label}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {perms.map(p => (
                <span key={p} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: colors.surfaceAlt, color: colors.textSub, border: `1px solid ${colors.border}` }}>{p}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── LOGS ────────────────────────────────────────────────────
const PageLogs = ({ logs, loading }) => {
  const { colors } = useAdminTheme();
  const [search, setSearch] = useState('');
  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' };
  const filtered = (logs || []).filter(l => l.desc?.toLowerCase().includes(search.toLowerCase()) || l.user?.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <Card><SkeletonBlock height={300} /></Card>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Logs système</h2>
        <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>Historique complet des activités</p>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }}><Svg d={I.search} size={15} /></div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrer les logs..." style={{ ...inp, paddingLeft: 34 }} />
      </div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.map((log, i) => (
          <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = colors.surfaceAlt}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 7, height: 7, borderRadius: 99, background: log.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: colors.textMuted, width: 40, fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>{log.time}</span>
            <div style={{ flex: 1, minWidth: 0 }}><span style={{ fontSize: 13, color: colors.textSub }}>{log.desc}</span></div>
            <span style={{ fontSize: 11, color: colors.textMuted, flexShrink: 0 }}>{log.user}</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: colors.surfaceAlt, color: colors.textMuted, border: `1px solid ${colors.border}`, flexShrink: 0, fontFamily: "'Inter', sans-serif" }}>{log.type.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── CONFIGURATION ───────────────────────────────────────────
const PageSettings = ({ settings, meUser, showToast }) => {
  const { colors } = useAdminTheme();
  const [saving, setSaving] = useState(false);
  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' };

  const saveSettings = async (section, data) => {
    setSaving(true);
    try {
      await extendedAdminAPI.updateSettings(data);
      showToast(`${section} sauvegardé`, 'success');
    } catch (err) {
      showToast(err?.message || 'Erreur', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>Configuration</h2>
        <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>Paramètres globaux de PichAI</p>
      </div>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 14 }}>Compte administrateur</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: colors.surfaceAlt, borderRadius: 8, border: `1px solid ${colors.border}` }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>{(meUser?.username || 'A')[0].toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{meUser?.username || 'Admin'}</div>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{meUser?.email || 'admin@PichAI.tech'} · {meUser?.role || 'admin'}</div>
          </div>
          <Badge bg={colors.greenSoft} color={colors.green}>Connecté</Badge>
        </div>
      </Card>
      {[
        { title: 'Général', fields: [
          { l: 'Nom de la plateforme', key: 'platform_name', type: 'text', default: settings?.platform_name ?? 'PichAI' },
          { l: 'Email de contact', key: 'contact_email', type: 'email', default: settings?.contact_email ?? 'admin@PichAI.tech' },
          { l: 'Langue par défaut', key: 'default_language', type: 'select', opts: ['fr', 'ht', 'en'], default: settings?.default_language ?? 'fr' },
        ]},
        { title: 'Sécurité', fields: [
          { l: 'Score confiance minimum', key: 'min_trust_score', type: 'number', default: settings?.min_trust_score ?? 0.3 },
          { l: 'Tentatives login max', key: 'max_login_attempts', type: 'number', default: settings?.max_login_attempts ?? 5 },
          { l: 'Durée session (min)', key: 'session_duration', type: 'number', default: settings?.session_duration ?? 60 },
        ]},
        { title: 'IA & Modération', fields: [
          { l: 'Seuil auto-approuver', key: 'auto_approve_threshold', type: 'number', default: settings?.auto_approve_threshold ?? 0.9 },
          { l: 'Modèle IA par défaut', key: 'default_ai_model', type: 'text', default: settings?.default_ai_model ?? 'claude-sonnet-4-6' },
          { l: 'Auto-résolution (jours)', key: 'auto_resolution_days', type: 'number', default: settings?.auto_resolution_days ?? 30 },
        ]},
        { title: 'Notifications', fields: [
          { l: 'Email alertes admin', key: 'alert_email', type: 'email', default: settings?.alert_email ?? 'alerts@PichAI.tech' },
          { l: 'Seuil alerte modération', key: 'moderation_alert_threshold', type: 'number', default: settings?.moderation_alert_threshold ?? 10 },
        ]},
      ].map(section => (
        <Card key={section.title}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 16 }}>{section.title}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
            {section.fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.l}</label>
                {f.type === 'select' ? (
                  <select defaultValue={f.default} data-key={f.key} style={{ ...inp, cursor: 'pointer' }}>
                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} defaultValue={f.default} data-key={f.key} style={inp} />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => {
            const data = {};
            section.fields.forEach(f => { const input = document.querySelector(`[data-key="${f.key}"]`); if (input) data[f.key] = input.value; });
            saveSettings(section.title, data);
          }} disabled={saving} style={{ marginTop: 16, padding: '9px 20px', borderRadius: 9, border: 'none', background: colors.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            {saving ? <Spin /> : `Sauvegarder ${section.title}`}
          </button>
        </Card>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL (avec contexte de thème admin)
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [page, setPage] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [toast, setToast] = useState(null);
  const [data, setData] = useState({
    stats: null, users: null, claims: null, categories: null,
    moderation: null, rolesPerms: {}, logs: null, settings: null, meUser: null,
  });

  const { isAdmin, isEditor, isModerator, isSuperAdmin, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { colors, isDark } = useAdminColors();

  // Navigation filtrée selon les droits
  const NAV_FILTERED = NAV.filter(item => {
    if (item.id === 'settings') return isSuperAdmin;
    if (item.id === 'users') return isSuperAdmin;
    if (item.id === 'roles') return isSuperAdmin;
    if (item.id === 'claims') return isEditor;
    if (item.id === 'categories') return isEditor;
    if (item.id === 'moderation') return isModerator;
    return true;
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (authLoading) return;
    const token = localStorage.getItem('access_token');
    if (!token || !user) {
      navigate('/connexion', { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    const accessibleIds = NAV_FILTERED.map(n => n.id);
    if (!accessibleIds.includes(page)) {
      setPage('overview');
    }
  }, [page, NAV_FILTERED]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        overviewRes, usersRes, claimsRes, categoriesRes,
        moderationRes, rolesRes, logsRes, settingsRes, meRes
      ] = await Promise.allSettled([
        extendedAdminAPI.getOverview(),
        extendedAdminAPI.getUsers(),
        extendedAdminAPI.getClaims(),
        categoriesAPI.getAllCategories(),
        extendedAdminAPI.getFlaggedComments(),
        extendedAdminAPI.getRoles(),
        extendedAdminAPI.getLogs(),
        extendedAdminAPI.getSettings(),
        authAPI.getCurrentUser(),
      ]);

      const val = (res, fallback) =>
        res.status === 'fulfilled' ? (res.value?.data ?? fallback) : fallback;

      setData({
        stats: val(overviewRes, null),
        users: val(usersRes, { users: [] })?.users || val(usersRes, []),
        claims: val(claimsRes, { claims: [] })?.claims || val(claimsRes, []),
        categories: val(categoriesRes, { categories: [] })?.categories || val(categoriesRes, []),
        moderation: val(moderationRes, { comments: [] })?.comments || val(moderationRes, []),
        rolesPerms: val(rolesRes, { roles: DEFAULT_ROLES })?.roles || DEFAULT_ROLES,
        logs: val(logsRes, { logs: [] })?.logs || [],
        settings: val(settingsRes, { settings: {} })?.settings || {},
        meUser: val(meRes, { user: null })?.user || val(meRes, null),
      });
    } catch (err) {
      console.error('Admin data load error:', err);
      showToast('Erreur de chargement des données', 'error');
    } finally {
      setLoading(false);
      setLastSync(new Date());
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const refresh = () => loadData();

  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: colors.bg }}>
      <Spin />
    </div>
  );

  if (!user || !isAdmin) return null;

  const pages = {
    overview: <PageOverview stats={data.stats} claims={data.claims} categories={data.categories} logs={data.logs} loading={loading} />,
    users: <PageUsers users={data.users} rolesPerms={data.rolesPerms} onRefresh={refresh} showToast={showToast} />,
    claims: <PageClaims claims={data.claims} categories={data.categories} onRefresh={refresh} showToast={showToast} />,
    moderation: <PageModeration moderation={data.moderation} onRefresh={refresh} showToast={showToast} />,
    categories: <PageCategories categories={data.categories} onRefresh={refresh} showToast={showToast} />,
    analytics: <PageAnalytics stats={data.stats} categories={data.categories} loading={loading} />,
    roles: <PageRoles rolesPerms={data.rolesPerms} loading={loading} />,
    logs: <PageLogs logs={data.logs} loading={loading} />,
    settings: <PageSettings settings={data.settings} meUser={data.meUser} showToast={showToast} />,
  };

  return (
    <AdminThemeContext.Provider value={{ colors, isDark }}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0, background: colors.bg, color: colors.text, fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
        {/* HEADER */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 54, flexShrink: 0, background: colors.surface, borderBottom: `1px solid ${colors.border}`, zIndex: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setCollapsed(!collapsed)} style={{ padding: 7, borderRadius: 8, border: 'none', background: 'transparent', color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.menu} size={17} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <img src={isDark ? logoDark : logoLight} alt="PICH AI" style={{ height: 20, width: 'auto', display: 'block' }} />
              <span style={{ fontSize: 11, color: colors.border }}>|</span>
              <span style={{ fontSize: 12, color: colors.textMuted }}>Administration</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading && <Spin />}
            {lastSync && !loading && <span style={{ fontSize: 10, color: colors.textMuted }}>{lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
            <button onClick={refresh} style={{ padding: 6, borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.textMuted, cursor: 'pointer' }}><Svg d={I.clock} size={14} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${colors.accent}, ${colors.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{(data.meUser?.username || 'A')[0].toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>{data.meUser?.username || 'Admin'}</div>
                <div style={{ fontSize: 9, color: colors.textMuted }}>{data.meUser?.role || 'admin'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* SIDEBAR */}
          <aside style={{ width: collapsed ? 52 : 212, flexShrink: 0, display: 'flex', flexDirection: 'column', background: colors.surface, borderRight: `1px solid ${colors.border}`, transition: 'width .2s ease', overflow: 'hidden', zIndex: 100 }}>
            <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
              {NAV_FILTERED.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => setPage(item.id)} title={collapsed ? item.label : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 9,
                      padding: collapsed ? '10px 0' : '8px 11px', justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 1,
                      background: active ? colors.accentSoft : 'transparent', color: active ? colors.text : colors.textMuted,
                      borderLeft: active ? `2px solid ${colors.accent}` : '2px solid transparent', transition: 'all .12s',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = colors.surfaceAlt; e.currentTarget.style.color = colors.textSub; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.textMuted; } }}
                  >
                    <Svg d={item.icon} size={16} style={{ flexShrink: 0 }} />
                    {!collapsed && <span style={{ flex: 1, textAlign: 'left', fontSize: 12.5, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: `1px solid ${colors.borderSub}`, padding: '10px 6px' }}>
              {!collapsed && (
                <div style={{ padding: '7px 11px', borderRadius: 8, background: colors.surfaceAlt, marginBottom: 5 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.meUser?.username || 'Admin'}</div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>{data.meUser?.email || 'admin@PichAI.tech'}</div>
                </div>
              )}
              <button onClick={() => { authAPI.logout().finally(() => { localStorage.removeItem('access_token'); window.location.href = '/connexion'; }); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 8, padding: collapsed ? '9px 0' : '7px 11px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 8, border: 'none', background: 'transparent', color: colors.textMuted, cursor: 'pointer', fontSize: 12, transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = colors.red; e.currentTarget.style.background = colors.redSoft; }}
                onMouseLeave={e => { e.currentTarget.style.color = colors.textMuted; e.currentTarget.style.background = 'transparent'; }}>
                <Svg d={I.logout} size={15} style={{ flexShrink: 0 }} />
                {!collapsed && <span>Déconnexion</span>}
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: colors.bg }}>
            {pages[page]}
          </main>
        </div>

        {/* FOOTER */}
        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 38, flexShrink: 0, background: colors.surface, borderTop: `1px solid ${colors.border}`, fontSize: 11, color: colors.textMuted }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontWeight: 700, color: colors.textMuted }}>PichAI Admin v1.0</span>
            <span>·</span>
            <span>© 2026 PichAI</span>
            <span>·</span>
            <span>Tous droits réservés</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: colors.green }} />
              <span style={{ color: colors.textMuted }}>API connectée</span>
            </div>
            <span>·</span>
            <span style={{ color: colors.textMuted }}>Sync {lastSync ? lastSync.toLocaleTimeString('fr-FR') : '—'}</span>
          </div>
        </footer>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 99px; }
          input::placeholder { color: ${colors.textMuted}; }
          button { font-family: inherit; }
        `}</style>
      </div>
    </AdminThemeContext.Provider>
  );
}