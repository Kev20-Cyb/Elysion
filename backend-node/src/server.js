require("dotenv").config();

console.log("ORISHAI_API_BASE_URL =", process.env.ORISHAI_API_BASE_URL);

const express = require("express");
const cors = require("cors");
const { connectDB, disconnectDB } = require("./db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const chatRoutes = require("./routes/chat.routes");
const chatConfigRoutes = require("./routes/chatConfig.routes");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   CORS CONFIG (FIX)
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://elysion-france.fr",
  process.env.FRONTEND_ORIGIN, // pour la prod
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Autorise Postman / curl / SSR
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// 🔥 IMPORTANT pour les preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ ok: true, backend: "elysion-node" });
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat/config", chatConfigRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message || err);
  res.status(500).json({ detail: "Internal server error" });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Backend Elysion Node running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
