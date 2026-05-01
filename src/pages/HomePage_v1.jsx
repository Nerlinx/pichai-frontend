import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuChipIcon,
  BellAlertIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  WifiIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

// Mock data pour les événements haïtiens
const haitiEvents = [
  {
    id: 1,
    title: "Prix du riz importé dépasse 200 HTG/kg avant juin 2026 ?",
    category: "économie",
    description: "Suivi de l'évolution du prix du riz sur le marché haïtien",
    currentConsensus: 68,
    iaConfidence: 0.71,
    participants: 1245,
    status: "active",
    trend: "up",
    daysLeft: 45,
    sources: [
      { name: "IHSI", type: "officiel" },
      { name: "Ministère du Commerce", type: "gouvernement" }
    ],
    impactScore: 85,
    lastUpdate: "Il y a 2 heures",
    forecastValue: "185 HTG/kg actuellement",
    userPrediction: null
  },
  {
    id: 2,
    title: "Taux de pénétration d'internet atteint 45% en Haïti d'ici fin 2026 ?",
    category: "technologie",
    description: "Analyse des infrastructures et adoption numérique",
    currentConsensus: 42,
    iaConfidence: 0.65,
    participants: 890,
    status: "active",
    trend: "up",
    daysLeft: 90,
    sources: [
      { name: "CONATEL", type: "régulateur" },
      { name: "Banque Mondiale", type: "international" }
    ],
    impactScore: 72,
    lastUpdate: "Il y a 1 jour",
    forecastValue: "38% actuellement",
    userPrediction: null
  },
  {
    id: 3,
    title: "Programme de cantines scolaires atteint 500,000 élèves en 2025 ?",
    category: "éducation",
    description: "Suivi de la mise en œuvre du programme alimentaire scolaire",
    currentConsensus: 75,
    iaConfidence: 0.82,
    participants: 2100,
    status: "active",
    trend: "up",
    daysLeft: 60,
    sources: [
      { name: "MENFP", type: "gouvernement" },
      { name: "PAM", type: "international" }
    ],
    impactScore: 88,
    lastUpdate: "Il y a 3 heures",
    forecastValue: "425,000 élèves couverts",
    userPrediction: null
  },
  {
    id: 4,
    title: "Route nationale #6 - Section Gonaïves terminée avant décembre 2025 ?",
    category: "infrastructure",
    description: "Avancement des travaux sur les infrastructures routières",
    currentConsensus: 55,
    iaConfidence: 0.58,
    participants: 1678,
    status: "active",
    trend: "neutral",
    daysLeft: 75,
    sources: [
      { name: "MTPTC", type: "gouvernement" },
      { name: "Rapport d'avancement", type: "document" }
    ],
    impactScore: 79,
    lastUpdate: "Il y a 5 heures",
    forecastValue: "65% complété",
    userPrediction: null
  },
  {
    id: 5,
    title: "Production électrique dépasse 500 MW en heures de pointe en 2025 ?",
    category: "énergie",
    description: "Capacité de production et distribution d'électricité",
    currentConsensus: 35,
    iaConfidence: 0.45,
    participants: 1345,
    status: "active",
    trend: "down",
    daysLeft: 120,
    sources: [
      { name: "EDH", type: "entreprise" },
      { name: "CNE", type: "régulateur" }
    ],
    impactScore: 91,
    lastUpdate: "Il y a 2 jours",
    forecastValue: "320 MW actuellement",
    userPrediction: null
  },
  {
    id: 6,
    title: "Taux de vaccination infantile dépasse 60% en Haïti d'ici fin 2025 ?",
    category: "santé",
    description: "Campagnes de vaccination et couverture sanitaire",
    currentConsensus: 48,
    iaConfidence: 0.62,
    participants: 980,
    status: "active",
    trend: "up",
    daysLeft: 100,
    sources: [
      { name: "MSPP", type: "gouvernement" },
      { name: "OMS", type: "international" }
    ],
    impactScore: 84,
    lastUpdate: "Il y a 6 heures",
    forecastValue: "45% actuellement",
    userPrediction: null
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(haitiEvents);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userInput, setUserInput] = useState({});
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('consensus');

  const categories = [
    { id: 'all', label: 'Tous', icon: GlobeAltIcon, count: haitiEvents.length },
    { id: 'économie', label: 'Économie', icon: CurrencyDollarIcon, count: haitiEvents.filter(e => e.category === 'économie').length },
    { id: 'éducation', label: 'Éducation', icon: AcademicCapIcon, count: haitiEvents.filter(e => e.category === 'éducation').length },
    { id: 'infrastructure', label: 'Infrastructure', icon: BuildingLibraryIcon, count: haitiEvents.filter(e => e.category === 'infrastructure').length },
    { id: 'santé', label: 'Santé', icon: UsersIcon, count: haitiEvents.filter(e => e.category === 'santé').length },
    { id: 'technologie', label: 'Technologie', icon: WifiIcon, count: haitiEvents.filter(e => e.category === 'technologie').length },
    { id: 'énergie', label: 'Énergie', icon: HomeIcon, count: haitiEvents.filter(e => e.category === 'énergie').length }
  ];

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.category === filter;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'consensus': return b.currentConsensus - a.currentConsensus;
      case 'participants': return b.participants - a.participants;
      case 'impact': return b.impactScore - a.impactScore;
      default: return 0;
    }
  });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowAnalysisModal(true);
  };

  const handleSubmitOpinion = (eventId, opinion) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          userPrediction: opinion,
          participants: event.participants + 1
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    alert("Merci pour votre contribution ! Votre avis a été enregistré.");
  };

  const handleIAAnalysis = (event) => {
    navigate(`/ai-analysis/${event.id}`);
  };

  const getConsensusColor = (percentage) => {
    if (percentage >= 70) return 'text-green-600 bg-green-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />;
    if (trend === 'down') return <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />;
    return <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />;
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConsensusColor(event.currentConsensus)}`}>
              {event.category.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">{event.lastUpdate}</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
        </div>
        
        <button 
          onClick={() => handleEventClick(event)}
          className="text-gray-400 hover:text-gray-600"
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Barre de consensus */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Consensus collectif</span>
            <span className="font-bold text-gray-900">{event.currentConsensus}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                event.currentConsensus >= 70 ? 'bg-green-500' :
                event.currentConsensus >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${event.currentConsensus}%` }}
            />
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CpuChipIcon className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600">IA</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {(event.iaConfidence * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <UserGroupIcon className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">Participants</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {event.participants.toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <ShieldCheckIcon className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-600">Impact</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {event.impactScore}/100
            </div>
          </div>
        </div>

        {/* Prévision actuelle */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600 mb-1">Prévision actuelle</div>
          <div className="font-medium text-gray-900">{event.forecastValue}</div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleEventClick(event)}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            Analyser
          </button>
          
          <button
            onClick={() => handleIAAnalysis(event)}
            className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            <CpuChipIcon className="w-4 h-4" />
            IA
          </button>
        </div>

        {/* Tendance et délai */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            {getTrendIcon(event.trend)}
            <span className="text-gray-600">
              {event.trend === 'up' ? 'En hausse' : 
               event.trend === 'down' ? 'En baisse' : 'Stable'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{event.daysLeft} jours restants</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FireIcon className="w-4 h-4" />
            Focus sur les enjeux haïtiens
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">Comprendre.</span>
            <span className="block text-blue-600">Anticiper.</span>
            <span className="block">Agir.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Plateforme d'intelligence collective pour analyser et anticiper 
            les événements nationaux en Haïti. Basé sur des données, pas des opinions.
          </p>

          {/* Recherche */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement ou une thématique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-sm text-gray-600">Événements actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">8,238</div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">68%</div>
              <div className="text-sm text-gray-600">Consensus moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">124</div>
              <div className="text-sm text-gray-600">Analyses IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres et tri */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                    filter === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="consensus">Consensus</option>
              <option value="participants">Participants</option>
              <option value="impact">Impact</option>
            </select>
          </div>
        </div>

        {/* Grille d'événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </section>


      {/* Modal d'analyse d'événement */}
      {showAnalysisModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConsensusColor(selectedEvent.currentConsensus)}`}>
                      {selectedEvent.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedEvent.participants.toLocaleString()} participants
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-sm text-blue-600 mb-1">Consensus actuel</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedEvent.currentConsensus}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Basé sur les contributions
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-green-600 mb-1">Confiance IA</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {(selectedEvent.iaConfidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Score de fiabilité
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-bold text-gray-900 mb-3">Contexte</h3>
                  <p className="text-gray-700 mb-4">
                    {selectedEvent.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.sources.map((source, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {source.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Zone d'interaction */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Donnez votre avis</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleSubmitOpinion(selectedEvent.id, 'oui')}
                    className="py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Probable (Oui)
                  </button>
                  <button
                    onClick={() => handleSubmitOpinion(selectedEvent.id, 'non')}
                    className="py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium flex items-center justify-center gap-2"
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                    Peu probable (Non)
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleIAAnalysis(selectedEvent)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2"
                  >
                    <CpuChipIcon className="w-5 h-5" />
                    Analyser avec l'IA
                  </button>
                  <button
                    onClick={() => navigate(`/event/${selectedEvent.id}`)}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium flex items-center justify-center gap-2"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    Voir analyse détaillée
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default HomePage;


// ----------------------------------------------

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  FireIcon
} from '@heroicons/react/24/outline';

// Événements d'actualité haïtiens - élégants et informatifs
const haitiCurrentEvents = [
  {
    id: 1,
    title: "Départ du Conseil Présidentiel avant le 7 février 2024",
    category: "politique",
    description: "Transition politique et calendrier constitutionnel",
    currentConsensus: 42,
    userPrediction: null,
    participants: 3150,
    daysLeft: 18,
    trend: "down",
    iaConfidence: 0.68,
    impactScore: 92,
    sources: ["Conseil Présidentiel", "Constitution"],
    lastUpdate: "Il y a 4h",
    forecastValue: "Probabilité moyenne",
    status: "urgent"
  },
  {
    id: 2,
    title: "Prix du gallon d'essence dépasse 900 HTG en février",
    category: "économie",
    description: "Évolution des prix des carburants et impact inflationniste",
    currentConsensus: 78,
    userPrediction: null,
    participants: 4280,
    daysLeft: 45,
    trend: "up",
    iaConfidence: 0.82,
    impactScore: 95,
    sources: ["Ministère du Commerce", "Distributeurs"],
    lastUpdate: "Il y a 6h",
    forecastValue: "850 HTG actuellement",
    status: "active"
  },
  {
    id: 3,
    title: "Manifestations majeures dans la zone métropolitaine cette semaine",
    category: "société",
    description: "Mobilisation sociale et mouvements de protestation",
    currentConsensus: 65,
    userPrediction: null,
    participants: 2890,
    daysLeft: 7,
    trend: "up",
    iaConfidence: 0.71,
    impactScore: 88,
    sources: ["Observatoires sociaux", "Médias locaux"],
    lastUpdate: "Il y a 2h",
    forecastValue: "Probabilité élevée",
    status: "active"
  },
  {
    id: 4,
    title: "Popularité du gouvernement en dessous de 15% selon sondage",
    category: "politique",
    description: "Mesure de l'approbation publique et confiance institutionnelle",
    currentConsensus: 85,
    userPrediction: null,
    participants: 1920,
    daysLeft: 30,
    trend: "down",
    iaConfidence: 0.89,
    impactScore: 84,
    sources: ["Instituts de sondage", "Sondages indépendants"],
    lastUpdate: "Il y a 1 jour",
    forecastValue: "18% dernière mesure",
    status: "active"
  },
  {
    id: 5,
    title: "Élections partielles organisées avant juin 2024",
    category: "politique",
    description: "Calendrier électoral et processus démocratique",
    currentConsensus: 38,
    userPrediction: null,
    participants: 2450,
    daysLeft: 120,
    trend: "neutral",
    iaConfidence: 0.62,
    impactScore: 91,
    sources: ["CEP", "Ministère de l'Intérieur"],
    lastUpdate: "Il y a 3 jours",
    forecastValue: "Incertain",
    status: "active"
  },
  {
    id: 6,
    title: "Taux de change HTG/USD dépasse 150 avant fin mars",
    category: "économie",
    description: "Stabilité monétaire et pression sur la gourde",
    currentConsensus: 72,
    userPrediction: null,
    participants: 3670,
    daysLeft: 75,
    trend: "up",
    iaConfidence: 0.77,
    impactScore: 93,
    sources: ["Banque de la République", "Marché parallèle"],
    lastUpdate: "Il y a 8h",
    forecastValue: "145 HTG actuellement",
    status: "active"
  },
  {
    id: 7,
    title: "Réouverture des écoles publiques dans 80% des communes",
    category: "éducation",
    description: "Accès à l'éducation et sécurité dans les zones urbaines",
    currentConsensus: 45,
    userPrediction: null,
    participants: 1780,
    daysLeft: 60,
    trend: "up",
    iaConfidence: 0.58,
    impactScore: 86,
    sources: ["MENFP", "Rapports de terrain"],
    lastUpdate: "Il y a 2 jours",
    forecastValue: "65% actuellement",
    status: "active"
  },
  {
    id: 8,
    title: "Accord avec le FMI conclu avant la fin du trimestre",
    category: "économie",
    description: "Négociations économiques et soutien international",
    currentConsensus: 58,
    userPrediction: null,
    participants: 2310,
    daysLeft: 90,
    trend: "up",
    iaConfidence: 0.65,
    impactScore: 94,
    sources: ["Ministère des Finances", "FMI"],
    lastUpdate: "Il y a 5h",
    forecastValue: "Négociations en cours",
    status: "active"
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(haitiCurrentEvents);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('consensus');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState({});

  const categories = [
    { id: 'all', label: 'Tous les événements', color: 'gray', count: events.length },
    { id: 'politique', label: 'Politique', color: 'blue', count: events.filter(e => e.category === 'politique').length },
    { id: 'économie', label: 'Économie', color: 'green', count: events.filter(e => e.category === 'économie').length },
    { id: 'société', label: 'Société', color: 'purple', count: events.filter(e => e.category === 'société').length },
    { id: 'éducation', label: 'Éducation', color: 'orange', count: events.filter(e => e.category === 'éducation').length }
  ];

  const handleVote = (eventId, vote) => {
    setUserVotes(prev => ({ ...prev, [eventId]: vote }));
    
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const newConsensus = vote === 'yes' 
          ? Math.min(event.currentConsensus + 5, 95)
          : Math.max(event.currentConsensus - 5, 5);
        
        return {
          ...event,
          currentConsensus: newConsensus,
          participants: event.participants + 1,
          userPrediction: vote
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  const handleIAAnalysis = (eventId) => {
    navigate(`/ai-analysis/${eventId}`);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const filteredEvents = events
    .filter(event => {
      if (filter !== 'all' && event.category !== filter) return false;
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'consensus': return b.currentConsensus - a.currentConsensus;
        case 'participants': return b.participants - a.participants;
        case 'urgency': 
          const urgencyA = a.status === 'urgent' ? 2 : a.status === 'active' ? 1 : 0;
          const urgencyB = b.status === 'urgent' ? 2 : b.status === 'active' ? 1 : 0;
          return urgencyB - urgencyA;
        default: return 0;
      }
    });

  const getCategoryColor = (category) => {
    const colorMap = {
      politique: 'bg-blue-100 text-blue-800 border-blue-200',
      économie: 'bg-green-100 text-green-800 border-green-200',
      société: 'bg-purple-100 text-purple-800 border-purple-200',
      éducation: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getConsensusColor = (percentage) => {
    if (percentage >= 70) return 'text-green-700';
    if (percentage >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const EventCard = ({ event }) => {
    const userVote = userVotes[event.id];
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
        <div className="p-5">
          {/* En-tête avec catégorie et statut */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                {event.category.toUpperCase()}
              </span>
              {event.status === 'urgent' && (
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200 flex items-center gap-1">
                  <FireIcon className="w-3 h-3" />
                  Urgent
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{event.lastUpdate}</span>
          </div>

          {/* Titre et description */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {event.description}
          </p>

          {/* Barre de consensus */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Consensus collectif</span>
              <span className={`font-semibold ${getConsensusColor(event.currentConsensus)}`}>
                {event.currentConsensus}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  event.currentConsensus >= 70 ? 'bg-green-500' :
                  event.currentConsensus >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${event.currentConsensus}%` }}
              />
            </div>
          </div>

          {/* Métriques rapides */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Participants</div>
              <div className="text-sm font-semibold text-gray-900">
                {event.participants.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Confiance IA</div>
              <div className="text-sm font-semibold text-gray-900">
                {(event.iaConfidence * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Jours restants</div>
              <div className="text-sm font-semibold text-gray-900">
                {event.daysLeft}
              </div>
            </div>
          </div>

          {/* Prévision actuelle */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Prévision actuelle</div>
            <div className="text-sm font-medium text-gray-900">{event.forecastValue}</div>
          </div>

          {/* Boutons d'interaction */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleVote(event.id, 'yes')}
                className={`flex items-center justify-center gap-1 py-2 text-sm rounded-lg transition ${
                  userVote === 'yes'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <CheckCircleIcon className="w-4 h-4" />
                <span>Probable</span>
              </button>
              <button
                onClick={() => handleVote(event.id, 'no')}
                className={`flex items-center justify-center gap-1 py-2 text-sm rounded-lg transition ${
                  userVote === 'no'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <XCircleIcon className="w-4 h-4" />
                <span>Improbable</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleIAAnalysis(event.id)}
                className="flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm rounded-lg border border-blue-200 transition"
              >
                <CpuChipIcon className="w-4 h-4" />
                <span>Analyse IA</span>
              </button>
              <button
                onClick={() => handleViewDetails(event.id)}
                className="flex items-center justify-center gap-1 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm rounded-lg transition"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Détails</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header sobre */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">EXPAND</h1>
                <p className="text-xs text-gray-500">Intelligence Collective Haïtienne</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Accueil</Link>
              <Link to="/methodologie" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Méthodologie</Link>
              <Link to="/analyses" className="text-gray-700 hover:text-gray-900 text-sm font-medium">Analyses</Link>
              <Link to="/a-propos" className="text-gray-700 hover:text-gray-900 text-sm font-medium">À propos</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/connexion')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                Connexion
              </button>
              <button 
                onClick={() => navigate('/inscription')}
                className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded text-sm font-medium transition"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section sobre */}
      <section className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Comprendre l'actualité haïtienne
              <br />
              <span className="font-semibold">par l'intelligence collective</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Analysez les événements politiques, économiques et sociaux avec la communauté.
              Contribuez à une vision plus claire de l'avenir d'Haïti.
            </p>

            {/* Barre de recherche */}
            <div className="relative max-w-xl">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement, une thématique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Filtres et contrôles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
                <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span>Trier par :</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="consensus">Consensus</option>
              <option value="participants">Participants</option>
              <option value="urgency">Urgence</option>
            </select>
          </div>
        </div>

        {/* Grille d'événements - 4 cartes par ligne sur desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun événement correspondant
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        )}

        {/* Statistiques résumées */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {events.length}
              </div>
              <div className="text-sm text-gray-600">Événements actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {events.reduce((sum, event) => sum + event.participants, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Participants totaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {Math.round(events.reduce((sum, event) => sum + event.currentConsensus, 0) / events.length)}%
              </div>
              <div className="text-sm text-gray-600">Consensus moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {events.filter(e => e.status === 'urgent').length}
              </div>
              <div className="text-sm text-gray-600">Urgences suivies</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer sobre */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-900 rounded"></div>
                <span className="font-semibold text-gray-900">EXPAND</span>
              </div>
              <p className="text-sm text-gray-600">
                Plateforme d'intelligence collective pour l'analyse des enjeux haïtiens.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Plateforme</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/explorer" className="hover:text-gray-900">Explorer</Link></li>
                <li><Link to="/categories" className="hover:text-gray-900">Catégories</Link></li>
                <li><Link to="/methodologie" className="hover:text-gray-900">Méthodologie</Link></li>
                <li><Link to="/transparence" className="hover:text-gray-900">Transparence</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Ressources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/faq" className="hover:text-gray-900">FAQ</Link></li>
                <li><Link to="/blog" className="hover:text-gray-900">Blog d'analyse</Link></li>
                <li><Link to="/donnees" className="hover:text-gray-900">Sources de données</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/contact" className="hover:text-gray-900">Nous contacter</Link></li>
                <li><Link to="/partenariats" className="hover:text-gray-900">Partenariats</Link></li>
                <li><Link to="/presse" className="hover:text-gray-900">Espace presse</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 EXPAND. Données et analyses pour Haïti.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;