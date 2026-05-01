// frontend/src/hooks/useEvents.js
import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '../services/api';

export const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [stats, setStats] = useState({
    total: 0,
    averageConsensus: 0,
    totalParticipants: 0,
    urgentCount: 0,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await eventsService.getActiveEvents(filters);
      
      // Transformer les données de l'API pour correspondre au format frontend
      const transformedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        category: event.category_name || event.category,
        description: event.description,
        currentConsensus: Math.round((event.current_consensus || event.crowd_confidence_score || 0.5) * 100),
        userPrediction: event.user_prediction || null,
        participants: event.participant_count || event.total_participants || 0,
        daysLeft: calculateDaysLeft(event.target_date || event.resolution_date),
        trend: calculateTrend(event.trend_data || []),
        iaConfidence: event.ai_confidence_score || 0.5,
        impactScore: calculateImpactScore(event),
        sources: event.sources || event.evidence?.map(e => e.title) || [],
        lastUpdate: formatLastUpdate(event.updated_at || event.last_update),
        forecastValue: getForecastValue(event),
        status: getStatus(event.status, event.urgency),
        // Données supplémentaires de l'API
        rawData: event,
      }));
      
      setEvents(transformedEvents);
      
      // Calculer les statistiques
      if (transformedEvents.length > 0) {
        const totalParticipants = transformedEvents.reduce((sum, e) => sum + e.participants, 0);
        const averageConsensus = Math.round(
          transformedEvents.reduce((sum, e) => sum + e.currentConsensus, 0) / transformedEvents.length
        );
        const urgentCount = transformedEvents.filter(e => e.status === 'urgent').length;
        
        setStats({
          total: transformedEvents.length,
          totalParticipants,
          averageConsensus,
          urgentCount,
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des événements:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fonctions utilitaires
  const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return 30;
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTrend = (trendData) => {
    if (!trendData || trendData.length < 2) return 'stable';
    const last = trendData[trendData.length - 1];
    const previous = trendData[trendData.length - 2];
    return last > previous ? 'up' : last < previous ? 'down' : 'stable';
  };

  const calculateImpactScore = (event) => {
    // Calcul basé sur la portée géographique, le nombre de participants, etc.
    let score = 50;
    if (event.geographic_scope === 'National') score += 20;
    if (event.participant_count > 1000) score += 15;
    if (event.category === 'économie') score += 10;
    if (event.urgency === 'high') score += 15;
    return Math.min(score, 100);
  };

  const formatLastUpdate = (dateString) => {
    if (!dateString) return 'Il y a quelques instants';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getForecastValue = (event) => {
    const consensus = event.current_consensus || 0.5;
    if (consensus > 0.7) return 'Probabilité élevée';
    if (consensus > 0.4) return 'Probabilité moyenne';
    return 'Probabilité faible';
  };

  const getStatus = (status, urgency) => {
    if (urgency === 'high' || status === 'urgent') return 'urgent';
    if (status === 'active' || status === 'in_progress') return 'active';
    return 'pending';
  };

  // Charger les événements au montage et quand les filtres changent
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Fonction pour voter
  const submitVote = useCallback(async (eventId, vote) => {
    try {
      const predictionData = {
        value: vote === 'yes' ? 0.8 : 0.2, // Convertir en valeur numérique
        confidence: 0.7,
        reasoning: vote === 'yes' ? 'Je pense que cela va se produire' : 'Je ne pense pas que cela va se produire',
      };
      
      await eventsService.submitPrediction(eventId, predictionData);
      
      // Recharger les événements après le vote
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erreur lors du vote:', err);
      return false;
    }
  }, [fetchEvents]);

  // Fonction de recherche
  const searchEvents = useCallback(async (query) => {
    try {
      const data = await eventsService.searchEvents(query);
      const transformedEvents = data.map(event => ({
        // ... transformation similaire à fetchEvents
      }));
      setEvents(transformedEvents);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
    }
  }, []);

  return {
    events,
    loading,
    error,
    stats,
    filters,
    setFilters,
    submitVote,
    searchEvents,
    refresh: fetchEvents,
  };
};

// Hook pour les catégories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du chargement des catégories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook pour le dashboard
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [quickStats, aiInsights, personalData] = await Promise.all([
          dashboardService.getQuickStats(),
          dashboardService.getAiInsights(),
          dashboardService.getPersonalDashboard(),
        ]);
        
        setDashboardData({
          quickStats,
          aiInsights,
          personalData,
        });
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du chargement du dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { dashboardData, loading, error };
};