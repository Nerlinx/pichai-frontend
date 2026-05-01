import React, { useState } from 'react';
import { 
  UsersIcon, 
  ChartBarIcon, 
  InformationCircleIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

const PredictionCard = ({ prediction, userVote, onVote }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(50);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [userReasoning, setUserReasoning] = useState('');

  const handleVote = () => {
    if (selectedOption && onVote) {
      onVote(prediction.id, selectedOption.id, confidence / 100);
      // Reset after voting
      setSelectedOption(null);
      setConfidence(50);
      setUserReasoning('');
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (conf >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                prediction.prediction_type === 'binary' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {prediction.prediction_type === 'binary' ? 'Oui/Non' : 'Choix multiple'}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {new Date(prediction.expires_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{prediction.question}</h3>
            
            {/* Crowd Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <UsersIcon className="w-4 h-4 mr-1" />
                <span>{prediction.total_participants.toLocaleString()} participants</span>
              </div>
              <div className="flex items-center">
                <ChartBarIcon className="w-4 h-4 mr-1" />
                <span className={getConfidenceColor(prediction.crowd_confidence * 100)}>
                  {Math.round(prediction.crowd_confidence * 100)}% confiance collective
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <InformationCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-4">Choisissez votre réponse :</h4>
          <div className="space-y-3">
            {prediction.options.map((option) => (
              <div key={option.id} className="relative">
                <button
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedOption?.id === option.id
                      ? `${option.color.split(' ')[0]} border-current transform scale-[1.02]`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        selectedOption?.id === option.id 
                          ? 'border-current' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption?.id === option.id && (
                          <div className="w-3 h-3 rounded-full bg-current"></div>
                        )}
                      </div>
                      <span className="font-medium">{option.text}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-3">{option.percentage}%</span>
                      <ChevronRightIcon className={`w-5 h-5 ${
                        selectedOption?.id === option.id ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Percentage Bar */}
                  <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${option.color.split(' ')[0]}`}
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Slider */}
        {selectedOption && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="font-medium text-gray-700">
                À quel point êtes-vous certain ? ({confidence}%)
              </label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                getConfidenceColor(confidence)
              }`}>
                {confidence >= 70 ? 'Très certain' : 
                 confidence >= 40 ? 'Modérément certain' : 
                 'Peu certain'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Pas du tout</span>
              <span>Neutre</span>
              <span>Absolument certain</span>
            </div>
          </div>
        )}

        {/* Reasoning Input */}
        {selectedOption && (
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Partagez votre raisonnement (optionnel) :
            </label>
            <textarea
              value={userReasoning}
              onChange={(e) => setUserReasoning(e.target.value)}
              placeholder="Pourquoi avez-vous fait ce choix ? Quelles informations avez-vous considérées ?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              setShowAnalysis(!showAnalysis);
              // Ici on pourrait appeler l'API pour l'analyse IA
            }}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Analyser avec l'IA
          </button>
          
          {selectedOption ? (
            <button
              onClick={handleVote}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Soumettre ma prédiction
            </button>
          ) : (
            <button
              disabled
              className="px-8 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            >
              Sélectionnez une option
            </button>
          )}
        </div>
      </div>

      {/* Analysis Panel */}
      {showAnalysis && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
            Analyse IA et Contexte
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Contexte de l'engagement</h5>
              <p className="text-sm text-gray-600">
                Cette promesse fait partie du plan éducatif 2023-2025. Des fonds ont été alloués 
                mais des retards dans les appels d'offres ont été signalés.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Historique similaire</h5>
              <p className="text-sm text-gray-600">
                Sur les 5 programmes similaires des 3 dernières années, 3 ont été complétés 
                dans les délais, 1 avec retard, et 1 annulé.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Facteurs clés</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Budget déjà approuvé</li>
                <li>• Partenaires internationaux impliqués</li>
                <li>• Élections municipales à venir</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Recommandation IA</h5>
              <div className="text-sm">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  Confiance modérée (68%)
                </span>
                <p className="mt-2 text-gray-600">
                  L'IA recommande de surveiller les appels d'offres du prochain trimestre.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;