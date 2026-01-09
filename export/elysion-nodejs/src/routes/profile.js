const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, UserProfile, RetirementProfile } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { formatUserResponse } = require('../utils/helpers');

const router = express.Router();

// ============================================
// GET /api/profile - Récupérer le profil
// ============================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.json(null);
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ detail: 'Erreur serveur' });
  }
});

// ============================================
// PUT /api/profile - Mettre à jour le profil
// ============================================
router.put('/', authenticateToken, async (req, res) => {
  try {
    const [profile, created] = await UserProfile.findOrCreate({
      where: { userId: req.user.id },
      defaults: { userId: req.user.id }
    });

    // Mettre à jour les champs fournis
    const allowedFields = [
      'dateOfBirth', 'gender', 'familySituation', 'childrenCount',
      'careerStartYear', 'currentSalary', 'validatedQuarters',
      'activityType', 'legalStatus', 'averageIncome', 'pensionScheme',
      'hadUnemployment', 'unemploymentDuration', 'unemploymentUnit',
      'hadParentalLeave', 'parentalLeaveDuration', 'parentalLeaveUnit',
      'hadSickLeave', 'sickLeaveDuration', 'sickLeaveUnit'
    ];

    const updates = {};
    for (const field of allowedFields) {
      // Convertir snake_case en camelCase si nécessaire
      const snakeField = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      } else if (req.body[snakeField] !== undefined) {
        updates[field] = req.body[snakeField];
      }
    }

    await profile.update(updates);

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ detail: 'Erreur lors de la mise à jour' });
  }
});

// ============================================
// GET /api/profile/retirement - Profil retraite
// ============================================
router.get('/retirement', authenticateToken, async (req, res) => {
  try {
    const retirementProfile = await RetirementProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!retirementProfile) {
      return res.json(null);
    }

    res.json(retirementProfile);
  } catch (error) {
    console.error('Get retirement profile error:', error);
    res.status(500).json({ detail: 'Erreur serveur' });
  }
});

// ============================================
// PUT /api/profile/retirement - Mettre à jour profil retraite
// ============================================
router.put('/retirement', authenticateToken, async (req, res) => {
  try {
    const [profile, created] = await RetirementProfile.findOrCreate({
      where: { userId: req.user.id },
      defaults: { 
        userId: req.user.id,
        currentAge: req.body.current_age || req.body.currentAge || 30
      }
    });

    const allowedFields = [
      'currentAge', 'targetRetirementAge', 'monthlyIncome',
      'currentSavings', 'monthlyContributions', 'estimatedPension',
      'estimatedBasePension', 'estimatedComplementaryPension',
      'replacementRate', 'totalQuarters', 'requiredQuarters',
      'agircArrcoPoints', 'rciPoints'
    ];

    const updates = {};
    for (const field of allowedFields) {
      const snakeField = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      } else if (req.body[snakeField] !== undefined) {
        updates[field] = req.body[snakeField];
      }
    }

    await profile.update(updates);

    res.json(profile);
  } catch (error) {
    console.error('Update retirement profile error:', error);
    res.status(500).json({ detail: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
