// src/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Ex : postgres://postgres:motdepasse@localhost:5432/elysion
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("[DB] Missing DATABASE_URL environment variable");
  throw new Error("DATABASE_URL is not defined");
}

// SSL : utile pour la prod (hébergeurs qui imposent TLS)
const ssl =
  process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({
  connectionString,
  ssl
});

async function connectDB() {
  // Petit ping pour vérifier que la connexion marche
  await pool.query("SELECT 1");
  console.log("[DB] Connected to PostgreSQL");
  return pool;
}

async function disconnectDB() {
  await pool.end();
  console.log("[DB] Disconnected from PostgreSQL");
}

module.exports = {
  pool,
  connectDB,
  disconnectDB
};
    