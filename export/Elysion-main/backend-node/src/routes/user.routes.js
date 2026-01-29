// src/routes/user.routes.js
const express = require("express");
const { authRequired } = require("../authMiddleware");

const router = express.Router();

// GET /api/users/profile
router.get("/profile", authRequired, (req, res) => {
  return res.json({
    message: "Protected route OK",
    user: req.user
  });
});

module.exports = router;
