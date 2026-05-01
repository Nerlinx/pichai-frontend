// ═══════════════════════════════════════════════════════════════
// PichAI – ChatPage.jsx
// Rendu structuré, animation d’attente épurée, style premium.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  StopIcon,
} from '@heroicons/react/24/outline';

// ─── Configuration API ───────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const authHdr = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

const GUEST_LIMIT = 5;
const FREE_USER_DAILY_LIMIT = 10;
const MAX_CHARS = 4000;

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const QUICK_SUGGESTIONS = [
  { icon: '🔍', text: 'Analyse les sources' },
  { icon: '📊', text: 'Compare avec les données' },
  { icon: '⚠️', text: 'Points faibles ?' },
  { icon: '💡', text: 'Résume le verdict' },
];

const HamburgerIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="20" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="6" width="17" height="2" rx="1" fill="currentColor" />
    <rect x="6" y="12" width="14" height="2" rx="1" fill="currentColor" />
  </svg>
);

// ─── Rendu structuré avec formatage léger (gras, italique, sections) ──
const formatRichContent = (content) => {
  if (!content) return null;

  // Découpe en sections (séparées par au moins un saut de ligne double)
  const sections = content.split(/\n\s*\n/);
  if (sections.length <= 1) {
    // Une seule section : on formate simplement le texte
    return <div className="ai-section">{formatInlineText(content)}</div>;
  }

  return sections.map((section, idx) => (
    <div key={idx} className="ai-section" style={{ marginBottom: idx < sections.length - 1 ? '1.25rem' : 0 }}>
      {formatInlineText(section.trim())}
    </div>
  ));
};

