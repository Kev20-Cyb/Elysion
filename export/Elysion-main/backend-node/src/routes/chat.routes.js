// src/routes/chat.routes.js
const express = require("express");
const { authRequired } = require("../authMiddleware");
const { callConversation, callRag } = require("../services/chatbotApi");

const router = express.Router();
const sessions = new Map();

router.post("/", authRequired, async (req, res) => {
  try {
    const { message, mode, ragOptions } = req.body;
    const safeMode = String(mode || "").trim().toLowerCase();
    const isRag = safeMode === "rag";
    if (!message || typeof message !== "string") {
      return res.status(400).json({ detail: "Missing message" });
    }

    const userId = req.user.userId;
    const userLabel = req.user.email || `user-${userId}`;
    const sessionUuid = sessions.get(userId);

    const resp = isRag
    ? await callRag({ message, user: userLabel, sessionUuid, searchOptions: ragOptions })
    : await callConversation({ message, user: userLabel, sessionUuid });


    if (resp?.sessionUuid) sessions.set(userId, resp.sessionUuid);

    res.json({
      reply: resp?.message ?? "",
      sessionUuid: resp?.sessionUuid ?? sessionUuid ?? null,
      messageUuid: resp?.messageUuid ?? null,
      documentsReferences: resp?.documentsReferences ?? [],
      usage: resp?.usage ?? null,
      mode: isRag ? "rag" : "conversation",
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ detail: err.message, payload: err.payload });
  }
});

module.exports = router;
