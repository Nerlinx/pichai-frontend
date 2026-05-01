import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  BookOpenIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { educationAPI } from '../services/api';
import EducationDashboard from '../components/dashboards/EducationDashboard';
import EducationStats from '../components/education/EducationStats';
import SchoolList from '../components/education/SchoolList';
import ProgramGrid from '../components/education/ProgramGrid';

const EducationPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    level: 'all',
    status: 'all',
    department: 'all'
  });

  useEffect(() => {
    const loadEducationData = async () => {
      try {
        setLoading(true);
        const data = await educationAPI.getEducationDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur chargement données éducation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducationData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
    { id: 'schools', label: 'Établissements', icon: BuildingLibraryIcon },
    { id: 'programs', label: 'Programmes', icon: BookOpenIcon },
    { id: 'stats', label: 'Statistiques', icon: ArrowTrendingUpIcon }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <AcademicCapIcon className="w-10 h-10 inline-block mr-3 text-purple-600" />
              Éducation
            </h1>
            <p className="text-gray-600 text-lg">
              Suivi des engagements, infrastructures scolaires et programmes éducatifs
            </p>
          </div>
          <button className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter un établissement
          </button>
        </div>

        {/* Quick Stats */}
        {dashboardData?.overview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Établissements</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {dashboardData.overview.total_claims || 0}
                  </p>
                </div>
                <BuildingLibraryIcon className="w-10 h-10 text-purple-600 opacity-70" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Bénéficiaires</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {(dashboardData.overview.total_beneficiaries || 0).toLocaleString()}
                  </p>
                </div>
                <UserGroupIcon className="w-10 h-10 text-blue-600 opacity-70" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Budget alloué</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    ${((dashboardData.overview.total_budget || 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
                <ChartBarIcon className="w-10 h-10 text-green-600 opacity-70" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Qualité moyenne</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {(dashboardData.overview.avg_quality_score || 0).toFixed(1)}/5
                  </p>
                </div>
                <ArrowTrendingUpIcon className="w-10 h-10 text-orange-600 opacity-70" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filtres
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Réinitialiser
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau d'éducation
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({...filters, level: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous les niveaux</option>
              <option value="prescolaire">Préscolaire</option>
              <option value="primaire">Primaire</option>
              <option value="secondaire">Secondaire</option>
              <option value="superieur">Supérieur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="construction">En construction</option>
              <option value="renovation">En rénovation</option>
              <option value="planned">Planifié</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous départements</option>
              <option value="ouest">Ouest</option>
              <option value="nord">Nord</option>
              <option value="artibonite">Artibonite</option>
              <option value="sud">Sud</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="mb-12">
        {activeTab === 'overview' && <EducationDashboard />}
        {activeTab === 'stats' && <EducationStats data={dashboardData} />}
        {activeTab === 'schools' && <SchoolList filters={filters} />}
        {activeTab === 'programs' && <ProgramGrid />}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Contribuez à l'amélioration de l'éducation en Haïti
          </h2>
          <p className="text-purple-100 mb-6 text-lg">
            Partagez des informations sur les écoles, programmes éducatifs ou suivez les engagements 
            des autorités pour une éducation plus transparente et accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Signaler un problème
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
              Devenir bénévole
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;