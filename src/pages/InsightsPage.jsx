// ═══════════════════════════════════════════════════════════════
// PICH AI — InsightsPage.jsx
// Le cerveau exposé : analyses compréhensibles
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CpuChipIcon,
  SignalIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// ─── MOCK DATA ───────────────────────────────────────────────────
const MOCK_INSIGHTS = [
  {
    id: 1,
    title: 'Hausse probable du prix du riz dans les 3 mois',
    summary: 'Les indicateurs convergent vers une augmentation de 15-20% du prix du riz, principalement due à la baisse de la production locale et à l\'inflation importée.',
    impact: 'high',
    confidence: 82,
    sources: 12,
    category: 'Économie',
    fullAnalysis: 'Analyse détaillée : La production dans l\'Artibonite a baissé de 12% cette année. Combiné à une hausse du dollar et des coûts de transport, le prix au détail devrait mécaniquement augmenter. Les témoignages terrain confirment déjà des hausses localisées.',
    suggestedQuestions: [
      'Pourquoi le prix du carburant influence-t-il le prix du riz ?',
      'Quelles régions sont les plus touchées ?',
    ],
  },
  {
    id: 2,
    title: 'Tensions politiques : quel impact sur l\'économie ?',
    summary: 'L\'incertitude politique actuelle pourrait retarder les investissements étrangers et les décaissements d\'aide internationale, avec un impact modéré sur la croissance à court terme.',
    impact: 'medium',
    confidence: 67,
    sources: 8,
    category: 'Politique',
    suggestedQuestions: [
      'Quels secteurs sont les plus vulnérables ?',
      'Y a-t-il un risque de dégradation de la note souveraine ?',
    ],
  },
  {
    id: 3,
    title: 'Amélioration de la sécurité dans le centre-ville',
    summary: 'Les opérations policières récentes ont réduit les incidents de 30% dans les zones ciblées. La confiance des commerçants remonte progressivement.',
    impact: 'low',
    confidence: 74,
    sources: 6,
    category: 'Sécurité',
  },
];

// ─── COMPOSANTS ─────────────────────────────────────────────────
const InsightCard = ({ insight, onClick }) => {
  const impactColors = {
    high: { bg: '#FEE2E2', text: '#DC2626', label: 'Impact élevé' },
    medium: { bg: '#FEF3C7', text: '#D97706', label: 'Impact moyen' },
    low: { bg: '#D1FAE5', text: '#059669', label: 'Impact faible' },
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--hdr-surface)',
        borderRadius: 16,
        border: '1px solid var(--hdr-border)',
        padding: 20,
        cursor: 'pointer',
        transition: 'all .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hdr-accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hdr-border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 20,
          background: impactColors[insight.impact].bg,
          color: impactColors[insight.impact].text,
          fontFamily: "'Space Mono', monospace",
        }}>
          {impactColors[insight.impact].label}
        </span>
        <span style={{ fontSize: 12, color: 'var(--hdr-text-muted)' }}>
          {insight.confidence}% confiance
        </span>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
        {insight.title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--hdr-text-sub)', marginBottom: 16, lineHeight: 1.5 }}>
        {insight.summary}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--hdr-text-muted)', fontSize: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <SignalIcon style={{ width: 14 }} /> {insight.sources} sources
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {insight.category}
        </span>
      </div>
    </div>
  );
};

// ─── PAGE ───────────────────────────────────────────────────────
const InsightsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedInsight, setSelectedInsight] = useState(null);
  const insights = MOCK_INSIGHTS;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)' }}>
      <div className="content-container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <CpuChipIcon style={{ width: 28, height: 28, color: 'var(--hdr-accent)' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Inter', sans-serif", margin: 0 }}>
            {t('insights.page_title')}
          </h1>
        </div>
        <p style={{ fontSize: 15, color: 'var(--hdr-text-muted)', marginBottom: 32 }}>
          {t('insights.subtitle')}
        </p>

        {!selectedInsight ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {insights.map(insight => (
                <InsightCard key={insight.id} insight={insight} onClick={() => setSelectedInsight(insight)} />
              ))}
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedInsight(null)}
              style={{ background: 'none', border: 'none', color: 'var(--hdr-accent)', marginBottom: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              ← {t('common.back_to_insights')}
            </button>

            <div style={{ background: 'var(--hdr-surface)', borderRadius: 16, border: '1px solid var(--hdr-border)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{
                  fontSize: 13,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: selectedInsight.impact === 'high' ? '#FEE2E2' : selectedInsight.impact === 'medium' ? '#FEF3C7' : '#D1FAE5',
                  color: selectedInsight.impact === 'high' ? '#DC2626' : selectedInsight.impact === 'medium' ? '#D97706' : '#059669',
                  fontWeight: 700,
                }}>
                  Impact {selectedInsight.impact === 'high' ? 'élevé' : selectedInsight.impact === 'medium' ? 'moyen' : 'faible'}
                </span>
                <span>{selectedInsight.confidence}% confiance</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{selectedInsight.title}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>{selectedInsight.fullAnalysis || selectedInsight.summary}</p>

              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>
                  📊 Données utilisées
                </h4>
                <ul style={{ paddingLeft: 20 }}>
                  <li>Sources officielles (CNSA, BRH)</li>
                  <li>Témoignages terrain (124 contributions)</li>
                  <li>Données de marché internationales</li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>
                  ❓ Questions suggérées
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedInsight.suggestedQuestions?.map((q, i) => (
                    <button
                      key={i}
                      style={{
                        background: 'var(--hdr-surface-alt)',
                        border: '1px solid var(--hdr-border)',
                        borderRadius: 30,
                        padding: '10px 18px',
                        textAlign: 'left',
                        color: 'var(--hdr-text)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {q} <ArrowRightIcon style={{ width: 16 }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;