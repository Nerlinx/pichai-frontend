// ═══════════════════════════════════════════════════════════════
// /frontend/src/components/layout/Header.jsx
// PICH AI — Header post‑connexion orienté “impact & activité”
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BoltIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '../../hooks/useUser';
import logoLight from '../../assets/log_pichAI_black.png';
import logoDark from '../../assets/log_pichAI_white.png';

// ─── ICÔNES PERSONNALISÉES ──────────────────────────────────────
const HamburgerIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 14" fill="none">
    <rect x="0" y="0" width="20" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="6" width="17" height="2" rx="1" fill="currentColor" />
    <rect x="6" y="12" width="14" height="2" rx="1" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const lightTheme = {
  bg: '#FFFFFF',
  bgScrolled: 'rgba(255,255,255,0.96)',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  text: '#0A0F1E',
  textSub: '#4A5875',
  textMuted: '#94A3B8',
  accent: '#0050E6',
  accentSoft: '#F1F5F9',
  surface: '#F8FAFC',
  drawerBg: '#FFFFFF',
  overlay: 'rgba(10,15,30,0.45)',
  inputBg: '#FFFFFF',
};

const darkTheme = {
  bg: '#0B0E14',
  bgScrolled: 'rgba(11,14,20,0.96)',
  border: '#2A323F',
  borderStrong: '#3B4252',
  text: '#F0F3F8',
  textSub: '#9AA6B9',
  textMuted: '#6C7A8E',
  accent: '#3B82F6',
  accentSoft: '#1E293B',
  surface: '#11161F',
  drawerBg: '#11161F',
  overlay: 'rgba(0,0,0,0.7)',
  inputBg: '#1A212C',
};

// ─── LIENS DE NAVIGATION ────────────────────────────────────────
const NAV_LINKS = [
  { key: 'explore', href: '/' },
  { key: 'predictions', href: '/predictions' },
  { key: 'claims', href: '/claims' },
  { key: 'insights', href: '/insights' },
];

const RESOURCE_LINKS = [
  { key: 'how_it_works', href: '/how-it-works', icon: <QuestionMarkCircleIcon style={{ width: 14 }} /> },
  { key: 'about', href: '/about', icon: <InformationCircleIcon style={{ width: 14 }} /> },
  { key: 'support', href: '/support', icon: <ChatBubbleLeftRightIcon style={{ width: 14 }} /> },
  { key: 'community', href: '/community', icon: <HeartIcon style={{ width: 14 }} /> },
];

const ECOSYSTEM_ITEMS = [
  [
    { key: 'fuel_price', href: '/secteurs/carburant', icon: <CurrencyDollarIcon style={{ width: 14 }} /> },
    { key: 'exchange_rate', href: '/secteurs/taux-change', icon: <CurrencyDollarIcon style={{ width: 14 }} /> },
    { key: 'local_markets', href: '/secteurs/marches', icon: <CurrencyDollarIcon style={{ width: 14 }} /> },
    { key: 'inflation', href: '/secteurs/inflation', icon: <CurrencyDollarIcon style={{ width: 14 }} /> },
    { key: 'investments', href: '/secteurs/investissements', icon: <CurrencyDollarIcon style={{ width: 14 }} /> },
  ],
  [
    { key: 'public_promises', href: '/secteurs/promesses', icon: <ShieldCheckIcon style={{ width: 14 }} /> },
    { key: 'security_index', href: '/secteurs/securite', icon: <ShieldCheckIcon style={{ width: 14 }} /> },
    { key: 'justice_corruption', href: '/secteurs/justice', icon: <ShieldCheckIcon style={{ width: 14 }} /> },
    { key: 'elections', href: '/secteurs/elections', icon: <ShieldCheckIcon style={{ width: 14 }} /> },
    { key: 'police_forces', href: '/secteurs/police', icon: <ShieldCheckIcon style={{ width: 14 }} /> },
  ],
  [
    { key: 'health', href: '/secteurs/sante', icon: <HeartIcon style={{ width: 14 }} /> },
    { key: 'education', href: '/secteurs/education', icon: <AcademicCapIcon style={{ width: 14 }} /> },
    { key: 'energy', href: '/secteurs/energie', icon: <BoltIcon style={{ width: 14 }} /> },
    { key: 'roads_transport', href: '/secteurs/transport', icon: <BuildingOfficeIcon style={{ width: 14 }} /> },
    { key: 'water_sanitation', href: '/secteurs/eau', icon: <BuildingOfficeIcon style={{ width: 14 }} /> },
  ],
];

