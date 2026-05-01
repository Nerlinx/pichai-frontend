import React from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  HeartIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const CategoryOverview = ({ data }) => {
  const categories = [
    {
      id: 1,
      name: 'Économie',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      claims: 45,
      avgCredibility: 0.72,
      completed: 28,
      pending: 12,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Éducation',
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      claims: 32,
      avgCredibility: 0.68,
      completed: 18,
      pending: 9,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Santé',
      icon: HeartIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      claims: 27,
      avgCredibility: 0.81,
      completed: 22,
      pending: 3,
      trend: 'up'
    },
    {
      id: 4,
      name: 'Infrastructure',
      icon: BuildingOfficeIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      claims: 38,
      avgCredibility: 0.65,
      completed: 24,
      pending: 8,
      trend: 'stable'
    },
    {
      id: 5,
      name: 'Technologie',
      icon: CpuChipIcon,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      claims: 19,
      avgCredibility: 0.75,
      completed: 12,
      pending: 5,
      trend: 'up'
    },
    {
      id: 6,
      name: 'Agriculture',
      icon: ChartBarIcon,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      claims: 24,
      avgCredibility: 0.69,
      completed: 16,
      pending: 6,
      trend: 'stable'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+12%</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center text-red-600">
          <ArrowTrendingUpIcon className="w-4 h-4 mr-1 transform rotate-180" />
          <span className="text-sm font-medium">-5%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-600">
          <span className="text-sm font-medium">Stable</span>
        </div>
      );
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6 text-gray-600" />
          Vue par Catégorie
        </h2>
        <span className="text-sm text-gray-500">
          Mise à jour: Janv. 2024
        </span>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const completionRate = Math.round((category.completed / category.claims) * 100);
          
          return (
            <div key={category.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <Icon className={`w-5 h-5 ${category.textColor}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{category.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{category.claims} engagements</span>
                      <span>•</span>
                      <span>{completionRate}% complétés</span>
                    </div>
                  </div>
                </div>
                {getTrendIcon(category.trend)}
              </div>

              <div className="space-y-3">
                {/* Barre de progression */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Taux d'avancement</span>
                    <span className="font-medium">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(completionRate)}`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">{category.completed}</div>
                    <div className="text-xs text-gray-600">Complétés</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">{category.pending}</div>
                    <div className="text-xs text-gray-600">En cours</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">
                      {(category.avgCredibility * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600">Crédibilité</div>
                  </div>
                </div>
              </div>

              {/* Lien vers la catégorie */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link 
                  to={`/${category.name.toLowerCase()}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1"
                >
                  Voir les détails
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Résumé global */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {categories.reduce((sum, cat) => sum + cat.claims, 0)}
            </div>
            <div className="text-sm text-blue-600">Engagements totaux</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {Math.round(
                categories.reduce((sum, cat) => sum + (cat.completed / cat.claims * 100), 0) / categories.length
              )}%
            </div>
            <div className="text-sm text-green-600">Moyenne de complétion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryOverview;