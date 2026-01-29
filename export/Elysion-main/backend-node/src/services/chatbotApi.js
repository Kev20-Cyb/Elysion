// src/services/chatbotApi.js

function getEnv(name, fallback = undefined) {
  const v = process.env[name];
  return v !== undefined && v !== "" ? v : fallback;
}

function buildUrl(baseUrl, path) {
  const base = baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function postJson(url, headers, body, timeoutSeconds = 30) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      const detail = json?.detail || json?.message || JSON.stringify(json);
      const err = new Error(`Chatbot API error ${res.status}: ${detail}`);
      err.status = res.status;
      err.payload = json;
      throw err;
    }

    return json;
  } finally {
    clearTimeout(timeout);
  }
}

async function callConversation({ message, user, sessionUuid }) {
  const baseUrl = getEnv("CHATBOT_API_BASE_URL");
  const productKey = getEnv("CHATBOT_PRODUCT_KEY");
  const model = getEnv("CHATBOT_MODEL", "gpt-4o");
  const timeoutSeconds = Number(getEnv("CHATBOT_TIMEOUT_SECONDS", "30"));

  if (!baseUrl) throw new Error("CHATBOT_API_BASE_URL is missing");
  if (!productKey) throw new Error("CHATBOT_PRODUCT_KEY is missing");

  const url = buildUrl(baseUrl, "/completions/conversation");

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "product-key": productKey,
  };

  const systemPrompt = `
  Tu es l’assistant officiel d’Elysion.

  Règles obligatoires :
  - Tu réponds uniquement aux sujets liés à Elysion : retraite, épargne, investissement (général), fonctionnement de la plateforme, aide utilisateur.
  - Tu ne donnes jamais de conseils financiers personnalisés ni de recommandations chiffrées adaptées à une personne.
  - Tu fournis uniquement des informations générales, pédagogiques et neutres.
  - Si la question est hors périmètre, refuse poliment et redirige vers Elysion.
  - Si des informations importantes manquent, pose 1 à 3 questions simples.

  Règles de forme (très important) :
  - N’utilise JAMAIS de Markdown.
  - N’utilise JAMAIS **, *, _, #, listes formatées ou titres.
  - Écris uniquement en texte brut.
  - Les listes doivent être écrites avec des tirets simples "-" ou sous forme de phrases.
  - Style naturel, fluide, comme une conversation.
  - Réponds dans la langue de l'utilisateur, avec un ton clair, simple et professionnel.
  - Réponses concises : 3 à 8 lignes maximum, sauf demande explicite de détail.

  `;


  const body = {
    systemPrompt,
    chatSettings: {
      temperature: 0.2,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      maxTokens: 1000,
      maxRetries: 3,
      timeout: timeoutSeconds,
      aiModel: {
        name: model,     // d’après ta doc: "gpt4o"
        regions: []
      }
    },
    message,
    user: user || "Anonymous",
    retentionHistory: 10,
    ...(sessionUuid ? { sessionUuid } : {}),
  };

  return postJson(url, headers, body, timeoutSeconds);
}

async function callRag({ message, user, sessionUuid, searchOptions, includeOldDocs = false }) {
  const baseUrl = getEnv("CHATBOT_API_BASE_URL");
  const productKey = getEnv("CHATBOT_PRODUCT_KEY");
  const model = getEnv("CHATBOT_MODEL", "gpt-4o");
  const timeoutSeconds = Number(getEnv("CHATBOT_TIMEOUT_SECONDS", "30"));

  if (!baseUrl) throw new Error("CHATBOT_API_BASE_URL is missing");
  if (!productKey) throw new Error("CHATBOT_PRODUCT_KEY is missing");

  const url = buildUrl(baseUrl, "/completions/rag");

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "product-key": productKey,
  };

  const body = {
    "systemPrompt": "You are an AI assistant that helps people with RAG.",
    "chatSettings": {
      "temperature": 0.7,
      "topP": 0.9,
      "frequencyPenalty": 0.5,
      "presencePenalty": 0.5,
      "maxTokens": 1500,
      "maxRetries": 3,
      "timeout": timeoutSeconds,
      "aiModel": { name: model, regions: [] }
    },
    message,
    user: user || "Anonymous",
    retentionHistory: 10,
    searchOptions: searchOptions || {
      tags: [],
      tagsOption: "OR",
      maxDistance: 0.7,
      maxNbDocs: 3
    },
    includeOldDocs,
    ...(sessionUuid ? { sessionUuid } : {}),
  };

  return postJson(url, headers, body, timeoutSeconds);
}

module.exports = {
  callConversation,
  callRag
};