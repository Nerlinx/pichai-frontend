import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EconomicClaimCard = ({ claim }) => {
  const getIndicatorColor = (indicator) => {
    const colors = {
      croissance_pib: 'bg-green-100 text-green-800',
      inflation: 'bg-red-100 text-red-800',
      chomage: 'bg-blue-100 text-blue-800',
      investissement: 'bg-purple-100 text-purple-800',
      balance_commerciale: 'bg-yellow-100 text-yellow-800',
      taux_change: 'bg-indigo-100 text-indigo-800',
      dette_publique: 'bg-gray-100 text-gray-800',
    };
    return colors[indicator] || 'bg-gray-100';
  };

  const formatIndicator = (indicator) => {
    const names = {
      croissance_pib: 'Croissance PIB',
      inflation: 'Inflation',
      chomage: 'Chômage',
      investissement: 'Investissement',
      balance_commerciale: 'Balance Commerciale',
      taux_change: 'Taux de Change',
      dette_publique: 'Dette Publique',
    };
    return names[indicator] || indicator;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {claim.title}
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            {claim.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIndicatorColor(claim.indicator_type)}`}>
              {formatIndicator(claim.indicator_type)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              {claim.source_entity}
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
              {claim.geographic_scope}
            </span>
          </div>
        </div>
        
        {/* Score et progression */}
        <div className="flex flex-col items-end space-y-3">
          {claim.credibility_score !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {(claim.credibility_score * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Crédibilité</div>
              <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className={`h-2 rounded-full ${
                    claim.credibility_score > 0.7 ? 'bg-green-500' :
                    claim.credibility_score > 0.4 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${claim.credibility_score * 100}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {claim.progress}%
            </div>
            <div className="text-xs text-gray-600">Progression</div>
          </div>
        </div>
      </div>

      {/* Détails chiffrés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Valeur cible</div>
          <div className="text-lg font-bold text-gray-800">
            {claim.target_value} {claim.unit}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Valeur actuelle</div>
          <div className="text-lg font-bold text-gray-800">
            {claim.current_value ? `${claim.current_value} ${claim.unit}` : 'Non disponible'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Échéance</div>
          <div className="text-lg font-bold text-gray-800">
            {format(new Date(claim.timeframe_end), 'dd MMM yyyy', { locale: fr })}
          </div>
        </div>
      </div>

      {/* Sources et impact */}
      {(claim.data_sources?.length > 0 || claim.impact_estimation) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {claim.data_sources?.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">Sources: </span>
              <span className="text-sm text-gray-600">
                {claim.data_sources.join(', ')}
              </span>
            </div>
          )}
          {claim.impact_estimation && (
            <div>
              <span className="text-sm font-medium text-gray-700">Impact estimé: </span>
              <span className="text-sm text-gray-600">
                {claim.impact_estimation}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EconomicClaimCard;