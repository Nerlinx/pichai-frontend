import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowTrendingUpIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { economyAPI, educationAPI, analyticsAPI } from '../services/api';
import QuickStats from '../components/dashboards/QuickStats';
import RecentClaims from '../components/dashboards/RecentClaims';
import CategoryOverview from '../components/dashboards/CategoryOverview';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    economy: null,
    education: null,
    combined: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [economyStats, educationStats, combinedData] = await Promise.all([
          economyAPI.getEconomicStats(),
          educationAPI.getEducationDashboard(),
          analyticsAPI.getCombinedDashboard()
        ]);

        setDashboardData({
          economy: economyStats,
          education: educationStats,
          combined: combinedData
        });
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        setError('Impossible de charger les données du dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Chargement du dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="page-header">
        <h1 className="page-title">Tableau de Bord Expand</h1>
        <p className="page-subtitle">
          Suivi en temps réel des engagements et analyses de confiance à travers tous les secteurs
        </p>
      </div>

      {/* Statistiques rapides */}
      <QuickStats data={dashboardData.combined} />

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vue d'ensemble économie */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              Indicateurs Économiques
            </h2>
            <Link 
              to="/economy" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              Voir détails <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          
          {dashboardData.economy && (
            <div className="space-y-4">
              {Object.entries(dashboardData.economy).slice(0, 5).map(([indicator, data]) => (
                <div key={indicator} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium capitalize">
                      {indicator.replace('_', ' ')}
                    </span>
                    <div className="text-sm text-gray-500">
                      {data.total_claims} engagements
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      data.avg_credibility > 0.7 ? 'text-green-600' :
                      data.avg_credibility > 0.4 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {data.avg_credibility ? `${(data.avg_credibility * 100).toFixed(0)}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Crédibilité
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vue d'ensemble éducation */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              Aperçu Éducation
            </h2>
            <Link 
              to="/education" 
              className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
            >
              Voir détails <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          
          {dashboardData.education?.overview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    {dashboardData.education.overview.total_claims}
                  </div>
                  <div className="text-sm text-purple-600">Engagements</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {(dashboardData.education.overview.total_beneficiaries / 1000).toFixed(1)}k
                  </div>
                  <div className="text-sm text-green-600">Bénéficiaires</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Par niveau:</h4>
                <div className="space-y-2">
                  {Object.entries(dashboardData.education.by_level || {}).map(([level, stats]) => (
                    <div key={level} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${stats.avg_completion}%` }}
                          />
                        </div>
                        <span className="font-medium">{stats.avg_completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagements récents */}
        <RecentClaims />
        
        {/* Vue par catégorie */}
        <CategoryOverview data={dashboardData.combined} />
        
        {/* Actions rapides */}
        <div className="card">
          <h2 className="card-title">
            <ChartBarIcon className="w-5 h-5" />
            Actions Rapides
          </h2>
          <div className="space-y-3">
            <Link 
              to="/submit" 
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Soumettre un engagement</span>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-blue-600" />
            </Link>
            
            <Link 
              to="/analytics" 
              className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">Voir les analyses</span>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-purple-600" />
            </Link>

            <Link 
              to="/collective-intelligence" 
              className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">Prédictions en Cours</span>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-green-600" />
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant PlusIcon pour compléter
const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default DashboardPage;