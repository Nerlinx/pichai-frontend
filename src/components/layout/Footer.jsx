import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import logoLight from '../../assets/log_pichAI_black.png';
import logoDark from '../../assets/log_pichAI_white.png';

const Footer = () => {
  const { t } = useTranslation('footer');
  const year = new Date().getFullYear();
 // 🎯 Lire le thème directement depuis le DOM
  const getCurrentTheme = () =>
    document.documentElement.getAttribute('data-theme') || 'light';

  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());


  useEffect(() => {
    const observer = new MutationObserver(() => {
      setCurrentTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);


  // Structure des colonnes avec clés de traduction
  const COLS = [
    {
      titleKey: 'col_intelligence',
      links: [
        { key: 'claims_flux', href: '/claims' },
        { key: 'predictive_index', href: '/predictions' },
        { key: 'ai_analysis', href: '/insights' },
        { key: 'domains_sectors', href: '/sectors' },
      ],
    },
    {
      titleKey: 'col_technology',
      links: [
        { key: 'api_access', href: '/api' },
        { key: 'documentation', href: '/docs' },
        { key: 'ai_architecture', href: '/stack' },
        { key: 'open_data', href: '/data' },
      ],
    },
    {
      titleKey: 'col_governance',
      links: [
        { key: 'partnerships', href: '/partners' },
        { key: 'methodology', href: '/method' },
        { key: 'ethics_algorithms', href: '/ethics' },
        { key: 'transparency', href: '/transparency' },
      ],
    },
  ];

  // Liens du bas
  const bottomLinks = [
    { key: 'privacy', href: '/confidentialite' },
    { key: 'terms', href: '/conditions' },
    { key: 'security', href: '/securite' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <footer
      style={{
        background: 'var(--hdr-bg)',
        borderTop: `1px solid var(--hdr-border)`,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.03)',
        fontFamily: "'Syne', system-ui, sans-serif",
        color: 'var(--hdr-text)',
        marginTop: 'auto',
      }}
    >
      <style>{`
        .footer-link {
          font-size: 12.5px;
          color: var(--hdr-text-sub);
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
          padding: 4px 0;
          line-height: 1.4;
        }
        .footer-link:hover {
          color: var(--hdr-accent);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }
        .slogan-box {
          border-left: 3px solid var(--hdr-accent);
          padding-left: 20px;
          margin-bottom: 28px;
        }
        .footer-bottom-links a {
          font-size: 9px;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--hdr-text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bottom-links a:hover {
          color: var(--hdr-accent);
        }
        .footer-col-title {
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'Syne', system-ui, sans-serif;
          color: var(--hdr-text);
          letter-spacing: -0.01em;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 24px;
          height: 2px;
          background: var(--hdr-accent);
          border-radius: 2px;
        }
        @media (max-width: 1100px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .brand-section {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 700px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .brand-section {
            grid-column: span 1 !important;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 20px;
          }
          .footer-bottom-links {
            flex-wrap: wrap;
            gap: 20px;
          }
          .slogan-box h3 {
            font-size: 16px;
          }
          .slogan-box p, .brand-section p {
            font-size: 13px;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 32px 40px' }}>
        <div className="footer-grid">
          {/* Colonne identité & slogans */}
          <div className="brand-section">
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: 'var(--hdr-text)',
                  letterSpacing: '-0.05em',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {/*PICH<span style={{ color: 'var(--hdr-accent)' }}>AI</span>*/}
              <img
                src={currentTheme === 'dark' ? logoDark : logoLight}
                alt="PICH AI"
                style={{
                  height: 20,
                  width: 'auto',
                  display: 'block'
                }}
              />
              </span>
            </Link>

            <div className="slogan-box">
              <h3
                style={{
                  fontSize: '17px',
                  lineHeight: 1.4,
                  fontWeight: 600,
                  margin: '0 0 12px',
                  color: 'var(--hdr-text)',
                }}
              >
                {t('slogan_title')}
              </h3>
              <p
                style={{
                  fontSize: '13.5px',
                  color: 'var(--hdr-text-sub)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {t('slogan_description')}
              </p>
            </div>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--hdr-text-sub)',
                lineHeight: 1.5,
                maxWidth: 480,
                fontStyle: 'italic',
                marginTop: 16,
              }}
            >
              {t('quote')}
            </p>
          </div>

          {/* Colonnes de navigation */}
          {COLS.map((col) => (
            <div key={col.titleKey}>
              <div className="footer-col-title">{t(col.titleKey)}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.key} style={{ marginBottom: 6 }}>
                    <Link to={link.href} className="footer-link">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Barre inférieure */}
        <div
          className="footer-bottom"
          style={{
            marginTop: 64,
            paddingTop: 28,
            borderTop: `1px solid var(--hdr-border)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                color: 'var(--hdr-text-muted)',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {t('copyright', { year })}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--hdr-text-muted)',
                fontSize: 10,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              <ShieldCheckIcon style={{ width: 13 }} />
              {t('sovereignty_badge')}
            </div>
          </div>

          <div className="footer-bottom-links" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {bottomLinks.map((link) => (
              <Link key={link.key} to={link.href}>
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;