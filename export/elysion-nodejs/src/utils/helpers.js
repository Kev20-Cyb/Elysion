const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Hash un mot de passe
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Vérifie un mot de passe
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Crée un token d'accès JWT
 */
const createAccessToken = (userId, expiresIn = process.env.JWT_EXPIRES_IN || '30m') => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Crée un token de réinitialisation de mot de passe
 */
const createResetToken = (email) => {
  return jwt.sign(
    { email, type: 'reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Vérifie un token de réinitialisation
 */
const verifyResetToken = (token) => {
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    if (decoded && decoded.type === 'reset') {
      jwt.verify(token, process.env.JWT_SECRET);
      return decoded.email;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Convertit une durée en mois
 */
const convertToMonths = (duration, unit) => {
  if (unit === 'days') {
    return duration / 30;
  }
  return duration;
};

/**
 * Calcule les trimestres pour freelance selon le revenu
 */
const calculateQuarters = (annualRevenue) => {
  const THRESHOLDS = {
    1: 4020,
    2: 8040,
    3: 12060,
    4: 16080
  };

  if (annualRevenue >= THRESHOLDS[4]) return 4;
  if (annualRevenue >= THRESHOLDS[3]) return 3;
  if (annualRevenue >= THRESHOLDS[2]) return 2;
  if (annualRevenue >= THRESHOLDS[1]) return 1;
  return 0;
};

/**
 * Valeur du point de retraite complémentaire (2024)
 */
const POINT_VALUE = 1.4386;

/**
 * Formate une réponse utilisateur (sans mot de passe)
 */
const formatUserResponse = (user) => {
  const { hashedPassword, ...userData } = user.toJSON ? user.toJSON() : user;
  return userData;
};

module.exports = {
  hashPassword,
  verifyPassword,
  createAccessToken,
  createResetToken,
  verifyResetToken,
  convertToMonths,
  calculateQuarters,
  POINT_VALUE,
  formatUserResponse
};
