import React, { useState, useEffect, useMemo } from 'react';
import { 
  Link, 
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  // Icônes principales
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  CpuChipIcon,
  DocumentTextIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  // Nouveaux icônes pour les sections
  FireIcon,
  StarIcon,
  RocketLaunchIcon,
  ChartPieIcon,
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  ClockIcon as ClockSolid,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import {
  ChartBarIcon as ChartBarSolid,
  FireIcon as FireSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';

// Services API
import { 
  dashboardAPI, 
  eventsAPI, 
  userAPI, 
  analyticsAPI,
  checkApiHealth  
} from '../services/api';

// Composants
import EventCard from '../components/dashboards/EventCard';
import QuickActions from '../components/dashboards/QuickActions';
import CredibilityScore from '../components/dashboards/CredibilityScore';
import DataChart from '../components/dashboards/DataChart';
import ActivityFeed from '../components/dashboards/ActivityFeed';

// Hooks personnalisés
import { useUser } from '../hooks/useUser';
import { useNotifications } from '../hooks/useNotifications';


// Données mock pour le développement
const mockDashboardData = {
  personal: {
    total_contributions: 12,
    validated_contributions: 10,
    credibility_score: 85,
    influence_score: 75,
    accuracy_score: 80,
    ranking: 42,
    pending_contributions: 2,
    category_performance: [
      { name: 'économie', accuracy: 85 },
      { name: 'éducation', accuracy: 75 },
      { name: 'gouvernance', accuracy: 90 }
    ],
    recent_badges: [
      { name: 'Première contribution' },
      { name: 'Vérificateur actif' }
    ]
  },
  
  followedEvents: [
    {
      id: 1,
      title: 'Prix du riz importé dépasse 200 HTG/kg avant juin 2026',
      category: 'économie',
      consensus: 68,
      participants: 1245,
      trend_direction: 'up',
      status: 'active',
      days_left: 45,
      attention_flag: false,
      ia_confidence_score: 0.71,
      forecast_value: '185 HTG/kg'
    },
    {
      id: 2,
      title: 'Réouverture des écoles publiques dans la zone métropolitaine',
      category: 'éducation',
      consensus: 75,
      participants: 890,
      trend_direction: 'up',
      status: 'active',
      days_left: 30,
      attention_flag: true,
      ia_confidence_score: 0.82,
      forecast_value: '85% de réouverture'
    }
  ],
  
  recommendations: [
    {
      id: 3,
      title: 'Taux de change USD/HTG atteint 150',
      category: 'économie',
      consensus: 55,
      participants: 2100,
      forecast_value: '145 HTG'
    },
    {
      id: 4,
      title: 'Projet de route nationale 6 - Avancement des travaux',
      category: 'infrastructure',
      consensus: 60,
      participants: 1200,
      forecast_value: '65% complété'
    }
  ],
  
  contributions: [
    {
      id: 1,
      event_id: 1,
      content: 'Ajout de données sur les importations de riz de janvier 2024',
      type: 'source',
      upvotes: 10,
      downvotes: 2,
      created_at: '2024-01-15T10:30:00',
      status: 'validated'
    }
  ],
  
  trends: {
    chart_data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [
        {
          label: 'Événements actifs',
          data: [12, 15, 14, 18, 16, 20, 22],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }
      ]
    }
  },
  
  aiInsights: {
    insights: [
      {
        id: 1,
        title: 'Tendance inflation',
        description: "L'inflation devrait se maintenir autour de 25% sur les 3 prochains mois selon les données disponibles.",
        confidence: 78,
        category: 'économie'
      },
      {
        id: 2,
        title: 'Éducation en ligne',
        description: 'La participation aux cours en ligne a augmenté de 30% ce mois-ci dans la région métropolitaine.',
        confidence: 92,
        category: 'éducation'
      }
    ]
  }
};

// Variable de configuration
const USE_MOCK_DATA = true;

const DashboardPage = () => {
  // Hooks personnalisés
  const { user, isLoading: userLoading } = useUser();
  const { notifications, unreadCount } = useNotifications();
  
  // États principaux
  const [dashboardData, setDashboardData] = useState({
    personal: null,
    followedEvents: [],
    recommendations: [],
    contributions: [],
    trends: null,
    aiInsights: []
  });
  
  const [filters, setFilters] = useState({
    timeRange: 'week',
    category: 'all',
    status: 'active'
  });
  
  const [loading, setLoading] = useState({
    main: true,
    personal: true,
    events: true,
    insights: true
  });
  
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'events', 'analytics'
  
  const navigate = useNavigate();
  const location = useLocation();

  // Effet pour charger les données du dashboard
  useEffect(() => {
    const loadDashboard = async () => {
  try {
    setLoading(prev => ({ ...prev, main: true }));
    
    // Vérifier d'abord la santé de l'API
    const health = await checkApiHealth();
    console.log('Statut API:', health);
    
    if (!health.backend && !USE_MOCK_DATA) {
      setError({
        message: 'Serveur backend non disponible',
        details: 'Le serveur API ne répond pas. Vérifiez que le backend FastAPI est en cours d\'exécution.',
        suggestion: 'Veuillez démarrer le serveur backend ou activez le mode de développement avec des données mock.'
      });
      return;
    }

    // Chargement en parallèle avec gestion d'erreur individuelle
    const loadWithFallback = async (apiCall, fallbackData, key) => {
      try {
        const response = await apiCall();
        return response.data || response;
      } catch (err) {
        console.warn(`Erreur chargement ${key}:`, err);
        return fallbackData;
      }
    };

    const [
      personalData,
      eventsData,
      recommendationsData,
      contributionsData,
      trendsData,
      insightsData
    ] = await Promise.all([
      loadWithFallback(
        () => dashboardAPI.getPersonalStats(),
        mockDashboardData.personal,
        'personal'
      ),
      loadWithFallback(
        () => eventsAPI.getFollowedEvents({ limit: 6 }),
        { events: mockDashboardData.followedEvents },
        'events'
      ),
      loadWithFallback(
        () => eventsAPI.getRecommendedEvents({ limit: 4 }),
        { events: mockDashboardData.recommendations },
        'recommendations'
      ),
      loadWithFallback(
        () => userAPI.getUserContributions({ limit: 5 }),
        { contributions: mockDashboardData.contributions },
        'contributions'
      ),
      loadWithFallback(
        () => analyticsAPI.getTrends(filters.timeRange),
        mockDashboardData.trends,
        'trends'
      ),
      loadWithFallback(
        () => dashboardAPI.getAIInsights(),
        mockDashboardData.aiInsights,
        'insights'
      )
    ]);

    setDashboardData({
      personal: personalData,
      followedEvents: eventsData.events || eventsData,
      recommendations: recommendationsData.events || recommendationsData,
      contributions: contributionsData.contributions || contributionsData,
      trends: trendsData,
      aiInsights: insightsData.insights || insightsData
    });

  } catch (err) {
    console.error('Erreur critique chargement dashboard:', err);
    setError({
      message: 'Impossible de charger le tableau de bord',
      details: err.detail || err.message,
      suggestion: 'Utilisation des données de démonstration'
    });
    
    // Fallback vers les données mock en cas d'erreur totale
    setDashboardData({
      personal: mockDashboardData.personal,
      followedEvents: mockDashboardData.followedEvents,
      recommendations: mockDashboardData.recommendations,
      contributions: mockDashboardData.contributions,
      trends: mockDashboardData.trends,
      aiInsights: mockDashboardData.aiInsights.insights
    });
  } finally {
    setLoading(prev => ({ 
      ...prev, 
      main: false,
      personal: false,
      events: false,
      insights: false 
    }));
  }
};

    loadDashboard();
  }, [filters.timeRange, location.key]);

  // Gestion des filtres
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Calcul des métriques dérivées
  const derivedMetrics = useMemo(() => {
    if (!dashboardData.personal) return null;
    
    const { personal, followedEvents } = dashboardData;
    
    // Taux d'engagement
    const engagementRate = personal.total_contributions > 0 
      ? (personal.validated_contributions / personal.total_contributions) * 100 
      : 0;
    
    // Impact score
    const impactScore = Math.min(
      ((personal.influence_score || 0) + (engagementRate / 10) + (personal.credibility_score || 0)) / 3,
      100
    );
    
    // Trends detection
    const trendingUp = followedEvents.filter(event => 
      event.trend_direction === 'up'
    ).length;
    
    const trendingDown = followedEvents.filter(event => 
      event.trend_direction === 'down'
    ).length;
    
    return {
      engagementRate,
      impactScore,
      trendingUp,
      trendingDown,
      neutral: followedEvents.length - (trendingUp + trendingDown)
    };
  }, [dashboardData]);

  // Événements nécessitant attention
  const eventsNeedingAttention = useMemo(() => {
    return dashboardData.followedEvents.filter(event => {
      const hoursSinceUpdate = event.hours_since_update || 24;
      const consensusChange = event.consensus_change_24h || 0;
      
      return (
        hoursSinceUpdate > 48 || // Pas mis à jour depuis plus de 2 jours
        Math.abs(consensusChange) > 20 || // Changement de consensus significatif
        event.attention_flag // Flag spécifique
      );
    });
  }, [dashboardData.followedEvents]);

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Impossible de charger le tableau de bord
          </h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Réessayer
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium text-center"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Écran de chargement
  if (loading.main) {
    return (
      <div className="space-y-8">
        {/* Skeleton pour l'en-tête */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
        
        {/* Skeleton pour les KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        
        {/* Skeleton pour la grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ===== EN-TÊTE PRINCIPALE ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de Bord
            </h1>
            {unreadCount > 0 && (
              <span className="relative">
                <BellAlertIcon className="w-6 h-6 text-blue-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-600">
              Bon retour, <span className="font-semibold text-gray-900">{user?.name || 'Utilisateur'}</span>
            </p>
            
            {/* Score de crédibilité */}
            <CredibilityScore 
              score={dashboardData.personal?.credibility_score || 0}
              level={dashboardData.personal?.credibility_level || 'beginner'}
              showBadge={true}
            />
            
            {/* Indicateur de statut */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                user?.status === 'active' ? 'bg-green-500' : 
                user?.status === 'verified' ? 'bg-blue-500' : 
                'bg-yellow-500'
              }`}></div>
              <span className="text-gray-500 capitalize">
                {user?.status || 'standard'} • Niveau {user?.level || 1}
              </span>
            </div>
          </div>
        </div>
        
        {/* Vue rapide et actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {['overview', 'events', 'analytics'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeView === view
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view === 'overview' ? 'Vue générale' :
                 view === 'events' ? 'Événements' : 'Analyses'}
              </button>
            ))}
          </div>
          
          <QuickActions 
            userLevel={user?.level}
            hasPendingContributions={dashboardData.personal?.pending_contributions > 0}
          />
        </div>
      </div>

      {/* ===== INDICATEURS CLÉS (KPIs) ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1 : Événements suivis */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Événements suivis</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.followedEvents.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Actifs</span>
              <span className="font-semibold">
                {dashboardData.followedEvents.filter(e => e.status === 'active').length}
              </span>
            </div>
          </div>
        </div>

        {/* Carte 2 : Contributions */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Contributions</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.personal?.total_contributions || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Validées</span>
              <span className="font-semibold text-green-600">
                {dashboardData.personal?.validated_contributions || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Carte 3 : Taux d'engagement */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Engagement</p>
              <p className="text-3xl font-bold text-gray-900">
                {derivedMetrics?.engagementRate ? `${derivedMetrics.engagementRate.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Influence</span>
              <span className="font-semibold">
                {dashboardData.personal?.influence_score || 0}/100
              </span>
            </div>
          </div>
        </div>

        {/* Carte 4 : Précision */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Précision moyenne</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.personal?.accuracy_score ? `${dashboardData.personal.accuracy_score}%` : 'N/A'}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckBadgeIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Classement</span>
              <span className="font-semibold">
                #{dashboardData.personal?.ranking || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION PRINCIPALE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : Événements suivis */}
        <div className="lg:col-span-2 space-y-6">
          {/* En-tête avec filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-500" />
                Événements que vous suivez
              </h2>
              <p className="text-gray-600 text-sm">
                {eventsNeedingAttention.length > 0 && (
                  <span className="text-orange-600 font-medium">
                    {eventsNeedingAttention.length} nécessitent votre attention •
                  </span>
                )} Dernière mise à jour: aujourd'hui
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-gray-100 text-gray-700 text-sm rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="resolved">Résolus</option>
                <option value="trending">Tendances</option>
              </select>
              
              <select
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="bg-gray-100 text-gray-700 text-sm rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </select>
            </div>
          </div>

          {/* Liste des événements */}
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.followedEvents.length > 0 ? (
              dashboardData.followedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  compact={true}
                  showUserPrediction={true}
                  showActions={true}
                  className={`${
                    eventsNeedingAttention.some(e => e.id === event.id)
                      ? 'border-l-4 border-l-orange-500'
                      : ''
                  }`}
                />
              ))
            ) : (
              <div className="col-span-2 bg-gray-50 rounded-xl p-8 text-center">
                <EyeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vous ne suivez aucun événement
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Commencez à suivre des événements pour voir leurs évolutions ici
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  Explorer les événements
                </Link>
              </div>
            )}
          </div>

          {/* Graphiques de tendances */}
          {dashboardData.trends && (
            <div className="card mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5" />
                  Tendances de vos événements
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">En hausse: {derivedMetrics?.trendingUp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">En baisse: {derivedMetrics?.trendingDown}</span>
                  </div>
                </div>
              </div>
              
              <DataChart
                type="line"
                data={dashboardData.trends.chart_data}
                height={200}
                options={{
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      intersect: false
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Colonne droite : Sidebar d'activités */}
        <div className="space-y-6">
          {/* Section IA Insights */}
          {dashboardData.aiInsights.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CpuChipIcon className="w-5 h-5 text-purple-600" />
                  Insights IA
                </h3>
                <InformationCircleIcon className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {dashboardData.aiInsights.slice(0, 3).map((insight, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-start gap-3">
                      <LightBulbIcon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 font-medium mb-1">
                          {insight.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {insight.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-purple-600 font-medium">
                            {insight.confidence}% de confiance
                          </span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            Explorer →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-center text-sm text-blue-600 hover:text-blue-800 font-medium border-t border-gray-100 pt-3">
                Voir tous les insights
              </button>
            </div>
          )}

          {/* Section Recommandations */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                Recommandations pour vous
              </h3>
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {dashboardData.recommendations.length > 0 ? (
                dashboardData.recommendations.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            event.category === 'économie' ? 'bg-green-100 text-green-800' :
                            event.category === 'éducation' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {event.participants} participants
                          </span>
                        </div>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        Consensus: <span className="font-semibold">{event.consensus}%</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Logique pour suivre l'événement
                        }}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Suivre
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    Plus de recommandations après plus d'activité
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Contributions récentes */}
          <ActivityFeed 
            contributions={dashboardData.contributions}
            isLoading={loading.personal}
          />

          {/* Section Statut utilisateur */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <UserCircleIcon className="w-8 h-8 text-gray-600" />
              <div>
                <h3 className="font-bold text-gray-900">Votre progression</h3>
                <p className="text-sm text-gray-600">
                  Niveau {user?.level || 1} • {user?.xp || 0} XP
                </p>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Prochain niveau</span>
                <span className="font-semibold">
                  {1000 - (user?.xp || 0)} XP requis
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
                ></div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-2">Badges récents</p>
              <div className="flex gap-2">
                {dashboardData.personal?.recent_badges?.map((badge, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                    title={badge.name}
                  >
                    <span className="text-xs font-bold">🏆</span>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">
                    Gagnez des badges en contribuant
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION INFÉRIEURE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics détaillées */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ChartPieIcon className="w-5 h-5" />
            Analytics détaillées
          </h3>
          
          <div className="space-y-6">
            {/* Performance par catégorie */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Performance par catégorie</h4>
              <div className="space-y-2">
                {dashboardData.personal?.category_performance?.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm capitalize">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${cat.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10 text-right">
                        {cat.accuracy}%
                      </span>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Données insuffisantes pour l'analyse
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides et statistiques */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/submit"
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center"
              >
                <PlusIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Soumettre</p>
              </Link>
              
              <Link
                to="/collective"
                className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition text-center"
              >
                <UserGroupIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Intelligence Collective</p>
              </Link>
              
              <Link
                to="/predictions"
                className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center"
              >
                <RocketLaunchIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Prédictions</p>
              </Link>
              
              <Link
                to="/analytics"
                className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition text-center"
              >
                <ChartBarSolid className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Analyses</p>
              </Link>
            </div>
          </div>

          {/* Alertes importantes */}
          {eventsNeedingAttention.length > 0 && (
            <div className="card border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <BellAlertIcon className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Nécessite votre attention
                </h3>
              </div>
              
              <div className="space-y-3">
                {eventsNeedingAttention.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {event.title}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-700">
                        {event.attention_reason}
                      </span>
                      <Link
                        to={`/event/${event.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Vérifier
                      </Link>
                    </div>
                  </div>
                ))}
                
                {eventsNeedingAttention.length > 2 && (
                  <Link
                    to="/alerts"
                    className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium pt-3 border-t border-orange-100"
                  >
                    Voir les {eventsNeedingAttention.length - 2} autres alertes
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== PIED DE PAGE DU DASHBOARD ===== */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>• Données mises à jour il y a moins de 5 minutes</span>
            <span>• Serveur: <span className="text-green-600">● En ligne</span></span>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-gray-700">
              Confidentialité
            </Link>
            <Link to="/help" className="hover:text-gray-700">
              Aide
            </Link>
            <Link to="/feedback" className="hover:text-gray-700">
              Donner mon avis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant PlusIcon manquant
const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 4v16m8-8H4" 
    />
  </svg>
);

export default DashboardPage;