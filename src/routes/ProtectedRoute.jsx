// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();

  // Pendant le chargement utilisateur
  if (loading) {
    return null; // ou spinner
  }

  // Session expirée / pas connecté
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;