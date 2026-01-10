const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../db');
const { authRequired } = require('../authMiddleware');

const router = express.Router();

// Chemin du fichier local (ne committez pas ce fichier dans git)
const CONFIG_DIR = path.resolve(__dirname, '..', '..', 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'chatbot.json');

async function isAdmin(userId) {
  try {
    const res = await pool.query('SELECT user_type FROM users WHERE id = $1', [userId]);
    if (res.rowCount === 0) return false;
    const { user_type } = res.rows[0];
    return user_type === 'admin' || user_type === 'superadmin';
  } catch (err) {
    console.error('isAdmin check failed', err);
    return false;
  }
}

function maskKey(key) {
  if (!key) return '';
  if (key.length <= 8) return '****';
  return key.slice(0, 4) + '...' + key.slice(-4);
}

// GET /api/chat/config
// Retourne la config (apiKey masquée)
router.get('/', authRequired, async (req, res) => {
  try {
    // Only admin can view full config; others get masked values
    const admin = await isAdmin(req.user.userId);

    // Lire le fichier si présent
    let fileData = null;
    try {
      const raw = await fs.readFile(CONFIG_FILE, 'utf8');
      fileData = JSON.parse(raw);
    } catch (err) {
      // fichier absent -> fallback aux env vars
      fileData = {
        provider: process.env.CHATBOT_PROVIDER || process.env.OPENAI_PROVIDER || 'openai',
        apiKey: process.env.OPENAI_API_KEY || process.env.CHATBOT_API_KEY || '',
        model: process.env.OPENAI_MODEL || process.env.CHATBOT_MODEL || ''
      };
    }

    const response = {
      provider: fileData.provider || null,
      model: fileData.model || null,
      apiKey: admin ? fileData.apiKey || null : maskKey(fileData.apiKey || '')
    };

    return res.json(response);
  } catch (err) {
    console.error('GET /api/chat/config error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// POST /api/chat/config
// Body: { provider, apiKey, model }
router.post('/', authRequired, async (req, res) => {
  try {
    // Only admin can set config
    const admin = await isAdmin(req.user.userId);
    if (!admin) return res.status(403).json({ detail: 'Admin role required' });

    const { provider, apiKey, model } = req.body;
    if (!provider || !apiKey) {
      return res.status(400).json({ detail: 'provider and apiKey are required' });
    }

    // Ensure config dir exists
    try {
      await fs.mkdir(CONFIG_DIR, { recursive: true });
    } catch (err) {
      // ignore
    }

    const toSave = {
      provider,
      apiKey,
      model: model || ''
    };

    await fs.writeFile(CONFIG_FILE, JSON.stringify(toSave, null, 2), { mode: 0o600 });

    return res.json({ ok: true, message: 'Chatbot configuration saved (stored server-side).' });
  } catch (err) {
    console.error('POST /api/chat/config error:', err);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
