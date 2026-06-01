const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Sends a message to the Ecofy AI chatbot.
 * @param {string}   message              — The user's message
 * @param {Array}    conversationHistory   — Previous turns: [{ role: 'user'|'model', text }]
 * @param {Object}   userContext           — Optional: { name, email, isLoggedIn }
 * @returns {Promise<{ reply: string, action: object|null }>}
 */
export const sendChatMessage = async (message, conversationHistory = [], userContext = {}) => {
  const response = await fetch(`${API_BASE_URL}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory, userContext }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Even on error, the backend returns { reply, action } with a friendly fallback
    return {
      reply: data.reply || 'Sorry, something went wrong. Please try again.',
      action: data.action || null,
    };
  }

  return data;
};