// Conversion du gras et de l’italique marqués par *...* et **...**
const formatInlineText = (text) => {
  // On découpe selon les motifs markdown en utilisant des segments.
  // Approche simple : on remplace d’abord les ** par des balises temporaires
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Ajouter le texte avant le match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    // Gras
    if (match[2]) {
      parts.push({ type: 'strong', value: match[2] });
    }
    // Italique
    else if (match[3]) {
      parts.push({ type: 'em', value: match[3] });
    }
    lastIndex = regex.lastIndex;
  }
  // Reste du texte
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <span>{text}</span>;
  }

  // Conversion des retours à la ligne simples en <br/>
  return (
    <span className="ai-paragraph">
      {parts.map((part, i) => {
        // On gère les sauts de ligne à l'intérieur du texte
        const lines = part.value.split('\n');
        return (
          <span key={i}>
            {lines.map((line, j) => (
              <span key={j}>
                {part.type === 'strong' ? <strong>{line}</strong> :
                 part.type === 'em' ? <em>{line}</em> :
                 line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
};

// ─── ChatPage ────────────────────────────────────────────────────
export default function ChatPage() {
  const { t } = useTranslation();
  const { claimId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const claimTitle = location.state?.claimTitle || t('chat.default_title');
  const isAuthenticated = !!getToken();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isNewConv, setIsNewConv] = useState(false);
  const [guestMsgCount, setGuestMsgCount] = useState(0);
  const [userDailyUsed, setUserDailyUsed] = useState(0);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('pichai-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pichai-theme', theme);
  }, [theme]);

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([]);
      return;
    }
    const mock = [
      { id: 'conv-1', title: 'Analyse inflation Haïti', claim_id: claimId, updated_at: new Date().toISOString() },
      { id: 'conv-2', title: 'Vaccination choléra', claim_id: claimId, updated_at: new Date(Date.now() - 86400000).toISOString() },
    ];
    setConversations(mock.filter(c => c.claim_id === claimId || !claimId));
    setUserDailyUsed(0);
  }, [claimId, isAuthenticated]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const loadMessages = async (convId) => {
    setActiveConvId(convId);
    setMessages([{
      id: 'm1',
      role: 'assistant',
      content: `Bonjour, je suis PichAI. Nous parlons bien de : **${claimTitle}**. Comment puis-je vous aider ?`
    }]);
    setIsNewConv(false);
    if (!isAuthenticated) setGuestMsgCount(0);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const createNewConversation = () => {
    const newConv = {
      id: genId(),
      title: t('chat.new_conversation'),
      claim_id: claimId,
      updated_at: new Date().toISOString(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Je suis prêt à discuter de **${claimTitle}**. Posez-moi une question.`
    }]);
    setIsNewConv(true);
    setGuestMsgCount(0);
    setUserDailyUsed(0);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const deleteConversation = (convId) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConvId === convId) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading || !activeConvId || msg.length > MAX_CHARS) return;

    if (!isAuthenticated && guestMsgCount >= GUEST_LIMIT) {
      setMessages(prev => [...prev, {
        id: genId(), role: 'system', content: t('chat.guest_limit_reached'), action: 'login'
      }]);
      setInput(''); return;
    }
    if (isAuthenticated && userDailyUsed >= FREE_USER_DAILY_LIMIT) {
      setMessages(prev => [...prev, {
        id: genId(), role: 'system', content: t('chat.daily_limit_reached'), action: 'upgrade'
      }]);
      setInput(''); return;
    }

    setInput('');
    const userMsg = { id: genId(), role: 'user', content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    if (isNewConv) {
      const words = msg.split(/\s+/);
      const title = words.slice(0, 6).join(' ') + (words.length > 6 ? '…' : '');
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, title } : c));
      setIsNewConv(false);
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method: 'POST',
        headers: authHdr(),
        body: JSON.stringify({ message: msg, claim_id: claimId }),
      });
      const data = await res.json();
      const assistantMsg = {
        id: genId(),
        role: 'assistant',
        content: data.response || t('chat.error_response'),
        provider: data.provider,
      };
      setMessages(prev => [...prev, assistantMsg]);

      const newGuestCount = guestMsgCount + (isAuthenticated ? 0 : 1);
      const newDailyUsed = userDailyUsed + (isAuthenticated ? 1 : 0);
      if (!isAuthenticated) setGuestMsgCount(newGuestCount);
      else setUserDailyUsed(newDailyUsed);

      if (!isAuthenticated && newGuestCount >= GUEST_LIMIT) {
        setMessages(prev => [...prev, { id: genId(), role: 'system', content: t('chat.last_free_message'), action: 'login' }]);
      }
      if (isAuthenticated && newDailyUsed >= FREE_USER_DAILY_LIMIT) {
        setMessages(prev => [...prev, { id: genId(), role: 'system', content: t('chat.quota_reached'), action: 'upgrade' }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: t('chat.service_unavailable') }]);
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

  const copyMessage = async (text, msgId) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    }
  }, [input]);

  const remainingMessages = isAuthenticated ? FREE_USER_DAILY_LIMIT - userDailyUsed : GUEST_LIMIT - guestMsgCount;

  // ─── Styles globaux (police, animation dots, sections) ────────
  useEffect(() => {
    const id = 'chat-page-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .chat-scrollbar::-webkit-scrollbar { width: 6px; }
      .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .chat-scrollbar::-webkit-scrollbar-thumb { background: var(--hdr-border, #CBD5E1); border-radius: 3px; }

      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .typing-dot {
        animation: bounce 1.4s infinite ease-in-out;
      }
      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }

      /* Sections AI */
      .ai-section {
        margin-bottom: 1.25rem;
      }
      .ai-section:last-child {
        margin-bottom: 0;
      }
      .ai-paragraph {
        display: inline; /* pour que les <br/> fonctionnent */
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el?.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  const bg = 'var(--hdr-bg, #FFFFFF)';
  const surface = 'var(--hdr-surface, #F1F5F9)';
  const textMain = 'var(--hdr-text, #0F172A)';
  const textMuted = 'var(--hdr-text-muted, #64748B)';
  const border = 'var(--hdr-border, #E2E8F0)';
  const accent = 'var(--hdr-accent, #000000)';

  return (
    <div className="flex flex-col" style={{ height: '100dvh', backgroundColor: bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b" style={{ borderColor: border, backgroundColor: bg }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-w-[44px] min-h-[44px] justify-center"
            style={{ color: textMuted }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">{t('common.back')}</span>
          </button>
          <span className="font-semibold text-base sm:text-lg" style={{ color: textMain }}>PichAI Chat</span>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{ color: textMuted }}
          aria-label={t('common.menu')}
        >
          <HamburgerIcon />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (identique) – masquée sur mobile avec overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 shadow-xl md:shadow-none`}
          style={{ backgroundColor: surface, borderRight: `1px solid ${border}` }}
        >
          {/* ... contenu sidebar inchangé ... */}
          <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: border }}>
            <h2 className="font-semibold text-sm" style={{ color: textMain }}>{t('chat.conversations')}</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
              style={{ color: textMuted }}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 chat-scrollbar">
            {conversations.length === 0 ? (
              <p className="text-xs px-2" style={{ color: textMuted }}>{t('chat.no_conversations')}</p>
            ) : (
              conversations.map(conv => (
                <div key={conv.id} onClick={() => loadMessages(conv.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer mb-1 text-sm ${
                    activeConvId === conv.id ? 'font-medium shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  style={{ backgroundColor: activeConvId === conv.id ? bg : 'transparent', color: textMain }}
                >
                  <span className="truncate flex-1">{conv.title}</span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t" style={{ borderColor: border }}>
            <button onClick={createNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: accent }}
            >
              <PlusIcon className="w-4 h-4" /> {t('chat.new_conversation')}
            </button>
          </div>
        </div>

        {/* Zone principale du chat */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: bg }}>
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div className="max-w-sm">
                <h3 className="font-semibold text-lg mb-2" style={{ color: textMain }}>{t('chat.welcome_title')}</h3>
                <p className="text-sm mb-5" style={{ color: textMuted }}>
                  {isAuthenticated ? t('chat.select_or_create') : t('chat.guest_welcome')}
                </p>
                <button onClick={createNewConversation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: accent }}
                >
                  <PlusIcon className="w-4 h-4" /> {t('chat.new_conversation')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Bandeau du claim */}
              <div className="px-4 py-2.5 border-b" style={{ borderColor: border, backgroundColor: surface }}>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: textMuted }}>📌 {t('chat.discussing_about')}</span>
                  <span className="font-semibold truncate" style={{ color: textMain }}>{claimTitle}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 chat-scrollbar" style={{ backgroundColor: bg }}>
                {messages.map(msg =>
                  msg.role === 'system' ? (
                    <div key={msg.id} className="flex justify-center">
                      <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm text-center"
                           style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.action === 'login' && (
                          <button onClick={() => navigate('/connexion', { state: { from: `/chat/${claimId}` } })}
                            className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: accent }}>
                            {t('common.login')}
                          </button>
                        )}
                        {msg.action === 'upgrade' && (
                          <button onClick={() => alert('Pro (simulation)')}
                            className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: accent }}>
                            {t('chat.view_pro')}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="relative group max-w-[90%] sm:max-w-[80%]">
                        <div
                          className="px-4 py-3 rounded-2xl break-words leading-relaxed text-sm sm:text-base"
                          style={{
                            backgroundColor: msg.role === 'user' ? surface : 'transparent',
                            border: msg.role === 'user' ? 'none' : `1px solid ${border}`,
                            color: textMain,
                          }}
                        >
                          {/* Rendu structuré pour l'assistant */}
                          {msg.role === 'assistant' ? formatRichContent(msg.content) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                          {msg.provider && (
                            <div className="text-[10px] mt-2 opacity-70" style={{ color: textMuted }}>
                              via {msg.provider}
                            </div>
                          )}
                        </div>
                        {/* Bouton copier amélioré */}
                        <button
                          onClick={() => copyMessage(msg.content, msg.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg border shadow-sm hover:border-gray-300 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 opacity-100 sm:opacity-0"
                          style={{
                            backgroundColor: bg,
                            borderColor: border,
                            color: copiedId === msg.id ? '#059669' : textMuted,
                          }}
                          title={t('common.copy')}
                        >
                          {copiedId === msg.id ? (
                            <CheckIcon className="w-3.5 h-3.5" />
                          ) : (
                            <ClipboardIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Indicateur de chargement : uniquement les dots */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl flex items-center gap-2" style={{ border: `1px solid ${border}`, backgroundColor: bg }}>
                      {/* Plus de texte "PichAI écrit" */}
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: textMuted }} />
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: textMuted }} />
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ backgroundColor: textMuted }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {messages.length <= 2 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {QUICK_SUGGESTIONS.map((s, i) => (
                      <button key={i}
                        onClick={() => { setInput(s.text); textareaRef.current?.focus(); }}
                        className="text-xs sm:text-sm flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                        style={{ backgroundColor: surface, color: textMain }}
                      >
                        <span>{s.icon}</span> {s.text}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Barre de saisie */}
              <div className="p-3 sm:p-4 border-t safe-bottom" style={{ borderColor: border, backgroundColor: bg }}>
                {remainingMessages <= 0 && (
                  <div className="text-center text-xs text-amber-600 mb-2">
                    {isAuthenticated ? t('chat.quota_exhausted') : t('chat.guest_messages_exhausted')}
                  </div>
                )}
                <div
                  className="flex items-end gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border focus-within:ring-1 transition-colors"
                  style={{ backgroundColor: surface, borderColor: border }}
                  onFocus={e => e.currentTarget.style.borderColor = accent}
                  onBlur={e => e.currentTarget.style.borderColor = border}
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      remainingMessages <= 0
                        ? t('chat.limit_reached')
                        : isAuthenticated
                        ? t('chat.input_placeholder_auth', { used: userDailyUsed, max: FREE_USER_DAILY_LIMIT })
                        : t('chat.input_placeholder_guest', { count: guestMsgCount, max: GUEST_LIMIT })
                    }
                    rows={1}
                    disabled={remainingMessages <= 0}
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base resize-none max-h-[200px] py-1.5 disabled:text-slate-400 disabled:cursor-not-allowed"
                    style={{ color: textMain }}
                  />
                  <div className="flex items-center gap-2">
                    {input.length > 0 && (
                      <span className={`text-xs ${input.length > MAX_CHARS ? 'text-red-500' : ''}`}
                        style={{ color: input.length > MAX_CHARS ? '#EF4444' : textMuted }}>
                        {input.length}/{MAX_CHARS}
                      </span>
                    )}
                    {input.trim() && !loading && remainingMessages > 0 ? (
                      <button onClick={sendMessage} disabled={input.length > MAX_CHARS}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors text-white"
                        style={{ backgroundColor: input.length > MAX_CHARS ? surface : accent }}>
                        <ArrowUpIcon className="w-5 h-5" />
                      </button>
                    ) : loading ? (
                      <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: surface }}>
                        <StopIcon className="w-5 h-5" style={{ color: textMuted }} />
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="text-center text-xs mt-2" style={{ color: textMuted }}>
                  {t('chat.disclaimer')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}