// src/routes/auth.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../db");
const { authRequired } = require("../authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: "Email and password are required" });
    }

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ detail: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      email,
      password: hashed,
      firstName: firstName || "",
      lastName: lastName || "",
      createdAt: new Date()
    };

    const result = await users.insertOne(user);

    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: "Email and password are required" });
    }

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /api/auth/me (protégé)
router.get("/me", authRequired, async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new require("mongodb").ObjectId(req.user.userId) });

    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    return res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
