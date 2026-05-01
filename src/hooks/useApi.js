// hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import { 
  eventsAPI, 
  dashboardAPI, 
  userAPI, 
  analyticsAPI, 
  categoriesAPI 
} from '../services/api';

// ─────────────────────────────────────────────
// 🧠 HELPERS GLOBAUX
// ─────────────────────────────────────────────
const getCategoryName = (cat) =>
  typeof cat === 'string' ? cat : cat?.name || 'général';


// ─────────────────────────────────────────────
// 🔥 EVENTS HOOK
// ─────────────────────────────────────────────
export const useEvents = (options = {}) => {
  const { 
    category = 'all', 
    limit = 12, 
    autoRefresh = true 
  } = options;
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    averageConsensus: 0,
    totalParticipants: 0,
    urgentCount: 0,
  });

  // ─────────────────────────────────────────────
  // 📦 FETCH EVENTS
  // ─────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { limit };
      if (category !== 'all') {
        params.category = category;
      }
      
      const response = await eventsAPI.getActiveEvents(params);

      // ⚠️ IMPORTANT: api.js retourne déjà des events NORMALISÉS
      const eventsData = response.data?.events || [];

      // 👉 On ne casse pas le travail de normalizeClaim
      const safeEvents = eventsData.map(event => ({
        ...event,

        // 🔒 Sécuriser category
        category: getCategoryName(event.category),

        // 🔒 Sécuriser description
        description: event.description || '',

        // 🔒 Sécuriser participants
        participants: event.participants || 0,

        // 🔒 Impact score sécurisé
        impactScore: calculateImpactScore(event),
      }));

      setEvents(safeEvents);

      // ─── STATS ────────────────────────────────
      if (safeEvents.length > 0) {
        const totalParticipants = safeEvents.reduce((sum, e) => sum + e.participants, 0);

        const averageConsensus = Math.round(
          safeEvents.reduce((sum, e) => sum + (e.currentConsensus || 0), 0) / safeEvents.length
        );

        const urgentCount = safeEvents.filter(e => e.status === 'urgent').length;
        
        setStats({
          total: safeEvents.length,
          totalParticipants,
          averageConsensus,
          urgentCount,
        });
      }

    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des événements');
      console.error('useEvents error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  // ─────────────────────────────────────────────
  // ⚙️ HELPERS
  // ─────────────────────────────────────────────
  const calculateImpactScore = (event) => {
    let score = 50;

    if (event.geographic_scope === 'National') score += 20;
    if ((event.participants || 0) > 1000) score += 15;
    if (event.status === 'urgent') score += 15;

    const categoryName = getCategoryName(event.category);

    if (categoryName.toLowerCase().includes('économie')) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  // ─────────────────────────────────────────────
  // 🔁 AUTO LOAD
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchEvents();

    if (autoRefresh) {
      const interval = setInterval(fetchEvents, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchEvents, autoRefresh]);

  // ─────────────────────────────────────────────
  // 🗳️ VOTE
  // ─────────────────────────────────────────────
  const submitVote = useCallback(async (eventId, vote) => {
    try {
      const predictionData = {
        vote,
        confidence_level: 0.7,
        reasoning: vote === 'yes'
          ? 'Je pense que cela va se produire'
          : 'Je ne pense pas que cela va se produire',
      };
      
      await eventsAPI.submitPrediction(eventId, predictionData);
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erreur lors du vote:', err);
      return false;
    }
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    stats,
    refresh: fetchEvents,
    submitVote,
    updateEvent: (eventId, updates) => {
      setEvents(prev =>
        prev.map(event =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
    }
  };
};


// ─────────────────────────────────────────────
// 🧩 CATEGORIES HOOK
// ─────────────────────────────────────────────
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await categoriesAPI.getAllCategories();

      console.log("CATEGORIES RAW:", response);

      // 🔥 SAFE EXTRACTION (important)
      const categoriesData =
        response?.data?.categories ||
        response?.categories ||
        [];

      setCategories(categoriesData);

    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refresh: fetchCategories };
};


// ─────────────────────────────────────────────
// 📊 DASHBOARD
// ─────────────────────────────────────────────
export const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getCombinedDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Erreur dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refresh: fetchDashboard };
};


// ─────────────────────────────────────────────
// 👤 USER
// ─────────────────────────────────────────────
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserProfile();
      setUser(response.data?.user);
    } catch (err) {
      setError(err.message || 'Erreur profil');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refresh: fetchUser };
};