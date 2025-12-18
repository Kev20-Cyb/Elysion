const tokenStore = {
  accessToken: null,
  refreshToken: null,
  expiresAt: 0, // timestamp ms
};

function env(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function getBaseUrl() {
  const v = (process.env.ORISHAI_API_BASE_URL || "").trim();
  if (!v) {
    throw new Error("ORISHAI_API_BASE_URL missing. Put it in backend .env and load dotenv BEFORE routes.");
  }
  return v.replace(/\/$/, "");
}

function buildUrl(path) {
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}


async function fetchJson(url, { method = "GET", headers = {}, body, timeoutSeconds = 30 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutSeconds * 1000);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }

    if (!res.ok) {
      const err = new Error(`OrishAi API ${res.status}: ${json?.detail || json?.message || text}`);
      err.status = res.status;
      err.payload = json;
      throw err;
    }
    return json;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Essaie de récupérer un token.
 * ⚠️ Le body exact dépend de votre implémentation.
 * Ici je mets une version “classique” + fallback.
 */
async function getToken() {
  // si déjà valide (marge 10s)
  if (tokenStore.accessToken && Date.now() < tokenStore.expiresAt - 10_000) {
    return tokenStore.accessToken;
  }

  const url = `${baseUrl()}/auth/token`;

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "product-key": env("ORISHAI_PRODUCT_KEY"),
  };

  // Body “probable” : adapte si Swagger indique autre chose
  const body = {
    client_id: env("ORISHAI_CLIENT_ID") || undefined,
    client_secret: env("ORISHAI_CLIENT_SECRET") || undefined,
  };

  // Si /auth/token est un GET sans body, on tente GET aussi.
  try {
    const resp = await fetchJson(url, { method: "POST", headers, body, timeoutSeconds: Number(env("ORISHAI_TIMEOUT_SECONDS", "30")) });
    // resp attendu: { access_token, refresh_token, expires_in } (souvent)
    if (resp?.access_token) {
      tokenStore.accessToken = resp.access_token;
      tokenStore.refreshToken = resp.refresh_token ?? tokenStore.refreshToken;
      tokenStore.expiresAt = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 50 * 60 * 1000);
      return tokenStore.accessToken;
    }
    return null;
  } catch (e) {
    // fallback GET (si c’est réellement GET /auth/token)
    const resp = await fetchJson(url, { method: "GET", headers, timeoutSeconds: Number(env("ORISHAI_TIMEOUT_SECONDS", "30")) });
    if (resp?.access_token) {
      tokenStore.accessToken = resp.access_token;
      tokenStore.refreshToken = resp.refresh_token ?? tokenStore.refreshToken;
      tokenStore.expiresAt = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 50 * 60 * 1000);
      return tokenStore.accessToken;
    }
    return null;
  }
}

async function callCompletion(path, payload) {
  const url = buildUrl("/completions/conversation");
  const timeoutSeconds = Number(env("ORISHAI_TIMEOUT_SECONDS", "30"));

  // Headers communs
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "product-key": env("ORISHAI_PRODUCT_KEY"),
  };

  // On tente avec Bearer si on peut en obtenir un (sinon on reste au product-key)
  const token = await getToken().catch(() => null);
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetchJson(url, { method: "POST", headers, body: payload, timeoutSeconds });
}

async function conversation({ message, user, sessionUuid }) {
  const model = env("ORISHAI_MODEL", "gpt-4o");

  return callCompletion("/completions/conversation", {
    systemPrompt: "You are an AI assistant that helps people.",
    chatSettings: {
      temperature: 0.2,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      maxTokens: 1000,
      maxRetries: 3,
      timeout: Number(env("ORISHAI_TIMEOUT_SECONDS", "30")),
      aiModel: { name: model, regions: [] },
    },
    message,
    user: user || "Anonymous",
    retentionHistory: 10,
    ...(sessionUuid ? { sessionUuid } : {}),
  });
}

async function rag({ message, user, sessionUuid, searchOptions, includeOldDocs = false }) {
  const model = env("ORISHAI_MODEL", "gpt-4o");

  return callCompletion("/completions/rag", {
    systemPrompt: "You are an AI assistant that helps people with RAG.",
    chatSettings: {
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      maxTokens: 1500,
      maxRetries: 3,
      timeout: Number(env("ORISHAI_TIMEOUT_SECONDS", "30")),
      aiModel: { name: model, regions: [] },
    },
    message,
    user: user || "Anonymous",
    retentionHistory: 10,
    searchOptions: searchOptions || { tags: [], tagsOption: "OR", maxDistance: 0.7, maxNbDocs: 3 },
    includeOldDocs,
    ...(sessionUuid ? { sessionUuid } : {}),
  });
}

module.exports = { conversation, rag };
