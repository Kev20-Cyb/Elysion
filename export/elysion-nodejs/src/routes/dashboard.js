const express = require('express');
const { User, UserProfile, RetirementProfile, Document } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { formatUserResponse } = require('../utils/helpers');

const router = express.Router();

// ============================================
// GET /api/dashboard - Données du tableau de bord
// ============================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Récupérer toutes les données utilisateur
    const [profile, retirementProfile, documents] = await Promise.all([
      UserProfile.findOne({ where: { userId: req.user.id } }),
      RetirementProfile.findOne({ where: { userId: req.user.id } }),
      Document.findAll({
        where: { userId: req.user.id },
        order: [['uploaded_at', 'DESC']],
        limit: 5
      })
    ]);

    // Construire la réponse
    const dashboardData = {
      user: formatUserResponse(req.user),
      profile: profile ? profile.toJSON() : null,
      retirement_estimate: retirementProfile ? {
        estimated_monthly_pension: parseFloat(retirementProfile.estimatedPension) || 0,
        estimated_base_pension: parseFloat(retirementProfile.estimatedBasePension) || 0,
        estimated_complementary_pension: parseFloat(retirementProfile.estimatedComplementaryPension) || 0,
        replacement_rate: parseFloat(retirementProfile.replacementRate) || 0,
        total_quarters: retirementProfile.totalQuarters || 0,
        required_quarters: retirementProfile.requiredQuarters || 172,
        target_retirement_age: retirementProfile.targetRetirementAge || 64
      } : {
        estimated_monthly_pension: 0,
        replacement_rate: 0,
        total_quarters: 0,
        required_quarters: 172,
        target_retirement_age: 64
      },
      progress: calculateProgress(profile, retirementProfile),
      recommendations: generateRecommendations(req.user, profile, retirementProfile),
      recent_documents: documents.map(doc => ({
        id: doc.id,
        filename: doc.filename,
        category: doc.category,
        uploaded_at: doc.uploadedAt
      }))
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ detail: 'Erreur serveur' });
  }
});

/**
 * Calcule la progression du profil
 */
function calculateProgress(profile, retirementProfile) {
  let completed = 0;
  const total = 5;

  if (profile) {
    if (profile.dateOfBirth) completed++;
    if (profile.careerStartYear) completed++;
    if (profile.currentSalary) completed++;
  }
  if (retirementProfile) {
    if (retirementProfile.estimatedPension > 0) completed++;
    if (retirementProfile.totalQuarters > 0) completed++;
  }

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
}

/**
 * Génère des recommandations personnalisées
 */
function generateRecommendations(user, profile, retirementProfile) {
  const recommendations = [];

  if (!profile || !profile.dateOfBirth) {
    recommendations.push('Complétez votre profil pour une estimation plus précise');
  }

  if (!retirementProfile || retirementProfile.estimatedPension === 0) {
    recommendations.push('Utilisez notre simulateur pour estimer votre retraite');
  }

  if (profile && profile.validatedQuarters < 100) {
    recommendations.push('Vérifiez votre relevé de carrière pour valider vos trimestres');
  }

  if (user.userType === 'freelancer') {
    recommendations.push('Pensez à optimiser vos cotisations retraite complémentaire (RCI)');
  }

  if (user.userType === 'employee') {
    recommendations.push('Consultez votre relevé Agirc-Arrco pour vérifier vos points');
  }

  return recommendations.slice(0, 3);
}

module.exports = router;
