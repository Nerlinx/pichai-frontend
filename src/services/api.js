// ═══════════════════════════════════════════════════════════════
// PICHAI — src/services/api.js
// ═══════════════════════════════════════════════════════════════

import axios from 'axios';

// ── INSTANCE AXIOS ───────────────────────────────────────────────
const api = axios.create({
  baseURL    : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers    : { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout    : Number(process.env.REACT_APP_API_TIMEOUT) || 15000,
  withCredentials: false,
});

export default api;

// ── LANGUE ───────────────────────────────────────────────────────
const getLang = () => {
  const lang = localStorage.getItem('i18nextLng');
  return lang === 'ht' ? 'ht' : 'fr';
};

// ── MODE MOCK ────────────────────────────────────────────────────
let _useMock =
  localStorage.getItem('use_mock_data') === 'true' ||
  import.meta.env.VITE_USE_MOCK === 'true';

export const isMockMode   = () => _useMock;
export const toggleMockData = (val) => {
  _useMock = !!val;
  localStorage.setItem('use_mock_data', _useMock ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('mockModeChanged', { detail: { useMock: _useMock } }));
  return _useMock;
};

// ── TOKEN ────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('access_token');
const setTokens = (access, refresh) => {
  if (access)  localStorage.setItem('access_token',  access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
};

// ── INTERCEPTEURS ────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (process.env.REACT_APP_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          const res = await api.post('/api/v1/auth/refresh', { refresh_token: refresh });
          const { access_token, refresh_token: newRefresh } = res.data;
          setTokens(access_token, newRefresh);
          orig.headers.Authorization = `Bearer ${access_token}`;
          return api(orig);
        }
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/connexion';
      }
    }
    return Promise.reject({
      status   : error.response?.status,
      message  : error.response?.data?.detail || error.response?.data?.message || error.message || 'Erreur serveur',
      url      : error.config?.url,
      timestamp: new Date().toISOString(),
    });
  }
);

// ── HELPERS ──────────────────────────────────────────────────────
const simulateDelay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const handleApiCall = async (realCall, mockResult, options = {}) => {
  const { useMock = isMockMode(), delay = 400 } = options;
  if (useMock) {
    await simulateDelay(delay);
    return { data: mockResult };
  }
  try {
    return await realCall();
  } catch (error) {
    if (process.env.REACT_APP_ENV === 'development') {
      console.warn('[API → Mock fallback]', error?.message || error);
    }
    await simulateDelay(200);
    return { data: mockResult };
  }
};

const normalizeCategory = (cat, lang = 'fr') => {
  if (!cat) return { name: 'Général', slug: 'general' };
  const ht = lang === 'ht';
  return {
    id            : cat.id,
    name          : ht ? (cat.name_ht || cat.name) : cat.name,
    description   : ht ? (cat.description_ht || cat.description) : cat.description,
    slug          : cat.slug,
    icon          : cat.icon,
    color_hex     : cat.color_hex,
    total_claims  : cat.total_claims,
    avg_confidence: cat.avg_confidence,
    is_active     : cat.is_active,
  };
};

