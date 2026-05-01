// frontend/src/components/events/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingLibraryIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CpuChipIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  BoltIcon,
  WifiIcon,
  HomeIcon,
  UsersIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const EventCard = ({ 
  event, 
  userVote, 
  onVote, 
  onViewDetails, 
  onAIAnalysis,
  isVoting 
}) => {
  const navigate = useNavigate();

  // Fonctions utilitaires (à externaliser dans un fichier utils si possible)
  const getCategoryClass = (category) => {
    const colorMap = {
      'Économie': 'emerald', 'économie': 'emerald',
      'Politique': 'blue', 'politique': 'blue',
      'Santé': 'red', 'santé': 'red',
      'Éducation': 'amber', 'éducation': 'amber',
      'Infrastructure': 'purple', 'infrastructure': 'purple',
      'Agriculture': 'lime', 'agriculture': 'lime',
      'Société': 'indigo', 'société': 'indigo',
      'Sécurité': 'rose', 'sécurité': 'rose',
      'Environnement': 'green', 'environnement': 'green'
    };
    const color = colorMap[category] || 'gray';
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      lime: 'bg-lime-50 text-lime-700 border-lime-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      rose: 'bg-rose-50 text-rose-700 border-rose-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colorClasses[color] || colorClasses.gray;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Économie': <BuildingLibraryIcon className="w-4 h-4" />,
      'économie': <AcademicCapIcon className="w-4 h-4" />,
      'Politique': <BuildingLibraryIcon className="w-4 h-4" />,
      'politique': <BuildingLibraryIcon className="w-4 h-4" />,
      'Santé': <ShieldCheckIcon className="w-4 h-4" />,
      'santé': <ShieldCheckIcon className="w-4 h-4" />,
      'Éducation': <AcademicCapIcon className="w-4 h-4" />,
      'éducation': <AcademicCapIcon className="w-4 h-4" />,
      'Infrastructure': <WifiIcon className="w-4 h-4" />,
      'infrastructure': <WifiIcon className="w-4 h-4" />,
      'Agriculture': <HomeIcon className="w-4 h-4" />,
      'agriculture': <HomeIcon className="w-4 h-4" />,
      'Société': <UsersIcon className="w-4 h-4" />,
      'société': <UsersIcon className="w-4 h-4" />,
    };
    return iconMap[category] || <FireIcon className="w-4 h-4" />;
  };

  const getConsensusColor = (percentage) => {
    if (percentage >= 70) return 'text-emerald-700';
    if (percentage >= 40) return 'text-amber-700';
    return 'text-red-700';
  };

  const getConsensusBgColor = (percentage) => {
    if (percentage >= 70) return 'bg-emerald-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />;
      case 'down': return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default: return <ArrowPathIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendText = (trend) => {
    switch(trend) {
      case 'up': return 'En hausse';
      case 'down': return 'En baisse';
      default: return 'Stable';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-5">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getCategoryClass(event.category)}`}>
              {getCategoryIcon(event.category)}
              {event.category.toUpperCase()}
            </span>
            {event.status === 'urgent' && (
              <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200 flex items-center gap-1 animate-pulse">
                <BoltIcon className="w-3 h-3" />
                Urgent
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500">{event.lastUpdate}</span>
            {event.trend && (
              <span className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                {getTrendIcon(event.trend)}
                {getTrendText(event.trend)}
              </span>
            )}
          </div>
        </div>

        {/* Titre et description */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Barre de consensus */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">Consensus collectif</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${getConsensusColor(event.currentConsensus)}`}>
                {event.currentConsensus}%
              </span>
              {userVote && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {userVote === 'yes' ? '✅ Voté' : '❌ Voté'}
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getConsensusBgColor(event.currentConsensus)} transition-all duration-500`}
              style={{ width: `${event.currentConsensus}%` }}
            />
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Participants</div>
            <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
              <UserGroupIcon className="w-3 h-3" />
              {formatNumber(event.participants)}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Confiance IA</div>
            <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
              <CpuChipIcon className="w-3 h-3" />
              {Math.round(event.iaConfidence * 100)}%
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Jours restants</div>
            <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
              <ClockIcon className="w-3 h-3" />
              {event.daysLeft}
            </div>
          </div>
        </div>

        {/* Prévision actuelle */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Prévision actuelle</div>
            <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              Score: {event.impactScore}/100
            </div>
          </div>
          <div className="text-sm font-medium text-gray-900 mt-1">{event.forecastValue}</div>
        </div>

        {/* Boutons d'interaction */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onVote(event.id, 'yes')}
              disabled={!!userVote || isVoting}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                userVote === 'yes'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 disabled:opacity-50'
              }`}
              aria-label="Voter probable"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>Probable</span>
            </button>
            <button
              onClick={() => onVote(event.id, 'no')}
              disabled={!!userVote || isVoting}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                userVote === 'no'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 disabled:opacity-50'
              }`}
              aria-label="Voter improbable"
            >
              <XCircleIcon className="w-4 h-4" />
              <span>Improbable</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAIAnalysis(event.id)}
              className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium rounded-lg border border-blue-200 transition-all group/ai"
              aria-label="Analyse IA"
            >
              <CpuChipIcon className="w-4 h-4 group-hover/ai:animate-pulse" />
              <span>Analyse IA</span>
            </button>
            <button
              onClick={() => onViewDetails(event.id)}
              className="flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium rounded-lg transition-all group/details"
              aria-label="Voir détails"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span>Détails</span>
              <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover/details:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;