import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../App";
import { sendMessage } from "../lib/chatClient";

// Petite bulle de chat en bas à droite + panneau minimal
export default function ChatBubble() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Emplacement pour image du bot (peut être défini via env REACT_APP_BOT_AVATAR)
  const botAvatar = process.env.REACT_APP_BOT_AVATAR || '';

  useEffect(() => {
    // Fermer la bulle si l'utilisateur se déconnecte
    if (!isAuthenticated) {
      setOpen(false);
      setMessages([]);
      setInput('');
    }
  }, [isAuthenticated]);

  // Auto-scroll quand on ouvre ou quand un nouveau message arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, open]);

  // Message d’accueil quand on ouvre la bulle la 1ère fois
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeText =
        `Bonjour ! Je suis l'assistant Elysion.\n` +
        `Voici quelques propositions :\n` +
        `• Voir votre dashboard\n` +
        `• Poser une question sur votre compte\n` +
        `• Demander de l'aide pour un projet`;

      setMessages([{ from: "bot", text: welcomeText }]);
    }
  }, [open, messages.length]);

  const suggestions = [
    'Voir votre dashboard',
    "Poser une question sur votre compte",
    "Demander de l'aide pour un projet",
  ];

  const handleSuggestion = async (text) => {
    // Ajoute le message utilisateur et envoie au chat
    setMessages((prev) => [...prev, { from: 'user', text }] );
    setLoading(true);
    try {
      const res = await sendMessage(text);
      const botText = res?.data?.reply || res?.data?.message || 'Pas de réponse';
      setMessages((prev) => [...prev, { from: 'bot', text: botText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Erreur de connexion au chat' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await sendMessage(input);
      const botText = res?.data?.reply || res?.data?.message || 'Pas de réponse';
      setMessages((m) => [...m, { from: 'bot', text: botText }]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Erreur de connexion au chat' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat window */}
      <div className="fixed right-6 bottom-6 z-50">
        {open && (
          <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-elysion-primary text-white font-semibold flex items-center gap-2">
              {/* Emplacement photo profil du bot (configurable via REACT_APP_BOT_AVATAR) */}
              {botAvatar ? (
                <img src={botAvatar} alt="Bot" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">🤖</div>
              )}
              <span>Assistant</span>
            </div>
            <div className="flex-1 p-3 overflow-auto bg-gray-50">
              {messages.length === 0 && (
                <div className="text-sm text-gray-500">Posez une question...</div>
              )}

              {/* Affiche le message de base (premier message bot) */}
              {messages.map((m, i) => (
                m.from === 'user' ? (
                  <div key={i} className="mb-2 flex justify-end">
                    <div className="px-3 py-1 rounded-lg text-sm bg-elysion-primary text-white">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="mb-2 flex items-start">
                    {/* avatar */}
                    {botAvatar ? (
                      <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full mr-2" />
                    ) : (
                      <div className="w-8 h-8 rounded-full mr-2 bg-gray-300 flex items-center justify-center">🤖</div>
                    )}
                    <div className="flex-1">
                      <div className="px-3 py-1 rounded-lg text-sm bg-white text-gray-800 shadow whitespace-pre-wrap">
                        {m.text}
                      </div>

                      {/* Si c'est le premier message bot, afficher des suggestions cliquables */}
                      {i === 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestion(s)}
                              className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Écrire un message..."
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button onClick={handleSend} disabled={loading} className="px-3 py-1 bg-elysion-primary text-white rounded">
                  {loading ? '...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating button */}
        <button
          onClick={() => setOpen((s) => !s)}
          title="Ouvrir le chat"
          className="w-14 h-14 rounded-full bg-elysion-primary text-white shadow-lg flex items-center justify-center"
        >
          💬
        </button>
      </div>
    </>
  );
}