import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CpuChipIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AIAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userQuestion, setUserQuestion] = useState('');

  // Données mock pour l'exemple
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvent = {
        id: parseInt(id),
        title: "Départ du Conseil Présidentiel avant le 7 février 2024",
        category: "politique",
        currentConsensus: 42,
        participants: 3150
      };
      
      const mockAnalysis = {
        confidence: 78,
        summary: "Selon l'analyse des données disponibles et des tendances récentes, la probabilité du départ du Conseil Présidentiel avant le 7 février 2024 est estimée à 42%. Cette estimation prend en compte plusieurs facteurs clés.",
        keyFactors: [
          {
            title: "Calendrier constitutionnel",
            impact: "élevé",
            description: "Le délai légal approche mais des extensions ont été observées dans le passé.",
            confidence: 65
          },
          {
            title: "Contexte politique",
            impact: "moyen",
            description: "Les négociations entre acteurs politiques montrent des signes de progression.",
            confidence: 72
          },
          {
            title: "Pression internationale",
            impact: "élevé",
            description: "Les partenaires internationaux poussent pour une transition rapide.",
            confidence: 85
          }
        ],
        sources: [
          "Constitution haïtienne - Article 134",
          "Communiqués du Conseil Présidentiel",
          "Déclarations des partenaires internationaux",
          "Analyses d'experts politiques"
        ],
        alternativeScenarios: [
          {
            scenario: "Départ à la date prévue",
            probability: "42%",
            implications: "Transition constitutionnelle normale"
          },
          {
            scenario: "Report de 30 jours",
            probability: "35%",
            implications: "Négociations supplémentaires nécessaires"
          },
          {
            scenario: "Report prolongé",
            probability: "23%",
            implications: "Crise constitutionnelle possible"
          }
        ]
      };
      
      setEvent(mockEvent);
      setAnalysis(mockAnalysis);
      setIsLoading(false);
    };
    
    fetchData();
  }, [id]);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    
    // Simulation de réponse IA
    alert(`Question envoyée à l'IA: "${userQuestion}"\n\n(Réponse simulée - Dans la version réelle, cela interagirait avec ton backend IA)`);
    setUserQuestion('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyse en cours par l'IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm">Retour</span>
            </button>
            
            <div className="flex items-center gap-2">
              <CpuChipIcon className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Analyse IA</span>
            </div>
            
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              Accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {event?.category}
              </span>
              <span className="text-sm text-gray-500">{event?.participants} participants</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {event?.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CpuChipIcon className="w-4 h-4" />
                <span>Confiance IA: <strong>{analysis?.confidence}%</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <ChartBarIcon className="w-4 h-4" />
                <span>Consensus: <strong>{event?.currentConsensus}%</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Résumé IA */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <LightBulbIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Résumé de l'analyse IA</h2>
                    <p className="text-sm text-gray-600">Synthèse automatique basée sur les données disponibles</p>
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {analysis?.summary}
                  </p>
                </div>
              </div>

              {/* Facteurs clés */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Facteurs clés analysés</h2>
                
                <div className="space-y-4">
                  {analysis?.keyFactors.map((factor, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{factor.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          factor.impact === 'élevé' ? 'bg-red-100 text-red-800' :
                          factor.impact === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Impact {factor.impact}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{factor.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Confiance IA sur ce facteur
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${factor.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{factor.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scénarios alternatifs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Scénarios possibles</h2>
                
                <div className="space-y-4">
                  {analysis?.alternativeScenarios.map((scenario, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{scenario.scenario}</h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {scenario.probability}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{scenario.implications}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sources */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  Sources analysées
                </h3>
                
                <ul className="space-y-2">
                  {analysis?.sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Poser une question à l'IA */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CpuChipIcon className="w-5 h-5" />
                  Questionnez l'IA
                </h3>
                
                <form onSubmit={handleSubmitQuestion}>
                  <textarea
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="Posez une question spécifique sur cet événement..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-sm"
                    rows={4}
                  />
                  
                  <button
                    type="submit"
                    className="w-full mt-3 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                  >
                    Envoyer à l'IA
                  </button>
                </form>
                
                <p className="text-xs text-gray-500 mt-3">
                  L'IA analysera votre question et fournira une réponse basée sur les données disponibles.
                </p>
              </div>

              {/* Métriques de confiance */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  Métriques de confiance
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Fiabilité des sources</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Frais de données</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-yellow-500 h-1.5 rounded-full w-3/5"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Consensus expert</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAnalysisPage;