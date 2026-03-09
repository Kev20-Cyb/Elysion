import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import DashboardLayout from './DashboardLayout';
import { Icons } from './ui/icons';

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
        <div className="w-20 h-20 mx-auto mb-6 bg-elysion-primary/10 rounded-2xl flex items-center justify-center">
          <Icons.Chart size={40} className="text-elysion-primary" aria-hidden="true" />
        </div>
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
          <div className="w-14 h-14 mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icons.Employee size={28} className="text-blue-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-elysion-primary mb-2">Salarié</h3>
          <p className="text-gray-600 text-sm mb-4">
            Régime général + Agirc-Arrco
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Calcul SAM (25 meilleures années)</li>
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Trimestres cotisés et assimilés</li>
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Retraite complémentaire Agirc-Arrco</li>
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Scénarios d'âge de départ</li>
          </ul>
          <div className="mt-4 text-elysion-primary font-semibold text-sm flex items-center gap-1">
            Simulateur 6 étapes <Icons.ArrowRight size={14} />
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
          <div className="w-14 h-14 mb-4 bg-orange-100 rounded-xl flex items-center justify-center">
            <Icons.Freelancer size={28} className="text-orange-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-elysion-primary mb-2">Freelance / Indépendant</h3>
          <p className="text-gray-600 text-sm mb-4">
            Micro-entrepreneur, BIC, BNC
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Calcul selon statut (micro/classique)</li>
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Trimestres SSI (seuils de validation)</li>
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Retraite complémentaire RCI</li>
            <li className="flex items-center gap-1"><Icons.Check size={12} className="text-green-500" /> Scénarios d'âge de départ</li>
          </ul>
          <div className="mt-4 text-elysion-accent font-semibold text-sm flex items-center gap-1">
            Simulateur 6 étapes <Icons.ArrowRight size={14} />
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

  const simulatorContent = (
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
  );

  // Si connecté, afficher avec la sidebar
  if (user) {
    return (
      <DashboardLayout title="Simulateur">
        {simulatorContent}
      </DashboardLayout>
    );
  }

  // Si non connecté, afficher avec la nav standalone
  return (
    <div className="min-h-screen bg-gradient-to-br from-elysion-bg to-white font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity"
            >
              <img src="/asset/Elysion - logo.png" alt="Elysion" className="h-8" />
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
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
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
            </div>
          </div>
        )}
      </nav>

      {simulatorContent}
    </div>
  );
};

export default Simulator;