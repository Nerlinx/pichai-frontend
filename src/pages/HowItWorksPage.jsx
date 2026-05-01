// ═══════════════════════════════════════════════════════════════
// PICH AI — HowItWorksPage.jsx
// Page de conversion : explication simple et exemple concret
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  SparklesIcon,
  ArrowRightIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const HowItWorksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    {
      icon: <CheckCircleIcon style={{ width: 32, height: 32 }} />,
      title: '1. Sitwayen kontribye',
      description: 'Votez, commentez, apportez des preuves terrain.',
    },
    {
      icon: <ChatBubbleLeftRightIcon style={{ width: 32, height: 32 }} />,
      title: '2. IA analyse',
      description: 'Notre IA croise les données officielles et les contributions citoyennes.',
    },
    {
      icon: <CpuChipIcon style={{ width: 32, height: 32 }} />,
      title: '3. Résultat',
      description: 'Obtenez des prédictions claires et des résumés compréhensibles.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hdr-bg)' }}>
      <div className="content-container" style={{ paddingTop: 48, paddingBottom: 60 }}>
        {/* Hook */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            {t('how.page_title')}
          </h1>
          <p style={{ fontSize: 18, color: 'var(--hdr-text-muted)', lineHeight: 1.5 }}>
            {t('how.hook')}
          </p>
        </div>

        {/* Étapes visuelles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 56 }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ textAlign: 'center', padding: 24, background: 'var(--hdr-surface)', borderRadius: 20, border: '1px solid var(--hdr-border)' }}>
              <div style={{ color: 'var(--hdr-accent)', marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--hdr-text-muted)' }}>{step.description}</p>
            </div>
          ))}
        </div>

        {/* Exemple concret */}
        <div style={{ background: 'var(--hdr-surface)', borderRadius: 24, border: '1px solid var(--hdr-border)', padding: 32, marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
            {t('how.example_title')}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>“Le prix du riz va-t-il augmenter ?”</p>
              <p style={{ fontSize: 36, fontWeight: 800, color: '#059669', marginBottom: 16 }}>68% probable</p>
              <p style={{ fontSize: 15, color: 'var(--hdr-text-muted)' }}>
                Raisons : baisse de production locale, inflation importée, témoignages terrain.
              </p>
            </div>
            <div style={{ background: 'var(--hdr-accent-soft)', borderRadius: 16, padding: 20, maxWidth: 300 }}>
              <SparklesIcon style={{ width: 24, height: 24, color: 'var(--hdr-accent)', marginBottom: 8 }} />
              <p style={{ fontSize: 14, fontStyle: 'italic' }}>“Dans mon quartier, le sac de riz est déjà passé de 1800 à 2200 gourdes.”</p>
              <p style={{ fontSize: 12, marginTop: 8 }}>— Témoignage Delmas</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '16px 40px',
              borderRadius: 40,
              border: 'none',
              background: 'var(--cta-button-bg, #111827)',
              color: 'var(--cta-button-text, #FFFFFF)',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <FireIcon style={{ width: 20 }} /> {t('how.cta')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;