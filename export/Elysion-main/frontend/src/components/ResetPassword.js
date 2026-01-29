import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token de réinitialisation manquant. Veuillez demander un nouveau lien.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/auth/reset-password`, {
        token,
        new_password: password
      });
      
      setMessage('Votre mot de passe a été réinitialisé avec succès !');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth?mode=login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur s\'est produite. Le token est peut-être expiré.');
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
                Réinitialiser le mot de passe
              </h1>
              <p className="text-gray-600">
                Entrez votre nouveau mot de passe ci-dessous.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elysion-primary focus:border-transparent"
                  placeholder="Minimum 6 caractères"
                  disabled={!token}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-elysion-primary focus:border-transparent"
                  placeholder="Répétez le mot de passe"
                  disabled={!token}
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
                  <p className="mt-2 text-xs">Redirection vers la page de connexion...</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !token || !password || !confirmPassword || message}
                className="w-full bg-elysion-primary text-white py-3 rounded-lg font-semibold hover:bg-elysion-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>

            {/* Back to Login */}
            {!message && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/auth?mode=login')}
                  className="text-elysion-primary hover:text-elysion-accent font-medium text-sm transition-colors"
                >
                  ← Retour à la connexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