// ─── STYLES GLOBAUX ─────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

  :root {
    --hdr-font: 'Syne', system-ui, sans-serif;
    --hdr-mono: 'Space Mono', monospace;
  }

  .ph-header {
    position: sticky; top: 0; z-index: 200;
    font-family: var(--hdr-font);
    transition: background 0.25s, box-shadow 0.25s, border-color 0.25s;
  }

  .ph-nav-link {
    position: relative; padding: 5px 13px; border-radius: 6px;
    font-size: 13.5px; font-weight: 500; color: var(--hdr-text-sub);
    text-decoration: none; white-space: nowrap; letter-spacing: -0.01em;
    transition: color 0.15s, background 0.15s;
  }
  .ph-nav-link:hover { color: var(--hdr-text); background: var(--hdr-surface); }
  .ph-nav-link.is-active { color: var(--hdr-text); font-weight: 700; background: var(--hdr-surface); }
  .ph-nav-link.is-active::after {
    content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%);
    width: 14px; height: 2px; background: var(--hdr-accent); border-radius: 2px;
  }

  .ph-ecosystem-btn {
    display: flex; align-items: center; gap: 4px; padding: 5px 13px; border-radius: 6px;
    background: transparent; border: none; font-size: 13.5px; font-weight: 500;
    font-family: var(--hdr-font); color: var(--hdr-text-sub); cursor: pointer;
    white-space: nowrap; letter-spacing: -0.01em;
    transition: color 0.15s, background 0.15s;
  }
  .ph-ecosystem-btn:hover { color: var(--hdr-text); background: var(--hdr-surface); }

  .ph-btn-outline {
    padding: 6px 16px; border-radius: 40px; border: 1px solid var(--hdr-border);
    background: transparent; font-size: 13px; font-weight: 500;
    font-family: var(--hdr-font); text-decoration: none; cursor: pointer;
    transition: background 0.15s, border-color 0.15s; color: var(--hdr-text-sub);
  }
  .ph-btn-outline:hover { background: var(--hdr-surface); border-color: var(--hdr-border-strong); color: var(--hdr-text); }

  .ph-btn-light {
    padding: 6px 16px; border-radius: 40px; border: 1px solid var(--hdr-border);
    background: var(--hdr-accent-soft); font-size: 13px; font-weight: 500;
    font-family: var(--hdr-font); text-decoration: none; cursor: pointer;
    transition: background 0.15s; color: var(--hdr-text);
  }
  .ph-btn-light:hover { background: var(--hdr-border); }

  .ph-avatar-btn {
    display: flex; align-items: center; gap: 6px; cursor: pointer;
    border: none; background: none; padding: 4px 8px; border-radius: 40px;
    color: var(--hdr-text-sub); font-size: 13px; font-weight: 500;
    font-family: var(--hdr-font);
    transition: background 0.15s;
  }
  .ph-avatar-btn:hover { background: var(--hdr-surface); }
  .ph-avatar-img {
    width: 28px; height: 28px; border-radius: 50%; object-fit: cover;
    border: 1px solid var(--hdr-border);
  }
  .ph-notif-btn {
    position: relative; display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 50%; border: none; background: none;
    color: var(--hdr-text-sub); cursor: pointer;
    transition: background 0.15s;
  }
  .ph-notif-btn:hover { background: var(--hdr-surface); }
  .ph-badge {
    position: absolute; top: 2px; right: 2px; min-width: 16px; height: 16px;
    background: #EF4444; color: white; border-radius: 8px; font-size: 10px;
    font-weight: 700; display: flex; align-items: center; justify-content: center;
    padding: 0 4px; line-height: 1;
  }

  .ph-user-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0; min-width: 240px;
    background: var(--hdr-drawer-bg); border: 1px solid var(--hdr-border);
    border-radius: 12px; padding: 8px 0; box-shadow: 0 12px 28px rgba(0,0,0,0.15);
    z-index: 250; animation: ph-fadein 0.2s ease;
  }
  .ph-user-dropdown-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 16px;
    font-size: 13px; font-family: var(--hdr-font); text-decoration: none;
    color: var(--hdr-text-sub); cursor: pointer; border: none; background: none;
    width: 100%; text-align: left;
  }
  .ph-user-dropdown-item:hover { background: var(--hdr-surface); color: var(--hdr-text); }
  .ph-user-dropdown-item.danger { color: #EF4444; }
  .ph-user-dropdown-separator { border-top: 1px solid var(--hdr-border); margin: 8px 0; }

  .ph-search-wrapper { position: relative; flex: 1; max-width: 480px; margin-left: 24px; }
  .ph-search-input {
    width: 100%; padding: 8px 12px 8px 36px; border-radius: 40px;
    border: 1px solid var(--hdr-border); background: var(--hdr-input-bg);
    font-size: 14px; font-family: var(--hdr-font); color: var(--hdr-text);
    transition: border-color 0.15s;
  }
  .ph-search-input:focus { outline: none; border-color: var(--hdr-accent); }
  .ph-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    width: 16px; height: 16px; color: var(--hdr-text-muted);
  }

  .ph-ecosystem-dropdown { position: relative; }
  .ph-mega-menu {
    position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%);
    background: var(--hdr-drawer-bg); border: 1px solid var(--hdr-border);
    border-radius: 12px; box-shadow: 0 12px 28px rgba(0,0,0,0.15);
    padding: 16px 20px; display: flex; gap: 24px; width: auto;
    min-width: 540px; max-width: 85vw; z-index: 250;
  }
  .ph-mega-column { display: flex; flex-direction: column; gap: 8px; border-right: 1px solid var(--hdr-border); padding-right: 20px; }
  .ph-mega-column:last-child { border-right: none; padding-right: 0; }
  .ph-mega-link {
    display: flex; align-items: center; gap: 10px; padding: 6px 0;
    font-size: 13px; font-family: var(--hdr-font); text-decoration: none;
    color: var(--hdr-text-sub); white-space: nowrap;
  }
  .ph-mega-link:hover { color: var(--hdr-text); }

  .ph-resources-dropdown { position: relative; }
  .ph-resources-btn {
    display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 6px;
    background: transparent; border: none; font-size: 13.5px; font-weight: 500;
    font-family: var(--hdr-font); color: var(--hdr-text-sub); cursor: pointer;
    white-space: nowrap; letter-spacing: -0.01em;
  }
  .ph-resources-btn:hover { background: var(--hdr-surface); color: var(--hdr-text); }
  .ph-resources-menu {
    position: absolute; top: calc(100% + 6px); right: 0; width: 240px;
    background: var(--hdr-drawer-bg); border: 1px solid var(--hdr-border);
    border-radius: 12px; padding: 8px 0; z-index: 250;
  }
  .ph-resources-section { padding: 8px 12px; border-bottom: 1px solid var(--hdr-border); }
  .ph-resources-section:last-child { border-bottom: none; }
  .ph-resources-label { font-size: 11px; font-weight: 600; font-family: var(--hdr-mono); color: var(--hdr-text-muted); margin-bottom: 6px; }
  .ph-lang-options { display: flex; gap: 8px; }
  .ph-lang-opt { padding: 4px 10px; border-radius: 30px; font-size: 12px; font-weight: 500; font-family: var(--hdr-font); background: transparent; border: 1px solid var(--hdr-border); cursor: pointer; }
  .ph-lang-opt.active { background: var(--hdr-accent-soft); border-color: var(--hdr-accent); color: var(--hdr-accent); }
  .ph-darkmode-toggle { display: flex; align-items: center; justify-content: space-between; }
  .ph-toggle-switch { width: 38px; height: 20px; background: var(--hdr-border); border-radius: 30px; display: flex; align-items: center; padding: 2px; cursor: pointer; }
  .ph-toggle-knob { width: 16px; height: 16px; background: var(--hdr-surface); border-radius: 50%; transition: transform 0.2s; }
  .ph-toggle-switch.dark { background: var(--hdr-accent); }
  .ph-toggle-switch.dark .ph-toggle-knob { transform: translateX(18px); }
  .ph-resources-link { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; font-family: var(--hdr-font); text-decoration: none; color: var(--hdr-text-sub); }
  .ph-resources-link:hover { background: var(--hdr-surface); color: var(--hdr-text); }

  .ph-overlay { position: fixed; inset: 0; background: var(--hdr-overlay); z-index: 300; animation: ph-fade-in 0.22s ease forwards; }
  @keyframes ph-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ph-fade-out { from { opacity: 1; } to { opacity: 0; } }
  .ph-overlay.closing { animation: ph-fade-out 0.22s ease forwards; }

  .ph-drawer {
    position: fixed; top: 0; left: 0; bottom: 0; width: 300px; max-width: 88vw;
    background: var(--hdr-drawer-bg); z-index: 400;
    display: flex; flex-direction: column; animation: ph-slide-in 0.25s ease forwards;
    overflow-y: auto;
  }
  @keyframes ph-slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  @keyframes ph-slide-out { from { transform: translateX(0); } to { transform: translateX(-100%); } }
  .ph-drawer.closing { animation: ph-slide-out 0.22s ease forwards; }

  .ph-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--hdr-border); }
  .ph-drawer-search { padding: 12px 16px; border-bottom: 1px solid var(--hdr-border); }
  .ph-drawer-search-input { width: 100%; padding: 10px 12px 10px 36px; border-radius: 40px; border: 1px solid var(--hdr-border); background: var(--hdr-input-bg); font-size: 14px; font-family: var(--hdr-font); }
  .ph-drawer-nav { flex: 1; padding: 8px 12px; }
  .ph-drawer-link { display: block; padding: 12px; font-size: 15px; font-weight: 600; font-family: var(--hdr-font); text-decoration: none; color: var(--hdr-text-sub); border-bottom: 1px solid var(--hdr-border); }
  .ph-drawer-link.is-active { color: var(--hdr-accent); }
  .ph-drawer-ecosystem { padding: 12px; border-top: 1px solid var(--hdr-border); margin-top: 8px; }
  .ph-drawer-ecosystem-title { font-size: 12px; font-weight: 600; font-family: var(--hdr-mono); color: var(--hdr-text-muted); margin: 8px 0 4px; }
  .ph-drawer-sub-link { display: block; padding: 6px 0 6px 12px; font-size: 13px; font-family: var(--hdr-font); text-decoration: none; color: var(--hdr-text-sub); }
  .ph-drawer-resources { padding: 12px; border-top: 1px solid var(--hdr-border); }
  .ph-drawer-res-title { font-size: 12px; font-weight: 600; font-family: var(--hdr-mono); color: var(--hdr-text-muted); margin-bottom: 12px; }
  .ph-drawer-lang-options { display: flex; gap: 10px; margin-bottom: 16px; }
  .ph-drawer-lang-btn { flex: 1; text-align: center; padding: 8px; border-radius: 30px; border: 1px solid var(--hdr-border); background: transparent; font-size: 13px; font-family: var(--hdr-font); }
  .ph-drawer-lang-btn.active { background: var(--hdr-accent-soft); border-color: var(--hdr-accent); color: var(--hdr-accent); }
  .ph-drawer-darkmode { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .ph-drawer-footer { padding: 16px 20px; border-top: 1px solid var(--hdr-border); display: flex; flex-direction: column; gap: 12px; }
  .ph-drawer-cta-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ph-drawer-btn-outline { text-align: center; padding: 10px; border-radius: 40px; border: 1px solid var(--hdr-border); background: transparent; font-size: 13px; font-weight: 500; font-family: var(--hdr-font); text-decoration: none; color: var(--hdr-text-sub); }
  .ph-drawer-btn-light { text-align: center; padding: 10px; border-radius: 40px; border: 1px solid var(--hdr-border); background: var(--hdr-accent-soft); font-size: 13px; font-weight: 500; font-family: var(--hdr-font); text-decoration: none; color: var(--hdr-text); }

  .ph-burger {
    display: none; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 8px; background: transparent;
    cursor: pointer; transition: transform 0.2s ease; border: none;
    color: var(--hdr-text-sub);
  }
  .ph-burger:hover { transform: scale(1.05); color: var(--hdr-text); }
  .ph-burger:active { transform: scale(0.98); }

  .ph-mobile-login {
    display: none; padding: 6px 16px; border-radius: 40px;
    border: 1px solid var(--hdr-border); background: transparent;
    font-size: 13px; font-weight: 500; font-family: var(--hdr-font);
    text-decoration: none; color: var(--hdr-text-sub); white-space: nowrap;
  }

  .ph-mobile-user-btn {
    display: none; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 50%; border: none; background: none;
    color: var(--hdr-text-sub); cursor: pointer;
    margin-right: 8px;
  }

  .ph-mobile-dashboard-btn {
    display: none; align-items: center; gap: 6px;
    padding: 6px 16px; border-radius: 40px;
    border: 1px solid var(--hdr-border);
    background: var(--hdr-accent-soft);
    font-size: 13px; font-weight: 500;
    font-family: var(--hdr-font); text-decoration: none;
    color: var(--hdr-text); white-space: nowrap;
  }

  @media (max-width: 900px) {
    .ph-desktop-nav, .ph-desktop-actions, .ph-search-wrapper { display: none !important; }
    .ph-burger { display: flex !important; }
    .ph-mobile-login { display: flex !important; }
    .ph-mobile-user-btn { display: flex !important; }
    .ph-mobile-dashboard-btn { display: flex !important; }
  }
  @media (min-width: 901px) {
    .ph-burger { display: none !important; }
    .ph-mobile-login { display: none !important; }
    .ph-mobile-user-btn { display: none !important; }
    .ph-mobile-dashboard-btn { display: none !important; }
  }
`;

// ─── HOOK THÈME ────────────────────────────────────────────────
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pichai-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pichai-theme', theme);
    const colors = theme === 'dark' ? darkTheme : lightTheme;
    Object.entries(colors).forEach(([key, val]) => {
      document.documentElement.style.setProperty(
        `--hdr-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
        val
      );
    });
  }, [theme]);
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return { theme, toggle };
};

