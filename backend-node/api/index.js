// Point d'entree serverless pour Vercel.
// Reutilise l'app Express definie dans src/server.js (elle exporte `app`
// sans jamais appeler app.listen() quand elle est require()-ee comme module).
const app = require("../src/server");

module.exports = app;