const normalizeClaim = (claim, lang = getLang()) => {
  let categoryObj = claim.category;
  if (typeof claim.category === 'string') {
    categoryObj = { name: claim.category, slug: claim.category.toLowerCase() };
  }
  return {
    id              : claim.id,
    title           : claim.title,
    description     : claim.short_description || claim.description || '',
    category        : normalizeCategory(categoryObj, lang),
    claimant        : claim.claimant || '',
    department      : claim.department || null,
    geographic_scope: claim.geographic_scope || 'National',
    status          : claim.status || 'pending',
    currentConsensus: claim.crowd_confidence_score != null
      ? Math.round(claim.crowd_confidence_score * 100)
      : null,
    iaConfidence    : claim.ai_confidence_score || 0,
    impactScore     : Math.round((claim.ai_confidence_score || 0) * 100),
    participants    : claim.total_votes || 0,
    lastUpdate      : claim.created_at
      ? new Date(claim.created_at).toLocaleDateString('fr-FR')
      : '—',
    daysLeft        : claim.target_date
      ? Math.max(0, Math.ceil((new Date(claim.target_date) - new Date()) / 86400000))
      : '—',
    trend           : 'stable',
    forecastValue   : claim.status === 'in_progress' ? 'En cours' : claim.status || '—',
    tags            : claim.tags || [],
    is_controversial: claim.is_controversial || false,
  };
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const MOCK_CLAIMS = [
  {
    id: 1,
    title           : "Stabilisation du taux de change à 125 HTG pour 1 USD",
    title_ht        : "Estabilizasyon to echanj la a 125 goud pou 1 dola",
    category        : { id: 1, name: 'Économie', name_ht: 'Ekonomi', slug: 'economie' },
    claimant        : "Banque de la République d'Haïti",
    description     : "Le gouvernement prévoit de stabiliser la gourde grâce à une injection massive de devises et une réduction du déficit budgétaire.",
    description_ht  : "Gouvènman an prevwa estabilize goud la gras ak yon piki deviz masif ak yon reduksyon nan defisit bidjetè a.",
    short_description_ht: "Plan pou desann pri dola a anba 125 goud.",
    crowd_confidence_score: 0.38,
    ai_confidence_score   : 0.55,
    status          : 'in_progress',
    total_votes     : 1240,
    created_at      : '2026-04-01T10:00:00',
  },
  {
    id: 2,
    title           : "Lancement d'une monnaie numérique souveraine (Gourde Digitale)",
    title_ht        : "Lansman yon lajan dijital pou peyi a (Goud Dijital)",
    category        : { id: 1, name: 'Économie', name_ht: 'Ekonomi', slug: 'economie' },
    claimant        : "Ministère des Finances",
    claimant_ht     : "Ministè Finans",
    description     : "Modernisation du système de paiement national pour réduire la dépendance au cash et faciliter les transactions sécurisées.",
    description_ht  : "Modernizasyon sistèm peman nasyonal la pou nou sèvi mwens ak kach epi fasilite tranzaksyon ki an sekirite.",
    short_description_ht: "Leta vle kreye yon fason pou moun peye ak telefòn san kach.",
    crowd_confidence_score: 0.52, ai_confidence_score: 0.68, status: 'pending', total_votes: 890, created_at: '2026-04-05T09:30:00'
  },
  {
    id: 3,
    title: "Baisse de 15% sur les prix des produits de première nécessité",
    title_ht: "Diminisyon 15% sou pri pwodwi nesesite de baz yo",
    category: { id: 1, name: 'Économie', name_ht: 'Ekonomi', slug: 'economie' },
    claimant: "Ministère du Commerce",
    claimant_ht: "Ministè Komès",
    description: "Subventions ciblées sur le riz, l'huile et la farine pour soulager le panier de la ménagère face à l'inflation.",
    description_ht: "Sivansyon sou diri, lwil ak farin pou ede pèp la jwenn manje pi bon mache fas ak lavi chè a.",
    short_description_ht: "Leta pwomèt pou pri diri ak lwil desann.",
    crowd_confidence_score: 0.22, ai_confidence_score: 0.31, status: 'in_progress', total_votes: 3500, created_at: '2026-04-10T14:00:00'
  },
  {
    id: 4,
    title: "Libération totale de la Route Nationale #1 d'ici juin",
    title_ht: "Liberasyon nèt ale wout nasyonal nimewo 1 anvan mwa jen",
    category: { id: 8, name: 'Sécurité', name_ht: 'Sekirite', slug: 'securite' },
    claimant: "Haut Commandement de la PNH",
    claimant_ht: "Gwo chèf lapolis yo",
    description: "Opération de grande envergure pour démanteler les foyers de gangs bloquant l'accès au Grand Nord.",
    description_ht: "Gwo operasyon pou kraze tout baz gang k ap bloke moun ki vle moute nan gran nò a.",
    short_description_ht: "Lapolis pwomèt pou moun ka vwayaje san pwoblèm vè Lenbe ak okap.",
    crowd_confidence_score: 0.41, ai_confidence_score: 0.38, status: 'in_progress', total_votes: 2100, created_at: '2026-04-12T08:00:00'
  },
  {
    id: 202,
    title: "Des élections seront organisées avant fin 2026",
    title_ht: "Eleksyon pral fèt avan fen 2026",
    description: "Le calendrier électoral reste incertain, mais les autorités de transition affirment vouloir organiser des élections. Les défis logistiques et sécuritaires restent majeurs.",
    description_ht: "Kalandriye elektoral la toujou pa klè, men otorite tranzisyon yo di yo vle òganize eleksyon. Gen gwo defi nan sekirite ak lojistik.",
    short_description: "Élections possibles mais incertaines.",
    short_description_ht: "Eleksyon posib men pa sèten.",
    category: { id: 2, name: 'Politique', slug: 'politique' },
    claimant: "Conseil de transition",
    claimant_ht: "Konsèy tranzisyon",
    crowd_confidence_score: 0.38,
    ai_confidence_score: 0.44,
    status: 'pending',
    total_votes: 910,
    created_at: '2026-04-26T10:00:00',
  },

  {
    id: 76,
    title: "Réouverture de l’aéroport Toussaint Louverture annoncée pour mi‑mai 2026",
    title_ht: "Reouvèti ayewopò Tousen Louvèti anonse pou mitan me 2026",
    description: "Des sources proches de l'OFNAC indiquent que les travaux de modernisation de la piste et du terminal sont terminés à 95 %. La rumeur d'une réouverture imminente enfle, mais aucune date officielle n'a encore été publiée, ce qui suscite à la fois espoir et spéculations.",
    description_ht: "Sous ki tou pre OFNAC endike travay modènizasyon pis ak tèminal la fini a 95 %. Rimè reouvèti iminan an ap monte, men pa gen okenn dat ofisyèl ki pibliye ankò, sa ki lakòz tou de espwa ak espekilasyon.",
    short_description: "Travaux à 95 %, rumeur de réouverture mi-mai, pas de confirmation.",
    short_description_ht: "Travay yo a 95 %, rimè reouvèti pou mitan me, pa gen konfimasyon.",
    category: { id: 4, name: 'Infrastructure', slug: 'infrastructure' },
    claimant: "Sources proches de l'OFNAC",
    claimant_ht: 'Sous ki tou pre OFNAC',
    crowd_confidence_score: 0.57,
    ai_confidence_score: 0.52,
    status: 'unverified',
    total_votes: 531,
    created_at: '2026-04-26T17:00:00',
  },
  {
    id: 10,
    title: "Réhabilitation de 50km de routes urbaines au Cap-Haïtien",
    title_ht: "Reparasyon 50 kilomèt wout anndan vil Okap",
    category: { id: 4, name: 'Infrastructure', name_ht: 'Enfrastrikti', slug: 'infrastructure' },
    claimant: "Ministère des Travaux Publics",
    claimant_ht: "Ministè Travay Publik (MTPTC)",
    description: "Modernisation des rues du centre-ville historique et des accès périphériques pour booster le tourisme.",
    description_ht: "Reparasyon lari nan sant vil okap ak wout bò kote yo pou touris ka vizite vil la pi byen.",
    short_description_ht: "Lari Okap pral bèl anpil pou touris yo.",
    crowd_confidence_score: 0.58, ai_confidence_score: 0.62, status: 'in_progress', total_votes: 940, created_at: '2026-04-15T15:30:00'
  },
  {
    id: 12,
    title: "Exportation de Mangue Francis vers l'Europe sans intermédiaires",
    title_ht: "Voye lachanm (Mang Fransis) an Ewòp san pasman",
    category: { id: 5, name: 'Agriculture', name_ht: 'Agrikilti', slug: 'agriculture' },
    claimant: "Association des Producteurs Nationaux",
    claimant_ht: "Asosyasyon plantè ayisyen yo",
    description: "Création d'un corridor direct pour exportation certifiée, augmentant les revenus des planteurs de 40%.",
    description_ht: "Kreye yon fason pou plantè yo voye mang yo an Ewòp dirèk pou yo ka fè plis kòb.",
    short_description_ht: "Plantè mang yo pral fè 40% plis kòb.",
    crowd_confidence_score: 0.67, ai_confidence_score: 0.74, status: 'pending', total_votes: 420, created_at: '2026-04-08T11:00:00'
  },
  {
    id: 13,
    title: "Vaccination gratuite de 2 millions d'enfants contre la polio",
    title_ht: "Vaksen gratis pou 2 milyon timoun kont maladi polyo",
    category: { id: 3, name: 'Santé', name_ht: 'Sante', slug: 'sante' },
    claimant: "Ministère de la Santé Publique",
    claimant_ht: "Ministè Sante Piblik (MSPP)",
    description: "Campagne nationale de santé publique visant à couvrir 95% des zones rurales et urbaines.",
    description_ht: "Gwo kanpay vaksen nan tout peyi a pou pwoteje prèske tout timoun yo.",
    short_description_ht: "Vaksen gratis pou sove timoun yo anba polyo.",
    crowd_confidence_score: 0.79, ai_confidence_score: 0.85, status: 'in_progress', total_votes: 1100, created_at: '2026-04-10T09:00:00'
  },
  {
    id: 14,
    title: "Construction de 3 centres de dialyse dans le Grand Sud",
    title_ht: "Konstriksyon 3 sant dyaliz nan Gran Sid la",
    category: { id: 3, name: 'Santé', name_ht: 'Sante', slug: 'sante' },
    claimant: "Fondation Digicel / MSPP",
    claimant_ht: "Fondasyon Dijisèl ak MSPP",
    description: "Ouverture de centres spécialisés aux Cayes et à Jérémie pour les patients souffrant d'insuffisance rénale.",
    description_ht: "Mete sant pou moun ki gen pwoblèm ren Okay ak Jeremi pou yo pa bezwen moute Pòtoprens.",
    short_description_ht: "Moun Okay ak Jeremi pral gen sant dyaliz bò lakay yo.",
    crowd_confidence_score: 0.44, ai_confidence_score: 0.59, status: 'pending', total_votes: 850, created_at: '2026-04-12T14:30:00'
  },
  {
    id: 16,
    title: "Restructuration de l'Université d'État d'Haïti (UEH)",
    title_ht: "Refòm ak modernizasyon nan Inivèsite Leta a (UEH)",
    category: { id: 2, name: 'Éducation', name_ht: 'Edikasyon', slug: 'education' },
    claimant: "Conseil de l'Université",
    claimant_ht: "Konsèy Inivèsite a",
    description: "Modernisation des infrastructures et numérisation des inscriptions pour les 11 facultés de l'UEH.",
    description_ht: "Reparasyon bilding yo ak pèmèt elèv yo enskri sou entènèt nan inivèsite leta a.",
    short_description_ht: "Inivèsite Leta pral vin pi modèn.",
    crowd_confidence_score: 0.28, ai_confidence_score: 0.34, status: 'in_progress', total_votes: 2300, created_at: '2026-04-16T11:00:00'
  },
  {
    id: 17,
    title: "Interdiction des sachets plastiques à usage unique",
    title_ht: "Lwa pou entèdi tout sache plastik yon sèl fwa",
    category: { id: 7, name: 'Environnement', name_ht: 'Anviwònman', slug: 'environnement' },
    claimant: "Ministère de l'Environnement",
    claimant_ht: "Ministè Anviwònman",
    description: "Application stricte du décret interdisant l'importation et la vente de sachets noirs pour protéger les égouts.",
    description_ht: "Leta pral serye fwa sa a pou anpeche moun vann sache nwa ki bloke dlo lè lapli tonbe.",
    short_description_ht: "Sache nwa p ap gen dwa vann ankò.",
    crowd_confidence_score: 0.39, ai_confidence_score: 0.47, status: 'in_progress', total_votes: 1560, created_at: '2026-04-20T09:00:00'
  },
  {
    id: 18,
    title: "Reforestation de 5 millions d'arbres dans le Plateau Central",
    title_ht: "Plante 5 milyon pye bwa nan Plato Santral",
    category: { id: 7, name: 'Environnement', name_ht: 'Anviwònman', slug: 'environnement' },
    claimant: "ONG Ayiti Vèt",
    claimant_ht: "Oganizasyon Ayiti Vèt",
    description: "Projet communautaire visant à restaurer le couvert forestier et protéger les bassins versants.",
    description_ht: "Pwojè pou n remete bwa nan mòn yo pou n pwoteje sous dlo nou yo.",
    short_description_ht: "Gwo pwojè pou n replante bwa nan mòn.",
    crowd_confidence_score: 0.55, ai_confidence_score: 0.61, status: 'pending', total_votes: 780, created_at: '2026-04-21T13:00:00'
  },
  {
    id: 19,
    title: "Création d'un fonds de garantie pour les startups IA locales",
    title_ht: "Kreye yon fon pou ede jèn k ap fè biznis nan IA",
    category: { id: 6, name: 'Technologie', name_ht: 'Teknoloji', slug: 'technologie' },
    claimant: "Banque Nationale de Crédit (BNC)",
    claimant_ht: "Bank Nasyonal Kredi",
    description: "Mise à disposition de 500 millions de gourdes de crédit à taux réduit pour les entrepreneurs tech.",
    description_ht: "Leta mete 500 milyon goud prèt ak ti enterè pou ede jèn k ap travay nan teknoloji.",
    short_description_ht: "Prèt kòb ak ti enterè pou biznis teknoloji.",
    crowd_confidence_score: 0.68, ai_confidence_score: 0.75, status: 'pending', total_votes: 490, created_at: '2026-04-25T14:00:00'
  },
   {
    id: 87,
    title: "Le comité électoral provisoire sera installé avant la fin mai 2026",
    title_ht: "Komite elektoral pwovizwa a va enstale anvan fen me 2026",
    description: "Conformément à l’accord politique du 10 avril, les parties prenantes finalisent la liste des membres du CEP. La société civile insiste sur la transparence du processus. La prochaine étape : la validation par le Parlement.",
    description_ht: "Konfòmeman a akò politik 10 avril la, pati yo ap finalize lis manm CEP a. Sosyete sivil la ensiste sou transparans pwosesis la. Pwochen etap la : validasyon pa Palman an.",
    short_description: "Installation prévue du CEP, validation en cours.",
    short_description_ht: "Enstalasyon prevwa CEP, validasyon an kou.",
    category: { id: 9, name: 'Justice & Gouvernance', slug: 'justice-gouvernance' },
    claimant: 'Primature',
    claimant_ht: 'Primati',
    crowd_confidence_score: 0.54,
    ai_confidence_score: 0.66,
    status: 'in_progress',
    total_votes: 230,
    created_at: '2026-04-24T18:30:00',
  },
  {
    id: 79,
    title: "Projet de gestion des déchets solides à Cap-Haïtien",
    title_ht: "Pwojè pou ranmase fatra nan lavil Okap",
    category: { id: 7, name: 'Environnement', name_ht: 'Anviwònman', slug: 'environnement' },
    claimant: "Mairie du Cap-Haïtien / SNGRS",
    claimant_ht: "Manti Okap / SNGRS",
    description: "Installation d'un centre de tri et de transformation des déchets organiques en compost.",
    description_ht: "Mete yon izin pou triye fatra epi fè angrè ak sa ki ka dekonpoze yo.",
    short_description_ht: "Netwaye lavil Okap.",
    crowd_confidence_score: 0.78, ai_confidence_score: 0.85, status: 'pending', total_votes: 940, created_at: '2026-04-29T13:30:00'
  }
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Économie',       name_ht: 'Ekonomi',      slug: 'economie',       description: 'Marchés, prix et indicateurs financiers.',      description_ht: 'Mache, pri ak endikatè finansye yo.'        },
  { id: 2, name: 'Éducation',      name_ht: 'Edikasyon',    slug: 'education',      description: 'Réformes scolaires et infrastructures.',         description_ht: 'Refòm lekòl ak enfrastrikti edikasyon yo.'  },
  { id: 3, name: 'Santé',          name_ht: 'Sante',        slug: 'sante',          description: 'Accès aux soins et crises sanitaires.',          description_ht: 'Aksè ak swen sante ak kriz sanitè yo.'      },
  { id: 4, name: 'Infrastructure', name_ht: 'Enfrastrikti', slug: 'infrastructure', description: 'Travaux, routes et réseaux énergétiques.',        description_ht: 'Travay, wout ak rezo enèji.'                },
  { id: 5, name: 'Agriculture',    name_ht: 'Agrikilti',    slug: 'agriculture',    description: 'Production locale et sécurité alimentaire.',     description_ht: 'Pwodiksyon lokal ak sekirite alimantè.'     },
  { id: 6, name: 'Technologie',    name_ht: 'Teknoloji',    slug: 'technologie',    description: 'Innovation numérique et écosystème startup.',    description_ht: 'Inovasyon nimerik ak ekosistèm startup.'    },
  { id: 7, name: 'Environnement',  name_ht: 'Anviwònman',   slug: 'environnement',  description: 'Climat, reforestation et gestion des déchets.',  description_ht: 'Klima, rebwazman ak jesyon dechè.'          },
  { id: 8, name: 'Sécurité',       name_ht: 'Sekirite',     slug: 'securite',       description: 'Climat sécuritaire et paix sociale.',            description_ht: 'Sekirite ak lapè sosyal.'                   },
];

const MOCK_DASHBOARD = {
  personal: {
    user: {
      id: 1, username: 'admin', email: 'admin@pichai.tech',
      first_name: 'Admin', last_name: 'PichAI',
      is_verified: true, trust_score: 0.85, contribution_score: 450,
    },
    contributions: { total: 12, validated: 10, pending: 2, accuracy_rate: 83 },
    predictions  : { total: 8, accuracy: 75, active_predictions: 3 },
  },
  quick_stats: {
    total_events      : MOCK_CLAIMS.length,
    active_events     : MOCK_CLAIMS.length,
    total_participants: MOCK_CLAIMS.reduce((s, c) => s + (c.total_votes || 0), 0),
    accuracy_rate     : 74,
    resolved_events   : 0,
    avg_consensus     : 45,
    new_events_today  : 0,
    urgent_events     : 0,
  },
  ai_insights: {
    insights: [
      {
        id         : 1,
        title      : "Volatilité des prix alimentaires",
        title_ht   : "Varyasyon pri manje yo nan mache a",
        description: "Les algorithmes détectent une instabilité croissante sur les produits de base importés.",
        description_ht: "Algoritm yo wè pri pwodwi n ap enpòte yo ap monte desann san rann kont.",
        confidence : 88,
        category   : 'Économie',
        impact_level: 'high',
        sources_count: 12,
      },
      {
        id: 2,
        title: "Amélioration des corridors logistiques",
        title_ht: "Amelyorasyon nan wout komèsyal yo",
        description: "Les données de mobilité suggèrent un déblocage progressif des axes routiers vers le Sud. Cela laisse présager une reprise des échanges commerciaux et une meilleure distribution des stocks d'ici 15 jours.",
        description_ht: "Done yo montre wout ki mennen nan Sid peyi a kòmanse debloke tikras pa tikras. Sa ban nou espwa komès la pral rekòmanse epi machandiz yo pral sikile pi byen nan de senmenn.",
        confidence: 74,
        category: 'Infrastructure',
        impact_level: 'medium',
        sources_count: 9,
      },
      {
        id: 3,
        title: "Adoption des technologies FinTech",
        title_ht: "Jan moun yo ap itilize teknoloji finansye",
        description: "L'intérêt pour les systèmes de paiement numérique et la monnaie digitale atteint un sommet historique. Les utilisateurs privilégient désormais la sécurité des transactions P2P face à la rareté du cash.",
        description_ht: "Enterè moun yo pou peman ak telefòn ak lajan dijital rive nan yon nivo nou pa t janm wè anvan. Itilizatè yo prefere sekirite tranzaksyon dijital yo paske kach la vin difisil pou jwenn.",
        confidence: 91,
        category: 'Technologie',
        impact_level: 'high',
        sources_count: 15,
      },
    ],
  },
  activity: {
    recent_activity: [],
    trending_events: MOCK_CLAIMS.slice(0, 2).map(c => ({
      id: c.id, title: c.title, category: c.category.name, trend: 'stable',
    })),
  },
};

// ═══════════════════════════════════════════════════════════════
// EVENTS API
// ═══════════════════════════════════════════════════════════════
export const eventsAPI = {
  getActiveEvents: async (params = {}) => {
    const { category, limit = 24 } = params;
    const mockEvents = MOCK_CLAIMS.map(c => normalizeClaim(c));

    return handleApiCall(
      async () => {
        const res = await api.get('/api/v1/claims/list', {
          params: { page: 1, per_page: limit, category: category || undefined, lang: getLang() },
        });
        const claims = res.data?.claims || res.data || [];
        return {
          data: {
            events: Array.isArray(claims) ? claims.map(c => normalizeClaim(c)) : mockEvents,
            total : res.data?.total || claims.length,
          },
        };
      },
      { events: mockEvents, total: mockEvents.length },
      { delay: 300 }
    );
  },

  getEventById: (claimId) => {
    const mock = MOCK_CLAIMS.find(c => c.id === parseInt(claimId));
    return handleApiCall(
      () => api.get(`/api/v1/claims/${claimId}/detail`),
      { event: mock ? normalizeClaim(mock) : normalizeClaim(MOCK_CLAIMS[0]) },
      { delay: 200 }
    );
  },

  getEventScores: (claimId) =>
    handleApiCall(
      () => api.get(`/api/v1/claims/${claimId}/scores`),
      { ai_score: 55, crowd_score: 38, verif_score: 0, composite: 38, verdict: 'Douteux', verdict_color: '#B91C1C' },
      { delay: 200 }
    ),

  submitPrediction: async (claimId, data) => {
    try {
      const token = getToken();
      if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const detailRes = await api.get(`/api/v1/claims/${claimId}/detail`).catch(() => null);
      const prediction = detailRes?.data?.prediction;

      if (!prediction) {
        return { data: { success: false, message: 'Pas de prédiction active' } };
      }

      const optionMap   = { yes: 'oui', no: 'non', incertain: 'incertain' };
      const votePayload = {
        prediction_id   : prediction.id,
        selected_option : optionMap[data.vote] || data.vote || 'incertain',
        confidence_level: data.confidence_level || 0.7,
        reasoning       : data.reasoning || '',
      };

      return handleApiCall(
        () => api.post(`/api/v1/claims/${claimId}/vote`, votePayload),
        { success: true, message: 'Vote enregistré', vote_id: Date.now() },
        { delay: 300, useMock: false }
      );
    } catch (e) {
      console.warn('[Vote] Erreur:', e);
      return { data: { success: false } };
    }
  },

  searchEvents: (query, params = {}) => {
    const mockResults = MOCK_CLAIMS
      .filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(query.toLowerCase())
      )
      .map(c => normalizeClaim(c));
    return handleApiCall(
      () => api.get('/api/v1/claims/list', { params: { page: 1, per_page: params.limit || 10 } }),
      { events: mockResults },
      { delay: 300 }
    );
  },

  // Stubs de compatibilité
  getFollowedEvents   : async () => ({ data: { events: [] } }),
  getRecommendedEvents: async () => ({ data: { events: MOCK_CLAIMS.slice(0, 2).map(c => normalizeClaim(c)) } }),
  followEvent         : async () => ({ data: { success: true } }),
  unfollowEvent       : async () => ({ data: { success: true } }),
  getEventPredictions : async () => ({ data: { predictions: [] } }),
  getEventSources     : async () => ({ data: { sources: [] } }),
};

