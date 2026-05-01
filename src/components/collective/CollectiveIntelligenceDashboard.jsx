import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  TrendingUpIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import PredictionCard from './PredictionCard';
import LiveChat from './LiveChat';
import { collectiveAPI } from '../../services/api';

const CollectiveIntelligenceDashboard = () => {
  const [activePredictions, setActivePredictions] = useState([]);
  const [trendingQuestions, setTrendingQuestions] = useState([]);
  const [userPredictions, setUserPredictions] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    predictionAccuracy: 0,
    activeQuestions: 0,
    crowdConfidence: 0
  });

  useEffect(() => {
    loadCollectiveData();
  }, []);

  const loadCollectiveData = async () => {
    try {
      setLoading(true);
      const [predictions, questions, userData, statistics] = await Promise.all([
        collectiveAPI.getActivePredictions(),
        collectiveAPI.getTrendingQuestions(),
        collectiveAPI.getUserPredictions(),
        collectiveAPI.getCollectiveStats()
      ]);
      
      setActivePredictions(predictions);
      setTrendingQuestions(questions);
      setUserPredictions(userData);
      setStats(statistics);
    } catch (error) {
      console.error('Erreur chargement intelligence collective:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (predictionId, optionId, confidence) => {
    try {
      await collectiveAPI.submitPrediction({
        prediction_id: predictionId,
        option_id: optionId,
        confidence: confidence,
        reasoning: "Basé sur mon analyse personnelle"
      });
      
      // Recharger les données
      loadCollectiveData();
    } catch (error) {
      console.error('Erreur soumission prédiction:', error);
    }
  };

  const samplePredictions = [
    {
      id: 1,
      claim_id: 45,
      question: "Le programme de bourses universitaires sera-t-il mis en œuvre avant 2025 ?",
      prediction_type: "binary",
      options: [
        { id: 1, text: "Oui, avant juin 2025", color: "bg-green-100 text-green-800", percentage: 65 },
        { id: 2, text: "Non, retard prévisible", color: "bg-red-100 text-red-800", percentage: 35 }
      ],
      total_participants: 1247,
      total_volume: 8924,
      crowd_confidence: 0.72,
      expires_at: "2024-12-31"
    },
    {
      id: 2,
      claim_id: 32,
      question: "Quel sera l'impact réel du plan de création d'emplois ?",
      prediction_type: "multiple",
      options: [
        { id: 1, text: "10-20k emplois créés", color: "bg-blue-100 text-blue-800", percentage: 28 },
        { id: 2, text: "20-30k emplois créés", color: "bg-purple-100 text-purple-800", percentage: 42 },
        { id: 3, text: "Moins de 10k emplois", color: "bg-orange-100 text-orange-800", percentage: 20 },
        { id: 4, text: "Impact négligeable", color: "bg-gray-100 text-gray-800", percentage: 10 }
      ],
      total_participants: 892,
      total_volume: 6543,
      crowd_confidence: 0.68,
      expires_at: "2024-06-30"
    },
    {
      id: 3,
      claim_id: 78,
      question: "À quel taux d'inflation arriverons-nous fin 2024 ?",
      prediction_type: "numeric",
      options: [
        { id: 1, text: "15-20%", color: "bg-yellow-100 text-yellow-800", percentage: 25 },
        { id: 2, text: "20-25%", color: "bg-orange-100 text-orange-800", percentage: 45 },
        { id: 3, text: "25-30%", color: "bg-red-100 text-red-800", percentage: 30 }
      ],
      total_participants: 567,
      total_volume: 4321,
      crowd_confidence: 0.61,
      expires_at: "2024-11-15"
    }
  ];

  const trendingQuestionsData = [
    { id: 1, question: "La réforme éducative sera-t-elle appliquée cette année ?", votes: 892 },
    { id: 2, question: "Impact réel des sanctions internationales ?", votes: 745 },
    { id: 3, question: "Quartiers qui bénéficieront de nouvelles infrastructures ?", votes: 621 },
    { id: 4, question: "Qui sera le prochain ministre des Finances ?", votes: 543 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                <LightBulbIcon className="w-10 h-10 inline-block mr-3" />
                Intelligence Collective
              </h1>
              <p className="text-blue-100 text-lg">
                Participez aux prédictions et engaments, analysez avec l'IA
              </p>
            </div>
            
            {/* Stats */}
            <div className="mt-6 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalParticipants.toLocaleString() || '2.4k'}</div>
                <div className="text-sm text-blue-200">Participants</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{Math.round(stats.predictionAccuracy * 100) || 72}%</div>
                <div className="text-sm text-blue-200">Précision</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.activeQuestions || 14}</div>
                <div className="text-sm text-blue-200">Questions actives</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{Math.round(stats.crowdConfidence * 100) || 68}%</div>
                <div className="text-sm text-blue-200">Confiance collective</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Prédictions actives */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-blue-600" />
                Prédictions en Cours
                <span className="ml-3 text-sm font-normal bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {activePredictions.length || 3} actives
                </span>
              </h2>
              
              <div className="space-y-6">
                {samplePredictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    userVote={userPredictions[prediction.id]}
                    onVote={handleVote}
                  />
                ))}
              </div>
            </div>

            {/* Trending Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-purple-600" />
                Questions Tendances
              </h3>
              <div className="space-y-4">
                {trendingQuestionsData.map((item) => (
                  <div key={item.id} className="group p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {item.question}
                        </h4>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          {item.votes} votes
                        </div>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                        Voter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Chat et Analytics */}
          <div className="space-y-6">
            {/* Chat Widget */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white mr-2" />
                    <h3 className="text-lg font-bold text-white">Assistant IA Expand</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white/80">En ligne</span>
                  </div>
                </div>
              </div>
              
              {/* Chat Interface */}
              <LiveChat isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
            </div>

            {/* User Stats */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Vos Contributions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Prédictions faites</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Précision personnelle</span>
                  <span className="font-bold text-green-400">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Influence collective</span>
                  <span className="font-bold">+8.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Niveau d'expert</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
                    </div>
                    <span className="ml-2 font-bold">65%</span>
                  </div>
                </div>
              </div>
              
              <button className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition">
                Voir mes analyses détaillées
              </button>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Comment ça marche ?</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Choisissez une prédiction</h4>
                    <p className="text-sm text-gray-600">Sélectionnez Oui/Non ou un choix multiple</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Indiquez votre confiance</h4>
                    <p className="text-sm text-gray-600">De 1% (doute) à 100% (certain)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Analysez avec l'IA</h4>
                    <p className="text-sm text-gray-600">Discutez avec l'assistant pour approfondir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Analytics */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analyses Collectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <ArrowTrendingUpIcon className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">72%</div>
                  <div className="text-sm text-gray-600">Précision collective</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                La sagesse des foudes surperforme les experts individuels sur les questions économiques.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <UsersIcon className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">2.4k</div>
                  <div className="text-sm text-gray-600">Participants actifs</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Communauté grandissante de citoyens engagés dans l'analyse prédictive.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <LightBulbIcon className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">14.2%</div>
                  <div className="text-sm text-gray-600">Amélioration prévision</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Grâce à l'IA et aux données collectives, les prédictions s'améliorent chaque mois.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectiveIntelligenceDashboard;