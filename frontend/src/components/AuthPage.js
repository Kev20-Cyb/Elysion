import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Default to login, but check URL params or state for mode
  const getInitialMode = () => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') return false;
    if (modeParam === 'login') return true;
    
    // Check if coming from onboarding or other flows that expect registration
    if (location.state?.mode === 'register') return false;
    
    return true; // Default to login
  };
  
  const [isLogin, setIsLogin] = useState(getInitialMode());
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    user_type: 'employee'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const userTypes = [
    { value: 'employee', label: 'Salarié', icon: '👔' },
    { value: 'freelancer', label: 'Freelance', icon: '💻' },
    { value: 'business_owner', label: 'Chef d\'entreprise', icon: '🏢' }
  ];

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-elysion-primary hover:text-elysion-accent transition-colors"
              data-testid="auth-home-btn"
            >
              Elysion
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className={isLogin ? 'btn-primary' : 'btn-outline'}
              >
                Se connecter
              </button>
              <button 
                onClick={() => navigate('/auth?mode=register')}
                className={!isLogin ? 'btn-primary' : 'btn-outline'}
              >
                Créer un compte
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="auth-mobile-menu-btn"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className="btn-ghost w-full text-left"
              >
                Accueil
              </button>
              <button
                onClick={() => { navigate('/simulator'); setMobileMenuOpen(false); }}
                className="btn-secondary w-full"
              >
                Simulateur
              </button>
              <button
                onClick={() => { setIsLogin(true); setMobileMenuOpen(false); }}
                className={`w-full ${isLogin ? 'btn-primary' : 'btn-outline'}`}
              >
                Se connecter
              </button>
              <button
                onClick={() => { setIsLogin(false); setMobileMenuOpen(false); }}
                className={`w-full ${!isLogin ? 'btn-primary' : 'btn-outline'}`}
              >
                Créer un compte
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Split Screen Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
          {/* Form Container */}
          <div className="card-elysion fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-elysion-primary mb-2">
                {isLogin ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-elysion-text-light">
                {isLogin 
                  ? 'Accédez à votre tableau de bord personnalisé' 
                  : 'Commencez votre planification retraite dès aujourd\'hui'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" data-testid="auth-error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-elysion-text-dark mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="input-elysion"
                      placeholder="Votre nom complet"
                      required={!isLogin}
                      data-testid="auth-fullname-input"
                    />
                  </div>

                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-elysion-text-dark mb-3">
                      Votre profil professionnel
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {userTypes.map((type) => (
                        <label key={type.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="user_type"
                            value={type.value}
                            checked={formData.user_type === type.value}
                            onChange={handleChange}
                            className="sr-only"
                            data-testid={`auth-usertype-${type.value}`}
                          />
                          <div className={`p-4 rounded-lg border-2 transition-all ${
                            formData.user_type === type.value
                              ? 'border-elysion-primary bg-elysion-primary/5'
                              : 'border-gray-200 hover:border-elysion-secondary'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{type.icon}</span>
                              <span className="font-medium text-elysion-text-dark">{type.label}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-elysion"
                  placeholder="votre@email.com"
                  required
                  data-testid="auth-email-input"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-elysion-text-dark">
                    Mot de passe
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm text-elysion-primary hover:text-elysion-accent transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-elysion"
                  placeholder="••••••••"
                  required
                  data-testid="auth-password-input"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-elysion-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-testid="auth-submit-btn"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Chargement...
                  </div>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer mon compte'
                )}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-elysion-text-light">
                {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ email: '', password: '', full_name: '', user_type: 'employee' });
                  }}
                  className="ml-2 text-elysion-primary font-semibold hover:text-elysion-accent transition-colors"
                  data-testid="auth-toggle-btn"
                >
                  {isLogin ? 'Créer un compte' : 'Se connecter'}
                </button>
              </p>
            </div>
          </div>

            {/* Security Notice */}
            <div className="mt-8 text-center text-sm text-elysion-text-light">
              <p>🔒 Vos données sont chiffrées et stockées en France conformément au RGPD</p>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <div className="relative">
            <img
              key={isLogin ? "login" : "register"}
              src={
                isLogin
                  ? "/asset/IllustrationConnexion.png"
                  : "/asset/IllustrationInscription.png"
              }
              alt={isLogin ? "Illustration connexion" : "Illustration inscription"}
              className="fade-image fade-image-enter fade-image-enter-active"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;