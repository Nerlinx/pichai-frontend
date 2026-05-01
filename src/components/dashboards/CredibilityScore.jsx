import React from 'react';
import { 
  ShieldCheckIcon, 
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const CredibilityScore = ({ 
  score, 
  level = 'beginner', 
  showBadge = false,
  size = 'medium',
  showLabel = true 
}) => {
  // Déterminer le niveau et la couleur basés sur le score
  const getLevelInfo = (score) => {
    if (score >= 90) return { 
      label: 'Expert', 
      color: 'text-green-700', 
      bgColor: 'bg-green-100', 
      borderColor: 'border-green-300',
      description: 'Haute fiabilité'
    };
    if (score >= 75) return { 
      label: 'Avancé', 
      color: 'text-blue-700', 
      bgColor: 'bg-blue-100', 
      borderColor: 'border-blue-300',
      description: 'Bonne fiabilité'
    };
    if (score >= 60) return { 
      label: 'Intermédiaire', 
      color: 'text-yellow-700', 
      bgColor: 'bg-yellow-100', 
      borderColor: 'border-yellow-300',
      description: 'Fiabilité moyenne'
    };
    if (score >= 40) return { 
      label: 'Débutant', 
      color: 'text-orange-700', 
      bgColor: 'bg-orange-100', 
      borderColor: 'border-orange-300',
      description: 'Fiabilité basique'
    };
    return { 
      label: 'Nouveau', 
      color: 'text-gray-700', 
      bgColor: 'bg-gray-100', 
      borderColor: 'border-gray-300',
      description: 'En développement'
    };
  };

  const levelInfo = getLevelInfo(score);
  
  // Taille du composant
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]}`}>
      {showBadge && (
        <div className={`mr-2 p-1 rounded-full ${levelInfo.bgColor} ${levelInfo.borderColor} border`}>
          <ShieldCheckIcon className={`w-4 h-4 ${levelInfo.color}`} />
        </div>
      )}
      
      <div className="flex flex-col">
        {showLabel && (
          <span className="text-xs text-gray-500">Score de crédibilité</span>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className={`font-bold ${levelInfo.color}`}>
              {score}/100
            </span>
            
            {/* Barre de progression */}
            <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${levelInfo.bgColor.replace('bg-', 'bg-').replace('100', '600')}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          
          <span className={`text-xs px-2 py-0.5 rounded-full ${levelInfo.bgColor} ${levelInfo.color}`}>
            {levelInfo.label}
          </span>
          
          {/* Info tooltip */}
          <div className="relative group">
            <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {levelInfo.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredibilityScore;