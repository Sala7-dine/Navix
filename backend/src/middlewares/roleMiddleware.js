// Middleware général pour autoriser certains rôles
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Rôle insuffisant' });
    }

    next();
  };
}

// Middleware spécifique pour admin uniquement
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès admin requis' });
  }
  next();
};

// Middleware pour seller ou admin
export const requireChauffeurOrAdmin = (req, res, next) => {
  if (!req.user || !['chauffeur', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès vendeur ou admin requis' });
  }
  next();
};

// Middleware pour vérifier que l'utilisateur est propriétaire ou admin
export const requireOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;

  if (!req.user) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  // Admin peut tout faire
  if (req.user.role === 'admin') {
    return next();
  }

  // Utilisateur peut seulement accéder à ses propres ressources
  if (req.user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({ error: 'Accès à cette ressource refusé' });
};


