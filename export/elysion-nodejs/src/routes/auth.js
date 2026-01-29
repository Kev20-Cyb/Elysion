const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, UserProfile, PasswordReset } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const {
  hashPassword,
  verifyPassword,
  createAccessToken,
  createResetToken,
  verifyResetToken,
  formatUserResponse
} = require('../utils/helpers');

const router = express.Router();

// ============================================
// POST /api/auth/register - Inscription
// ============================================
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty().trim(),
  body('user_type').isIn(['employee', 'freelancer', 'business_owner'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ detail: errors.array()[0].msg });
    }

    const { email, password, full_name, user_type } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ detail: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      hashedPassword,
      fullName: full_name,
      userType: user_type
    });

    // Créer le token
    const accessToken = createAccessToken(user.id);

    res.status(201).json({
      access_token: accessToken,
      token_type: 'bearer',
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ detail: 'Erreur lors de l\'inscription' });
  }
});

// ============================================
// POST /api/auth/login - Connexion
// ============================================
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ detail: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ detail: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.hashedPassword);
    if (!isValid) {
      return res.status(401).json({ detail: 'Email ou mot de passe incorrect' });
    }

    // Créer le token
    const accessToken = createAccessToken(user.id);

    res.json({
      access_token: accessToken,
      token_type: 'bearer',
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Erreur lors de la connexion' });
  }
});

// ============================================
// POST /api/auth/request-password-reset
// ============================================
router.post('/request-password-reset', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Ne pas révéler si l'email existe
      return res.json({ 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
      });
    }

    // Créer le token de réinitialisation
    const token = createResetToken(email);
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    await PasswordReset.create({
      email,
      token,
      expiresAt
    });

    // En production, envoyer l'email ici
    console.log(`Reset token for ${email}: ${token}`);

    res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      // En développement seulement:
      ...(process.env.NODE_ENV === 'development' && { token })
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ detail: 'Erreur lors de la demande' });
  }
});

// ============================================
// POST /api/auth/reset-password
// ============================================
router.post('/reset-password', [
  body('token').notEmpty(),
  body('new_password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { token, new_password } = req.body;

    // Vérifier le token
    const email = verifyResetToken(token);
    if (!email) {
      return res.status(400).json({ detail: 'Token invalide ou expiré' });
    }

    // Vérifier dans la base
    const resetRecord = await PasswordReset.findOne({
      where: { token, used: false }
    });

    if (!resetRecord) {
      return res.status(400).json({ detail: 'Token invalide ou déjà utilisé' });
    }

    if (new Date() > resetRecord.expiresAt) {
      return res.status(400).json({ detail: 'Token expiré' });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await hashPassword(new_password);
    await User.update(
      { hashedPassword },
      { where: { email } }
    );

    // Marquer le token comme utilisé
    await resetRecord.update({ used: true });

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ detail: 'Erreur lors de la réinitialisation' });
  }
});

// ============================================
// GET /api/auth/me - Utilisateur actuel
// ============================================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json(formatUserResponse(req.user));
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ detail: 'Erreur serveur' });
  }
});

module.exports = router;
