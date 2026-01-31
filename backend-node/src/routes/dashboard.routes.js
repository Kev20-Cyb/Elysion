const express = require("express");
const { authRequired } = require("../authMiddleware");

const router = express.Router();

// GET /api/dashboard
router.get("/", authRequired, async (req, res) => {
  try {
    // Pour l'instant on renvoie des valeurs mockées
    const data = {
      projected_retirement_age: 65,
      estimated_monthly_pension: 1800,
      savings_progress: 45,
      recommendations: [
        "Augmenter votre épargne mensuelle de 50€ pour atteindre plus rapidement votre objectif.",
        "Diversifier vos placements avec une part d’ETF pour lisser le risque.",
        "Mettre à jour vos informations de revenus pour affiner la simulation."
      ],
      recent_documents: [
        { name: "Relevé de carrière 2024", date: "01/11/2025", type: "retirement" },
        { name: "Avis d’imposition 2024", date: "15/10/2025", type: "tax" },
        { name: "Bulletin de salaire - Octobre 2025", date: "31/10/2025", type: "income" }
      ]
    };

    return res.json(data);
  } catch (err) {
    console.error("Dashboard route error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
