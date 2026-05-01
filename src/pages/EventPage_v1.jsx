import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShareIcon,
  BookmarkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Données mock basées sur l'ID
      const mockEvents = {
        1: {
          id: 1,
          title: "Départ du Conseil Présidentiel avant le 7 février 2024",
          category: "politique",
          description: "Analyse de la transition politique et du calendrier constitutionnel en Haïti. Cet événement suit la probabilité que le Conseil Présidentiel termine son mandat avant la date constitutionnelle du 7 février 2024.",
          detailedDescription: `
            <p>La question de la transition politique en Haïti est cruciale pour la stabilité du pays. Le Conseil Présidentiel, établi suite aux accords politiques de 2023, doit théoriquement quitter le pouvoir le 7 février 2024 selon le calendrier constitutionnel révisé.</p>
            
            <h3>Contexte</h3>
            <p>Depuis sa formation, le Conseil a fait face à de nombreux défis : crise économique, insécurité, et pressions internationales. Les négociations pour une transition ordonnée sont en cours entre les différents acteurs politiques.</p>
            
            <h3>Indicateurs clés suivis</h3>
            <ul>
              <li>Avancement des réformes constitutionnelles</li>
              <li>Négociations entre partis politiques</li>
              <li>Position des partenaires internationaux</li>
              <li>Calendrier électoral proposé</li>
            </ul>
          `,
          currentConsensus: 42,
          participants: 3150,
          daysLeft: 18,
          trend: "down",
          iaConfidence: 0.68,
          impactScore: 92,
          createdDate: "15 janvier 2024",
          resolutionDate: "7 février 2024",
          sources: [
            { name: "Constitution haïtienne", type: "juridique" },
            { name: "Communiqués officiels", type: "gouvernement" },
            { name: "Analystes politiques", type: "expert" },
            { name: "Médias locaux", type: "presse" }
          ],
          contributors: [
            { name: "ExpertConstitution", contributions: 45, role: "expert" },
            { name: "AnalystePolitique", contributions: 32, role: "analyste" },
            { name: "ObservateurInternational", contributions: 28, role: "observateur" }
          ],
          timeline: [
            { date: "15 jan 2024", event: "Publication de l'analyse", status: "completed" },
            { date: "20 jan 2024", event: "Premier rapport d'experts", status: "pending" },
            { date: "7 fév 2024", event: "Date de résolution", status: "upcoming" }
          ]
        }
      };
      
      setEvent(mockEvents[id] || mockEvents[1]);
      setIsLoading(false);
    };
    
    fetchEvent();
  }, [id]);

  const handleVote = (vote) => {
    setUserVote(vote);
    // Ici, tu enverrais le vote à ton API
    console.log(`Vote ${vote} pour l'événement ${id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Consultez cette analyse sur EXPAND: ${event?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm">Retour</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'text-blue-500 fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de l'événement */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {event.category}
              </span>
              <span className="text-sm text-gray-500">ID: #{event.id}</span>
              <span className="text-sm text-gray-500">
                Créé le: {event.createdDate}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            
            <p className="text-gray-700 text-lg mb-6">
              {event.description}
            </p>
            
            {/* Métriques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Consensus</div>
                <div className="text-2xl font-bold text-gray-900">{event.currentConsensus}%</div>
                <div className="text-xs text-gray-500">
                  {event.trend === 'up' ? 'En hausse' : 'En baisse'}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Participants</div>
                <div className="text-2xl font-bold text-gray-900">{event.participants.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Contributeurs</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Jours restants</div>
                <div className="text-2xl font-bold text-gray-900">{event.daysLeft}</div>
                <div className="text-xs text-gray-500">Résolution: {event.resolutionDate}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Confiance IA</div>
                <div className="text-2xl font-bold text-gray-900">{(event.iaConfidence * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-500">Score de fiabilité</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description détaillée */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description détaillée</h2>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.detailedDescription }}
                />
              </div>

              {/* Participation */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Donnez votre avis</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleVote('yes')}
                    className={`flex items-center justify-center gap-3 py-4 rounded-lg border transition ${
                      userVote === 'yes'
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Probable</div>
                      <div className="text-sm">Cela se produira</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleVote('no')}
                    className={`flex items-center justify-center gap-3 py-4 rounded-lg border transition ${
                      userVote === 'no'
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <XCircleIcon className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Improbable</div>
                      <div className="text-sm">Cela ne se produira pas</div>
                    </div>
                  </button>
                </div>
                
                <div className="text-center">
                  <Link
                    to={`/ai-analysis/${id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <CpuChipIcon className="w-5 h-5" />
                    Analyser avec l'IA
                  </Link>
                </div>
              </div>

              {/* Sources */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sources et références</h2>
                <div className="space-y-3">
                  {event.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{source.name}</div>
                        <div className="text-sm text-gray-500">{source.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Chronologie
                </h3>
                
                <div className="space-y-4">
                  {event.timeline.map((item, index) => (
                    <div key={index} className="relative pl-6">
                      <div className={`absolute left-0 top-1 w-2 h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`} />
                      <div className="text-sm font-medium text-gray-900">{item.date}</div>
                      <div className="text-sm text-gray-600">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributeurs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Contributeurs actifs
                </h3>
                
                <div className="space-y-3">
                  {event.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {contributor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contributor.name}</div>
                          <div className="text-xs text-gray-500">{contributor.role}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{contributor.contributions} contributions</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <Link
                    to={`/ai-analysis/${id}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                  >
                    <CpuChipIcon className="w-5 h-5" />
                    <span>Analyse IA complète</span>
                  </Link>
                  
                  <button className="w-full flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                    <ShareIcon className="w-5 h-5" />
                    <span>Partager l'analyse</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  >
                    <BookmarkIcon className="w-5 h-5" />
                    <span>{isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventPage;