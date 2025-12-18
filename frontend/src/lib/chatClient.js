import axios from 'axios';

// Utilise la même base que l'app
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

// Petit wrapper pour les appels vers le chatbot
export const sendMessage = (message) => {
  // Endpoint préparé : POST /api/chat (à adapter selon le backend)
  return axios.post(`${API}/chat`, { message });
};

export default {
  sendMessage
};
