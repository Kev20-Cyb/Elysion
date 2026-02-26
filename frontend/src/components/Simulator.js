import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Simulator = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'choice'
  const [selectedStatus, setSelectedStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirection vers le simulateur détaillé approprié
  const handleStartSimulation = (status) => {
    if (status === 'self_employed' || status === 'freelance' || status === 'business_owner') {
      navigate('/simulator/freelance');
    } else if (status === 'employee' || status === 'civil_servant') {
      navigate('/simulator/employee');
    }
  };

  const renderIntroSection = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-6xl mb-6">📊</div>
        <h1 className="text-4xl font-bold text-elysion-primary mb-6 font-montserrat">
          Estimez votre retraite en quelques clics
        </h1>
        <p className="text-xl text-elysion-text-light max-w-2xl mx-auto mb-8">
          Sélectionnez votre profil pour accéder à un simulateur détaillé et personnalisé — aucun compte requis.
        </p>
        
        <button 
          onClick={() => setCurrentStep('choice')}
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
          data-testid="simulator-start-btn"
        >
          Commencer la simulation
        </button>
      </div>
    </div>
  );

  const renderChoiceSection = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-4 font-montserrat">
          Quel est votre statut professionnel ?
        </h2>
        <p className="text-gray-600">
          Choisissez votre profil pour accéder au simulateur adapté à votre situation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Salarié */}
        <button
          onClick={() => {
            setSelectedStatus('employee');
            handleStartSimulation('employee');
          }}
          className={`p-8 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
            selectedStatus === 'employee'
              ? 'border-elysion-primary bg-elysion-primary-50'
              : 'border-gray-200 bg-white hover:border-elysion-primary'
          }`}
        >
          <div className="text-5xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-elysion-primary mb-2">Salarié</h3>
          <p className="text-gray-600 text-sm mb-4">
            Régime général + Agirc-Arrco
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>✓ Calcul SAM (25 meilleures années)</li>
            <li>✓ Trimestres cotisés et assimilés</li>
            <li>✓ Retraite complémentaire Agirc-Arrco</li>
            <li>✓ Scénarios d'âge de départ</li>
          </ul>
          <div className="mt-4 text-elysion-primary font-semibold text-sm flex items-center">
            Simulateur 6 étapes →
          </div>
        </button>

        {/* Freelance / Indépendant */}
        <button
          onClick={() => {
            setSelectedStatus('freelance');
            handleStartSimulation('freelance');
          }}
          className={`p-8 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
            selectedStatus === 'freelance'
              ? 'border-elysion-accent bg-elysion-accent-50'
              : 'border-gray-200 bg-white hover:border-elysion-accent'
          }`}
        >
          <div className="text-5xl mb-4">💻</div>
          <h3 className="text-xl font-bold text-elysion-primary mb-2">Freelance / Indépendant</h3>
          <p className="text-gray-600 text-sm mb-4">
            Micro-entrepreneur, BIC, BNC
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>✓ Calcul selon statut (micro/classique)</li>
            <li>✓ Trimestres SSI (seuils de validation)</li>
            <li>✓ Retraite complémentaire RCI</li>
            <li>✓ Scénarios d'âge de départ</li>
          </ul>
          <div className="mt-4 text-elysion-accent font-semibold text-sm flex items-center">
            Simulateur 6 étapes →
          </div>
        </button>
      </div>

      <div className="text-center">
        <button 
          onClick={() => setCurrentStep('intro')}
          className="text-gray-500 hover:text-elysion-primary transition-colors"
        >
          ← Retour
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-elysion-bg to-white font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-elysion-primary font-montserrat hover:text-elysion-accent transition-colors"
            >
              Elysion
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary"
                  >
                    Tableau de bord
                  </button>
                  <div className="flex items-center space-x-2 bg-elysion-primary/10 px-3 py-1.5 rounded-full">
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-medium text-elysion-primary">
                      {user.first_name || user.full_name?.split(' ')[0]}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/auth?mode=login')}
                    className="btn-primary"
                  >
                    Se connecter
                  </button>
                  <button 
                    onClick={() => navigate('/onboarding')}
                    className="btn-outline"
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>

            {/* Mobile: User name + Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <span className="text-sm font-medium text-elysion-primary">
                  {user.first_name || user.full_name?.split(' ')[0]}
                </span>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="simulator-mobile-menu-btn"
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
              {user ? (
                <>
                  <button
                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                    className="btn-secondary w-full"
                  >
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                    className="btn-outline w-full"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full py-2 px-4 rounded-lg text-red-600 font-medium bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/auth?mode=login'); setMobileMenuOpen(false); }}
                    className="btn-primary w-full"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => { navigate('/onboarding'); setMobileMenuOpen(false); }}
                    className="btn-outline w-full"
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Intro Section */}
        {currentStep === 'intro' && (
          <div className="text-center mb-12">
            {renderIntroSection()}
          </div>
        )}

        {/* Choice Section */}
        {currentStep === 'choice' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {renderChoiceSection()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;