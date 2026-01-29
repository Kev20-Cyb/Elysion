const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const documentsRoutes = require('./routes/documents');
const dashboardRoutes = require('./routes/dashboard');

// Créer l'application Express
const app = express();

// ============================================
// MIDDLEWARES
// ============================================

// Sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// ROUTES
// ============================================

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route racine
app.get('/api', (req, res) => {
  res.json({
    name: 'Elysion API',
    version: '1.0.0',
    description: 'Plateforme de simulation de retraite',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        requestReset: 'POST /api/auth/request-password-reset',
        resetPassword: 'POST /api/auth/reset-password'
      },
      profile: {
        get: 'GET /api/profile',
        update: 'PUT /api/profile',
        retirement: 'GET /api/profile/retirement',
        updateRetirement: 'PUT /api/profile/retirement'
      },
      documents: {
        list: 'GET /api/documents',
        upload: 'POST /api/documents/upload',
        download: 'GET /api/documents/download/:id',
        update: 'PUT /api/documents/:id',
        delete: 'DELETE /api/documents/:id'
      },
      dashboard: 'GET /api/dashboard'
    }
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    detail: 'Route non trouvée',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      detail: 'Fichier trop volumineux (max 10MB)'
    });
  }

  if (err.message === 'Seuls les fichiers PDF sont autorisés') {
    return res.status(400).json({ detail: err.message });
  }

  res.status(err.status || 500).json({
    detail: err.message || 'Erreur serveur interne'
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

const PORT = process.env.PORT || 8001;

const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await testConnection();

    // Synchroniser les modèles (créer les tables si nécessaire)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Base de données synchronisée');

    // Démarrer le serveur
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 ELYSION API - Node.js/Express.js                     ║
║                                                           ║
║   Serveur démarré sur: http://0.0.0.0:${PORT}               ║
║   Environnement: ${process.env.NODE_ENV || 'development'}                          ║
║   Base de données: PostgreSQL                             ║
║                                                           ║
║   Endpoints:                                              ║
║   • API: http://localhost:${PORT}/api                       ║
║   • Health: http://localhost:${PORT}/api/health             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
