// ═══════════════════════════════════════════════════════════════
// PICH AI — DiscussionPage.jsx
// Intelligence collective autour d'un claim
// Version : production, responsive, IA intégrée, contributions enrichies
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  ChatBubbleOvalLeftIcon,
  MapPinIcon,
  LinkIcon,
  PhotoIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  BoltIcon,
  XMarkIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

// ─── CONSTANTES & MOCK (à remplacer par API) ─────────────────────
const SEMANTIC = {
  green: '#059669',
  greenSoft: '#F0FDF9',
  red: '#DC2626',
  redSoft: '#FFF5F5',
  amber: '#D97706',
  amberSoft: '#FFFBEB',
  purple: '#7C3AED',
  purpleSoft: '#F5F3FF',
};

// Mock du claim (événement)
const MOCK_EVENT = {
  id: 1,
  title: 'Stabilisation de l\'inflation à moins de 15% en 2026',
  category: 'Économie',
  currentConsensus: 45,
  participants: 6,
  trend: 'down',
  status: 'in_progress', // active, urgent, resolved
  aiSummary: "D'après les 6 contributions, la tendance est incertaine. 3 personnes pensent que l'objectif sera atteint, 3 le jugent improbable. Les signaux économiques récents sont mitigés.",
  keySignals: [
    "Création de 50 000 emplois agricoles (en cours)",
    "Pression sur le taux de change persistante",
    "Baisse attendue des prix du carburant"
  ],
  timeSeries: [45, 44, 44, 45, 45],
};

// Mock des contributions (commentaires enrichis)
const MOCK_COMMENTS = [
  {
    id: 101,
    user: "Marie L.",
    avatar: "ML",
    location: "Port-au-Prince",
    type: "opinion",        // opinion, proof, question, correction
    text: "Le gouvernement a déjà pris des mesures pour stabiliser les prix des produits de première nécessité. Je pense que l'objectif est atteignable.",
    time: "2h",
    votes_helpful: 4,
    votes_not_helpful: 1,
    weight: null,           // uniquement pour les preuves
    aiAnswer: null,         // uniquement pour les questions
    hasImage: false,
    hasLink: false,
  },
  {
    id: 102,
    user: "EcoAnalyst",
    avatar: "EA",
    location: "Delmas",
    type: "proof",
    text: "Rapport de la BRH : les réserves internationales sont en hausse de 8% ce trimestre. Voici le lien vers le document officiel.",
    time: "5h",
    votes_helpful: 7,
    votes_not_helpful: 0,
    weight: 2.5,
    aiAnswer: null,
    hasLink: true,
    linkUrl: "https://www.brh.ht/rapport-trimestriel",
  },
  {
    id: 103,
    user: "Sophie M.",
    avatar: "SM",
    location: "Cap-Haïtien",
    type: "question",
    text: "Quel est l'impact réel de la flambée du dollar sur les prix locaux ? Les importations deviennent plus chères, mais est-ce que cela sera compensé par autre chose ?",
    time: "1j",
    votes_helpful: 5,
    votes_not_helpful: 0,
    weight: null,
    aiAnswer: "D'après les données disponibles, chaque augmentation de 1 gourde du dollar entraîne une hausse moyenne de 0.7 gourde sur le prix du riz importé. La compensation par des subventions ciblées est en discussion, mais pas encore mise en œuvre.",
    hasImage: false,
  },
  {
    id: 104,
    user: "Jacques D.",
    avatar: "JD",
    location: "Artibonite",
    type: "correction",
    text: "Le rapport de la BRH mentionne une hausse de 5%, pas 8%. Je joins la capture d'écran de la page 12.",
    time: "3h",
    votes_helpful: 2,
    votes_not_helpful: 1,
    weight: 1.2,
    aiAnswer: null,
    hasImage: true,
  },
];

