// src/routes/auth.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const { authRequired } = require("../authMiddleware");

const router = express.Router();

// Helper pour générer le JWT
function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name, user_type } = req.body;

    if (!email || !password || !full_name || !user_type) {
      return res.status(400).json({ detail: "Missing required fields" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rowCount > 0) {
      return res.status(409).json({ detail: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users (email, full_name, user_type, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, user_type, created_at`,
      [email, full_name, user_type, passwordHash]
    );

    const user = insertResult.rows[0];
    const token = signToken(user);

    return res.status(201).json({
      token,
      user
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, email, full_name, user_type, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const token = signToken(user);

    // On ne renvoie jamais le hash
    delete user.password_hash;

    return res.json({
      token,
      user
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /api/auth/me (protégé)
router.get("/me", authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, full_name, user_type, created_at FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ detail: "User not found" });
    }

    return res.json({
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
