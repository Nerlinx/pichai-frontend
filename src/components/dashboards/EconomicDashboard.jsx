import React, { useState, useEffect } from 'react';
import { economyAPI } from '../../services/api';
import EconomicClaimCard from '../economy/EconomicClaimCard';
import EconomicIndicatorFilter from '../economy/EconomicIndicatorFilter';
import ProgressChart from '../charts/ProgressChart';
import CredibilityChart from '../charts/CredibilityChart';
import { Spinner, Alert, Button } from '../common';

const EconomicDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [filters, setFilters] = useState({
    minCredibility: 0.5,
    sortBy: 'credibility',
  });

  useEffect(() => {
    loadData();
  }, [selectedIndicator, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        indicator: selectedIndicator,
        min_credibility: filters.minCredibility,
        limit: 20,
      };
      
      const [claimsData, statsData] = await Promise.all([
        economyAPI.getEconomicClaims(params),
        economyAPI.getEconomicStats(),
      ]);
      
      setClaims(claimsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading economic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading && !claims.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard Économique
            </h2>
            <p className="text-gray-600">
              Suivi des indicateurs économiques et engagements
            </p>
          </div>
          <EconomicIndicatorFilter
            selected={selectedIndicator}
            onChange={setSelectedIndicator}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>

        {/* Statistiques rapides */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(stats).slice(0, 4).map(([indicator, data]) => (
              <div key={indicator} className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 font-medium capitalize mb-1">
                  {indicator.replace('_', ' ')}
                </div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-bold text-blue-900">
                    {data.total_claims}
                  </div>
                  <div className="ml-2 text-sm text-blue-700">
                    engagements
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Crédibilité: </span>
                  <span className={`font-medium ${
                    data.avg_credibility > 0.7 ? 'text-green-600' :
                    data.avg_credibility > 0.4 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {(data.avg_credibility * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Progression des engagements</h3>
          <ProgressChart data={claims} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Distribution de crédibilité</h3>
          <CredibilityChart data={claims} />
        </div>
      </div>

      {/* Liste des engagements */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Engagements Économiques</h3>
          <div className="text-sm text-gray-600">
            {claims.length} résultats
          </div>
        </div>

        <div className="space-y-4">
          {claims.length > 0 ? (
            claims.map((claim) => (
              <EconomicClaimCard key={claim.id} claim={claim} />
            ))
          ) : (
            <Alert type="info" message="Aucun engagement trouvé avec les filtres actuels" />
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomicDashboard;