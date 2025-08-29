// middleware/roleMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../Models');
// Middleware pour vérifier le rôle
// Middleware/roleMiddleware.js

// Mapping des profils (id_profile => rôle lisible)
// middleware/roleMiddleware.js
// Middleware للتحقق من صلاحيات الـ roles
const roleMap = {
  1: 'Admin',             
  2: 'Chef',              
  3: 'Fonctionnaire',
  4: 'SG',
  5: 'CabinetGouv',
  6: 'Gouv'
};

const roleMiddleware = (allowedRoles = [], allowSelf = false) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Non authentifié' });

    const userRole = roleMap[req.user.id_profile] || 'Unknown';

    // Admin عندو كلشي
    if (userRole === 'Admin') return next();

    // Vérification des roles
    if (allowedRoles.includes(userRole)) return next();

    // Vérifier si utilisateur peut accéder à son propre compte
    if (allowSelf && req.params.id_user && Number(req.params.id_user) === req.user.id_user) return next();

    return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
  };
};

module.exports = { roleMiddleware };

