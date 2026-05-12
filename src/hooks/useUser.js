// ═══════════════════════════════════════════════════════════════
// PICHAI — src/hooks/useUser.js
//
// Hook + Context d'authentification centralisé
//
// Usage :
//   1. Envelopper l'app avec <AuthProvider> dans main.jsx
//   2. Utiliser useAuth() dans n'importe quel composant
//
// Fonctionnalités :
//   - Chargement du profil au montage (si token présent)
//   - Login / Logout
//   - Mise à jour du profil
//   - Notifications + rafraîchissement
//   - Nettoyage propre (pas de setState sur composant démonté)
//   - Détection 401 compatible Axios et fetch natif
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';


// ════════════════════════════════════════════════════════════════
// CONTEXT
// ════════════════════════════════════════════════════════════════

const AuthContext = createContext(null);


// ════════════════════════════════════════════════════════════════
// HOOK INTERNE — ne pas utiliser directement hors de AuthProvider
// ════════════════════════════════════════════════════════════════

const _useUserState = () => {
  const [user,          setUser         ] = useState(null);
  const [isLoading,     setIsLoading    ] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount  ] = useState(0);


  // ── Helpers ────────────────────────────────────────────────

  /** Détecte un statut HTTP 401 quelle que soit la forme de l'erreur */
  const _is401 = (error) =>
    error?.response?.status === 401 ||   // Axios
    error?.status            === 401 ||   // fetch wrapper
    error?.code              === 401;

  /** Nettoie la session locale */
  const _clearSession = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  }, []);


  // ── Notifications ──────────────────────────────────────────

  const refreshNotifications = useCallback(async () => {
    try {
      // userAPI.getNotifications() → { data: { notifications, unread_count } }
      const res = await userAPI.getNotifications();
      const data = res?.data || res || {};
      setNotifications(data.notifications || []);
      setUnreadCount(  data.unread_count  || 0);
    } catch (error) {
      // console.warn('[useUser] Notifications non disponibles :', error);
    }
  }, []);


  // ── Chargement initial ─────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // authAPI.getCurrentUser() → { data: { user: {...} } }
        const res = await authAPI.getCurrentUser();
        if (cancelled) return;

        const userData = res?.data?.user || res?.data || res;
        if (!userData || !userData.id) {
          throw new Error('Profil utilisateur invalide');
        }

        setUser(userData);
        refreshNotifications();

      } catch (error) {
        if (cancelled) return;
        // console.error('[useUser] Chargement du profil échoué :', error);
        if (_is401(error)) _clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchUserData();
    return () => { cancelled = true; };
  }, [_clearSession, refreshNotifications]);


  // ── Actions ────────────────────────────────────────────────

  /**
   * Connexion utilisateur.
   * @param {{ email: string, password: string }} credentials
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  const login = useCallback(async (credentials) => {
    try {
      // authAPI.login() → { data: { access_token, refresh_token, user? } }
      const loginRes = await authAPI.login(credentials);
      const loginData = loginRes?.data || loginRes;

      const token = loginData?.access_token;
      if (!token) throw new Error('Token absent dans la réponse');

      localStorage.setItem('access_token', token);
      if (loginData?.refresh_token) {
        localStorage.setItem('refresh_token', loginData.refresh_token);
      }

      // Récupérer le profil complet
      const profileRes = await authAPI.getCurrentUser();
      const userData = profileRes?.data?.user || profileRes?.data || profileRes;

      setUser(userData);
      await refreshNotifications();

      return { success: true, user: userData };

    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);

      return {
        success: false,
        error: error?.response?.data?.detail ||
               error?.message               ||
               'Erreur de connexion',
      };
    }
  }, [refreshNotifications]);


  /**
   * Déconnexion utilisateur.
   * Le token est toujours supprimé, même si l'appel API échoue.
   */
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Échec silencieux — on déconnecte quand même côté client
      // console.warn('[useUser] Erreur lors de la déconnexion serveur :', error);
    } finally {
      _clearSession();
    }
  }, [_clearSession]);


  /**
   * Mise à jour du profil utilisateur.
   * @param {object} data  Champs à mettre à jour
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  const updateProfile = useCallback(async (data) => {
    try {
      // userAPI.updateProfile() → { data: { success, user } }
      const res = await userAPI.updateProfile(data);
      const updated = res?.data?.user || res?.data || res;
      setUser(updated);
      return { success: true, user: updated };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.detail ||
               error?.message               ||
               'Erreur lors de la mise à jour',
      };
    }
  }, []);


  // ── Valeurs exposées ───────────────────────────────────────

  return {
    // État utilisateur
    user,
    isLoading,
    isAuthenticated: !!user || !!localStorage.getItem('access_token'),

    // Notifications
    notifications,
    unreadCount,
    refreshNotifications,

    // Actions
    login,
    logout,
    updateProfile,

    // Raccourcis profil (valeurs par défaut sûres)
    userLevel          : user?.level               ?? 1,
    credibilityScore   : user?.credibility_score   ?? 0,
    totalContributions : user?.total_contributions ?? 0,
    userRole           : user?.role                ?? 'citizen',
    isAdmin            : ['admin', 'moderator', 'editor'].includes(user?.role),
  };
};


// ════════════════════════════════════════════════════════════════
// PROVIDER — à placer au niveau racine de l'app (main.jsx)
// ════════════════════════════════════════════════════════════════

/**
 * Envelopper l'app entière avec AuthProvider pour partager
 * l'état d'authentification sans re-fetch à chaque composant.
 *
 * @example
 * // main.jsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  const value = _useUserState();
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// ════════════════════════════════════════════════════════════════
// HOOK PUBLIC — à utiliser dans les composants
// ════════════════════════════════════════════════════════════════

/**
 * Hook d'authentification centralisé.
 * Doit être utilisé à l'intérieur d'un <AuthProvider>.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('[useAuth] Doit être utilisé à l\'intérieur d\'un <AuthProvider>');
  }
  return context;
};


// ════════════════════════════════════════════════════════════════
// EXPORT LEGACY — compatibilité avec l'ancien import useUser()
// ════════════════════════════════════════════════════════════════

/**
 * @deprecated Utiliser useAuth() à la place.
 * Conservé pour ne pas casser les imports existants.
 */
export const useUser = useAuth;