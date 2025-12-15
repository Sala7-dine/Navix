import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur est actif
  if (!user.status) {
    return <Navigate to="/pending" replace />;
  }

  // Si un rôle spécifique est requis, vérifier
  if (requiredRole && user.role !== requiredRole) {
    // Rediriger vers le dashboard approprié selon le rôle
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'chauffeur') {
      return <Navigate to="/chauffeur/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
