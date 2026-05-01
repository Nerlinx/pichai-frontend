import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  UserCircleIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const RecentClaims = () => {
  const recentClaims = [
    {
      id: 1,
      title: 'Construction de 10 nouvelles écoles',
      category: 'Éducation',
      claimant: 'Ministère de l\'Éducation',
      date: '2024-01-15',
      status: 'En cours',
      statusColor: 'bg-blue-100 text-blue-800',
      confidence: 0.85,
      source: 'Discours officiel'
    },
    {
      id: 2,
      title: 'Réduction du taux de chômage à 20%',
      category: 'Économie',
      claimant: 'Ministère des Finances',
      date: '2024-01-14',
      status: 'Non vérifié',
      statusColor: 'bg-yellow-100 text-yellow-800',
      confidence: 0.65,
      source: 'Conférence de presse'
    },
    {
      id: 3,
      title: 'Programme de vaccination national',
      category: 'Santé',
      claimant: 'Ministère de la Santé',
      date: '2024-01-13',
      status: 'Tenue',
      statusColor: 'bg-green-100 text-green-800',
      confidence: 0.92,
      source: 'Déclaration publique'
    },
    {
      id: 4,
      title: 'Modernisation des routes nationales',
      category: 'Infrastructure',
      claimant: 'Ministère des TPTC',
      date: '2024-01-12',
      status: 'Partiellement tenue',
      statusColor: 'bg-orange-100 text-orange-800',
      confidence: 0.78,
      source: 'Plan national'
    },
    {
      id: 5,
      title: 'Formation de 5000 jeunes en numérique',
      category: 'Technologie',
      claimant: 'Ministère de la Jeunesse',
      date: '2024-01-11',
      status: 'En attente',
      statusColor: 'bg-gray-100 text-gray-800',
      confidence: 0.71,
      source: 'Annonce gouvernementale'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Tenue':
        return <CheckBadgeIcon className="w-4 h-4" />;
      case 'En cours':
        return <ClockIcon className="w-4 h-4" />;
      case 'Non vérifié':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Économie': 'bg-blue-50 text-blue-700 border-blue-200',
      'Éducation': 'bg-purple-50 text-purple-700 border-purple-200',
      'Santé': 'bg-green-50 text-green-700 border-green-200',
      'Infrastructure': 'bg-orange-50 text-orange-700 border-orange-200',
      'Technologie': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="card lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CalendarDaysIcon className="w-6 h-6 text-gray-600" />
          Engagements Récents
        </h2>
        <Link 
          to="/all-claims" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          Voir tous <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentClaims.map((claim) => (
          <div 
            key={claim.id} 
            className="group p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(claim.category)}`}>
                    {getStatusIcon(claim.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {claim.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(claim.category)}`}>
                        {claim.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <UserCircleIcon className="w-4 h-4" />
                        <span>{claim.claimant}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>{new Date(claim.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${claim.statusColor} flex items-center gap-1`}>
                  {claim.status}
                </span>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      claim.confidence > 0.8 ? 'text-green-600' :
                      claim.confidence > 0.6 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {(claim.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Confiance
                    </div>
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        claim.confidence > 0.8 ? 'bg-green-500' :
                        claim.confidence > 0.6 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${claim.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
              <span className="font-medium">Source:</span> {claim.source}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Tenue (≥80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>En cours (60-79%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>À risque (≤59%)</span>
            </div>
          </div>
          <div className="text-gray-500">
            {recentClaims.length} engagements affichés
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentClaims;