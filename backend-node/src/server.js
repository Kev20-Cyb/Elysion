// src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB, disconnectDB } = require("./db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true
  })
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, backend: "elysion-node" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Gestion des erreurs basiques
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ detail: "Internal server error" });
});

// Start server
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Backend Elysion Node running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
});

// Si tu veux gérer un "shutdown" propre : Ctrl+C ferme le process Node
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
