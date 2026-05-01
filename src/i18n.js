// src/i18n.js (version avancée)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Charge les traductions depuis /public/locales/{{lng}}/{{ns}}.json
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: { escapeValue: false },
    // Configuration du backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Chemin vers les fichiers de traduction
    },
    // Configuration des namespaces
    ns: ['common', 'header', 'home', 'footer'], // Namespaces à charger par défaut
    defaultNS: 'common', // Namespace par défaut
  });

export default i18n;