// Fonction utilitaire pour obtenir la couleur du badge selon le type
const getTypeBadgeStyle = (type) => {
  switch (type) {
    case 'opinion':   return { bg: SEMANTIC.greenSoft, color: SEMANTIC.green, icon: <ChatBubbleOvalLeftIcon width={12} /> };
    case 'proof':     return { bg: SEMANTIC.amberSoft, color: SEMANTIC.amber, icon: <LinkIcon width={12} /> };
    case 'question':  return { bg: SEMANTIC.purpleSoft, color: SEMANTIC.purple, icon: <QuestionMarkCircleIcon width={12} /> };
    case 'correction':return { bg: SEMANTIC.redSoft, color: SEMANTIC.red, icon: <FlagIcon width={12} /> };
    default:          return { bg: 'var(--hdr-surface-alt)', color: 'var(--hdr-text-muted)', icon: null };
  }
};

// ─── COMPOSANTS INTERNES ─────────────────────────────────────────

// Carte de contribution unique
const ContributionCard = ({ comment, onHelpful, onNotHelpful, onReport }) => {
  const { t } = useTranslation();
  const badge = getTypeBadgeStyle(comment.type);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  const [notHelpfulClicked, setNotHelpfulClicked] = useState(false);

  const handleHelpful = () => {
    if (!helpfulClicked) {
      setHelpfulClicked(true);
      onHelpful?.(comment.id);
    }
  };
  const handleNotHelpful = () => {
    if (!notHelpfulClicked) {
      setNotHelpfulClicked(true);
      onNotHelpful?.(comment.id);
    }
  };

  return (
    <div style={{ padding: '20px 0', borderBottom: '1px solid var(--hdr-border)' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Avatar */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--hdr-surface-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--hdr-text)',
          flexShrink: 0,
        }}>
          {comment.avatar}
        </div>

        {/* Contenu principal */}
        <div style={{ flex: 1 }}>
          {/* En-tête : nom, lieu, badge, temps */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--hdr-text)' }}>{comment.user}</span>
            {comment.location && (
              <span style={{ fontSize: 12, color: 'var(--hdr-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPinIcon style={{ width: 12 }} /> {comment.location}
              </span>
            )}
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 20,
              background: badge.bg,
              color: badge.color,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}>
              {badge.icon} {t(`discussion.type_${comment.type}`)}
            </span>
            {comment.weight && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 12,
                background: SEMANTIC.amberSoft,
                color: SEMANTIC.amber,
                fontFamily: "'Space Mono', monospace",
              }}>
                {t('discussion.ai_weight')} {comment.weight}×
              </span>
            )}
            <span style={{ fontSize: 11, color: 'var(--hdr-text-muted)', marginLeft: 'auto' }}>{comment.time}</span>
          </div>

          {/* Texte */}
          <p style={{ fontSize: 14, color: 'var(--hdr-text)', margin: '8px 0', lineHeight: 1.5 }}>{comment.text}</p>

          {/* Éventuel lien ou image */}
          {comment.hasImage && (
            <div style={{ marginTop: 8, padding: 8, background: 'var(--hdr-surface-alt)', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <PhotoIcon style={{ width: 14, color: 'var(--hdr-text-muted)' }} />
              <span style={{ fontSize: 12, color: 'var(--hdr-text-sub)' }}>image_123.jpg</span>
            </div>
          )}
          {comment.hasLink && (
            <div style={{ marginTop: 8 }}>
              <a href={comment.linkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--hdr-accent)', textDecoration: 'none' }}>
                <LinkIcon style={{ width: 12, display: 'inline', marginRight: 4 }} /> {comment.linkUrl}
              </a>
            </div>
          )}

          {/* Réponse IA pour les questions */}
          {comment.type === 'question' && comment.aiAnswer && (
            <div style={{
              marginTop: 12,
              marginLeft: 16,
              padding: 12,
              background: 'var(--hdr-accent-soft)',
              borderRadius: 12,
              borderLeft: `3px solid var(--hdr-accent)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <CpuChipIcon style={{ width: 14, color: 'var(--hdr-accent)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--hdr-accent)' }}>{t('discussion.ai_response')}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--hdr-text)', margin: 0, lineHeight: 1.5 }}>{comment.aiAnswer}</p>
            </div>
          )}

          {/* Boutons d'action : Utile / Pas utile / Signaler */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>
            <button
              onClick={handleHelpful}
              disabled={helpfulClicked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: helpfulClicked ? SEMANTIC.green : 'var(--hdr-text-muted)',
                fontSize: 12,
                cursor: 'pointer',
                opacity: helpfulClicked ? 1 : 0.7,
              }}
            >
              <HandThumbUpIcon style={{ width: 14 }} /> {t('discussion.helpful')} ({comment.votes_helpful})
            </button>
            <button
              onClick={handleNotHelpful}
              disabled={notHelpfulClicked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: notHelpfulClicked ? SEMANTIC.red : 'var(--hdr-text-muted)',
                fontSize: 12,
                cursor: 'pointer',
                opacity: notHelpfulClicked ? 1 : 0.7,
              }}
            >
              <HandThumbDownIcon style={{ width: 14 }} /> {t('discussion.not_helpful')} ({comment.votes_not_helpful})
            </button>
            <button
              onClick={() => onReport?.(comment.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: 'var(--hdr-text-muted)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <FlagIcon style={{ width: 14 }} /> {t('discussion.report')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar IA (desktop)
const IASidebar = ({ event, onAskAI }) => {
  const { t } = useTranslation();
  return (
    <div style={{
      position: 'sticky',
      top: 80,
      alignSelf: 'start',
    }}>
      {/* Évolution du score */}
      <div style={{ marginBottom: 28, background: 'var(--hdr-surface)', borderRadius: 16, padding: 16, border: '1px solid var(--hdr-border)' }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>
          📈 {t('discussion.consensus_evolution')}
        </h4>
        <div style={{ height: 100, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {event.timeSeries.map((val, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: val, width: '100%', background: 'var(--hdr-accent)', borderRadius: '4px 4px 0 0', minHeight: 2 }} />
              <span style={{ fontSize: 10, marginTop: 4, color: 'var(--hdr-text-muted)' }}>{val}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé IA */}
      <div style={{ marginBottom: 28, background: 'var(--hdr-surface)', borderRadius: 16, padding: 16, border: '1px solid var(--hdr-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <CpuChipIcon style={{ width: 18, color: 'var(--hdr-accent)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{t('discussion.ai_insight')}</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--hdr-text)', margin: 0, lineHeight: 1.5 }}>{event.aiSummary}</p>
      </div>

      {/* Signaux clés */}
      {event.keySignals && event.keySignals.length > 0 && (
        <div style={{ marginBottom: 28, background: 'var(--hdr-surface)', borderRadius: 16, padding: 16, border: '1px solid var(--hdr-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BoltIcon style={{ width: 18, color: SEMANTIC.amber }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{t('discussion.key_signals')}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--hdr-text-sub)', fontSize: 13 }}>
            {event.keySignals.map((signal, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{signal}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bouton poser une question à l'IA */}
      <button
        onClick={onAskAI}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 40,
          border: 'none',
          background: 'var(--hdr-accent)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <SparklesIcon style={{ width: 16 }} /> {t('discussion.ask_ai')}
      </button>
    </div>
  );
};

// Bottom sheet pour mobile (sidebar IA)
const MobileIASheet = ({ event, onAskAI, isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--hdr-bg)',
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 30px',
          zIndex: 1001,
          maxHeight: '80vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <XMarkIcon style={{ width: 24, color: 'var(--hdr-text-muted)' }} />
          </button>
        </div>
        <IASidebar event={event} onAskAI={() => { onAskAI(); onClose(); }} />
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </>
  );
};

// ─── COMPOSANT PRINCIPAL ─────────────────────────────────────────
const DiscussionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(MOCK_EVENT);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [userVote, setUserVote] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, proof, question, correction
  const [commentInput, setCommentInput] = useState('');
  const [selectedType, setSelectedType] = useState('opinion');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Filtrage des commentaires selon l'onglet
  const filteredComments = comments.filter(comment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'proof') return comment.type === 'proof';
    if (activeTab === 'question') return comment.type === 'question';
    if (activeTab === 'correction') return comment.type === 'correction';
    return true;
  });

  const handleVote = (vote) => {
    setUserVote(vote);
    // Ici, appel API pour soumettre le vote
  };

  const handlePublish = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "Vous", // à remplacer par l'utilisateur connecté
      avatar: "MO",
      location: selectedDepartment || "Haïti",
      type: selectedType,
      text: commentInput,
      time: "À l'instant",
      votes_helpful: 0,
      votes_not_helpful: 0,
      weight: selectedType === 'proof' ? 1.0 : null,
      aiAnswer: null,
      hasLink: false,
      hasImage: false,
    };
    setComments([newComment, ...comments]);
    setCommentInput('');
    setSelectedDepartment('');
    // Ici, appel API pour poster
  };

  const handleHelpful = (commentId) => {
    // Mettre à jour localement (appel API ensuite)
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, votes_helpful: c.votes_helpful + 1 } : c
    ));
  };

  const handleNotHelpful = (commentId) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, votes_not_helpful: c.votes_not_helpful + 1 } : c
    ));
  };

  const handleReport = (commentId) => {
    alert(t('discussion.report_thanks'));
    // Appel API de signalement
  };

  const handleAskAI = () => {
    // Ouvrir un modal ou faire une requête API
    alert(t('discussion.ask_ai_coming_soon'));
  };

  // Départements haïtiens pour le select
  const departments = [
    'Artibonite', 'Centre', 'Grand’Anse', 'Nippes', 'Nord', 'Nord-Est', 'Nord-Ouest',
    'Ouest', 'Port-au-Prince', 'Sud', 'Sud-Est'
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)' }}>
      <div className="discussion-container" style={{ paddingBottom: 100 }}> {/* padding pour la zone fixe */}

        {/* En-tête fixe (sticky) */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'var(--hdr-bg)',
          borderBottom: '1px solid var(--hdr-border)',
          padding: '16px 24px',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          background: 'rgba(var(--hdr-bg-rgb), 0.95)',
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hdr-text)' }}
                aria-label={t('common.back')}
              >
                <ArrowLeftIcon style={{ width: 20, height: 20 }} />
              </button>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--hdr-text)', margin: 0, flex: 1 }}>
                {event.title}
              </h1>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: event.currentConsensus >= 50 ? SEMANTIC.green : SEMANTIC.red }}>
                    {event.currentConsensus}%
                  </span>
                  <span style={{ display: 'block', fontSize: 10, color: 'var(--hdr-text-muted)' }}>{t('event.probable_label')}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleVote('yes')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 30,
                      border: userVote === 'yes' ? `2px solid ${SEMANTIC.green}` : '1px solid var(--hdr-border)',
                      background: userVote === 'yes' ? SEMANTIC.greenSoft : 'transparent',
                      color: userVote === 'yes' ? SEMANTIC.green : 'var(--hdr-text)',
                      fontWeight: 600,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircleIcon style={{ width: 14 }} /> {t('event.probable')}
                  </button>
                  <button
                    onClick={() => handleVote('no')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 30,
                      border: userVote === 'no' ? `2px solid ${SEMANTIC.red}` : '1px solid var(--hdr-border)',
                      background: userVote === 'no' ? SEMANTIC.redSoft : 'transparent',
                      color: userVote === 'no' ? SEMANTIC.red : 'var(--hdr-text)',
                      fontWeight: 600,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <XCircleIcon style={{ width: 14 }} /> {t('event.improbable')}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {event.trend === 'up' ? (
                  <ArrowTrendingUpIcon style={{ width: 16, color: SEMANTIC.green }} />
                ) : (
                  <ArrowTrendingDownIcon style={{ width: 16, color: SEMANTIC.red }} />
                )}
                <span style={{ fontSize: 12, color: 'var(--hdr-text-muted)' }}>
                  {event.participants} {t('event.participants')}
                </span>
                {event.status === 'urgent' && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: SEMANTIC.red, background: SEMANTIC.redSoft, padding: '2px 8px', borderRadius: 20 }}>
                    {t('event.urgent')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal : grille desktop / mobile adaptative */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 0 24px' }}>
          <div className="discussion-grid" style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {/* Colonne gauche (discussion) - 70% sur desktop */}
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              {/* Onglets */}
              <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--hdr-border)', marginBottom: 24 }}>
                {[
                  { id: 'all', label: t('discussion.tab_all') },
                  { id: 'proof', label: t('discussion.tab_proofs') },
                  { id: 'question', label: t('discussion.tab_questions') },
                  { id: 'correction', label: t('discussion.tab_corrections') },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      background: 'none',
                      fontSize: 13,
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      color: activeTab === tab.id ? 'var(--hdr-accent)' : 'var(--hdr-text-muted)',
                      borderBottom: activeTab === tab.id ? `2px solid var(--hdr-accent)` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Liste des contributions */}
              {filteredComments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--hdr-text-muted)' }}>
                  {t('discussion.no_comments')}
                </div>
              ) : (
                filteredComments.map(comment => (
                  <ContributionCard
                    key={comment.id}
                    comment={comment}
                    onHelpful={handleHelpful}
                    onNotHelpful={handleNotHelpful}
                    onReport={handleReport}
                  />
                ))
              )}
            </div>

            {/* Sidebar IA (desktop) */}
            <div className="desktop-sidebar" style={{ width: 320, flexShrink: 0, display: 'block' }}>
              <IASidebar event={event} onAskAI={handleAskAI} />
            </div>

            {/* Bouton flottant mobile pour ouvrir la sidebar IA */}
            <div className="mobile-fab" style={{ display: 'none', position: 'fixed', bottom: 100, right: 16, zIndex: 20 }}>
              <button
                onClick={() => setMobileSheetOpen(true)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--hdr-accent)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <CpuChipIcon style={{ width: 24 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Zone de contribution fixe en bas (collée) */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--hdr-bg)',
          borderTop: '1px solid var(--hdr-border)',
          padding: '16px 24px',
          zIndex: 15,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={t('discussion.input_placeholder')}
                rows={2}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid var(--hdr-border)',
                  background: 'var(--hdr-surface)',
                  color: 'var(--hdr-text)',
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 20,
                    border: '1px solid var(--hdr-border)',
                    background: 'var(--hdr-surface)',
                    color: 'var(--hdr-text)',
                    fontSize: 13,
                  }}
                >
                  <option value="opinion">💬 {t('discussion.type_opinion')}</option>
                  <option value="proof">🔗 {t('discussion.type_proof')}</option>
                  <option value="question">❓ {t('discussion.type_question')}</option>
                  <option value="correction">⚠️ {t('discussion.type_correction')}</option>
                </select>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 20,
                    border: '1px solid var(--hdr-border)',
                    background: 'var(--hdr-surface)',
                    color: 'var(--hdr-text)',
                    fontSize: 13,
                  }}
                >
                  <option value="">{t('discussion.select_department')}</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid var(--hdr-border)',
                    borderRadius: 20,
                    padding: '8px 12px',
                    color: 'var(--hdr-text)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <PhotoIcon style={{ width: 16 }} /> {t('discussion.upload')}
                </button>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid var(--hdr-border)',
                    borderRadius: 20,
                    padding: '8px 12px',
                    color: 'var(--hdr-text)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <LinkIcon style={{ width: 16 }} /> {t('discussion.add_link')}
                </button>
                <button
                  onClick={handlePublish}
                  style={{
                    marginLeft: 'auto',
                    padding: '10px 24px',
                    borderRadius: 30,
                    border: 'none',
                    background: 'var(--hdr-accent)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t('discussion.publish')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <MobileIASheet
          isOpen={mobileSheetOpen}
          onClose={() => setMobileSheetOpen(false)}
          event={event}
          onAskAI={handleAskAI}
        />

        <style>{`
          @media (max-width: 768px) {
            .desktop-sidebar {
              display: none !important;
            }
            .mobile-fab {
              display: block !important;
            }
            .discussion-container {
              padding-bottom: 140px !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-fab {
              display: none !important;
            }
            .desktop-sidebar {
              display: block !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DiscussionPage;