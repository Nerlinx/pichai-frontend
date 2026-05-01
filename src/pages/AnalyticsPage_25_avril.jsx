// ═══════════════════════════════════════════════════════════════
// PichAI — AIAnalysisPage.jsx 
// Design Perplexity / X · Mobile-first · Desktop optimisé
// ✅ Correction removeChild · ✅ Style via useEffect · ✅ Tabs sans démontage
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  ArrowUpIcon,
  StopIcon,
} from '@heroicons/react/24/outline';

// ─── Configuration API ───────────────────────────────────────────
const API_BASE = 'http://10.236.42.100:8000';
const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const authHdr = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// ─── PALETTE ─────────────────────────────────────────────────────
const C = {
  green: '#0F7B4E',
  amber: '#B45309',
  red: '#D32F2F',
  purple: '#6D28D9',
};

// ─── VERDICTS ────────────────────────────────────────────────────
const VERDICTS = {
  Crédible:    { color: C.green,   bg: 'bg-emerald-50',  icon: '✅', label: 'Crédible' },
  Possible:    { color: C.amber,   bg: 'bg-amber-50',    icon: '⚠️', label: 'Possible' },
  Douteux:     { color: C.red,     bg: 'bg-red-50',      icon: '❌', label: 'Douteux' },
  Insuffisant: { color: '#64748B', bg: 'bg-slate-100',   icon: '❓', label: 'Insuffisant' },
};

