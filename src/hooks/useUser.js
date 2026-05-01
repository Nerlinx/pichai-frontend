// src/hooks/useUser.js
import { useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier si le token existe
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Récupérer le profil utilisateur
        const userData = await authAPI.getMe();
        setUser(userData);
        
        // Récupérer les notifications (optionnel)
        try {
          const notificationsData = await userAPI.getNotifications();
          setNotifications(notificationsData.notifications || []);
          setUnreadCount(notificationsData.unread_count || 0);
        } catch (notifError) {
          console.warn('Erreur lors du chargement des notifications:', notifError);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        
        // Si l'erreur est 401 (non autorisé), déconnecter
        if (error?.status === 401 || error?.code === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Stocker le token
      localStorage.setItem('token', response.access_token);
      
      // Récupérer les données utilisateur
      const userData = await authAPI.getMe();
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Erreur de connexion' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const updateProfile = async (data) => {
    try {
      const updatedUser = await userAPI.updateProfile(data);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshNotifications = async () => {
    try {
      const notificationsData = await userAPI.getNotifications();
      setNotifications(notificationsData.notifications || []);
      setUnreadCount(notificationsData.unread_count || 0);
    } catch (error) {
      console.warn('Erreur lors du rafraîchissement des notifications:', error);
    }
  };

  return {
    // Données utilisateur
    user,
    isLoading,
    isAuthenticated: !!user,
    
    // Notifications
    notifications,
    unreadCount,
    refreshNotifications,
    
    // Actions
    login,
    logout,
    updateProfile,
    
    // Métadonnées
    userLevel: user?.level || 1,
    credibilityScore: user?.credibility_score || 0,
    totalContributions: user?.total_contributions || 0,
  };
};