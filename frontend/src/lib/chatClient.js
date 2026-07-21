import axios from 'axios';

// Utilise la meme base que l'app
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// Petit wrapper pour les appels vers le chatbot
export const sendMessage = (message) => {
    // Endpoint prepare : POST /api/chat (a adapter selon le backend)
    return axios.post(`${API}/chat`, { message });
};

// Verifie si le chatbot est configure cote backend (CHATBOT_API_BASE_URL /
// CHATBOT_PRODUCT_KEY presents). Utilise pour masquer le widget de chat
// quand ces identifiants tiers ne sont pas fournis.
export const getChatStatus = () => axios.get(`${API}/chat/status`);

export default {
    sendMessage,
    getChatStatus
};
