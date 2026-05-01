import React from 'react';
import CategoryBadge from '../common/CategoryBadge';
import ConfidenceBadge from '../common/ConfidenceBadge';

const ClaimCard = ({ claim }) => {
  const getStatusColor = (status) => {
    const colors = {
      'non_verifie': 'bg-gray-100 text-gray-800',
      'en_cours': 'bg-blue-100 text-blue-800',
      'tenu': 'bg-green-100 text-green-800',
      'non_tenu': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{claim.title}</h3>
        <div className="flex space-x-2">
          <CategoryBadge category={claim.category} />
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
            {claim.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-3">{claim.description.substring(0, 150)}...</p>
      
      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="font-medium">Source :</span> {claim.source}
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <span className="font-medium">Par :</span> {claim.claimant}
          </div>
          {claim.verification_score && (
            <ConfidenceBadge score={claim.verification_score} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;