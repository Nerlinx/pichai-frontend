// hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import api, { 
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
      if (category !== 'all') params.category = category;

      // ── Appels parallèles events + stats globales ──────────────
      const [response, statsRes] = await Promise.all([
        eventsAPI.getActiveEvents(params),
        api.get('/api/v1/claims/stats').catch(() => ({ data: {} })),  // ← NOUVEAU
      ]);

      const eventsData  = response.data?.events || [];
      const globalStats = statsRes.data || {};                         // ← NOUVEAU

      const safeEvents = eventsData.map(event => ({
        ...event,
        category    : getCategoryName(event.category),
        description : event.description || '',
        participants: event.participants || 0,
        impactScore : calculateImpactScore(event),
      }));

      setEvents(safeEvents);

      if (safeEvents.length > 0) {
        // participants = somme des votes par claim (comme avant)
        // MAIS on remplace par unique_participants du backend si disponible
        const totalParticipants = globalStats.unique_participants
          ?? safeEvents.reduce((sum, e) => sum + e.participants, 0);

        const averageConsensus = Math.round(
          safeEvents.reduce((sum, e) => sum + (e.currentConsensus || 0), 0) / safeEvents.length
        );

        setStats({
          total             : safeEvents.length,
          totalParticipants : globalStats.unique_participants              // ← users uniques du backend
            ?? safeEvents.reduce((sum, e) => sum + e.participants, 0),    // ← fallback si /stats échoue
          averageConsensus,
          urgentCount       : safeEvents.filter(e => e.status === 'urgent').length,
          votes_this_month  : globalStats.votes_this_month ?? 0,
          ai_precision      : globalStats.ai_precision     ?? 0,
        });
      }

    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des événements');
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
      const predictionData = { vote, confidence_level: 0.7, reasoning: vote === 'yes' ? 'Je pense que cela va se produire' : 'Je ne pense pas que cela va se produire' };
      const res = await eventsAPI.submitClaimVote(eventId, predictionData);

      // ── Si vote anonyme → sauvegarder en localStorage ──────
      if (res?.data?.anonymous === true) {
        const pending = JSON.parse(localStorage.getItem('pending_votes') || '[]');
        const already = pending.find(v => v.claim_id === eventId);
        if (!already) {
          pending.push({ claim_id: eventId, value: vote === 'yes' ? 'probable' : 'improbable' });
          localStorage.setItem('pending_votes', JSON.stringify(pending));
        }
      }

      await fetchEvents();
      return true;
    } catch (err) {
      // console.error('Erreur lors du vote:', err);
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

      // console.log("CATEGORIES RAW:", response);

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