const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { Document, DocumentCategory } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configuration Multer pour l'upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.env.UPLOAD_DIR || './uploads', req.user.id);
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
    }
  }
});

// ============================================
// POST /api/documents/upload - Upload document
// ============================================
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'Aucun fichier fourni' });
    }

    const category = req.body.category || 'other';
    
    // Valider la catégorie
    if (!Object.values(DocumentCategory).includes(category)) {
      return res.status(400).json({ detail: 'Catégorie invalide' });
    }

    const document = await Document.create({
      userId: req.user.id,
      filename: req.body.filename || req.file.originalname,
      originalFilename: req.file.originalname,
      category,
      fileSize: req.file.size,
      filePath: req.file.path,
      mimeType: req.file.mimetype
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ detail: 'Erreur lors de l\'upload' });
  }
});

// ============================================
// GET /api/documents - Liste des documents
// ============================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    
    const where = { userId: req.user.id };
    if (category && Object.values(DocumentCategory).includes(category)) {
      where.category = category;
    }

    const documents = await Document.findAll({
      where,
      order: [['uploaded_at', 'DESC']]
    });

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ detail: 'Erreur serveur' });
  }
});

// ============================================
// GET /api/documents/download/:id - Télécharger
// ============================================
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({ detail: 'Document non trouvé' });
    }

    res.download(document.filePath, document.filename);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ detail: 'Erreur lors du téléchargement' });
  }
});

// ============================================
// PUT /api/documents/:id - Mettre à jour
// ============================================
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({ detail: 'Document non trouvé' });
    }

    const updates = {};
    if (req.body.filename) {
      updates.filename = req.body.filename;
    }
    if (req.body.category && Object.values(DocumentCategory).includes(req.body.category)) {
      updates.category = req.body.category;
    }

    await document.update(updates);

    res.json(document);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ detail: 'Erreur lors de la mise à jour' });
  }
});

// ============================================
// DELETE /api/documents/:id - Supprimer
// ============================================
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({ detail: 'Document non trouvé' });
    }

    // Supprimer le fichier physique
    try {
      await fs.unlink(document.filePath);
    } catch (err) {
      console.warn('Could not delete file:', err);
    }

    await document.destroy();

    res.json({ message: 'Document supprimé' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ detail: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
