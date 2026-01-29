const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware d'authentification JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        detail: 'Token d\'authentification requis' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.sub, {
      attributes: { exclude: ['hashedPassword'] }
    });

    if (!user) {
      return res.status(401).json({ 
        detail: 'Utilisateur non trouvé' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        detail: 'Compte désactivé' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        detail: 'Token expiré' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        detail: 'Token invalide' 
      });
    }
    console.error('Auth error:', error);
    return res.status(500).json({ 
      detail: 'Erreur d\'authentification' 
    });
  }
};

/**
 * Middleware optionnel - authentifie si token présent
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.sub, {
        attributes: { exclude: ['hashedPassword'] }
      });
      req.user = user;
    }
    next();
  } catch (error) {
    // Token invalide, continuer sans authentification
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };
