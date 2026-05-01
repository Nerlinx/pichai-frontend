import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const QuickStats = ({ data }) => {
  // Données par défaut si aucune n'est fournie
  const stats = data || {
    total_events: 124,
    active_events: 45,
    total_participants: 8921,
    avg_consensus: 68,
    trending_up: 8,
    trending_down: 3
  };

  const statCards = [
    {
      id: 1,
      title: 'Événements actifs',
      value: stats.active_events || 0,
      change: '+12%',
      icon: ChartBarIcon,
      color: 'blue',
      trend: 'up'
    },
    {
      id: 2,
      title: 'Participants totaux',
      value: stats.total_participants || 0,
      change: '+8%',
      icon: UsersIcon,
      color: 'green',
      trend: 'up'
    },
    {
      id: 3,
      title: 'Consensus moyen',
      value: `${stats.avg_consensus || 0}%`,
      change: '+2%',
      icon: CheckCircleIcon,
      color: 'purple',
      trend: 'up'
    },
    {
      id: 4,
      title: 'En hausse cette semaine',
      value: stats.trending_up || 0,
      change: '+3',
      icon: ArrowTrendingUpIcon,
      color: 'orange',
      trend: 'up'
    }
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600', icon: 'text-red-600' }
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        
        return (
          <div key={stat.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof stat.value === 'number' && stat.value >= 1000 
                    ? `${(stat.value / 1000).toFixed(1)}k` 
                    : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className={`flex items-center text-sm ${colors.text}`}>
                {stat.trend === 'up' ? (
                  <>
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">{stat.change}</span>
                  </>
                ) : (
                  <>
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">{stat.change}</span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-500">vs. semaine dernière</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;