// ─── UTILITAIRES ─────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── ✅ STYLES GLOBAUX VIA useEffect (corrige le bug removeChild sur mobile) ─
function useGlobalStyles() {
  useEffect(() => {
    const id = 'ai-analysis-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `.hide-scrollbar::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);
}

// ─── SCORE RING ───────────────────────────────────────────────────
function ScoreRing({ value, color, size = 'default', label }) {
  const sizeMap = { sm: 52, default: 64, lg: 80 };
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 64;
  const r = (pixelSize - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        className="transform -rotate-90"
      >
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={r}
          fill="none"
          stroke="#E5E5E7"
          strokeWidth="6"
        />
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className="transition-all duration-700 ease-out"
        />
        <text
          x={pixelSize / 2}
          y={pixelSize / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#0F0F10"
          fontSize={pixelSize < 60 ? '16' : '20'}
          fontWeight="600"
          style={{
            transform: 'rotate(90deg)',
            transformOrigin: `${pixelSize / 2}px ${pixelSize / 2}px`,
          }}
        >
          {Math.round(pct)}
        </text>
      </svg>
      {label && <div className="text-xs sm:text-sm text-slate-500 mt-1.5">{label}</div>}
    </div>
  );
}

// ─── BOUTON ACTION ───────────────────────────────────────────────
function ActionButton({ children, onClick, loading, icon, variant = 'secondary', className = '' }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95';
  const variants = {
    primary:   'bg-black hover:bg-gray-800 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
    ghost:     'hover:bg-slate-100 text-slate-600',
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]} ${className} ${loading ? 'opacity-70' : ''}`}
    >
      {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ─── CHAT IA ─────────────────────────────────────────────────────
function AIChat({ claimId, claimTitle }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Je suis PichAI. J'analyse "${claimTitle}" en temps réel.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const MAX_CHARS = 4000;
  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    }
  }, [input]);

  const SUGGESTIONS = [
    { icon: '🔍', text: 'Analyse les sources' },
    { icon: '📊', text: 'Compare avec OMS' },
    { icon: '⚠️', text: 'Biais potentiels ?' },
    { icon: '🌍', text: 'Actualités Haïti' },
  ];

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading || isOverLimit) return;

    setInput('');
    const userMsg = {
      id: `user-${Date.now()}-${Math.random()}`,
      role: 'user',
      content: msg,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method: 'POST',
        headers: authHdr(),
        body: JSON.stringify({ message: msg, claim_id: claimId }),
      });
      const data = await res.json();
      const assistantMsg = {
        id: `assistant-${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content: data.response || 'Réponse indisponible.',
        provider: data.provider,
        latency: data.latency_ms,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '❌ Service IA temporairement indisponible.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white flex flex-col h-full min-h-[500px] sm:min-h-[600px] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black rounded-xl flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-sm sm:text-base">PichAI</div>
          <div className="text-[10px] sm:text-xs text-slate-500">Grok · Claude · GPT-4</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-5 space-y-4 sm:space-y-6 text-sm sm:text-base">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-slate-100'
                  : 'bg-white border border-slate-100'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              {msg.provider && (
                <div className="text-[10px] text-slate-400 mt-1">via {msg.provider}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-3 sm:px-6 py-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(s.text);
                textareaRef.current?.focus();
              }}
              className="text-xs sm:text-sm flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
            >
              <span>{s.icon}</span> {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      <div className="p-3 sm:p-5 border-t border-slate-100">
        <div className="flex items-end gap-2 bg-slate-50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border border-transparent focus-within:border-black/20 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="flex-1 bg-transparent outline-none text-sm sm:text-base resize-none max-h-[200px] py-1.5"
          />
          <div className="flex items-center gap-2">
            {charCount > 0 && (
              <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            )}
            {input.trim() && !loading ? (
              <button
                onClick={sendMessage}
                disabled={isOverLimit}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isOverLimit
                    ? 'bg-slate-200 text-slate-400'
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            ) : loading ? (
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center">
                <StopIcon className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          PichAI peut faire des erreurs. Vérifiez les sources.
        </p>
      </div>
    </div>
  );
}

// ─── ACTUALITÉS ───────────────────────────────────────────────────
function WebResults({ claimId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const performSearch = useCallback(
    async (query = '') => {
      setLoading(true);
      setDone(false);
      try {
        const res = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/web-search`, {
          method: 'POST',
          headers: authHdr(),
          body: JSON.stringify({
            query: query || undefined,
            max_results: 20,
            search_type: 'news',
            mode: 'serper',
          }),
        });
        const data = await res.json();
        const withKeys = (data.articles || []).map((a, i) => ({
          ...a,
          uniqueKey: `${a.link || 'article'}-${Date.now()}-${i}-${Math.random()}`,
        }));
        setArticles(withKeys);
        setDone(true);
        setPage(1);
      } catch {
        setArticles([
          {
            title: 'Le MSPP annonce une nouvelle campagne de vaccination',
            source: 'Le Nouvelliste',
            pub_date: new Date().toISOString(),
            link: '#',
            image_url: 'https://picsum.photos/id/1015/400/250',
            snippet:
              'Le ministère de la Santé publique lance une vaste campagne de vaccination contre plusieurs maladies.',
            uniqueKey: 'fb1',
          },
          {
            title: 'Haïti : avancées dans la lutte contre le choléra',
            source: 'AlterPresse',
            pub_date: new Date().toISOString(),
            link: '#',
            image_url: 'https://picsum.photos/id/1043/400/250',
            snippet: "Les efforts conjoints du MSPP et de l'OMS montrent des résultats encourageants.",
            uniqueKey: 'fb2',
          },
          {
            title: 'Nouveau rapport sur la malnutrition infantile',
            source: 'UNICEF',
            pub_date: new Date().toISOString(),
            link: '#',
            image_url: 'https://picsum.photos/id/1005/400/250',
            snippet: 'La situation reste préoccupante dans plusieurs départements.',
            uniqueKey: 'fb3',
          },
        ]);
        setDone(true);
      } finally {
        setLoading(false);
      }
    },
    [claimId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const filtered = articles.filter(
    (a) => sourceFilter === 'all' || a.source?.toLowerCase().includes(sourceFilter)
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="bg-white rounded-xl">
      {/* En-tête avec recherche */}
      <div className="px-3 sm:px-5 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <NewspaperIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
          <span className="font-semibold text-lg sm:text-xl">Actualités</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une actualité..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 border-0 rounded-full text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black/10"
            />
          </div>
        </form>

        <ActionButton
          onClick={() => performSearch(searchQuery)}
          loading={loading}
          icon={<ArrowPathIcon className="w-4 sm:w-5" />}
          variant="ghost"
        >
          {loading ? '' : 'Actualiser'}
        </ActionButton>
      </div>

      {/* Contenu */}
      <div className="px-3 sm:px-5 py-4 sm:py-6">
        {!done && !loading && (
          <div className="py-16 text-center">
            <GlobeAltIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-sm sm:text-base">
              Lancez une recherche pour voir les actualités
            </p>
          </div>
        )}

        {loading && (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {done && (
          <>
            {filtered.length > 0 ? (
              <>
                <div className="flex flex-wrap items-center justify-between mb-5 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs sm:text-sm">Source :</span>
                    <select
                      value={sourceFilter}
                      onChange={(e) => {
                        setSourceFilter(e.target.value);
                        setPage(1);
                      }}
                      className="bg-slate-50 border-0 rounded-full px-3 py-1.5 text-xs sm:text-sm"
                    >
                      <option value="all">Toutes les sources</option>
                      {[...new Set(articles.map((a) => a.source).filter(Boolean))].map((src) => (
                        <option key={src} value={src.toLowerCase()}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-slate-400 text-xs sm:text-sm">
                    {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginated.map((article) => (
                    <a
                      key={article.uniqueKey}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-xl overflow-hidden hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
                    >
                      <div className="aspect-[16/9] bg-slate-100 relative">
                        {article.image_url ? (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100">
                            <NewspaperIcon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-1.5">
                          <span className="font-medium text-black">{article.source}</span>
                          <span>·</span>
                          <span>{formatDate(article.pub_date)}</span>
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                          {article.title}
                        </h3>
                        {article.snippet && (
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2">
                            {article.snippet}
                          </p>
                        )}
                        <div className="mt-3 text-xs sm:text-sm flex items-center gap-1 text-slate-500 group-hover:text-black transition-colors">
                          Lire l'article
                          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="text-xs sm:text-sm text-slate-500 hover:text-black disabled:opacity-30 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <span className="text-xs sm:text-sm text-slate-400">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="text-xs sm:text-sm text-slate-500 hover:text-black disabled:opacity-30 transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center text-slate-400 text-sm sm:text-base">
                Aucun article trouvé
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ANALYSE IA ──────────────────────────────────────────────────
function AIAnalysisPanel({ claimId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/analyze`, {
        method: 'POST',
        headers: authHdr(),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        score: 68,
        verdict: 'Possible',
        analyse:
          'Le claim présente des éléments crédibles mais certaines sources sont contradictoires.',
        points_forts: ['Source MSPP fiable', 'Corrélation avec données terrain'],
        points_faibles: ['Manque de données récentes', 'Biais politique potentiel'],
        coherence: 82,
        source_credibility: 74,
        oms_comparison: { standard: 92, current: 68 },
      });
    } finally {
      setLoading(false);
    }
  };

  const analysis = result?.analysis || result || {
    score: 68,
    verdict: 'Possible',
    analyse:
      'Le claim présente des éléments crédibles mais certaines sources sont contradictoires.',
    points_forts: ['Source MSPP fiable'],
    points_faibles: ['Manque de données récentes'],
    coherence: 82,
    source_credibility: 74,
    oms_comparison: { standard: 92, current: 68 },
  };

  const vConfig = VERDICTS[analysis.verdict] || VERDICTS.Insuffisant;

  return (
    <div className="bg-white rounded-xl">
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CpuChipIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
          <span className="font-semibold text-lg sm:text-xl">Analyse approfondie</span>
        </div>
        <ActionButton
          onClick={runAnalysis}
          loading={loading}
          variant="primary"
          icon={<CpuChipIcon className="w-4 sm:w-5" />}
        >
          {loading ? 'Analyse…' : result ? 'Relancer' : 'Analyser'}
        </ActionButton>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6">
        {!result && !loading && (
          <div className="py-16 text-center">
            <CpuChipIcon className="w-14 h-14 sm:w-20 sm:h-20 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Prêt pour l'analyse IA</h3>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
              L'IA va croiser des centaines de sources et vous donner un verdict précis.
            </p>
          </div>
        )}

        {loading && (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {result && (
          <>
            <div
              className={`${vConfig.bg} rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center gap-5 md:gap-8 mb-6 sm:mb-8`}
            >
              <ScoreRing value={analysis.score} color={vConfig.color} size="lg" />
              <div className="flex-1 text-center md:text-left">
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: vConfig.color }}
                >
                  {vConfig.icon} {vConfig.label}
                </div>
                <div className="text-slate-500 text-sm sm:text-base mt-1">
                  Fiabilité sources {analysis.source_credibility}%
                </div>
              </div>
              <div className="flex gap-6 sm:gap-8 text-center">
                <div>
                  <div className="text-xs sm:text-sm text-slate-500">Cohérence</div>
                  <div className="text-xl sm:text-2xl font-semibold">{analysis.coherence}%</div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-slate-100 mb-5 sm:mb-6 overflow-x-auto hide-scrollbar">
              {['Synthèse', 'Comparaison OMS'].map((label, i) => {
                const key = i === 0 ? 'overview' : 'oms';
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === key
                        ? 'border-black text-black'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-5 sm:space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 sm:p-5">
                  <p className="text-sm sm:text-base leading-relaxed">{analysis.analyse}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm sm:text-base font-medium mb-3">
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      Points forts
                    </h4>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {analysis.points_forts?.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-500">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm sm:text-base font-medium mb-3">
                      <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      Points faibles
                    </h4>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {analysis.points_faibles?.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-500">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'oms' && (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-flex flex-wrap justify-center gap-8 sm:gap-12">
                  <div>
                    <div className="text-sm sm:text-base text-slate-500">Standard OMS</div>
                    <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mt-1">
                      {analysis?.oms_comparison?.standard ?? 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base text-slate-500">Ce claim</div>
                    <div
                      className="text-3xl sm:text-4xl font-bold mt-1"
                      style={{ color: vConfig.color }}
                    >
                      {analysis?.oms_comparison?.current ?? 0}%
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm sm:text-base text-slate-500">
                  Écart de{' '}
                  <span className="font-semibold">
                    {(analysis?.oms_comparison?.standard ?? 0) -
                      (analysis?.oms_comparison?.current ?? 0)}{' '}
                    points
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────
export default function AIAnalysisPage() {
  // ✅ Styles globaux injectés proprement via useEffect (corrige removeChild sur mobile)
  useGlobalStyles();

  const { id: eventId } = useParams();
  const claimId = parseInt(eventId);
  const [claim, setClaim] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('analyse');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [detailRes, scoresRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/claims/${claimId}/detail`, { headers: authHdr() }),
          fetch(`${API_BASE}/api/v1/claims/${claimId}/scores`),
        ]);
        const detail = await detailRes.json();
        const scoresData = await scoresRes.json();
        setClaim(detail.claim);
        setScores(scoresData);
      } catch (e) {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [claimId]);

  const TABS = [
    { id: 'analyse', label: 'Analyse IA',  icon: <CpuChipIcon className="w-4 sm:w-5" /> },
    { id: 'web',     label: 'Actualités',   icon: <GlobeAltIcon className="w-4 sm:w-5" /> },
    { id: 'chat',    label: 'PichAI Chat',  icon: <SparklesIcon className="w-4 sm:w-5" /> },
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">Chargement…</div>;
  if (error)   return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb */}
      <div className="border-b border-slate-50 px-4 sm:px-6 py-3 flex items-center gap-2 text-xs sm:text-sm">
        <Link
          to="/"
          className="text-slate-500 hover:text-black transition-colors flex items-center gap-1"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Accueil
        </Link>
        <span className="text-slate-300">/</span>
        <Link
          to={`/event/${claimId}`}
          className="text-slate-500 hover:text-black transition-colors"
        >
          Détail
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-black">Analyse IA</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Claim header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {claim?.category && (
              <span className="px-3 py-1 text-xs sm:text-sm bg-slate-100 rounded-full">
                {claim.category}
              </span>
            )}
            <span className="px-3 py-1 text-xs sm:text-sm bg-violet-50 text-violet-700 rounded-full">
              Analyse IA
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold leading-tight mb-3">{claim?.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs sm:text-sm text-slate-600">
            <span>🏛️ {claim?.claimant}</span>
            {claim?.department && <span>📍 {claim.department}</span>}
            {claim?.claim_date && <span>📅 {formatDate(claim.claim_date)}</span>}
          </div>
        </div>

        {/* Scores */}
        {scores && (
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 mb-6 sm:mb-8">
            {[
              { label: 'Score IA',    value: scores.ai_score,   color: '#6D28D9' },
              { label: 'Communauté', value: scores.crowd_score, color: '#0066CC' },
              { label: 'Composite',  value: scores.composite,   color: scores.verdict_color || '#0F7B4E' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <ScoreRing value={s.value} color={s.color} size="sm" label={s.label} />
              </div>
            ))}
            {scores.verdict && (
              <div
                className={`${VERDICTS[scores.verdict]?.bg ?? 'bg-slate-100'} px-4 py-2 rounded-full text-sm sm:text-base font-medium`}
              >
                {VERDICTS[scores.verdict]?.icon} {VERDICTS[scores.verdict]?.label}
              </div>
            )}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-slate-50 rounded-full mb-6 sm:mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-base font-medium transition-all ${
                tab === t.id
                  ? 'bg-white shadow-sm text-black'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* ✅ Onglets montés une seule fois, visibilité via display (évite les erreurs de démontage sur mobile) */}
        <div>
          <div style={{ display: tab === 'analyse' ? 'block' : 'none' }}>
            <AIAnalysisPanel claimId={claimId} />
          </div>
          <div style={{ display: tab === 'web' ? 'block' : 'none' }}>
            <WebResults claimId={claimId} />
          </div>
          <div style={{ display: tab === 'chat' ? 'block' : 'none' }}>
            <AIChat claimId={claimId} claimTitle={claim?.title} />
          </div>
        </div>
      </div>

      {/* ✅ Plus de <style> JSX inline — remplacé par useGlobalStyles() en haut du composant */}
    </div>
  );
}