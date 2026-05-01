// ═══════════════════════════════════════════════════════════════
// EXPAND — AIAnalysisPage.jsx
// Page d'analyse IA complète — connectée aux endpoints réels
//
// Endpoints utilisés :
//   GET  /api/v1/claims/{id}/detail
//   GET  /api/v1/claims/{id}/scores
//   POST /api/v1/ai/claims/{id}/analyze
//   POST /api/v1/ai/claims/{id}/web-search
//   GET  /api/v1/ai/claims/{id}/social-trends
//   POST /api/v1/ai/chat
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const API_BASE  = 'http://localhost:8000';
const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const authHdr   = () => ({
  Authorization : `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// ── PALETTE ───────────────────────────────────────────────────────
const C = {
  bg          : '#FAF8F5',
  surface     : '#FFFFFF',
  surfaceAlt  : '#F4F1EC',
  border      : '#E8E3DA',
  borderLight : '#EFE9E0',
  text        : '#1C1917',
  textSub     : '#78716C',
  textMuted   : '#A8A29E',
  accent      : '#1D4ED8',
  accentSoft  : '#EFF6FF',
  accentBorder: '#BFDBFE',
  green       : '#15803D',
  greenSoft   : '#F0FDF4',
  greenBorder : '#BBF7D0',
  red         : '#B91C1C',
  redSoft     : '#FEF2F2',
  redBorder   : '#FECACA',
  amber       : '#B45309',
  amberSoft   : '#FFFBEB',
  amberBorder : '#FDE68A',
  purple      : '#6D28D9',
  purpleSoft  : '#F5F3FF',
};

// ── VERDICT CONFIG ────────────────────────────────────────────────
const VERDICTS = {
  Crédible   : { color: C.green,  bg: C.greenSoft,  border: C.greenBorder,  icon: '✅' },
  Possible   : { color: C.amber,  bg: C.amberSoft,  border: C.amberBorder,  icon: '⚠️' },
  Douteux    : { color: C.red,    bg: C.redSoft,    border: C.redBorder,    icon: '❌' },
  Insuffisant: { color: C.textMuted, bg: C.surfaceAlt, border: C.border,   icon: '❓' },
};

// ── SCORE RING ────────────────────────────────────────────────────
function ScoreRing({ value, color, size = 72, stroke = 7 }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(value || 0, 0), 100);
  const dash = (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.borderLight} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={C.text} fontSize={size < 60 ? 12 : 16} fontWeight="800"
        fontFamily="Georgia, serif"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px` }}
      >
        {Math.round(pct)}
      </text>
    </svg>
  );
}