// ═══════════════════════════════════════════════════════════════
// CATEGORIES API
// ═══════════════════════════════════════════════════════════════
export const categoriesAPI = {
  getAllCategories: () =>
    handleApiCall(
      async () => {
        const lang = getLang();
        const res  = await api.get('/api/v1/categories/', { params: { include_inactive: false, lang } });
        let cats   = res?.data?.categories || res?.data || [];
        if (!Array.isArray(cats)) cats = [];
        if (cats.length === 0) return { data: { categories: MOCK_CATEGORIES } };
        return {
          data: {
            categories: cats.map(c => ({
              id            : c.id,
              name          : lang === 'ht' ? (c.name_ht || c.name) : (c.name || 'Général'),
              description   : lang === 'ht' ? (c.description_ht || c.description) : (c.description || ''),
              slug          : c.slug || `cat-${c.id}`,
              icon          : c.icon || null,
              color_hex     : c.color_hex || '#999999',
              total_claims  : c.total_claims || 0,
              avg_confidence: c.avg_confidence || 0,
              is_active     : c.is_active ?? true,
            })),
          },
        };
      },
      { categories: MOCK_CATEGORIES },
      { delay: 200 }
    ),
};

// ═══════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════
export const authAPI = {
  login: (credentials) =>
    handleApiCall(
      () => api.post('/api/v1/auth/login', credentials),
      { access_token: null, user: null },
      { useMock: false }
    ),

  register: (userData) =>
    handleApiCall(
      () => api.post('/api/v1/auth/register', userData),
      { success: true, message: 'Compte créé', user_id: Date.now() },
      { useMock: false }
    ),

  getCurrentUser: () =>
    handleApiCall(
      () => api.get('/api/v1/auth/me'),
      { user: MOCK_DASHBOARD.personal.user }
    ),

  logout: () =>
    handleApiCall(
      () => api.post('/api/v1/auth/logout'),
      { success: true }
    ),

  forgotPassword: (email) =>
    handleApiCall(
      () => api.post('/api/v1/auth/forgot-password', { email }),
      { success: true, message: 'Email envoyé' }
    ),
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD API
// ═══════════════════════════════════════════════════════════════
export const dashboardAPI = {
  getPersonalDashboard: () =>
    handleApiCall(() => api.get('/api/v1/dashboard/personal'), { dashboard: MOCK_DASHBOARD.personal }),

  getAIInsights: () =>
    handleApiCall(() => api.get('/api/v1/dashboard/ai-insights'), { insights: MOCK_DASHBOARD.ai_insights }),

  getQuickStats: () =>
    handleApiCall(() => api.get('/api/v1/dashboard/quick-stats'), { stats: MOCK_DASHBOARD.quick_stats }),

  getDashboardActivity: () =>
    handleApiCall(() => api.get('/api/v1/dashboard/activity'), { activity: MOCK_DASHBOARD.activity }),

  getCombinedDashboard: async () => {
    try {
      const [personal, insights, stats, activity] = await Promise.all([
        dashboardAPI.getPersonalDashboard(),
        dashboardAPI.getAIInsights(),
        dashboardAPI.getQuickStats(),
        dashboardAPI.getDashboardActivity(),
      ]);
      return {
        personal: personal.data?.dashboard || personal.data,
        insights: insights.data?.insights  || insights.data,
        stats   : stats.data?.stats        || stats.data,
        activity: activity.data?.activity  || activity.data,
      };
    } catch {
      return {
        personal: MOCK_DASHBOARD.personal,
        insights: MOCK_DASHBOARD.ai_insights,
        stats   : MOCK_DASHBOARD.quick_stats,
        activity: MOCK_DASHBOARD.activity,
      };
    }
  },
};

// ═══════════════════════════════════════════════════════════════
// USER API
// ═══════════════════════════════════════════════════════════════
export const userAPI = {
  getUserProfile        : ()      => handleApiCall(() => api.get('/api/v1/auth/me'), { user: MOCK_DASHBOARD.personal.user }),
  getUserContributions  : (p = {})=> handleApiCall(() => api.get('/api/v1/user/contributions', { params: p }), { contributions: MOCK_DASHBOARD.personal.contributions }),
  getNotifications      : ()      => handleApiCall(() => api.get('/api/v1/user/notifications'), { notifications: [] }),
  markNotificationsAsRead:(ids=[])=> handleApiCall(() => api.post('/api/v1/user/notifications/mark-read', { notification_ids: ids }), { success: true }),
  getLeaderboard        : (p = {})=> handleApiCall(() => api.get('/api/v1/user/leaderboard', { params: p }), { leaderboard: [] }),
  updateProfile         : (data)  => handleApiCall(() => api.put('/api/v1/user/profile', data), { success: true, user: { ...MOCK_DASHBOARD.personal.user, ...data } }),
};

// ═══════════════════════════════════════════════════════════════
// AI API
// ═══════════════════════════════════════════════════════════════
export const aiAPI = {
  analyzeEvent    : (claimId)           => api.post(`/api/v1/ai/claims/${claimId}/analyze`),
  askEventQuestion: (claimId, question) => api.post('/api/v1/ai/chat', { message: question, claim_id: claimId }),
  webSearch       : (claimId)           => api.post(`/api/v1/ai/claims/${claimId}/web-search`),
  getHealth       : ()                  => api.get('/api/v1/ai/health'),
};

// ═══════════════════════════════════════════════════════════════
// ANALYTICS API
// ═══════════════════════════════════════════════════════════════
export const analyticsAPI = {
  getTrends: (range = 'week') =>
    handleApiCall(() => api.get(`/api/v1/analytics/trends?range=${range}`), { trends: {} }),
  getStats: () =>
    handleApiCall(() => api.get('/api/v1/analytics/stats'), { stats: { overview: MOCK_DASHBOARD.quick_stats } }),
};

// ═══════════════════════════════════════════════════════════════
// ECONOMY / EDUCATION API
// ═══════════════════════════════════════════════════════════════
export const economyAPI = {
  getEconomicClaims: (p) => handleApiCall(() => api.get('/api/v1/economy/',              { params: p }), { claims: [] }),
  getEconomicStats : ()  => handleApiCall(() => api.get('/api/v1/economy/indicators/stats'),              { inflation_rate: 25.3 }),
};

export const educationAPI = {
  getEducationClaims   : (p) => handleApiCall(() => api.get('/api/v1/education/',          { params: p }), { claims: [] }),
  getEducationDashboard: ()  => handleApiCall(() => api.get('/api/v1/education/dashboard'),                { overview: {} }),
  getEducationStats    : ()  => handleApiCall(() => api.get('/api/v1/education/stats'),                    { total_claims: 0 }),
  getEducationLevels   : ()  => [
    { value: 'prescolaire', label: 'Préscolaire' },
    { value: 'primaire',    label: 'Primaire'    },
    { value: 'secondaire',  label: 'Secondaire'  },
    { value: 'superieur',   label: 'Supérieur'   },
  ],
};

// ═══════════════════════════════════════════════════════════════
// COLLECTIVE API
// ═══════════════════════════════════════════════════════════════
export const collectiveAPI = {
  getActivePredictions: () => api.get('/api/v1/collective/predictions/active').catch(() => ({ data: [] })),
  createPrediction    : (d) => api.post('/api/v1/collective/predictions/', d),
  submitPrediction    : (d) => api.post(`/api/v1/collective/predictions/${d.prediction_id}/vote`, d),
  analyzeWithAI       : (q) => api.post('/api/v1/collective/chat/analyze', q),
  getCollectiveStats  : ()  => api.get('/api/v1/collective/stats').catch(() => ({ data: {} })),
  getUserPredictions  : ()  => api.get('/api/v1/collective/user/predictions').catch(() => ({ data: [] })),
};

// ═══════════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════════
export const adminAPI = {
  getDashboard: (p = {}) =>
    handleApiCall(
      () => api.get('/api/v1/admin/dashboard', { params: p }),
      { active_users: 0, new_claims: 0, new_predictions: 0 }
    ),
};

// ═══════════════════════════════════════════════════════════════
// HAPPENING + INSIGHTS
// ═══════════════════════════════════════════════════════════════
export const fetchHappening = async () => {
  try {
    const res = await api.get('/api/v1/happening', { params: { lang: getLang(), limit: 8 } });
    return res.data;
  } catch (err) {
    if (process.env.REACT_APP_ENV === 'development') {
      console.error('[Happening]', err);
    }
    return [];
  }
};

export const fetchInsights = async () => {
  try {
    const res = await api.get('/api/v1/insights', { params: { lang: getLang(), limit: 4 } });
    return res.data;
  } catch (err) {
    if (process.env.REACT_APP_ENV === 'development') {
      console.error('[Insights]', err);
    }
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// HEALTH
// ═══════════════════════════════════════════════════════════════
export const healthAPI = {
  checkApiHealth: async () => {
    try {
      const res = await api.get('/api/health');
      return { status: 'healthy', backend: true, message: 'Backend connecté', version: res.data?.version };
    } catch (e) {
      return { status: 'unhealthy', backend: false, message: `Backend non disponible: ${e.message}` };
    }
  },
  testEndpoint: () => handleApiCall(() => api.get('/api/v1/test'), { message: 'OK' }),
};

export const checkApiHealth = healthAPI.checkApiHealth;