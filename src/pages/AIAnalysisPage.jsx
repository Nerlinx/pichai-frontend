// ═══════════════════════════════════════════════════════════════
// PichAI — AIAnalysisPage.jsx
// Design épuré (X/Perplexity) : pas de bordures, boutons noirs/gris,
// loader noir, police Inter, dates optionnelles.
// Thème clair/sombre via variables CSS, multilingue (fr/ht).
// Onglets responsifs, champ de recherche visible, analyse IA stylée.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  ChevronRightIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// ─── Configuration API ───────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const getToken = () =>
  localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const authHdr = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// ─── PALETTE FIXE (verdicts) ─────────────────────────────────────
const C = {
  green: '#0F7B4E',
  amber: '#B45309',
  red: '#D32F2F',
  purple: '#6D28D9',
};

// ─── VERDICTS ────────────────────────────────────────────────────
const VERDICTS = {
  Crédible:    { color: C.green, bg: 'rgba(15,123,78,0.08)', icon: '✅' },
  Possible:    { color: C.amber, bg: 'rgba(180,83,9,0.08)', icon: '⚠️' },
  Douteux:     { color: C.red, bg: 'rgba(211,47,47,0.08)', icon: '❌' },
  Insuffisant: { color: '#64748B', bg: 'rgba(100,116,139,0.08)', icon: '❓' },
};

// ─── UTILITAIRES ─────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── STYLES GLOBAUX ───────────────────────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const id = 'ai-analysis-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      /* Responsive helpers */
      @media (max-width: 640px) {
        .tab-label-full { display: none !important; }
        .tab-label-short { display: inline !important; }
      }
      @media (min-width: 641px) {
        .tab-label-full { display: inline !important; }
        .tab-label-short { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el?.parentNode) el.parentNode.removeChild(el);
    };
  }, []);
}

// ─── SCORE RING ───────────────────────────────────────────────────
function ScoreRing({ value, color, size = 'default', label, formula }) {
  const sizeMap = { sm: 52, default: 64, lg: 80 };
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 64;
  const r = (pixelSize - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const dash = (pct / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={pixelSize} height={pixelSize} viewBox={`0 0 ${pixelSize} ${pixelSize}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={pixelSize / 2} cy={pixelSize / 2} r={r} fill="none" stroke="var(--hdr-border, #E5E5E7)" strokeWidth="6" />
        <circle
          cx={pixelSize / 2} cy={pixelSize / 2} r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.7s ease' }}
        />
        <text
          x={pixelSize / 2} y={pixelSize / 2} textAnchor="middle" dominantBaseline="central"
          fill="var(--hdr-text, #0F0F10)" fontSize={pixelSize < 60 ? '16' : '20'} fontWeight="600"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${pixelSize / 2}px ${pixelSize / 2}px` }}
        >
          {Math.round(pct)}
        </text>
      </svg>
      {label && (
        <div style={{ fontSize: 12, color: 'var(--hdr-text-muted, #64748B)', marginTop: 4 }}>
          {label}
          {formula && <span title={formula} style={{ cursor: 'help', marginLeft: 4 }}>ⓘ</span>}
        </div>
      )}
    </div>
  );
}