// ── CHAT IA ───────────────────────────────────────────────────────
function AIChat({ claimId, claimTitle }) {
  const [messages, setMessages] = useState([{
    role   : 'assistant',
    content: `Bonjour ! Je suis votre assistant d'analyse pour **"${claimTitle}"**.\n\nJe peux :\n• Expliquer les scores et l'analyse IA\n• Rechercher des informations récentes\n• Comparer avec d'autres événements similaires\n• Répondre à vos questions en français ou en kreyòl\n\nQue souhaitez-vous savoir ?`,
  }]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const SUGGESTIONS = [
    'Pourquoi ce score ?',
    'Ki sous yo itilize ?',
    'Comparer avec 2023',
    'Facteurs de risque',
  ];

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res  = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method : 'POST',
        headers: authHdr(),
        body   : JSON.stringify({ message: msg, claim_id: claimId }),
      });
      const data = await res.json();
      const reply    = data.response || data.detail || 'Réponse indisponible.';
      const provider = data.provider || 'fallback';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, provider, latency: data.latency_ms }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Impossible de joindre le service IA. Vérifiez votre connexion.',
      }]);
    }
    setLoading(false);
  };

  const renderContent = (text) => {
    // Formatage basique markdown → lisible
    return text
      .replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      background   : C.surface,
      border       : `1px solid ${C.border}`,
      borderRadius : 12,
      display      : 'flex',
      flexDirection: 'column',
      height       : 480,
      overflow     : 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding     : '12px 16px',
        borderBottom: `1px solid ${C.border}`,
        display     : 'flex',
        alignItems  : 'center',
        gap         : 8,
        background  : C.surfaceAlt,
      }}>
        <div style={{
          width         : 28, height: 28,
          background    : C.text,
          borderRadius  : 8,
          display       : 'flex',
          alignItems    : 'center',
          justifyContent: 'center',
        }}>
          <CpuChipIcon style={{ width: 14, height: 14, color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Assistant EXPAND</div>
          <div style={{ fontSize: 10, color: C.textMuted }}>Analyse contextuelle · Questions libres</div>
        </div>
        <div style={{
          marginLeft  : 'auto',
          width       : 7, height: 7,
          borderRadius: '50%',
          background  : C.green,
        }} />
      </div>

      {/* Messages */}
      <div style={{
        flex     : 1,
        overflowY: 'auto',
        padding  : '14px 14px 6px',
        display  : 'flex',
        flexDirection: 'column',
        gap      : 10,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display       : 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth    : '88%',
              padding     : '9px 13px',
              fontSize    : 13,
              lineHeight  : 1.55,
              background  : msg.role === 'user' ? C.text : C.surfaceAlt,
              color       : msg.role === 'user' ? '#fff' : C.text,
              borderRadius: msg.role === 'user'
                ? '12px 12px 3px 12px'
                : '12px 12px 12px 3px',
              border: msg.role === 'user' ? 'none' : `1px solid ${C.border}`,
            }}>
              <div
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                style={{ whiteSpace: 'pre-wrap' }}
              />
              {msg.provider && (
                <div style={{
                  fontSize  : 9,
                  color     : msg.role === 'user' ? 'rgba(255,255,255,0.5)' : C.textMuted,
                  marginTop : 5,
                  display   : 'flex',
                  gap       : 6,
                }}>
                  <span>via {msg.provider}</span>
                  {msg.latency && <span>· {msg.latency}ms</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding     : '9px 14px',
              background  : C.surfaceAlt,
              border      : `1px solid ${C.border}`,
              borderRadius: '12px 12px 12px 3px',
              display     : 'flex',
              gap         : 4,
              alignItems  : 'center',
            }}>
              {[0,1,2].map(n => (
                <div key={n} style={{
                  width        : 5, height: 5,
                  borderRadius : '50%',
                  background   : C.textMuted,
                  animation    : `bounce 1s ease ${n * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{
        padding : '6px 14px',
        display : 'flex',
        gap     : 6,
        flexWrap: 'wrap',
      }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} style={{
            padding     : '4px 10px',
            borderRadius: 20,
            border      : `1px solid ${C.border}`,
            background  : C.bg,
            color       : C.textSub,
            fontSize    : 11,
            cursor      : 'pointer',
            whiteSpace  : 'nowrap',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding    : '10px 14px',
        borderTop  : `1px solid ${C.border}`,
        display    : 'flex',
        gap        : 8,
        background : C.surface,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Posez une question sur cet événement…"
          style={{
            flex        : 1,
            background  : C.surfaceAlt,
            border      : `1px solid ${C.border}`,
            borderRadius: 8,
            padding     : '8px 12px',
            fontSize    : 13,
            color       : C.text,
            outline     : 'none',
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} style={{
          padding     : '8px 16px',
          borderRadius: 8,
          border      : 'none',
          background  : input.trim() && !loading ? C.text : C.borderLight,
          color       : input.trim() && !loading ? '#fff' : C.textMuted,
          fontWeight  : 700,
          fontSize    : 13,
          cursor      : input.trim() && !loading ? 'pointer' : 'not-allowed',
        }}>
          ↑
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

// ── RÉSULTATS RECHERCHE WEB ───────────────────────────────────────
function WebResults({ claimId }) {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState('');

  const search = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/web-search`, {
        method: 'POST', headers: authHdr(),
      });
      const data = await res.json();
      setArticles(data.articles || []);
      setDone(true);
    } catch {
      setError('Erreur lors de la recherche.');
      setDone(true);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background  : C.surface,
      border      : `1px solid ${C.border}`,
      borderRadius: 12,
      overflow    : 'hidden',
    }}>
      <div style={{
        padding     : '14px 16px',
        borderBottom: `1px solid ${C.border}`,
        display     : 'flex',
        justifyContent: 'space-between',
        alignItems  : 'center',
        background  : C.surfaceAlt,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <GlobeAltIcon style={{ width: 15, height: 15, color: C.textSub }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
            Actualités récentes
          </span>
          <span style={{
            fontSize: 10, color: C.textMuted,
            background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '1px 7px',
          }}>
            Google News RSS · Gratuit
          </span>
        </div>
        <button onClick={search} disabled={loading} style={{
          display     : 'flex',
          alignItems  : 'center',
          gap         : 5,
          padding     : '5px 12px',
          borderRadius: 7,
          border      : `1px solid ${C.accentBorder}`,
          background  : loading ? C.bg : C.accentSoft,
          color       : loading ? C.textMuted : C.accent,
          fontSize    : 11,
          fontWeight  : 700,
          cursor      : loading ? 'not-allowed' : 'pointer',
        }}>
          <ArrowPathIcon style={{
            width: 12, height: 12,
            animation: loading ? 'spin 0.8s linear infinite' : 'none',
          }} />
          {loading ? 'Recherche…' : done ? 'Actualiser' : 'Lancer la recherche'}
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {!done && !loading && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.textMuted, fontSize: 13 }}>
            <GlobeAltIcon style={{ width: 28, height: 28, margin: '0 auto 8px', display: 'block' }} />
            Recherche dans les médias haïtiens et internationaux
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: 28, height: 28, margin: '0 auto 8px',
              border: `2px solid ${C.border}`, borderTopColor: C.accent,
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 12, color: C.textMuted }}>
              Recherche dans Le Nouvelliste, AyiboPost, RFI Haïti…
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px', background: C.redSoft,
            border: `1px solid ${C.redBorder}`, borderRadius: 8,
            fontSize: 12, color: C.red,
          }}>
            {error}
          </div>
        )}

        {done && !loading && articles.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: C.textMuted, fontSize: 13 }}>
            Aucun article trouvé pour ce sujet.
          </div>
        )}

        {articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {articles.map((a, i) => (
              <div key={i} style={{
                padding     : '12px 14px',
                background  : C.bg,
                border      : `1px solid ${C.border}`,
                borderRadius: 9,
              }}>
                <div style={{
                  fontSize  : 13,
                  fontWeight: 600,
                  color     : C.text,
                  lineHeight: 1.4,
                  marginBottom: 6,
                  fontFamily: 'Georgia, serif',
                }}>
                  {a.title}
                </div>
                <div style={{
                  display       : 'flex',
                  justifyContent: 'space-between',
                  alignItems    : 'center',
                  fontSize      : 11,
                  color         : C.textMuted,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DocumentTextIcon style={{ width: 11, height: 11 }} />
                    {a.source}
                  </span>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {a.pub_date && (
                      <span>{new Date(a.pub_date).toLocaleDateString('fr-FR')}</span>
                    )}
                    {a.link && (
                      <a href={a.link} target="_blank" rel="noopener noreferrer" style={{
                        color: C.accent, textDecoration: 'none', fontWeight: 600,
                      }}>
                        Lire ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── ANALYSE IA STRUCTURÉE ─────────────────────────────────────────
function AIAnalysisPanel({ claimId }) {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/analyze`, {
        method: 'POST', headers: authHdr(),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Analyse indisponible — vérifiez que le serveur est démarré.");
    }
    setLoading(false);
  };

  const analysis = result?.analysis;
  const verdict  = analysis?.verdict;
  const vConfig  = VERDICTS[verdict] || VERDICTS['Insuffisant'];

  return (
    <div style={{
      background  : C.surface,
      border      : `1px solid ${C.border}`,
      borderRadius: 12,
      overflow    : 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding     : '14px 16px',
        borderBottom: `1px solid ${C.border}`,
        display     : 'flex',
        justifyContent: 'space-between',
        alignItems  : 'center',
        background  : C.surfaceAlt,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <CpuChipIcon style={{ width: 15, height: 15, color: C.textSub }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
            Analyse IA approfondie
          </span>
        </div>
        <button onClick={runAnalysis} disabled={loading} style={{
          display     : 'flex',
          alignItems  : 'center',
          gap         : 5,
          padding     : '5px 14px',
          borderRadius: 7,
          border      : 'none',
          background  : loading ? C.borderLight : C.text,
          color       : loading ? C.textMuted : '#fff',
          fontSize    : 11,
          fontWeight  : 700,
          cursor      : loading ? 'not-allowed' : 'pointer',
        }}>
          <CpuChipIcon style={{
            width: 12, height: 12,
            animation: loading ? 'spin 0.8s linear infinite' : 'none',
          }} />
          {loading ? 'Analyse en cours…' : result ? 'Relancer' : 'Lancer l\'analyse'}
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {/* État initial */}
        {!result && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '28px 20px' }}>
            <CpuChipIcon style={{
              width: 36, height: 36,
              color: C.textMuted, margin: '0 auto 10px', display: 'block',
            }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              Analyse IA non lancée
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, maxWidth: 320, margin: '0 auto 16px' }}>
              L'IA va analyser ce claim en profondeur — sources, contexte haïtien, points forts et faibles.
            </div>
            <button onClick={runAnalysis} style={{
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: C.text, color: '#fff', fontSize: 13,
              fontWeight: 700, cursor: 'pointer',
            }}>
              Analyser maintenant
            </button>
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{
              width: 32, height: 32, margin: '0 auto 12px',
              border: `2px solid ${C.border}`, borderTopColor: C.accent,
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 13, color: C.textSub, marginBottom: 4 }}>
              Analyse en cours…
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>
              Vérification des sources · Scoring de crédibilité · Contexte haïtien
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div style={{
            padding: '12px 14px', background: C.redSoft,
            border: `1px solid ${C.redBorder}`, borderRadius: 8,
            fontSize: 12, color: C.red,
          }}>
            {error}
          </div>
        )}

        {/* Résultats */}
        {result && analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Verdict + score */}
            <div style={{
              display    : 'flex',
              alignItems : 'center',
              gap        : 16,
              padding    : '14px 16px',
              background : vConfig.bg,
              border     : `1px solid ${vConfig.border}`,
              borderRadius: 10,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize  : 36,
                  fontWeight: 900,
                  color     : vConfig.color,
                  lineHeight: 1,
                  fontFamily: 'Georgia, serif',
                }}>
                  {analysis.score || 0}
                </div>
                <div style={{ fontSize: 9, color: vConfig.color, marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Score
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: vConfig.border }} />
              <div>
                <div style={{
                  fontSize  : 20,
                  fontWeight: 800,
                  color     : vConfig.color,
                  fontFamily: 'Georgia, serif',
                }}>
                  {vConfig.icon} {verdict}
                </div>
                <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>
                  Verdict IA — mis à jour à l'instant
                </div>
              </div>
              {result.score_updated !== undefined && (
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: C.textMuted }}>Score mis à jour</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                    {Math.round(result.score_updated * 100)}%
                  </div>
                </div>
              )}
            </div>

            {/* Analyse textuelle */}
            {analysis.analyse && (
              <div style={{
                padding    : '12px 14px',
                background : C.surfaceAlt,
                borderRadius: 9,
                border     : `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Analyse
                </div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.65, margin: 0 }}>
                  {analysis.analyse}
                </p>
              </div>
            )}

            {/* Points forts / faibles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {analysis.points_forts?.length > 0 && (
                <div style={{
                  padding: '12px 14px', background: C.greenSoft,
                  border: `1px solid ${C.greenBorder}`, borderRadius: 9,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.green, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    ✅ Points forts
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {analysis.points_forts.slice(0, 3).map((p, i) => (
                      <li key={i} style={{
                        fontSize: 12, color: C.text, lineHeight: 1.5,
                        paddingBottom: 5, marginBottom: 5,
                        borderBottom: i < analysis.points_forts.length - 1 ? `1px solid ${C.greenBorder}` : 'none',
                      }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.points_faibles?.length > 0 && (
                <div style={{
                  padding: '12px 14px', background: C.redSoft,
                  border: `1px solid ${C.redBorder}`, borderRadius: 9,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.red, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    ❌ Points faibles
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {analysis.points_faibles.slice(0, 3).map((p, i) => (
                      <li key={i} style={{
                        fontSize: 12, color: C.text, lineHeight: 1.5,
                        paddingBottom: 5, marginBottom: 5,
                        borderBottom: i < analysis.points_faibles.length - 1 ? `1px solid ${C.redBorder}` : 'none',
                      }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sources suggérées */}
            {analysis.sources_suggerees?.length > 0 && (
              <div style={{
                padding: '12px 14px', background: C.accentSoft,
                border: `1px solid ${C.accentBorder}`, borderRadius: 9,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  🔗 Sources recommandées
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {analysis.sources_suggerees.slice(0, 4).map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.text }}>
                      · {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions de suivi */}
            {analysis.questions_approfondissement?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Questions pour approfondir
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {analysis.questions_approfondissement.slice(0, 3).map((q, i) => (
                    <span key={i} style={{
                      fontSize: 11, padding: '4px 10px',
                      background: C.surfaceAlt, border: `1px solid ${C.border}`,
                      borderRadius: 20, color: C.textSub,
                    }}>
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────
export default function AIAnalysisPage() {
  const { id: eventId } = useParams();
  const claimId = parseInt(eventId);
  const [claim,   setClaim]    = useState(null);
  const [scores,  setScores]   = useState(null);
  const [loading, setLoading]  = useState(true);
  const [error,   setError]    = useState('');
  const [tab,     setTab]      = useState('analyse');

  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/claims/${claimId}/detail`, { headers: authHdr() }),
          fetch(`${API_BASE}/api/v1/claims/${claimId}/scores`),
        ]);
        if (!dRes.ok) throw new Error('Claim introuvable');
        const d = await dRes.json();
        const s = await sRes.json();
        setClaim(d.claim);
        setScores(s);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };
    load();
  }, [claimId]);

  const TABS = [
    { id: 'analyse', label: 'Analyse IA',    icon: <CpuChipIcon  style={{ width: 13, height: 13 }} /> },
    { id: 'web',     label: 'Actualités',     icon: <GlobeAltIcon style={{ width: 13, height: 13 }} /> },
    { id: 'chat',    label: 'Interroger l\'IA', icon: <ChartBarIcon style={{ width: 13, height: 13 }} /> },
  ];

  // ── Chargement ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 36, height: 36, margin: '0 auto 12px',
          border: `2px solid ${C.border}`, borderTopColor: C.accent,
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ fontSize: 13, color: C.textSub }}>Chargement…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  // ── Erreur ──
  if (error) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <ExclamationTriangleIcon style={{ width: 40, height: 40, color: C.red, margin: '0 auto 12px', display: 'block' }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>Événement introuvable</div>
        <div style={{ fontSize: 13, color: C.textSub, marginBottom: 18 }}>{error}</div>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 18px', borderRadius: 8,
          background: C.text, color: '#fff',
          fontSize: 13, fontWeight: 700, textDecoration: 'none',
        }}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight  : '100vh',
      background : C.bg,
      fontFamily : "'Inter', system-ui, sans-serif",
    }}>

      {/* ── BREADCRUMB ── */}
      <div style={{
        background  : C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding     : '10px 20px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: C.textSub, textDecoration: 'none',
          }}>
            <ArrowLeftIcon style={{ width: 13, height: 13 }} />
            Accueil
          </Link>
          <span style={{ color: C.textMuted, fontSize: 12 }}>›</span>
          <Link to={`/event/${claimId}`} style={{ fontSize: 12, color: C.textSub, textDecoration: 'none' }}>
            Détail
          </Link>
          <span style={{ color: C.textMuted, fontSize: 12 }}>›</span>
          <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>Analyse IA</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── HEADER ÉVÉNEMENT ── */}
        <div style={{
          background  : C.surface,
          border      : `1px solid ${C.border}`,
          borderRadius: 12,
          padding     : '20px 24px',
          marginBottom: 20,
          display     : 'flex',
          gap         : 20,
          alignItems  : 'flex-start',
          flexWrap    : 'wrap',
        }}>
          {/* Infos */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {claim.category && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 9px',
                  borderRadius: 20, background: C.accentSoft,
                  color: C.accent, border: `1px solid ${C.accentBorder}`,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {claim.category}
                </span>
              )}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 9px',
                borderRadius: 20, background: '#F5F3FF',
                color: C.purple, border: '1px solid #DDD6FE',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <CpuChipIcon style={{ width: 9, height: 9 }} />
                Analyse IA
              </span>
            </div>

            <h1 style={{
              fontSize  : 20,
              fontWeight: 800,
              color     : C.text,
              lineHeight: 1.3,
              margin    : '0 0 8px',
              fontFamily: 'Georgia, serif',
            }}>
              {claim.title}
            </h1>

            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: C.textMuted, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                🏛️ {claim.claimant}
              </span>
              {claim.department && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  📍 {claim.department}
                </span>
              )}
              {claim.claim_date && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ClockIcon style={{ width: 10, height: 10 }} />
                  {new Date(claim.claim_date).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
          </div>

          {/* Scores résumés */}
          {scores && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {[
                { label: 'Score IA',     value: scores.ai_score,    color: C.purple },
                { label: 'Communauté',   value: scores.crowd_score, color: C.accent },
                { label: 'Composite',    value: scores.composite,   color: scores.verdict_color || C.green },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <ScoreRing value={s.value} color={s.color} size={64} stroke={6} />
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
              {scores.verdict && (
                <div style={{
                  padding    : '8px 14px',
                  background : (VERDICTS[scores.verdict] || VERDICTS['Insuffisant']).bg,
                  border     : `1px solid ${(VERDICTS[scores.verdict] || VERDICTS['Insuffisant']).border}`,
                  borderRadius: 9,
                  textAlign  : 'center',
                }}>
                  <div style={{
                    fontSize  : 20,
                    marginBottom: 2,
                  }}>
                    {(VERDICTS[scores.verdict] || VERDICTS['Insuffisant']).icon}
                  </div>
                  <div style={{
                    fontSize  : 12,
                    fontWeight: 800,
                    color     : (VERDICTS[scores.verdict] || VERDICTS['Insuffisant']).color,
                  }}>
                    {scores.verdict}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── ONGLETS ── */}
        <div style={{
          display     : 'flex',
          gap         : 4,
          marginBottom: 16,
          background  : C.surface,
          borderRadius: 10,
          padding     : 4,
          border      : `1px solid ${C.border}`,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex        : 1,
              display     : 'flex',
              alignItems  : 'center',
              justifyContent: 'center',
              gap         : 5,
              padding     : '8px 4px',
              borderRadius: 8,
              border      : 'none',
              background  : tab === t.id ? C.bg : 'transparent',
              color       : tab === t.id ? C.text : C.textSub,
              fontSize    : 12,
              fontWeight  : tab === t.id ? 700 : 500,
              cursor      : 'pointer',
              boxShadow   : tab === t.id ? `0 1px 3px rgba(0,0,0,0.08)` : 'none',
              transition  : 'all 0.15s',
            }}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── CONTENU ONGLETS ── */}
        {tab === 'analyse' && <AIAnalysisPanel claimId={claimId} />}
        {tab === 'web'     && <WebResults claimId={claimId} />}
        {tab === 'chat'    && <AIChat claimId={claimId} claimTitle={claim.title} />}

        {/* ── LIEN RETOUR DÉTAIL ── */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to={`/event/${claimId}`} style={{
            display       : 'inline-flex',
            alignItems    : 'center',
            gap           : 6,
            fontSize      : 12,
            color         : C.textSub,
            textDecoration: 'none',
          }}>
            <ArrowLeftIcon style={{ width: 12, height: 12 }} />
            Retour à la page détail de cet événement
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #A8A29E; }
      `}</style>
    </div>
  );
}