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
const newsletterRoutes = require("./routes/newsletter.routes");
const documentsRoutes = require("./routes/documents.routes");

const app = express();

/* CORS CONFIG (FIX) */
const allowedOrigins = [
     "http://localhost:3000",
     "http://localhost:3001",
     process.env.FRONTEND_ORIGIN,
   ].filter(Boolean);

app.use(
     cors({
            origin: (origin, cb) => {
                     if (!origin) return cb(null, true);

              if (allowedOrigins.includes(origin)) {
                         return cb(null, true);
              }

              return cb(new Error(`CORS blocked: ${origin}`));
            },
            credentials: true,
     })
   );

app.options("*", cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
     res.json({ ok: true, backend: "elysion-node" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat/config", chatConfigRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/documents", documentsRoutes);

app.use((err, req, res, next) => {
     console.error("Unhandled error:", err.message || err);
     res.status(500).json({ detail: "Internal server error" });
});

// MIGRATION VERCEL (2026-07) : sur Vercel, ce fichier est importe par
// backend-node/api/index.js et l'app Express exportee est utilisee directement
// comme handler serverless -- app.listen() n'est jamais appele (le check
// require.main ci-dessous garantit ca). En local (npm run dev / npm start)
// ou sur le VPS existant (node src/server.js), le comportement est inchange.
if (require.main === module) {
     const PORT = process.env.PORT || 5000;
     app.listen(PORT, async () => {
            try {
                     await connectDB();
                     console.log(`Backend Elysion Node running on http://localhost:${PORT}`);
            } catch (err) {
                     console.error("Failed to connect to DB:", err);
                     process.exit(1);
            }
     });

  process.on("SIGINT", async () => {
         await disconnectDB();
         process.exit(0);
  });
}

module.exports = app;
