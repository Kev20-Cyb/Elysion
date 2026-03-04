// src/routes/documents.routes.js
// Coffre-fort documentaire - Routes pour la gestion des documents PDF
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../db");
const { authRequired } = require("../authMiddleware");

const router = express.Router();

// Configuration du dossier d'upload
const UPLOAD_DIR = path.join(__dirname, "../../uploads/documents");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/x-pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont acceptés"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Catégories valides
const VALID_CATEGORIES = [
  "salary_slip",
  "career_statement",
  "tax_declaration",
  "retirement_contract",
  "other",
];

// ============================================
// POST /api/documents/upload
// Upload un document PDF
// ============================================
router.post("/upload", authRequired, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ detail: "Le fichier est trop volumineux. Taille maximale : 10MB" });
      }
      return res.status(400).json({ detail: err.message });
    }
    if (err) {
      return res.status(400).json({ detail: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ detail: "Aucun fichier fourni" });
    }

    try {
      const category = VALID_CATEGORIES.includes(req.body.category)
        ? req.body.category
        : "other";

      const docId = uuidv4();

      const result = await pool.query(
        `INSERT INTO documents (id, user_id, filename, original_name, category, file_size, mime_type, file_path, uploaded_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, filename, original_name AS original_filename, category, file_size, uploaded_at, updated_at`,
        [
          docId,
          req.user.id,
          req.file.originalname,
          req.file.originalname,
          category,
          req.file.size,
          req.file.mimetype,
          req.file.path,
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Document upload error:", error);
      // Nettoyer le fichier en cas d'erreur DB
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ detail: "Erreur lors de l'upload du document" });
    }
  });
});

// ============================================
// GET /api/documents
// Liste les documents de l'utilisateur
// ============================================
router.get("/", authRequired, async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT id, filename, original_name AS original_filename, category, file_size, uploaded_at, updated_at
      FROM documents
      WHERE user_id = $1
    `;
    const params = [req.user.id];

    if (category && VALID_CATEGORIES.includes(category)) {
      query += ` AND category = $2`;
      params.push(category);
    }

    query += ` ORDER BY uploaded_at DESC`;

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (error) {
    console.error("Documents list error:", error);
    return res.status(500).json({ detail: "Erreur lors de la récupération des documents" });
  }
});

// ============================================
// GET /api/documents/stats/summary
// Statistiques des documents
// ============================================
router.get("/stats/summary", authRequired, async (req, res) => {
  try {
    // Total count + size
    const totals = await pool.query(
      `SELECT COUNT(*) AS total_documents, COALESCE(SUM(file_size), 0) AS total_size_bytes
       FROM documents WHERE user_id = $1`,
      [req.user.id]
    );

    // Count by category
    const categories = await pool.query(
      `SELECT category, COUNT(*) AS count
       FROM documents WHERE user_id = $1
       GROUP BY category`,
      [req.user.id]
    );

    // Recent (last 7 days)
    const recent = await pool.query(
      `SELECT COUNT(*) AS recent_count
       FROM documents
       WHERE user_id = $1 AND uploaded_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'`,
      [req.user.id]
    );

    const byCategory = {};
    categories.rows.forEach((row) => {
      byCategory[row.category] = parseInt(row.count, 10);
    });

    const totalBytes = parseInt(totals.rows[0].total_size_bytes, 10);

    return res.json({
      total_documents: parseInt(totals.rows[0].total_documents, 10),
      total_size_bytes: totalBytes,
      total_size_mb: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
      by_category: byCategory,
      recent_count: parseInt(recent.rows[0].recent_count, 10),
    });
  } catch (error) {
    console.error("Document stats error:", error);
    return res.status(500).json({ detail: "Erreur lors de la récupération des statistiques" });
  }
});

// ============================================
// GET /api/documents/:id
// Récupère un document spécifique
// ============================================
router.get("/:id", authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, filename, original_name AS original_filename, category, file_size, uploaded_at, updated_at
       FROM documents WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ detail: "Document non trouvé" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Document get error:", error);
    return res.status(500).json({ detail: "Erreur lors de la récupération du document" });
  }
});

// ============================================
// GET /api/documents/:id/download
// Télécharge le fichier PDF
// ============================================
router.get("/:id/download", authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT filename, file_path FROM documents WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ detail: "Document non trouvé" });
    }

    const doc = result.rows[0];

    if (!fs.existsSync(doc.file_path)) {
      return res.status(404).json({ detail: "Fichier introuvable sur le serveur" });
    }

    return res.download(doc.file_path, doc.filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ detail: "Erreur lors du téléchargement" });
        }
      }
    });
  } catch (error) {
    console.error("Document download error:", error);
    return res.status(500).json({ detail: "Erreur lors du téléchargement" });
  }
});

// ============================================
// PATCH /api/documents/:id
// Met à jour le nom ou la catégorie d'un document
// ============================================
router.patch("/:id", authRequired, async (req, res) => {
  try {
    const { filename, category } = req.body;

    // Vérifier que le document existe et appartient à l'utilisateur
    const existing = await pool.query(
      `SELECT id FROM documents WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ detail: "Document non trouvé" });
    }

    // Construire la mise à jour dynamiquement
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (filename) {
      updates.push(`filename = $${paramIndex++}`);
      values.push(filename);
    }
    if (category && VALID_CATEGORIES.includes(category)) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }

    if (updates.length === 0) {
      // Rien à mettre à jour, retourner le document tel quel
      const doc = await pool.query(
        `SELECT id, filename, original_name AS original_filename, category, file_size, uploaded_at, updated_at
         FROM documents WHERE id = $1`,
        [req.params.id]
      );
      return res.json(doc.rows[0]);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE documents SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING id, filename, original_name AS original_filename, category, file_size, uploaded_at, updated_at`,
      values
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Document update error:", error);
    return res.status(500).json({ detail: "Erreur lors de la mise à jour" });
  }
});

// ============================================
// DELETE /api/documents/:id
// Supprime un document (fichier + BDD)
// ============================================
router.delete("/:id", authRequired, async (req, res) => {
  try {
    // Récupérer le chemin du fichier avant suppression
    const existing = await pool.query(
      `SELECT file_path FROM documents WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ detail: "Document non trouvé" });
    }

    const filePath = existing.rows[0].file_path;

    // Supprimer de la BDD
    await pool.query(`DELETE FROM documents WHERE id = $1`, [req.params.id]);

    // Supprimer le fichier physique
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsErr) {
      console.error("Error deleting file from disk:", fsErr);
    }

    return res.json({ message: "Document supprimé avec succès" });
  } catch (error) {
    console.error("Document delete error:", error);
    return res.status(500).json({ detail: "Erreur lors de la suppression" });
  }
});

module.exports = router;