// ─── BOUTON ACTION ───────────────────────────────────────────────
function ActionButton({ children, onClick, loading, icon, variant = 'primary', style }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: variant === 'ghost' ? '6px 12px' : '8px 16px',
    borderRadius: 40,
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    cursor: loading ? 'default' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.15s',
    ...style,
  };

  const colors = {
    primary: { bg: 'var(--hdr-accent, #000)', color: '#fff' },
    secondary: { bg: 'var(--hdr-surface, #F1F5F9)', color: 'var(--hdr-text, #0F172A)' },
    ghost: { bg: 'transparent', color: 'var(--hdr-text-muted, #64748B)' },
  };

  const { bg, color } = colors[variant] || colors.primary;

  return (
    <button onClick={onClick} disabled={loading} style={{ ...baseStyle, backgroundColor: bg, color }}>
      {loading ? <ArrowPathIcon style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}

// ─── ACTUALITÉS ──────────────────────────────────────────────────
function WebResults({ claimId }) {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const performSearch = useCallback(async (query = '') => {
    setLoading(true);
    setDone(false);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/web-search`, {
        method: 'POST',
        headers: authHdr(),
        body: JSON.stringify({ query: query || undefined, max_results: 20, search_type: 'news', mode: 'serper' }),
      });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      const items = data.articles || data.results || [];
      const withKeys = items.map((a, i) => ({ ...a, uniqueKey: a.link || `article-${i}` }));
      setArticles(withKeys);
      setDone(true);
      setPage(1);
    } catch {
      setArticles([]);
      setError(t('analysis.news_error'));
      setDone(true);
    } finally { setLoading(false); }
  }, [claimId, t]);

  const handleSubmit = (e) => { e.preventDefault(); performSearch(searchQuery); };

  const filtered = articles.filter(a => sourceFilter === 'all' || a.source?.toLowerCase().includes(sourceFilter));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const inputBg = 'var(--hdr-surface, #F8FAFC)';
  const borderColor = 'var(--hdr-border, #E2E8F0)';
  const textColor = 'var(--hdr-text, #0F172A)';
  const mutedColor = 'var(--hdr-text-muted, #64748B)';

  return (
    <div style={{ background: 'transparent', fontFamily: 'Inter, sans-serif' }}>
      {/* En-tête + recherche */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NewspaperIcon style={{ width: 20, height: 20, color: mutedColor }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: textColor }}>
            {t('analysis.news')}
          </span>
        </div>
        <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 200 }}>
          <div style={{ position: 'relative' }}>
            <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, color: mutedColor }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('analysis.search_placeholder')}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: 40,
                border: `1px solid ${borderColor}`,
                backgroundColor: inputBg,
                color: textColor,
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--hdr-accent, #000)';
                e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.05)';
              }}
              onBlur={e => {
                e.target.style.borderColor = borderColor;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </form>
        <ActionButton onClick={() => performSearch(searchQuery)} loading={loading} icon={<ArrowPathIcon style={{ width: 16 }} />} variant="secondary">
          {loading ? '' : t('analysis.refresh')}
        </ActionButton>
      </div>

      {/* Contenu */}
      {!done && loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${borderColor}`, borderTopColor: 'var(--hdr-accent, #000)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
      {!done && !loading && (
        <div style={{ textAlign: 'center', padding: 60, color: mutedColor }}>
          <GlobeAltIcon style={{ width: 40, margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: 14 }}>{t('analysis.start_search')}</p>
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: 40, color: C.red }}>
          <ExclamationTriangleIcon style={{ width: 32, margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14 }}>{error}</p>
          <ActionButton onClick={() => performSearch(searchQuery)} loading={false} icon={<ArrowPathIcon style={{ width: 16 }} />} variant="primary" style={{ marginTop: 16 }}>
            {t('common.retry')}
          </ActionButton>
        </div>
      )}

      {done && !error && (
        <>
          {filtered.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: mutedColor }}>{t('analysis.source_filter')}</span>
                  <select
                    value={sourceFilter}
                    onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      border: `1px solid ${borderColor}`,
                      backgroundColor: inputBg,
                      color: textColor,
                      fontSize: 13,
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                    }}
                  >
                    <option value="all">{t('analysis.all_sources')}</option>
                    {[...new Set(articles.map(a => a.source).filter(Boolean))].map(src => (
                      <option key={src} value={src.toLowerCase()}>{src}</option>
                    ))}
                  </select>
                </div>
                <span style={{ fontSize: 13, color: mutedColor }}>{filtered.length} {t('analysis.results')}</span>
              </div>

              <div className="hide-scrollbar" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 16,
              }}>
                {paginated.map(article => (
                  <a key={article.uniqueKey} href={article.link} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      background: 'transparent',
                      borderRadius: 8,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = inputBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ aspectRatio: '16/9', backgroundColor: borderColor, borderRadius: 8, overflow: 'hidden' }}>
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: inputBg }}>
                          <NewspaperIcon style={{ width: 32, height: 32, color: mutedColor }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '12px 4px' }}>
                      <div style={{ fontSize: 12, color: mutedColor, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontWeight: 600, color: textColor }}>{article.source}</span>
                        {article.pub_date && (
                          <>
                            <span style={{ color: mutedColor }}>·</span>
                            <span>{formatDate(article.pub_date)}</span>
                          </>
                        )}
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: textColor, margin: '0 0 4px', lineHeight: 1.4 }}>
                        {article.title}
                      </h3>
                      {article.snippet && (
                        <p style={{ fontSize: 12, color: 'var(--hdr-text-sub, #475569)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.snippet}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24, fontSize: 14 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ background: 'none', border: 'none', color: page === 1 ? mutedColor : textColor, fontWeight: 600, cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
                    ← {t('analysis.previous')}
                  </button>
                  <span style={{ color: mutedColor }}>{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ background: 'none', border: 'none', color: page === totalPages ? mutedColor : textColor, fontWeight: 600, cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
                    {t('analysis.next')} →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 60, color: mutedColor }}>
              {t('analysis.no_articles')}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── ANALYSE IA (style Perplexity) ───────────────────────────────
function AIAnalysisPanel({ claimId }) {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/analyze`, {
        method: 'POST',
        headers: authHdr(),
      });
      if (!res.ok) throw new Error('Erreur analyse');
      const data = await res.json();
      setResult(data);
    } catch {
      setError(t('analysis.ai_error'));
    } finally { setLoading(false); }
  };

  const analysis = result?.analysis || result || null;
  const vConfig = analysis ? VERDICTS[analysis.verdict] || VERDICTS.Insuffisant : null;

  const textColor = 'var(--hdr-text, #0F172A)';
  const mutedColor = 'var(--hdr-text-muted, #64748B)';
  const surfaceBg = 'var(--hdr-surface, #F8FAFC)';
  const accentColor = 'var(--hdr-accent, #000)';

  return (
    <div style={{ background: 'transparent', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--hdr-border, #E2E8F0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CpuChipIcon style={{ width: 20, height: 20, color: mutedColor }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: textColor }}>
            {t('analysis.deep_analysis')}
          </span>
        </div>
        <ActionButton onClick={runAnalysis} loading={loading} variant="primary" icon={<CpuChipIcon style={{ width: 16 }} />}>
          {loading ? t('analysis.analyzing') : result ? t('analysis.relaunch') : t('analysis.analyze')}
        </ActionButton>
      </div>

      {!result && !loading && !error && (
        <div style={{ textAlign: 'center', padding: 60, color: mutedColor }}>
          <CpuChipIcon style={{ width: 48, margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: textColor }}>{t('analysis.ready')}</h3>
          <p style={{ maxWidth: 400, margin: '0 auto', fontSize: 14 }}>{t('analysis.ready_desc')}</p>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--hdr-border, #E2E8F0)', borderTopColor: accentColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: 40, color: C.red }}>
          <ExclamationTriangleIcon style={{ width: 32, margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14 }}>{error}</p>
          <ActionButton onClick={runAnalysis} loading={false} icon={<ArrowPathIcon style={{ width: 16 }} />} variant="primary" style={{ marginTop: 16 }}>
            {t('common.retry')}
          </ActionButton>
        </div>
      )}

      {result && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Carte verdict + score + cohérence */}
          <div style={{
            backgroundColor: vConfig.bg,
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 20,
          }}>
            <ScoreRing value={analysis.score} color={vConfig.color} size="lg" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: vConfig.color }}>
                {vConfig.icon} {vConfig.label}
              </div>
              <div style={{ fontSize: 14, color: mutedColor, marginTop: 4 }}>
                {t('analysis.source_reliability')} {analysis.source_credibility}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: mutedColor }}>{t('analysis.coherence')}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: textColor }}>{analysis.coherence}%</div>
            </div>
          </div>

          {/* Synthèse (gris pâle style Perplexity en mode clair) */}
          <div style={{
            backgroundColor: surfaceBg,
            borderRadius: 10,
            padding: '16px 20px',
            color: textColor,
            fontSize: 14,
            lineHeight: 1.6,
          }}>
            <p style={{ margin: 0 }}>{analysis.analyse}</p>
            {analysis.enriched_by_citizens && (
              <div style={{ fontSize: 12, color: mutedColor, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UsersIcon style={{ width: 14 }} />
                {t('analysis.enriched_by_citizens')}
              </div>
            )}
          </div>

          {/* Points forts / faibles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 600, marginBottom: 12, color: textColor }}>
                <CheckCircleIcon style={{ width: 18, color: C.green }} />
                {t('analysis.strengths')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, color: 'var(--hdr-text-sub, #334155)', lineHeight: 1.5 }}>
                {(analysis.points_forts || []).map((p, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: C.green }}>•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 600, marginBottom: 12, color: textColor }}>
                <XCircleIcon style={{ width: 18, color: C.red }} />
                {t('analysis.weaknesses')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, color: 'var(--hdr-text-sub, #334155)', lineHeight: 1.5 }}>
                {(analysis.points_faibles || []).map((p, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: C.red }}>•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signaux clés */}
          {analysis.key_signals && analysis.key_signals.length > 0 && (
            <div style={{ backgroundColor: surfaceBg, borderRadius: 10, padding: '16px 20px' }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: textColor }}>{t('analysis.key_signals')}</h4>
              <ul style={{ fontSize: 13, color: 'var(--hdr-text-sub, #475569)', paddingLeft: 20, margin: 0 }}>
                {analysis.key_signals.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────
export default function AIAnalysisPage() {
  useGlobalStyles();
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const claimId = parseInt(eventId);
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('analyse');

  const loadData = useCallback(async () => {
    try {
      const [detailRes, scoresRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/claims/${claimId}/detail`, { headers: authHdr() }),
        fetch(`${API_BASE}/api/v1/claims/${claimId}/scores`),
      ]);
      if (!detailRes.ok || !scoresRes.ok) throw new Error('Erreur chargement');
      const detail = await detailRes.json();
      const scoresData = await scoresRes.json();
      setClaim(detail.claim);
      setScores(scoresData);
    } catch (e) {
      setError(t('analysis.load_error'));
    } finally {
      setLoading(false);
    }
  }, [claimId, t]);

  useEffect(() => { loadData(); }, [loadData]);

  const TABS = [
    { id: 'analyse', label: t('analysis.tab_analysis'), shortLabel: 'Analyse', icon: <CpuChipIcon style={{ width: 16 }} /> },
    { id: 'web', label: t('analysis.tab_news'), shortLabel: 'Actus', icon: <GlobeAltIcon style={{ width: 16 }} /> },
  ];

  const compositeFormula = 'Votes (50%) + Preuves (30%) + IA (20%)';

  const bgColor = 'var(--hdr-bg, #FFFFFF)';
  const textColor = 'var(--hdr-text, #0F172A)';
  const mutedColor = 'var(--hdr-text-muted, #64748B)';
  const accentColor = 'var(--hdr-accent, #000)';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--hdr-border, #E2E8F0)', borderTopColor: accentColor, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: mutedColor }}>{t('analysis.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !claim) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bgColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <ExclamationTriangleIcon style={{ width: 48, marginBottom: 16, color: C.red }} />
        <p style={{ fontSize: 16, marginBottom: 16, color: textColor }}>{error}</p>
        <button onClick={loadData} style={{
          padding: '10px 24px',
          borderRadius: 40,
          border: 'none',
          backgroundColor: accentColor,
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, fontFamily: 'Inter, sans-serif' }}>
      {/* Breadcrumb */}
      <div style={{
        borderBottom: '1px solid var(--hdr-border, #F1F5F9)',
        padding: '12px 20px',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: mutedColor,
        flexWrap: 'wrap',
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeftIcon style={{ width: 14 }} /> {t('common.home')}
        </Link>
        <span>/</span>
        <Link to={`/event/${claimId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {t('common.detail')}
        </Link>
        <span>/</span>
        <span style={{ fontWeight: 500, color: textColor }}>{t('analysis.title')}</span>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* En-tête claim */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {claim?.category && (
              <span style={{ padding: '4px 10px', borderRadius: 20, backgroundColor: 'var(--hdr-surface, #F1F5F9)', fontSize: 12, color: 'var(--hdr-text-sub, #334155)' }}>
                {claim.category}
              </span>
            )}
            <span style={{ padding: '4px 10px', borderRadius: 20, backgroundColor: 'rgba(124,58,237,0.08)', color: C.purple, fontSize: 12, fontWeight: 500 }}>
              {t('analysis.ai_analysis')}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, margin: '0 0 8px', color: textColor }}>
            {claim?.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: mutedColor }}>
            {claim?.claimant && <span>🏛️ {claim.claimant}</span>}
            {claim?.department && <span>📍 {claim.department}</span>}
            {claim?.claim_date && <span>📅 {formatDate(claim.claim_date)}</span>}
          </div>
        </div>

        {/* Scores */}
        {scores && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <ScoreRing value={scores.ai_score} color={C.purple} size="sm" label={t('analysis.ai_score')} />
            <ScoreRing value={scores.crowd_score} color="#0066CC" size="sm" label={t('analysis.crowd_score')} />
            <ScoreRing value={scores.composite} color={scores.verdict_color || C.green} size="sm" label={t('analysis.composite_score')} formula={compositeFormula} />
            {scores.verdict && (
              <div style={{
                padding: '6px 14px',
                borderRadius: 40,
                background: VERDICTS[scores.verdict]?.bg,
                color: VERDICTS[scores.verdict]?.color || textColor,
                fontSize: 13,
                fontWeight: 500,
              }}>
                {VERDICTS[scores.verdict]?.icon} {VERDICTS[scores.verdict]?.label}
              </div>
            )}
          </div>
        )}

        {/* Barre d'onglets responsive */}
        <div style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          backgroundColor: 'var(--hdr-surface, #F1F5F9)',
          borderRadius: 40,
          marginBottom: 24,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {TABS.map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 16px',
                borderRadius: 40,
                border: 'none',
                backgroundColor: tab === tabItem.id ? bgColor : 'transparent',
                color: tab === tabItem.id ? textColor : mutedColor,
                fontWeight: tab === tabItem.id ? 600 : 400,
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: tab === tabItem.id ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                flexShrink: 0,
              }}
            >
              {tabItem.icon}
              <span className="tab-label-full">{tabItem.label}</span>
              <span className="tab-label-short" style={{ display: 'none' }}>{tabItem.shortLabel}</span>
            </button>
          ))}
          {/* Bouton Discussions */}
          <button
            onClick={() => navigate(`/discussion/${claimId}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 40,
              border: 'none',
              backgroundColor: 'transparent',
              color: mutedColor,
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChatBubbleLeftRightIcon style={{ width: 16 }} />
            <span className="tab-label-full">{t('analysis.tab_discussions')}</span>
            <span className="tab-label-short" style={{ display: 'none' }}>Discussions</span>
          </button>
          {/* Bouton Chat */}
          <button
            onClick={() => navigate(`/chat/${claimId}`, { state: { claimTitle: claim?.title } })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 16px',
              borderRadius: 40,
              border: 'none',
              backgroundColor: 'transparent',
              color: mutedColor,
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <SparklesIcon style={{ width: 16 }} />
            <span className="tab-label-full">PichAI Chat</span>
            <span className="tab-label-short" style={{ display: 'none' }}>Chat</span>
          </button>
        </div>

        {/* Contenu */}
        {tab === 'analyse' && <AIAnalysisPanel claimId={claimId} />}
        {tab === 'web' && <WebResults claimId={claimId} />}
      </div>
    </div>
  );
}