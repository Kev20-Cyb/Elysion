import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Simulator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'choice'
  const [selectedStatus, setSelectedStatus] = useState('');

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
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className="text-elysion-primary hover:text-elysion-accent font-medium transition-colors"
              >
                Se connecter
              </button>
              <button 
                onClick={() => navigate('/auth?mode=register')}
                className="btn-elysion-accent"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
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