import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetLink('');

    try {
      const response = await axios.post(`${API}/auth/forgot-password`, { email });
      setMessage(response.data.message);
      
      // For MVP, display the reset link (in production, this would be emailed)
      if (response.data.reset_link) {
        setResetLink(response.data.reset_link);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-elysion-primary hover:text-elysion-accent transition-colors"
            >
              Elysion
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-elysion-primary mb-2">
                Mot de passe oublié ?
              </h1>
              <p className="text-gray-600">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elysion-primary focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}

              {/* Reset Link (MVP only - remove in production) */}
              {resetLink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    Lien de réinitialisation (Mode MVP) :
                  </p>
                  <a 
                    href={resetLink} 
                    className="text-xs text-blue-600 break-all hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resetLink}
                  </a>
                  <p className="text-xs text-gray-600 mt-2">
                    En production, ce lien sera envoyé par email.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-elysion-primary text-white py-3 rounded-lg font-semibold hover:bg-elysion-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="text-elysion-primary hover:text-elysion-accent font-medium text-sm transition-colors"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
