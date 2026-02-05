const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

/**
 * POST /api/newsletter/subscribe
 * Inscrit un email à la newsletter
 */
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ detail: "L'email est requis." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ detail: "Format d'email invalide." });
    }

    const db = getDB();
    const newsletterCollection = db.collection("newsletter_subscribers");

    // Vérifier si l'email existe déjà
    const existingSubscriber = await newsletterCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingSubscriber) {
      return res.status(409).json({ detail: "Cette adresse email est déjà inscrite." });
    }

    // Insérer le nouvel abonné
    await newsletterCollection.insertOne({
      email: email.toLowerCase(),
      subscribed_at: new Date(),
      is_active: true,
      source: "landing_page"
    });

    res.status(201).json({ 
      message: "Inscription réussie !",
      email: email.toLowerCase()
    });

  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ detail: "Erreur lors de l'inscription." });
  }
});

/**
 * DELETE /api/newsletter/unsubscribe
 * Désinscrit un email de la newsletter
 */
router.delete("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ detail: "L'email est requis." });
    }

    const db = getDB();
    const newsletterCollection = db.collection("newsletter_subscribers");

    const result = await newsletterCollection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          is_active: false,
          unsubscribed_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ detail: "Email non trouvé." });
    }

    res.json({ message: "Désinscription réussie." });

  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    res.status(500).json({ detail: "Erreur lors de la désinscription." });
  }
});

/**
 * GET /api/newsletter/subscribers
 * Liste tous les abonnés (admin only - à protéger)
 */
router.get("/subscribers", async (req, res) => {
  try {
    const db = getDB();
    const newsletterCollection = db.collection("newsletter_subscribers");

    const subscribers = await newsletterCollection
      .find({ is_active: true })
      .sort({ subscribed_at: -1 })
      .toArray();

    // Exclure _id pour éviter les problèmes de sérialisation
    const cleanedSubscribers = subscribers.map(({ _id, ...rest }) => rest);

    res.json({ 
      count: cleanedSubscribers.length,
      subscribers: cleanedSubscribers 
    });

  } catch (error) {
    console.error("Newsletter list error:", error);
    res.status(500).json({ detail: "Erreur lors de la récupération des abonnés." });
  }
});

module.exports = router;