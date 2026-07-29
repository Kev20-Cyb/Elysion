// src/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Ex : postgres://postgres:motdepasse@localhost:5432/elysion
const rawConnectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!rawConnectionString) {
    console.error("[DB] Missing DATABASE_URL environment variable");
    throw new Error("DATABASE_URL is not defined");
}

// SSL : Supabase impose TLS avec un certificat non reconnu par la chaine de
// confiance par defaut de Node ("self-signed certificate in certificate
// chain"). Passer `ssl: { rejectUnauthorized: false }` directement dans la
// config du Pool NE SUFFIT PAS : node-postgres reconstruit sa config a
// partir des parametres de la connectionString (ex: ?sslmode=require) et
// cela peut ecraser l'option ssl explicite. La solution fiable est de
// forcer sslmode=no-verify directement dans l'URL de connexion : pg
// reconnait cette valeur speciale et desactive la verification du
// certificat cote client (equivalent a rejectUnauthorized:false), sans
// etre ecrase par un autre parsing.
// MIGRATION VERCEL (2026-07)
function withNoVerifySsl(connString) {
    if (process.env.DB_SSL === "false") {
        return connString;
    }
    try {
        const url = new URL(connString);
        url.searchParams.set("sslmode", "no-verify");
        return url.toString();
    } catch (e) {
        console.error("[DB] Could not parse connection string for sslmode override:", e.message);
        return connString;
    }
}

const connectionString = withNoVerifySsl(rawConnectionString);

// MIGRATION VERCEL (2026-07) : pool limite pour environnement serverless.
// Utiliser de preference l'URL du connection pooler Supabase (mode Transaction,
// port 6543) comme DATABASE_URL plutot que la connexion directe (port 5432).
const pool = new Pool({
    connectionString,
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
