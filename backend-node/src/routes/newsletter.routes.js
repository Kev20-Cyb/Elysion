const express = require("express");
const { pool } = require("../db");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

/**
 * POST /api/newsletter/subscribe
 * Inscrit un email à la newsletter
 */
router.post("/subscribe", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const source = String(req.body.source || "landing_page").trim().slice(0, 50);

    if (!email) return res.status(400).json({ detail: "L'email est requis." });
    if (!isValidEmail(email)) return res.status(400).json({ detail: "Format d'email invalide." });

    // Upsert : si déjà inscrit, on réactive (UX plus smooth)
    const q = `
      INSERT INTO newsletter_subscribers (email, source, is_active, subscribed_at, unsubscribed_at)
      VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP, NULL)
      ON CONFLICT (email) DO UPDATE SET
        is_active = TRUE,
        source = EXCLUDED.source,
        subscribed_at = CURRENT_TIMESTAMP,
        unsubscribed_at = NULL
      RETURNING id, email, subscribed_at, is_active, source
    `;
    const r = await pool.query(q, [email, source]);

    return res.status(201).json({
      message: "Inscription réussie !",
      subscriber: r.rows[0],
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return res.status(500).json({ detail: "Erreur lors de l'inscription." });
  }
});
/**
 * POST /api/newsletter/unsubscribe
 * Désinscrit un email de la newsletter
 */
router.post("/unsubscribe", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) return res.status(400).json({ detail: "L'email est requis." });
    if (!isValidEmail(email)) return res.status(400).json({ detail: "Format d'email invalide." });

    const r = await pool.query(
      `UPDATE newsletter_subscribers
       SET is_active = FALSE,
           unsubscribed_at = CURRENT_TIMESTAMP
       WHERE email = $1
       RETURNING id, email, unsubscribed_at, is_active`,
      [email]
    );

    if (r.rowCount === 0) {
      return res.status(404).json({ detail: "Email non trouvé." });
    }

    return res.json({ message: "Désinscription réussie.", subscriber: r.rows[0] });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return res.status(500).json({ detail: "Erreur lors de la désinscription." });
  }
});

/**
 * GET /api/newsletter/subscribers
 * Liste tous les abonnés actifs (à protéger si besoin)
 */
router.get("/subscribers", async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, email, subscribed_at, unsubscribed_at, is_active, source
       FROM newsletter_subscribers
       WHERE is_active = TRUE
       ORDER BY subscribed_at DESC
       LIMIT 1000`
    );

    return res.json({ count: r.rowCount, subscribers: r.rows });
  } catch (error) {
    console.error("Newsletter list error:", error);
    return res.status(500).json({ detail: "Erreur lors de la récupération des abonnés." });
  }
});

module.exports = router;
