import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EventCard = ({ 
  event, 
  compact = false, 
  showUserPrediction = false,
  showActions = true,
  className = '' 
}) => {


  if (!event) {
    console.warn('EventCard: event prop is undefined');
    return null; // Ou un composant de fallback
  }

  const getConsensusColor = (value) => {
    if (value > 70) return 'text-green-600 bg-green-50';
    if (value > 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'économie': return 'bg-blue-100 text-blue-800';
      case 'éducation': return 'bg-green-100 text-green-800';
      case 'gouvernance': return 'bg-purple-100 text-purple-800';
      case 'infrastructure': return 'bg-orange-100 text-orange-800';
      case 'santé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            {event.attention_flag && (
              <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
            )}
            {event.trend_direction === 'up' && (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            )}
            {event.trend_direction === 'down' && (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
            )}
          </div>
          
          <h4 className="font-medium text-gray-900 line-clamp-2">
            {event.title}
          </h4>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Consensus collectif</span>
            <span className="font-semibold">{event.consensus || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                event.consensus > 70 ? 'bg-green-500' :
                event.consensus > 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${event.consensus || 0}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <UserGroupIcon className="w-4 h-4" />
            <span>{event.participants || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{event.days_left || 0}j restants</span>
          </div>
        </div>
        
        {event.forecast_value && (
          <div className="text-sm p-2 bg-gray-50 rounded-lg">
            <span className="font-medium">Prévision actuelle: </span>
            {event.forecast_value}
          </div>
        )}
      </div>

      {showUserPrediction && event.user_prediction && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Votre prévision</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{event.user_prediction.value}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              event.user_prediction.accuracy > 70 ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.user_prediction.accuracy}% de précision
            </span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <Link
              to={`/event/${event.id}`}
              className="flex-1 text-center py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition"
            >
              Analyser
            </Link>
            <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition">
              ...
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;