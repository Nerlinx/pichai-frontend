import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  TrendingDownIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const QuickStats = ({ data }) => {
  // Données par défaut si aucune donnée n'est passée
  const defaultStats = {
    economy: {
      totalClaims: 45,
      avgCredibility: 0.72,
      activeIndicators: 7
    },
    education: {
      totalClaims: 32,
      avgCompletion: 0.65,
      beneficiaries: 12500
    },
    combined: {
      totalClaims: 77,
      avgTrustScore: 0.68,
      verifiedClaims: 58
    }
  };

  const stats = data || defaultStats;

  const statCards = [
    {
      title: 'Engagements Totaux',
      value: stats.combined?.totalClaims || 77,
      change: '+12%',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Score de Confiance Moyen',
      value: `${((stats.combined?.avgTrustScore || 0.68) * 100).toFixed(0)}%`,
      change: '+5%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Engagements Vérifiés',
      value: stats.combined?.verifiedClaims || 58,
      change: '+8%',
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'En Attente',
      value: 19,
      change: '-3%',
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
            
            <div className="mb-2">
              <div className="text-3xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stat.title}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200/50">
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">Mise à jour: Aujourd'hui</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;