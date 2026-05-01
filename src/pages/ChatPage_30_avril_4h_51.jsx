// ═══════════════════════════════════════════════════════════════
// PichAI – ChatPage.jsx
// Chat dédié, invités bienvenus (5 msg). Hamburger mobile only.
// Bandeau claim + suggestions rapides · Input toujours visible.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeftIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  StopIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

// ─── Configuration API ───────────────────────────────────────────
const API_BASE = 'http://10.236.42.100:8000';
const getToken = () => localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
const authHdr = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

// ─── Limites ─────────────────────────────────────────────────────
const GUEST_LIMIT = 5;
const FREE_USER_DAILY_LIMIT = 10;

// ─── Helpers ─────────────────────────────────────────────────────
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Suggestions d’actions (contextuelles au claim) ──────────────
const QUICK_SUGGESTIONS = [
  { icon: '🔍', text: 'Analyse les sources' },
  { icon: '📊', text: 'Compare avec OMS' },
  { icon: '⚠️', text: 'Points faibles ?' },
  { icon: '💡', text: 'Résume le verdict' },
];

// ─── ChatPage ────────────────────────────────────────────────────
export default function ChatPage() {
  const { claimId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const claimTitle = location.state?.claimTitle || 'cette discussion';
  const isAuthenticated = !!getToken();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Mobile : sidebar fermée par défaut
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isNewConv, setIsNewConv] = useState(false);

  const [guestMsgCount, setGuestMsgCount] = useState(0);
  const [userDailyUsed, setUserDailyUsed] = useState(0);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const MAX_CHARS = 4000;

  // ─── Chargement conversations ──────────────────────────────────
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

  const loadMessages = async (convId) => {
    setActiveConvId(convId);
    setMessages([
      { id: 'm1', role: 'assistant', content: `Bonjour, je suis PichAI. Nous parlons bien de : **${claimTitle}**. Comment puis-je vous aider ?` }
    ]);
    setIsNewConv(false);
    if (!isAuthenticated) setGuestMsgCount(0);
    // Fermer la sidebar sur mobile
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const createNewConversation = () => {
    const newConv = {
      id: genId(),
      title: 'Nouvelle discussion...',
      claim_id: claimId,
      updated_at: new Date().toISOString(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setMessages([
      { id: 'welcome', role: 'assistant', content: `Je suis prêt à discuter de **${claimTitle}**. Posez-moi une question.` }
    ]);
    setIsNewConv(true);
    setGuestMsgCount(0);
    setUserDailyUsed(0);
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
      const systemMsg = {
        id: genId(),
        role: 'system',
        content: '✨ **Limite de messages gratuits atteinte**\n\nConnecte-toi pour continuer à discuter, sauvegarder tes analyses et profiter de PichAI sans interruption.',
        action: 'login'
      };
      setMessages(prev => [...prev, systemMsg]);
      setInput('');
      return;
    }

    if (isAuthenticated && userDailyUsed >= FREE_USER_DAILY_LIMIT) {
      const systemMsg = {
        id: genId(),
        role: 'system',
        content: '⚡ **Quota quotidien épuisé**\n\nPasse à PichAI Pro pour continuer à utiliser l\'assistant sans limite.',
        action: 'upgrade'
      };
      setMessages(prev => [...prev, systemMsg]);
      setInput('');
      return;
    }

    setInput('');
    const userMsg = { id: genId(), role: 'user', content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    if (isNewConv) {
      const words = msg.split(/\s+/);
      const title = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
      setConversations(prev => prev.map(c => (c.id === activeConvId ? { ...c, title } : c)));
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
      const assistantMsg = { id: genId(), role: 'assistant', content: data.response || 'Réponse indisponible.', provider: data.provider };
      setMessages(prev => [...prev, assistantMsg]);

      if (!isAuthenticated) {
        setGuestMsgCount(prev => prev + 1);
      } else {
        setUserDailyUsed(prev => prev + 1);
      }

      if (!isAuthenticated && guestMsgCount + 1 === GUEST_LIMIT) {
        const systemMsg = { id: genId(), role: 'system', content: '✨ **C\'était ton dernier message gratuit.** Connecte-toi pour continuer la discussion.', action: 'login' };
        setMessages(prev => [...prev, systemMsg]);
      }
      if (isAuthenticated && userDailyUsed + 1 === FREE_USER_DAILY_LIMIT) {
        const systemMsg = { id: genId(), role: 'system', content: '⚡ **Quota quotidien atteint.** Passe à la version Pro pour continuer sans limite.', action: 'upgrade' };
        setMessages(prev => [...prev, systemMsg]);
      }
    } catch {
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: '❌ Service IA indisponible.' }]);
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
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

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

  const remainingMessages = isAuthenticated
    ? FREE_USER_DAILY_LIMIT - userDailyUsed
    : GUEST_LIMIT - guestMsgCount;

  // Composant message système (login/upgrade)
  const SystemMessage = ({ msg }) => (
    <div className="flex justify-center">
      <div className="max-w-[80%] bg-amber-50 border border-amber-200 text-amber-900 px-5 py-3 rounded-2xl text-sm text-center">
        <p className="whitespace-pre-wrap">{msg.content}</p>
        {msg.action === 'login' && (
          <button
            onClick={() => navigate('/connexion', { state: { from: `/chat/${claimId}` } })}
            className="mt-3 px-4 py-2 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800"
          >
            Se connecter
          </button>
        )}
        {msg.action === 'upgrade' && (
          <button
            onClick={() => alert('Redirection vers l\'offre Pro (simulation)')}
            className="mt-3 px-4 py-2 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800"
          >
            Voir les offres Pro
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col bg-white font-sans"
      style={{ height: '100dvh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-600 hover:text-black min-w-[44px] min-h-[44px] justify-center"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Retour</span>
          </button>
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-base">PichAI Chat</span>
        </div>

        {/* Bouton hamburger uniquement sur mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Menu conversations"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar conversations */}
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-50 border-r border-slate-100 flex flex-col transition-transform duration-300 shadow-xl md:shadow-none`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-200">
            <h2 className="font-semibold text-sm text-slate-700">Conversations</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-200 md:hidden"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-400 px-2">Aucune conversation</p>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => loadMessages(conv.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer mb-1 text-sm ${
                    activeConvId === conv.id ? 'bg-white shadow-sm font-medium' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate flex-1">{conv.title}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={createNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-full text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" /> Nouvelle discussion
            </button>
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {!activeConvId ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div className="max-w-sm">
                <SparklesIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Bienvenue dans PichAI Chat</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {isAuthenticated
                    ? 'Sélectionnez une conversation ou créez-en une nouvelle.'
                    : 'Discutez librement (5 messages gratuits).'}
                </p>
                <button
                  onClick={createNewConversation}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm min-h-[44px]"
                >
                  <PlusIcon className="w-4 h-4" /> Nouvelle discussion
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Bandeau du claim */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-slate-500">📌 Vous discutez à propos de :</span>
                  <span className="font-semibold text-sm sm:text-base truncate">{claimTitle}</span>
                </div>
              </div>

              {/* Messages + suggestions */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 text-sm">
                {messages.map(msg =>
                  msg.role === 'system' ? (
                    <SystemMessage key={msg.id} msg={msg} />
                  ) : (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="relative group max-w-[90%] sm:max-w-[80%]">
                        <div
                          className={`px-4 py-2.5 rounded-2xl break-words whitespace-pre-wrap leading-relaxed ${
                            msg.role === 'user' ? 'bg-slate-100' : 'bg-white border border-slate-100'
                          }`}
                        >
                          {msg.content}
                          {msg.provider && (
                            <div className="text-[10px] text-slate-400 mt-1">via {msg.provider}</div>
                          )}
                        </div>
                        <button
                          onClick={() => copyMessage(msg.content, msg.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 backdrop-blur border border-slate-200 shadow-sm text-slate-500 hover:text-black hover:border-slate-300 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100"
                          title="Copier"
                        >
                          {copiedId === msg.id ? (
                            <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <ClipboardIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>PichAI écrit</span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions rapides (affichées quand peu de messages) */}
                {messages.length <= 2 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {QUICK_SUGGESTIONS.map((s, i) => (
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

                <div ref={scrollRef} />
              </div>

              {/* Input fixé en bas avec safe area */}
              <div className="p-3 sm:p-4 border-t border-slate-100 bg-white safe-bottom">
                {(remainingMessages <= 0) && (
                  <div className="text-center text-xs text-amber-600 mb-2">
                    {isAuthenticated
                      ? 'Quota quotidien épuisé. Passez à la version Pro pour continuer.'
                      : 'Messages gratuits épuisés. Connectez-vous pour continuer.'}
                  </div>
                )}
                <div className="flex items-end gap-2 bg-slate-50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border border-transparent focus-within:border-black/20 transition-colors">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      remainingMessages <= 0
                        ? 'Limite atteinte'
                        : isAuthenticated
                        ? `Message (${userDailyUsed}/${FREE_USER_DAILY_LIMIT})`
                        : `Message (${guestMsgCount}/${GUEST_LIMIT} gratuit)`
                    }
                    rows={1}
                    disabled={remainingMessages <= 0}
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base resize-none max-h-[200px] py-1.5 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-2">
                    {input.length > 0 && (
                      <span className={`text-xs ${input.length > MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
                        {input.length}/{MAX_CHARS}
                      </span>
                    )}
                    {input.trim() && !loading && remainingMessages > 0 ? (
                      <button
                        onClick={sendMessage}
                        disabled={input.length > MAX_CHARS}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                          input.length > MAX_CHARS ? 'bg-slate-200 text-slate-400' : 'bg-black hover:bg-gray-800 text-white'
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
                <p className="text-center text-xs text-slate-400 mt-2">
                  PichAI peut faire des erreurs. Vérifiez les sources.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}