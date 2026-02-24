const express = require("express");
const { authRequired } = require("../authMiddleware");
const { pool } = require("../db");

const router = express.Router();

// GET /api/dashboard
router.get("/", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer la dernière simulation de l'utilisateur
    const simResult = await pool.query(
      "SELECT simulation_data, last_simulation_at FROM retirement_profiles WHERE user_id = $1",
      [userId]
    );
    
    const simulation = simResult.rows[0]?.simulation_data || null;
    
    // Calculer les données du dashboard basées sur la simulation
    let data = {
      projected_retirement_age: 64,
      estimated_monthly_pension: 1800,
      savings_progress: 65,
      recommendations: [
        "Augmenter votre épargne mensuelle de 50€ pour atteindre plus rapidement votre objectif.",
        "Diversifier vos placements avec une part d'ETF pour lisser le risque.",
        "Mettre à jour vos informations de revenus pour affiner la simulation."
      ],
      recent_documents: []
    };
    
    // Si une simulation existe, utiliser ses données
    if (simulation && simulation.results) {
      const results = simulation.results;
      data.projected_retirement_age = results.retirementAge || 64;
      data.estimated_monthly_pension = results.currentPension || results.scenarios?.[0]?.totalMonthly || 1800;
      data.savings_progress = results.replacementRate || 65;
    }

    return res.json(data);
  } catch (err) {
    console.error("Dashboard route error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /api/simulation/save - Sauvegarder les résultats de simulation
router.post("/simulation/save", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const simulationData = req.body;
    
    // Vérifier si un profil existe déjà
    const existing = await pool.query(
      "SELECT id FROM retirement_profiles WHERE user_id = $1",
      [userId]
    );
    
    if (existing.rows.length > 0) {
      // Mettre à jour
      await pool.query(
        `UPDATE retirement_profiles 
         SET simulation_data = $1, last_simulation_at = NOW(), updated_at = NOW() 
         WHERE user_id = $2`,
        [JSON.stringify(simulationData), userId]
      );
    } else {
      // Créer
      await pool.query(
        `INSERT INTO retirement_profiles (user_id, simulation_data, last_simulation_at, created_at, updated_at) 
         VALUES ($1, $2, NOW(), NOW(), NOW())`,
        [userId, JSON.stringify(simulationData)]
      );
    }
    
    return res.json({ message: "Simulation sauvegardée avec succès", success: true });
  } catch (err) {
    console.error("Save simulation error:", err);
    return res.status(500).json({ detail: "Erreur lors de la sauvegarde" });
  }
});

// GET /api/simulation/latest - Récupérer la dernière simulation
router.get("/simulation/latest", authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      "SELECT simulation_data, last_simulation_at FROM retirement_profiles WHERE user_id = $1",
      [userId]
    );
    
    if (result.rows.length === 0 || !result.rows[0].simulation_data) {
      return res.json({ simulation: null });
    }
    
    return res.json({
      simulation: result.rows[0].simulation_data,
      saved_at: result.rows[0].last_simulation_at
    });
  } catch (err) {
    console.error("Get latest simulation error:", err);
    return res.status(500).json({ detail: "Erreur lors de la récupération" });
  }
});

module.exports = router;