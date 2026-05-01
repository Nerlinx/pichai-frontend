// ═══════════════════════════════════════════════════════════════
// EXPAND — EventDetailsPage.jsx (VERSION CORRIGÉE REMOVECHILD)
// Design Grok / X / Perplexity · Mobile-first · Clés stables
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ClockIcon,
  CpuChipIcon,
  GlobeAltIcon,
  PlusIcon,
  ArrowPathIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import { saveAnonymousVote } from '../services/voteService';

// ─── Configuration API ───────────────────────────────────────────
export const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const authHdr = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// ─── PALETTE (exacte Perplexity/Grok light) ───────────────────────
const C = {
  accent: '#0066CC',
  green: '#0F7B4E',
  amber: '#B45309',
  red: '#D32F2F',
  purple: '#6D28D9',
};

// ─── VERDICTS / STATUTS ───────────────────────────────────────────
const VERDICTS = {
  Crédible:  { color: C.green, bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅', label: 'Crédible' },
  Possible:  { color: C.amber, bg: 'bg-amber-50',  border: 'border-amber-200', icon: '⚠️', label: 'Possible' },
  Douteux:   { color: C.red,   bg: 'bg-red-50',    border: 'border-red-200', icon: '❌', label: 'Douteux' },
  Insuffisant:{ color: '#64748B',bg: 'bg-slate-100',border: 'border-slate-200', icon: '❓', label: 'Insuffisant' },
};

const STATUS = {
  pending:            { label: 'En attente', color: C.amber, bg: 'bg-amber-50', border: 'border-amber-200' },
  verified:           { label: 'Vérifié',    color: C.green, bg: 'bg-emerald-50', border: 'border-emerald-200' },
  in_progress:        { label: 'En cours',   color: C.accent, bg: 'bg-blue-50', border: 'border-blue-200' },
  completed:          { label: 'Complété',   color: C.green, bg: 'bg-emerald-50', border: 'border-emerald-200' },
  partially_completed:{ label: 'Partiel',    color: C.purple, bg: 'bg-purple-50', border: 'border-purple-200' },
  failed:             { label: 'Échoué',     color: C.red,    bg: 'bg-red-50', border: 'border-red-200' },
  cancelled:          { label: 'Annulé',     color: '#64748B', bg: 'bg-slate-100', border: 'border-slate-200' },
};

// ─── COORDONNÉES DÉPARTEMENTS HAÏTI ────────────────────────────────
const DEPTS = {
  'Artibonite': [19.46, -72.68], 'Centre': [19.10, -72.00],
  "Grand'Anse": [18.44, -74.12], 'Nippes': [18.40, -73.42],
  'Nord': [19.76, -72.20], 'Nord-Est': [19.55, -71.85],
  'Nord-Ouest': [19.83, -73.38], 'Ouest': [18.54, -72.34],
  'Sud': [18.20, -73.75], 'Sud-Est': [18.20, -72.33],
};

// ─── UTILITAIRES ──────────────────────────────────────────────────
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// ─── SCORE RING (chiffres horizontaux) ───────────────────────────
function ScoreRing({ value, color, size = 'default', label }) {
  const sizeMap = { sm: 52, default: 64, lg: 80 };
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 64;
  const r = (pixelSize - 6) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width={pixelSize} height={pixelSize} viewBox={`0 0 ${pixelSize} ${pixelSize}`} className="transform -rotate-90">
        <circle cx={pixelSize / 2} cy={pixelSize / 2} r={r} fill="none" stroke="#E5E5E7" strokeWidth="6" />
        <circle
          cx={pixelSize / 2} cy={pixelSize / 2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
          className="transition-all duration-700 ease-out"
        />
        <text
          x={pixelSize / 2} y={pixelSize / 2} textAnchor="middle" dominantBaseline="central"
          fill="#0F0F10" fontSize={pixelSize < 60 ? '16' : '20'} fontWeight="600"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${pixelSize / 2}px ${pixelSize / 2}px` }}
        >
          {Math.round(pct)}
        </text>
      </svg>
      {label && <div className="text-xs sm:text-sm text-slate-500 mt-1.5">{label}</div>}
    </div>
  );
}

// ─── BOUTON ACTION ───────────────────────────────────────────────
function ActionButton({ children, onClick, loading, icon, variant = 'secondary', fullWidth = false, disabled = false, className = '' }) {
  const base = `inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${fullWidth ? 'w-full' : ''}`;
  const variants = {
    primary:   'bg-black hover:bg-gray-800 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
    ghost:     'hover:bg-slate-100 text-slate-600',
  };
  const variantClass = variants[variant] || variants.secondary;
  const disabledClass = (loading || disabled) ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${variantClass} ${disabledClass} ${className}`}
    >
      {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ─── CARTE HAÏTI (ÉPURÉE) ────────────────────────────────────────
function HaitiMap({ department }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-sm">Localisation</span>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${department ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
          {department || 'National'}
        </span>
      </div>
      <div className="p-4">
        <svg viewBox="0 0 240 140" width="100%" className="max-h-[160px]">
          <rect width="240" height="140" fill="#D6EAF8" rx="8" />
          <path d="M 20 70 Q 30 45 60 42 Q 90 38 120 40 Q 150 38 175 48 Q 200 55 215 68 Q 220 78 210 88 Q 195 100 170 102 Q 140 108 110 104 Q 80 102 55 95 Q 30 88 20 70 Z" fill="#D5E8D4" stroke="#82B366" strokeWidth="1.5" />
          <path d="M 80 60 Q 110 52 140 58 Q 160 62 155 72 Q 140 80 110 78 Q 85 76 80 60 Z" fill="#B8D9A8" stroke="none" opacity="0.7" />
          <path d="M 55 95 Q 45 105 40 115 Q 55 120 80 115 Q 95 108 110 104 Q 80 102 55 95 Z" fill="#C8E0B0" stroke="#82B366" strokeWidth="1" />
          {Object.entries(DEPTS).map(([dept, [lat, lng]]) => {
            const x = ((lng + 74.5) / 3.2) * 200 + 20;
            const y = ((19.95 - lat) / 2.2) * 110 + 15;
            const active = department && dept.toLowerCase().includes(department.toLowerCase().split(' ')[0]);
            return (
              <g key={dept}>
                {active && <circle cx={x + 1} cy={y + 1} r={9} fill="rgba(0,0,0,0.15)" />}
                <circle cx={x} cy={y} r={active ? 8 : 4} fill={active ? C.red : '#5D8A5D'} stroke={active ? '#FECACA' : '#3D6B3D'} strokeWidth={active ? 2 : 1} />
                <circle cx={x} cy={y} r={active ? 3 : 1.5} fill="white" opacity="0.9" />
                {active && <circle cx={x} cy={y} r={8} fill="none" stroke={C.red} strokeWidth="2" className="animate-ping" style={{ animationDuration: '2s' }} />}
                {active && (
                  <>
                    <rect x={x - 22} y={y - 20} width={44} height={12} fill="white" rx={4} opacity="0.92" stroke={C.red} strokeWidth="0.5" />
                    <text x={x} y={y - 12} textAnchor="middle" fill={C.red} fontSize="5.5" fontWeight="800">{dept}</text>
                  </>
                )}
              </g>
            );
          })}
          <text x="120" y="132" textAnchor="middle" fill="#4A7A4A" fontSize="8" fontWeight="700" letterSpacing="3">HAÏTI</text>
        </svg>
      </div>
    </div>
  );
}

// ─── ONGLET VOTE ──────────────────────────────────────────────────
function VoteTab({ prediction, userVote, claimId, onSuccess }) {
  const [sel, setSel] = useState(userVote?.selected_option || null);
  const [conf, setConf] = useState(userVote?.confidence_level || 0.7);
  const [reason, setReason] = useState(userVote?.reasoning || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!prediction) return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
      🗳️ Aucune prédiction active pour ce claim.
    </div>
  );

  const OPTS = [
    { value: 'oui', label: 'OUI', color: C.green, soft: 'bg-emerald-50', border: 'border-emerald-200' },
    { value: 'non', label: 'NON', color: C.red, soft: 'bg-red-50', border: 'border-red-200' },
    { value: 'incertain', label: 'INCERTAIN', color: C.amber, soft: 'bg-amber-50', border: 'border-amber-200' },
  ];

  const submit = async () => {
    if (!sel) return;
    setLoading(true);
    const token = getToken();
    if (!token) {
      saveAnonymousVote(claimId, prediction.id, sel, conf);
      setMsg('✓ Vote sauvegardé — connectez-vous pour le valider définitivement');
      setLoading(false);
      return;
    }
    try {
      const r = await fetch(`${API_BASE}/api/v1/claims/${claimId}/vote`, {
        method: 'POST', headers: authHdr(),
        body: JSON.stringify({ prediction_id: prediction.id, selected_option: sel, confidence_level: conf, reasoning: reason }),
      });
      const d = await r.json();
      if (r.ok) { setMsg('✓ Vote enregistré'); onSuccess?.(); }
      else setMsg(d.detail || 'Erreur');
    } catch { setMsg('Erreur réseau'); }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="mb-5">
        <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <span className="text-base">🗳️</span> Prédiction — {prediction.total_votes || 0} votes
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">{prediction.question}</div>
      </div>

      <div className="mb-6">
        {OPTS.map(opt => {
          const d = prediction.vote_breakdown?.[opt.value];
          const pct = d?.percent || 0;
          return (
            <div key={opt.value} className="mb-4">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span className="font-medium">{opt.label}</span>
                <span>{pct}% <span className="text-slate-400">({d?.count || 0})</span></span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: opt.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-5">
        {OPTS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSel(opt.value)}
            className={`flex-1 py-2.5 rounded-full text-xs font-semibold border transition-all ${sel === opt.value ? `${opt.soft} ${opt.border} border` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            style={{ color: sel === opt.value ? opt.color : undefined }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Niveau de confiance</span>
          <strong className="text-slate-900">{Math.round(conf * 100)}%</strong>
        </div>
        <input type="range" min="0" max="1" step="0.05" value={conf} onChange={e => setConf(parseFloat(e.target.value))} className="w-full accent-black" />
      </div>

      <textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Justification (optionnel)…"
        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm resize-y min-h-[70px] mb-4 focus:outline-none focus:border-black/20"
      />

      <ActionButton onClick={submit} loading={loading} fullWidth variant="primary" disabled={!sel}>
        {userVote ? 'Mettre à jour mon vote' : 'Soumettre mon vote'}
      </ActionButton>
      {msg && <div className="mt-3 text-xs text-slate-500 text-center">{msg}</div>}
    </div>
  );
}

// ─── ONGLET PREUVES ───────────────────────────────────────────────
function EvidenceTab({ evidence, claimId, onNew }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '', source_type: 'article' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const ICONS = { article: '📰', video: '🎥', document: '📄', official_statement: '🏛️', social_media: '📱', report: '📊', data_source: '📈' };
  const credColor = (s) => !s ? 'text-slate-400' : s >= 0.7 ? 'text-emerald-600' : s >= 0.4 ? 'text-amber-600' : 'text-red-600';

  const submit = async () => {
    if (!form.title) return;
    setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/api/v1/claims/${claimId}/evidence`, { method: 'POST', headers: authHdr(), body: JSON.stringify(form) });
      const d = await r.json();
      if (r.ok) { setMsg('✓ Preuve soumise — en attente de modération'); setForm({ title: '', url: '', description: '', source_type: 'article' }); setOpen(false); onNew?.(); }
      else setMsg(d.detail || 'Erreur');
    } catch { setMsg('Erreur réseau'); }
    setBusy(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span className="text-base">🔍</span> Preuves ({evidence.length})
        </div>
        <ActionButton onClick={() => setOpen(!open)} icon={<PlusIcon className="w-4 h-4" />} variant="secondary">Ajouter</ActionButton>
      </div>

      <div className="p-5">
        {open && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <input placeholder="Titre *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-white border border-slate-200 rounded-full px-4 py-2 text-sm mb-3 focus:outline-none focus:border-black/20" />
            <input placeholder="URL (optionnel)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="w-full bg-white border border-slate-200 rounded-full px-4 py-2 text-sm mb-3 focus:outline-none focus:border-black/20" />
            <select value={form.source_type} onChange={e => setForm({ ...form, source_type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-full px-4 py-2 text-sm mb-3 focus:outline-none focus:border-black/20">
              {Object.entries(ICONS).map(([v, ic]) => <option key={v} value={v}>{ic} {v.replace('_', ' ')}</option>)}
            </select>
            <textarea placeholder="Description…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm resize-y min-h-[60px] mb-3 focus:outline-none focus:border-black/20" />
            <div className="flex gap-2">
              <ActionButton onClick={submit} loading={busy} variant="primary" fullWidth>Soumettre</ActionButton>
              <ActionButton onClick={() => setOpen(false)} variant="secondary">Annuler</ActionButton>
            </div>
            {msg && <div className="mt-2 text-xs text-slate-500">{msg}</div>}
          </div>
        )}

        {evidence.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">Aucune preuve soumise. Soyez le premier !</div>
        ) : (
          <div className="space-y-3">
            {evidence.map((e, idx) => {
              const key = e.id ? `evidence-${e.id}` : `evidence-${idx}-${Date.now()}`;
              return (
                <div key={key} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-slate-900">{ICONS[e.source_type] || '📄'} {e.title}</span>
                    {e.credibility_score != null && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${credColor(e.credibility_score)} bg-opacity-10`} style={{ backgroundColor: credColor(e.credibility_score) + '20' }}>
                        {Math.round(e.credibility_score * 100)}% fiable
                      </span>
                    )}
                  </div>
                  {e.description && <div className="text-xs text-slate-600 mb-2 line-clamp-3">{e.description}</div>}
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>par {e.submitted_by}</span>
                    {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Voir la source ↗</a>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ONGLET CHAT IA (CLÉS STABLES CORRIGÉES) ──────────────────────
function ChatTab({ claimId }) {
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const [msgs, setMsgs] = useState([
    { id: generateId(), role: 'assistant', content: 'Bonjour ! Je suis PICHAI, votre analyste IA. Posez-moi vos questions sur cet événement.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const MAX_CHARS = 4000;
  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  }, [input]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading || isOverLimit) return;
    setInput('');
    const userMsg = { id: generateId(), role: 'user', content: msg };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/v1/ai/chat`, { method: 'POST', headers: authHdr(), body: JSON.stringify({ message: msg, claim_id: claimId }) });
      const d = await r.json();
      const reply = d.response || d.detail || 'Réponse indisponible.';
      const assistantMsg = { id: generateId(), role: 'assistant', content: reply, provider: d.provider };
      setMsgs(prev => [...prev, assistantMsg]);
    } catch {
      setMsgs(prev => [...prev, { id: generateId(), role: 'assistant', content: '❌ Erreur de connexion.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[480px] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm">Assistant PICHAI</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${m.role === 'user' ? 'bg-slate-100' : 'bg-white border border-slate-100'}`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.provider && <div className="text-[10px] text-slate-400 mt-1">via {m.provider}</div>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-end gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-black/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="flex-1 bg-transparent outline-none text-sm resize-none max-h-[160px] py-1.5"
          />
          <div className="flex items-center gap-1">
            {charCount > 0 && (
              <span className={`text-[10px] ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            )}
            {input.trim() && !loading ? (
              <button
                onClick={send}
                disabled={isOverLimit}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOverLimit ? 'bg-slate-200 text-slate-400' : 'bg-black text-white'}`}
              >
                <ArrowUpIcon className="w-4 h-4" />
              </button>
            ) : loading ? (
              <button className="w-8 h-8 bg-slate-200 text-slate-400 rounded-lg flex items-center justify-center">
                <StopIcon className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ONGLET ACTUALITÉS (CLÉS STABLES) ─────────────────────────────
function WebTab({ claimId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(null);

  const performSearch = useCallback(async (query = '') => {
    setLoading(true);
    setDone(false);
    try {
      const r = await fetch(`${API_BASE}/api/v1/ai/claims/${claimId}/web-search`, {
        method: 'POST',
        headers: authHdr(),
        body: JSON.stringify({ query: query || undefined, max_results: 12, search_type: 'news', mode: 'serper' }),
      });
      const d = await r.json();
      const withKeys = (d.articles || []).map((a, i) => ({
        ...a,
        uniqueKey: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
      }));
      setArticles(withKeys);
      setDone(true);
    } catch {
      setArticles([
        { title: 'Le MSPP annonce une nouvelle campagne', source: 'Le Nouvelliste', pub_date: new Date().toISOString(), link: '#', image_url: 'https://picsum.photos/id/1015/400/250', snippet: '...', uniqueKey: `fb1-${Date.now()}` },
        { title: 'Haïti : avancées contre le choléra', source: 'AlterPresse', pub_date: new Date().toISOString(), link: '#', image_url: 'https://picsum.photos/id/1043/400/250', snippet: '...', uniqueKey: `fb2-${Date.now()}` },
      ]);
      setDone(true);
    } finally {
      setLoading(false);
    }
  }, [claimId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5 text-slate-500" />
            <span className="font-semibold text-base">Actualités</span>
            {done && articles.length > 0 && <span className="text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-500">{articles.length}</span>}
          </div>
          <form onSubmit={handleSubmit} className="w-full sm:w-auto sm:flex-1 sm:max-w-sm">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-black"
              />
            </div>
          </form>
          <ActionButton onClick={() => performSearch(searchQuery)} loading={loading} icon={<ArrowPathIcon className="w-4" />} variant="ghost">
            {loading ? '' : 'Actualiser'}
          </ActionButton>
        </div>
      </div>

      <div className="p-5">
        {!done && !loading && (
          <div className="py-12 text-center text-slate-400 text-sm">Lancez une recherche</div>
        )}
        {loading && (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-black rounded-full animate-spin" />
          </div>
        )}
        {done && articles.length === 0 && <div className="py-12 text-center text-slate-400 text-sm">Aucun article</div>}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((a, i) => {
              const isOpen = expanded === i;
              return (
                <a
                  key={a.uniqueKey}
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {a.image_url && (
                    <div className="aspect-[16/9] bg-slate-100">
                      <img src={a.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                      <span className="font-medium text-black">{a.source}</span>
                      <span>·</span>
                      <span>{formatDate(a.pub_date)}</span>
                    </div>
                    <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:underline">{a.title}</h3>
                    {a.snippet && <p className={`text-xs text-slate-600 mt-1 ${isOpen ? '' : 'line-clamp-2'}`}>{a.snippet}</p>}
                    <button
                      onClick={(e) => { e.preventDefault(); setExpanded(isOpen ? null : i); }}
                      className="text-[10px] text-slate-400 mt-2 hover:text-black"
                    >
                      {isOpen ? '▲ Réduire' : '▼ Voir plus'}
                    </button>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPALE ───────────────────────────────────────────────
export default function EventDetailsPage() {
  const { id: eventId } = useParams();
  const claimId = parseInt(eventId);
  const [data, setData] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('vote');

  const load = async () => {
    setLoading(true);
    try {
      const [dRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/claims/${claimId}/detail`, { headers: authHdr() }),
        fetch(`${API_BASE}/api/v1/claims/${claimId}/scores`),
      ]);
      if (!dRes.ok) throw new Error('Événement introuvable');
      setData(await dRes.json());
      setScores(await sRes.json());
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [claimId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Chargement…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const { claim, evidence, prediction, user_vote } = data;
  const st = STATUS[claim.status] || STATUS.pending;

  const TABS = [
    { id: 'vote', label: 'Vote', icon: '🗳️' },
    { id: 'preuves', label: 'Preuves', icon: '🔍' },
    { id: 'chat', label: 'Chat IA', icon: <SparklesIcon className="w-4 h-4" /> },
    { id: 'web', label: 'Actualités', icon: <GlobeAltIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-10">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs sm:text-sm">
          <Link to="/" className="flex items-center gap-1.5 text-slate-500 hover:text-black transition-colors">
            <ArrowLeftIcon className="w-4" /> Accueil
          </Link>
          <span className="text-slate-300">›</span>
          <span className="font-medium text-slate-900">Événement #{claimId}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* En-tête événement */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${st.bg} ${st.border}`} style={{ color: st.color }}>{st.label}</span>
            {claim.category && <span className="px-3 py-0.5 text-xs font-medium bg-slate-100 border border-slate-200 rounded-full text-slate-700">{claim.category}</span>}
            {claim.is_controversial && <span className="px-3 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">⚡ Controversé</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight text-slate-900 mb-3">{claim.title}</h1>
          <div className="text-sm text-slate-600 mb-3">🏛️ {claim.claimant}</div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{claim.short_description || claim.description?.substring(0, 200)}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs sm:text-sm text-slate-500">
            {claim.claim_date && <span><ClockIcon className="w-3.5 inline mr-1" />{formatDate(claim.claim_date)}</span>}
            {claim.department && <span><MapPinIcon className="w-3.5 inline mr-1" />{claim.department}</span>}
          </div>

          {scores && (
            <div className="mt-6 flex flex-wrap items-center gap-5 sm:gap-8">
              <ScoreRing value={scores.ai_score} color={C.purple} size="sm" label="IA" />
              <ScoreRing value={scores.crowd_score} color={C.accent} size="sm" label="Communauté" />
              <ScoreRing value={scores.verif_score} color={C.green} size="sm" label="Vérification" />
              <div className={`px-5 py-2 rounded-full ${VERDICTS[scores.verdict]?.bg || 'bg-slate-100'} border ${VERDICTS[scores.verdict]?.border || 'border-slate-200'}`}>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: VERDICTS[scores.verdict]?.color || C.green }}>{Math.round(scores.composite)}</div>
                <div className="text-xs text-slate-500">{scores.verdict}</div>
              </div>
            </div>
          )}
        </div>

        {/* Layout 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Colonne principale (onglets) */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 p-1 bg-slate-50 rounded-full mb-5">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow-sm text-black' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {typeof t.icon === 'string' ? <span>{t.icon}</span> : t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
            {tab === 'vote' && <VoteTab prediction={prediction} userVote={user_vote} claimId={claimId} onSuccess={load} />}
            {tab === 'preuves' && <EvidenceTab evidence={evidence} claimId={claimId} onNew={load} />}
            {tab === 'chat' && <ChatTab claimId={claimId} />}
            {tab === 'web' && <WebTab claimId={claimId} />}
          </div>

          {/* Sidebar droite */}
          <div className="space-y-4">
            <HaitiMap department={claim.department} />
            {(claim.target_value || claim.current_value) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-base">📊</span> Données chiffrées
                </div>
                {claim.target_value && (
                  <div className="mb-3">
                    <div className="text-xs text-slate-500">Objectif</div>
                    <div className="text-xl font-bold text-slate-900">{claim.target_value.toLocaleString()} <span className="text-xs text-slate-500">{claim.unit}</span></div>
                  </div>
                )}
                {claim.current_value && (
                  <div>
                    <div className="text-xs text-slate-500">Actuel</div>
                    <div className="text-xl font-bold text-emerald-600">{claim.current_value.toLocaleString()} <span className="text-xs text-slate-500">{claim.unit}</span></div>
                  </div>
                )}
              </div>
            )}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-base">📈</span> Statistiques
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Preuves', value: data.total_evidence || 0, color: C.purple, icon: <DocumentTextIcon className="w-4 h-4" /> },
                  { label: 'Votes', value: prediction?.total_votes || 0, color: C.accent, icon: <UsersIcon className="w-4 h-4" /> }
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                      {s.icon} {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {claim.source_url && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="text-base">🔗</span> Source officielle
                </div>
                <a href={claim.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-black hover:underline break-all">{claim.source_url.substring(0, 50)}… ↗</a>
              </div>
            )}
            <Link to={`/ai-analysis/${claimId}`} className="block">
              <ActionButton fullWidth variant="primary" icon={<CpuChipIcon className="w-4" />}>Analyse IA complète</ActionButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}