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

// SSL : utile pour la prod (hebergeurs qui imposent TLS)
const ssl =
    process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
      : false;

// MIGRATION VERCEL (2026-07) : pool limite pour environnement serverless.
// Utiliser de preference l'URL du connection pooler Supabase (mode Transaction,
// port 6543) comme DATABASE_URL plutot que la connexion directe (port 5432).
const pool = new Pool({
    connectionString,
    ssl,
    max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 3,
    idleTimeoutMillis: 10000,
});

async function connectDB() {
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
