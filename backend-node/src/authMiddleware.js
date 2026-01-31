// src/authMiddleware.js
const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ detail: "Missing or invalid Authorization header" });
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, email, ... }
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}

module.exports = { authRequired };