// ─── SOUS‑COMPOSANTS ────────────────────────────────────────────
const EcosystemMegaMenu = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation('header');

  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="ph-ecosystem-dropdown" ref={containerRef}>
      <button ref={buttonRef} className="ph-ecosystem-btn" onClick={() => setOpen(!open)}>
        {t('ecosystems')} <ChevronDownIcon style={{ width: 14 }} />
      </button>
      {open && (
        <div className="ph-mega-menu">
          {ECOSYSTEM_ITEMS.map((column, idx) => (
            <div key={idx} className="ph-mega-column">
              {column.map((item, i) => (
                <Link key={i} to={item.href} className="ph-mega-link" onClick={() => setOpen(false)}>
                  {item.icon}
                  {t(item.key)}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ResourcesDropdown = ({ darkModeToggle, theme }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { t, i18n } = useTranslation('header');
  const currentLang = i18n.language;

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="ph-resources-dropdown">
      <button ref={buttonRef} className="ph-resources-btn" onClick={() => setOpen(!open)}>
        {t('resources')} <ChevronDownIcon style={{ width: 14 }} />
      </button>
      {open && (
        <div ref={dropdownRef} className="ph-resources-menu">
          <div className="ph-resources-section">
            <div className="ph-resources-label">{t('language')}</div>
            <div className="ph-lang-options">
              <button className={`ph-lang-opt ${currentLang === 'fr' ? 'active' : ''}`} onClick={() => changeLanguage('fr')}>
                Français
              </button>
              <button className={`ph-lang-opt ${currentLang === 'ht' ? 'active' : ''}`} onClick={() => changeLanguage('ht')}>
                Kreyòl
              </button>
            </div>
          </div>
          <div className="ph-resources-section">
            <div className="ph-resources-label">{t('appearance')}</div>
            <div className="ph-darkmode-toggle">
              <span style={{ fontSize: 13, fontFamily: 'var(--hdr-font)' }}>
                {theme === 'light' ? t('light_mode') : t('dark_mode')}
              </span>
              <div
                className={`ph-toggle-switch ${theme === 'dark' ? 'dark' : ''}`}
                onClick={darkModeToggle}
              >
                <div className="ph-toggle-knob" />
              </div>
            </div>
          </div>
          <div className="ph-resources-section">
            <div className="ph-resources-label">{t('useful_links')}</div>
            {RESOURCE_LINKS.map(link => (
              <Link key={link.href} to={link.href} className="ph-resources-link" onClick={() => setOpen(false)}>
                {link.icon} {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useTranslation('header');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (path) => {
    setOpen(false);
    navigate(path);
  };

  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email || 'Utilisateur';
  const isPro = user?.plan === 'pro';

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button className="ph-avatar-btn" onClick={() => setOpen(!open)}>
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={displayName} className="ph-avatar-img" />
        ) : (
          <UserCircleIcon style={{ width: 28, height: 28 }} />
        )}
        <span className="ph-desktop-nav" style={{ marginLeft: 4 }}>
          {displayName}
        </span>
        <ChevronDownIcon style={{ width: 12 }} />
      </button>
      {open && (
        <div className="ph-user-dropdown">
          <div className="ph-user-dropdown-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--hdr-text)' }}>{displayName}</div>
            <div style={{ fontSize: 11, color: 'var(--hdr-text-muted)' }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: isPro ? 'var(--hdr-accent)' : 'var(--hdr-text-muted)' }}>
              {isPro ? '● Plan Pro actif' : '● Plan Gratuit'}
            </div>
          </div>
          <div className="ph-user-dropdown-separator" />
          <button className="ph-user-dropdown-item" onClick={() => handleClick('/dashboard')}>
            <Bars3Icon style={{ width: 16 }} /> {t('dashboard.my_dashboard')}
          </button>
          <button className="ph-user-dropdown-item" onClick={() => handleClick('/suivis')}>
            <HeartIcon style={{ width: 16 }} /> {t('dashboard.followed_claims')}
          </button>
          <button className="ph-user-dropdown-item" onClick={() => handleClick('/discussions')}>
            <ChatBubbleLeftRightIcon style={{ width: 16 }} /> {t('dashboard.my_discussions')}
          </button>
          <button className="ph-user-dropdown-item" onClick={() => handleClick('/impact')}>
            { /*<CpuChipIcon style={{ width: 16 }} /> */}
            {t('dashboard.my_impact')}
          </button>
          <div className="ph-user-dropdown-separator" />
          <button className="ph-user-dropdown-item" onClick={() => handleClick('/parametres')}>
            <Cog6ToothIcon style={{ width: 16 }} /> {t('dashboard.settings')}
          </button>
          {!isPro ? (
            <button className="ph-user-dropdown-item" onClick={() => handleClick('/pro')}>
              <BoltIcon style={{ width: 16 }} /> {t('dashboard.upgrade_pro')}
            </button>
          ) : (
            <div className="ph-user-dropdown-item" style={{ cursor: 'default', color: 'var(--hdr-text-muted)' }}>
              <CheckCircleIcon style={{ width: 16, color: 'var(--hdr-accent)' }} /> Plan Pro actif
            </div>
          )}
          <div className="ph-user-dropdown-separator" />
          <button className="ph-user-dropdown-item danger" onClick={onLogout}>
            <ArrowRightOnRectangleIcon style={{ width: 16 }} /> {t('header.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

const NotificationBell = ({ count = 0, onClick }) => (
  <button className="ph-notif-btn" onClick={onClick} aria-label="Notifications">
    <BellIcon style={{ width: 18 }} />
    {count > 0 && <span className="ph-badge">{count > 9 ? '9+' : count}</span>}
  </button>
);

const MobileDrawer = ({
  isOpen,
  onClose,
  isActive,
  searchQuery,
  setSearchQuery,
  darkModeToggle,
  theme,
  isAuthenticated,
  user,
  onLogout,
}) => {
  const [closing, setClosing] = useState(false);
  const { t, i18n } = useTranslation('header');
  const currentLang = i18n.language;

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen && !closing) return null;

  return (
    <>
      <div className={`ph-overlay${closing ? ' closing' : ''}`} onClick={handleClose} aria-hidden="true" />
      <div className={`ph-drawer${closing ? ' closing' : ''}`} role="dialog" aria-modal="true">
        <div className="ph-drawer-header">
          <Link to="/" onClick={handleClose} style={{ textDecoration: 'none' }}>
            <img
              src={theme === 'dark' ? logoDark : logoLight}
              alt="PICH AI"
              style={{ height: 20, width: 'auto', display: 'block' }}
            />
          </Link>
          <button onClick={handleClose} className="ph-burger" aria-label={t('close')}>
            <CloseIcon />
          </button>
        </div>

        <div className="ph-drawer-search">
          <div style={{ position: 'relative' }}>
            <MagnifyingGlassIcon
              style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', width: 16,
                color: 'var(--hdr-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ph-drawer-search-input"
            />
          </div>
        </div>

        <nav className="ph-drawer-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={handleClose}
              className={`ph-drawer-link${isActive(link.href) ? ' is-active' : ''}`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="ph-drawer-ecosystem">
          <div className="ph-drawer-res-title" style={{ color: 'var(--hdr-accent)' }}>
            {t('ecosystems').toUpperCase()}
          </div>
          {ECOSYSTEM_ITEMS.map((column, idx) => (
            <div key={idx}>
              {column.map(item => (
                <Link key={item.href} to={item.href} onClick={handleClose} className="ph-drawer-sub-link">
                  {t(item.key)}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="ph-drawer-resources">
          <div className="ph-drawer-res-title">{t('resources').toUpperCase()}</div>
          <div className="ph-drawer-lang-options">
            <button
              className={`ph-drawer-lang-btn ${currentLang === 'fr' ? 'active' : ''}`}
              onClick={() => changeLanguage('fr')}
            >
              Français
            </button>
            <button
              className={`ph-drawer-lang-btn ${currentLang === 'ht' ? 'active' : ''}`}
              onClick={() => changeLanguage('ht')}
            >
              Kreyòl
            </button>
          </div>
          <div className="ph-drawer-darkmode">
            <span style={{ fontSize: 13, fontFamily: 'var(--hdr-font)' }}>
              {theme === 'light' ? t('light_mode') : t('dark_mode')}
            </span>
            <div
              className={`ph-toggle-switch ${theme === 'dark' ? 'dark' : ''}`}
              onClick={darkModeToggle}
            >
              <div className="ph-toggle-knob" />
            </div>
          </div>
          {RESOURCE_LINKS.map(link => (
            <Link key={link.href} to={link.href} onClick={handleClose} className="ph-resources-link" style={{ marginBottom: 4 }}>
              {link.icon} {t(link.key)}
            </Link>
          ))}
        </div>

        <div className="ph-drawer-footer">
          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="profile" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                ) : (
                  <UserCircleIcon style={{ width: 36 }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--hdr-text)' }}>
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--hdr-text-muted)' }}>
                    {user?.plan === 'pro' ? 'Plan Pro' : 'Plan Gratuit'}
                  </div>
                </div>
              </div>
              <Link to="/dashboard" onClick={handleClose} className="ph-drawer-btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {t('dashboard.my_dashboard')}
              </Link>
              <Link to="/suivis" onClick={handleClose} className="ph-drawer-btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {t('dashboard.followed_claims')}
              </Link>
              <Link to="/discussions" onClick={handleClose} className="ph-drawer-btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {t('dashboard.my_discussions')}
              </Link>
              <Link to="/impact" onClick={handleClose} className="ph-drawer-btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {t('dashboard.my_impact')}
              </Link>
              <Link to="/parametres" onClick={handleClose} className="ph-drawer-btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                {t('dashboard.settings')}
              </Link>
              <button
                onClick={() => { handleClose(); onLogout?.(); }}
                style={{
                  width: '100%', padding: '10px', borderRadius: 40,
                  border: '1px solid var(--hdr-border)', background: 'transparent',
                  color: '#EF4444', fontSize: 13, fontWeight: 500,
                  fontFamily: 'var(--hdr-font)', cursor: 'pointer',
                }}
              >
                {t('header.logout')}
              </button>
            </>
          ) : (
            <div className="ph-drawer-cta-row">
              <Link to="/connexion" onClick={handleClose} className="ph-drawer-btn-outline">
                {t('login')}
              </Link>
              <Link to="/inscription" onClick={handleClose} className="ph-drawer-btn-light">
                {t('signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Header = ({ onToggleSidebar, onChatToggle, unreadNotifications: propUnread }) => {
  const location = useLocation();
  const navigate = useNavigate();                    
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggle: darkModeToggle } = useTheme();
  const { t } = useTranslation('header');
  const { user, isAuthenticated, logout, unreadCount: hookUnread } = useUser();

  const unread = propUnread ?? hookUnread;

  // Gestion de la déconnexion avec retour à l’accueil
  const isLoggingOut = useRef(false);               

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();                                        
    navigate('/');                                   
  };


  useEffect(() => {
    // Réinitialise le drapeau après une déconnexion volontaire
    if (isLoggingOut.current && !isAuthenticated) {
      isLoggingOut.current = false;
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isActive = useCallback(
    (href) => (href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)),
    [location.pathname]
  );

  const isDashboard = location.pathname.startsWith('/dashboard');
  const showDashboardButton = isAuthenticated && !isDashboard;

  const showImpactLink = isAuthenticated && !isDashboard;

  return (
    <>
      <style>{STYLES}</style>
      <header
        className="ph-header"
        style={{
          background: scrolled ? 'var(--hdr-bg-scrolled)' : 'var(--hdr-bg)',
          borderBottom: `1px solid ${scrolled ? 'var(--hdr-border-strong)' : 'var(--hdr-border)'}`,
          boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.08)' : 'none',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            padding: '0 28px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isDashboard && (
              <button className="ph-burger" onClick={onToggleSidebar} aria-label="Menu">
                <HamburgerIcon />
              </button>
            )}
            {!isDashboard && (
              <button className="ph-burger" onClick={() => setMenuOpen(true)} aria-label={t('menu')}>
                <HamburgerIcon />
              </button>
            )}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
              <img
                src={theme === 'dark' ? logoDark : logoLight}
                alt="PICH AI"
                style={{ height: 20, width: 'auto', display: 'block' }}
              />
            </Link>
          </div>

       
          {isDashboard && (
            <div className="ph-search-wrapper" style={{ display: 'flex' }}>
              <MagnifyingGlassIcon className="ph-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un claim, une institution, un événement..."
                className="ph-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          
          {!isDashboard && (
            <nav
              className="ph-desktop-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                justifyContent: 'center',
              }}
            >
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`ph-nav-link${isActive(link.href) ? ' is-active' : ''}`}
                >
                  {t(link.key)}
                </Link>
              ))}
              <EcosystemMegaMenu />
              {showImpactLink && (
                <Link
                  to="/impact"
                  className={`ph-nav-link${isActive('/impact') ? ' is-active' : ''}`}
                  style={{ marginLeft: 8 }}
                >
                  {/* <ArrowTrendingUpIcon style={{ width: 14, marginRight: 4 }} /> */}
                  {t('dashboard.my_impact')}
                </Link>
              )}
            </nav>
          )}

          <div
            className="ph-desktop-actions"
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            {isDashboard ? (
              <>
                <NotificationBell count={unread} onClick={() => window.location.href = '/notifications'} />
                <button
                  className="ph-btn-outline"
                  onClick={onChatToggle || (() => window.location.href = '/chat')}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px' }}
                >
                  { /* <CpuChipIcon style={{ width: 16 }} /> */}
                  PichAI Chat
                </button>
                <UserDropdown user={user} onLogout={handleLogout} />
              </>
            ) : isAuthenticated ? (
              <>
                {showDashboardButton ? (
                  <>
                    <ResourcesDropdown darkModeToggle={darkModeToggle} theme={theme} />
                    <NotificationBell count={unread} onClick={() => window.location.href = '/notifications'} />
                    <Link to="/dashboard" className="ph-btn-light">
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <ResourcesDropdown darkModeToggle={darkModeToggle} theme={theme} />
                    <NotificationBell count={unread} onClick={() => window.location.href = '/notifications'} />
                    <UserDropdown user={user} onLogout={handleLogout} />
                  </>
                )}
              </>
            ) : (
              <>
                <ResourcesDropdown darkModeToggle={darkModeToggle} theme={theme} />
                <Link to="/connexion" className="ph-btn-outline">{t('login')}</Link>
                <Link to="/inscription" className="ph-btn-light">{t('signup')}</Link>
              </>
            )}
          </div>

          
          {!isDashboard && !isAuthenticated && (
            <Link to="/connexion" className="ph-mobile-login">{t('login')}</Link>
          )}
          {isDashboard && (
            <button className="ph-mobile-user-btn" onClick={() => setMenuOpen(true)} aria-label="Compte">
              <UserCircleIcon style={{ width: 24, height: 24 }} />
            </button>
          )}
          {showDashboardButton && !isDashboard && (
            <Link to="/dashboard" className="ph-mobile-dashboard-btn">
          
              Dashboard
            </Link>
          )}
        </div>
      </header>

      <MobileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isActive={isActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkModeToggle={darkModeToggle}
        theme={theme}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
