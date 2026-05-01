import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import ActivityChart from '../../components/admin/ActivityChart';
import RecentActivity from '../../components/admin/RecentActivity';
import QuickActions from '../../components/admin/QuickActions';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboard({ period: timeRange });
      setDashboardData(data);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Utilisateurs Actifs',
      value: dashboardData?.active_users || 0,
      change: '+12%',
      icon: UsersIcon,
      color: 'bg-blue-500',
      description: 'Utilisateurs actifs cette période'
    },
    {
      title: 'Engagements Nouveaux',
      value: dashboardData?.new_claims || 0,
      change: '+8%',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      description: 'Nouveaux engagements soumis'
    },
    {
      title: 'En Attente',
      value: dashboardData?.claims_by_status?.pending || 0,
      change: dashboardData?.claims_by_status?.pending > 10 ? '+5' : '-2',
      icon: ClockIcon,
      color: 'bg-yellow-500',
      description: 'Engagements en attente de modération'
    },
    {
      title: 'Prédictions',
      value: dashboardData?.new_predictions || 0,
      change: '+23%',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      description: 'Nouvelles prédictions utilisateurs'
    }
  ];

  const quickActions = [
    {
      title: 'Modérer les engagements',
      description: '45 engagements en attente de modération',
      icon: DocumentTextIcon,
      action: '/admin/claims?status=pending',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: 'Analyser l\'activité',
      description: 'Voir les tendances récentes',
      icon: ChartBarIcon,
      action: '/admin/analytics',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Vérifier les utilisateurs',
      description: '12 nouveaux utilisateurs à vérifier',
      icon: UsersIcon,
      action: '/admin/users?status=pending',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Paramètres système',
      description: 'Configurer les préférences',
      icon: ClockIcon,
      action: '/admin/settings',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de la plateforme et de son activité
        </p>
      </div>

      {/* Filtres de période */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeRange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                timeRange === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'day' ? 'Aujourd\'hui' : 
               period === 'week' ? 'Cette semaine' :
               period === 'month' ? 'Ce mois' : 'Cette année'}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-500">
          Dernière mise à jour: Il y a 5 minutes
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique d'activité */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Activité Récente</h2>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Utilisateurs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Engagements</span>
                </div>
              </div>
            </div>
            <ActivityChart data={dashboardData?.activity_over_time || []} />
          </div>
        </div>

        {/* Actions rapides */}
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </div>

      {/* Activité récente et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Activité Récente</h2>
          <RecentActivity />
        </div>

        {/* Alertes système */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Alertes Système</h2>
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Stockage presque plein</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>85% du stockage utilisé. Pensez à nettoyer les logs anciens.</p>
                </div>
                <div className="mt-3">
                  <button className="text-sm font-medium text-yellow-800 hover:text-yellow-900">
                    Voir les détails →
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Sauvegarde programmée</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Prochaine sauvegarde automatique dans 2 heures.</p>
                </div>
              </div>
            </div>

            <div className="flex items-start p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Performance optimale</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Temps de réponse API moyen: 120ms ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé des états */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé par Statut</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {dashboardData?.claims_by_status?.approved || 0}
            </div>
            <div className="text-sm text-gray-600">Engagements Approuvés</div>
            <div className="mt-2 text-xs text-green-600">
              <ArrowTrendingUpIcon className="inline h-4 w-4 mr-1" />
              +12% depuis la semaine dernière
            </div>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">
              {dashboardData?.claims_by_status?.pending || 0}
            </div>
            <div className="text-sm text-gray-600">En Attente de Modération</div>
            <div className="mt-2 text-xs text-yellow-600">
              <ArrowTrendingUpIcon className="inline h-4 w-4 mr-1" />
              +5 depuis hier
            </div>
          </div>
          
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="text-3xl font-bold text-red-600">
              {dashboardData?.claims_by_status?.rejected || 0}
            </div>
            <div className="text-sm text-gray-600">Engagements Rejetés</div>
            <div className="mt-2 text-xs text-red-600">
              <ArrowTrendingDownIcon className="inline h-4 w-4 mr-1" />
              -3% depuis la semaine dernière
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;