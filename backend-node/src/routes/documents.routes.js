// src/routes/documents.routes.js
// Coffre-fort documentaire - Routes pour la gestion des documents PDF
//
// MIGRATION VERCEL (2026-07) : le stockage des fichiers est passe du disque local
// (multer.diskStorage) vers Vercel Blob (@vercel/blob), car le systeme de fichiers
// d'une fonction serverless Vercel est ephemere et non partage entre invocations.
// La colonne file_path en base contient desormais l'URL du blob
// (https://...blob.vercel-storage.com/...) au lieu d'un chemin disque local.
const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { put, del } = require("@vercel/blob");
const { pool } = require("../db");
const { authRequired } = require("../authMiddleware");

const router = express.Router();

// Multer garde le fichier en memoire (buffer) au lieu de l'ecrire sur disque,
// on l'envoie ensuite directement vers Vercel Blob.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (
          file.mimetype === "application/pdf" ||
          file.mimetype === "application/x-pdf"
        ) {
          cb(null, true);
    } else {
          cb(new Error("Seuls les fichiers PDF sont acceptes"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const VALID_CATEGORIES = [
    "salary_slip",
    "career_statement",
    "tax_declaration",
    "retirement_contract",
    "other",
  ];

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

                              if (!req.user || !req.user.userId) {
                                      return res.status(401).json({
                                                detail: "Utilisateur non authentifie"
                                      });
                              }

                              let blob;
          try {
                  const category = VALID_CATEGORIES.includes(req.body.category)
                    ? req.body.category
                            : "other";

            const docId = uuidv4();
                  const blobName = `documents/${req.user.userId}/${docId}${path.extname(req.file.originalname)}`;

            blob = await put(blobName, req.file.buffer, {
                      access: "public",
                      contentType: req.file.mimetype,
                      token: process.env.BLOB_READ_WRITE_TOKEN,
            });

            const result = await pool.query(
                      `INSERT INTO documents (id, user_id, filename, original_filename, category, file_size, mime_type, file_path, uploaded_at, updated_at)
                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                                      RETURNING id, filename, original_filename AS original_filename, category, file_size, uploaded_at, updated_at`,
                      [
                                  docId,
                                       req.user.userId,
                                  req.file.originalname,
                                  req.file.originalname,
                                  category,
                                  req.file.size,
                                  req.file.mimetype,
                                  blob.url,
                                ]
                    );

            return res.status(201).json(result.rows[0]);
          } catch (error) {
                  console.error("Document upload error:", error);
                  if (blob && blob.url) {
                            try {
                                        await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
                            } catch (cleanupErr) {
                                        console.error("Blob cleanup error:", cleanupErr);
                            }
                  }
                  return res.status(500).json({ detail: "Erreur lors de l'upload du document" });
          }
    });
});

router.get("/", authRequired, async (req, res) => {
    try {
          const { category } = req.query;
          let query = `
                SELECT id, filename, original_filename AS original_filename, category, file_size, uploaded_at, updated_at
                      FROM documents
                            WHERE user_id = $1
                                `;
          const params = [req.user.userId];

      if (category && VALID_CATEGORIES.includes(category)) {
              query += ` AND category = $2`;
              params.push(category);
      }

      query += ` ORDER BY uploaded_at DESC`;

      const result = await pool.query(query, params);
          return res.json(result.rows);
    } catch (error) {
          console.error("Documents list error:", error);
          return res.status(500).json({ detail: "Erreur lors de la recuperation des documents" });
    }
});

router.get("/stats/summary", authRequired, async (req, res) => {
    try {
          const totals = await pool.query(
                  `SELECT COUNT(*) AS total_documents, COALESCE(SUM(file_size), 0) AS total_size_bytes
                         FROM documents WHERE user_id = $1`,
                  [req.user.userId]
                );

      const categories = await pool.query(
              `SELECT category, COUNT(*) AS count
                     FROM documents WHERE user_id = $1
                            GROUP BY category`,
              [req.user.userId]
            );

      const recent = await pool.query(
              `SELECT COUNT(*) AS recent_count
                     FROM documents
                            WHERE user_id = $1 AND uploaded_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'`,
              [req.user.userId]
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
          return res.status(500).json({ detail: "Erreur lors de la recuperation des statistiques" });
    }
});

router.get("/:id", authRequired, async (req, res) => {
    try {
          const result = await pool.query(
                  `SELECT id, filename, original_filename AS original_filename, category, file_size, uploaded_at, updated_at
                         FROM documents WHERE id = $1 AND user_id = $2`,
                  [req.params.id, req.user.userId]
                );

      if (result.rowCount === 0) {
              return res.status(404).json({ detail: "Document non trouve" });
      }

      return res.json(result.rows[0]);
    } catch (error) {
          console.error("Document get error:", error);
          return res.status(500).json({ detail: "Erreur lors de la recuperation du document" });
    }
});

router.get("/:id/download", authRequired, async (req, res) => {
    try {
          const result = await pool.query(
                  `SELECT filename, file_path FROM documents WHERE id = $1 AND user_id = $2`,
                  [req.params.id, req.user.userId]
                );

      if (result.rowCount === 0) {
              return res.status(404).json({ detail: "Document non trouve" });
      }

      const doc = result.rows[0];

      if (!doc.file_path) {
              return res.status(404).json({ detail: "Fichier introuvable" });
      }

      return res.redirect(302, doc.file_path);
    } catch (error) {
          console.error("Document download error:", error);
          return res.status(500).json({ detail: "Erreur lors du telechargement" });
    }
});

router.patch("/:id", authRequired, async (req, res) => {
    try {
          const { filename, category } = req.body;

      const existing = await pool.query(
              `SELECT id FROM documents WHERE id = $1 AND user_id = $2`,
              [req.params.id, req.user.userId]
            );

      if (existing.rowCount === 0) {
              return res.status(404).json({ detail: "Document non trouve" });
      }

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
              const doc = await pool.query(
                        `SELECT id, filename, original_filename AS original_filename, category, file_size, uploaded_at, updated_at
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
                            RETURNING id, filename, original_filename AS original_filename, category, file_size, uploaded_at, updated_at`,
              values
            );

      return res.json(result.rows[0]);
    } catch (error) {
          console.error("Document update error:", error);
          return res.status(500).json({ detail: "Erreur lors de la mise a jour" });
    }
});

router.delete("/:id", authRequired, async (req, res) => {
    try {
          const existing = await pool.query(
                  `SELECT file_path FROM documents WHERE id = $1 AND user_id = $2`,
                  [req.params.id, req.user.userId]
                );

      if (existing.rowCount === 0) {
              return res.status(404).json({ detail: "Document non trouve" });
      }

      const blobUrl = existing.rows[0].file_path;

      await pool.query(`DELETE FROM documents WHERE id = $1`, [req.params.id]);

      if (blobUrl) {
              try {
                        await del(blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
              } catch (blobErr) {
                        console.error("Error deleting blob:", blobErr);
              }
      }

      return res.json({ message: "Document supprime avec succes" });
    } catch (error) {
          console.error("Document delete error:", error);
          return res.status(500).json({ detail: "Erreur lors de la suppression" });
    }
});

module.exports = router;
