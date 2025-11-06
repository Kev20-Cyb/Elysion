import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Simulator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'step1', 'step2', 'results'
  const [formData, setFormData] = useState({
    birthDate: '',
    professionalStatus: '',
    careerStart: '',
    annualIncome: '',
    desiredIncome: ''
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateRetirement = () => {
    const currentAge = calculateAge(formData.birthDate);
    const careerLength = new Date().getFullYear() - parseInt(formData.careerStart);
    const annualIncome = parseInt(formData.annualIncome);
    const desiredIncome = parseInt(formData.desiredIncome);

    // Simple calculation logic based on professional status
    let legalRetirementAge = 62;
    let fullRateAge = 67;
    let pensionRate = 0.75;

    switch (formData.professionalStatus) {
      case 'employee':
        legalRetirementAge = 62;
        fullRateAge = 67;
        pensionRate = 0.75;
        break;
      case 'self_employed':
        legalRetirementAge = 62;
        fullRateAge = 67;
        pensionRate = 0.65;
        break;
      case 'civil_servant':
        legalRetirementAge = 62;
        fullRateAge = 65;
        pensionRate = 0.75;
        break;
      case 'business_owner':
        legalRetirementAge = 62;
        fullRateAge = 67;
        pensionRate = 0.70;
        break;
      default:
        legalRetirementAge = 62;
        fullRateAge = 67;
        pensionRate = 0.75;
    }

    // Adjust based on career length
    if (careerLength >= 42) {
      fullRateAge = Math.max(legalRetirementAge, fullRateAge - 2);
    }

    // Calculate estimated pension
    const estimatedPension = Math.round(annualIncome * pensionRate / 12);
    const replacementRate = Math.round((estimatedPension * 12 / annualIncome) * 100);

    const calculatedResults = {
      legalRetirementAge,
      fullRateAge,
      estimatedPension,
      replacementRate,
      currentAge,
      yearsToRetirement: legalRetirementAge - currentAge
    };

    setResults(calculatedResults);
    setCurrentStep('results');
  };

  const handleNextStep = () => {
    if (currentStep === 'intro') {
      setCurrentStep('step1');
    } else if (currentStep === 'step1') {
      setCurrentStep('step2');
    } else if (currentStep === 'step2') {
      calculateRetirement();
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'step2') {
      setCurrentStep('step1');
    } else if (currentStep === 'step1') {
      setCurrentStep('intro');
    }
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const renderIntroSection = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-6xl mb-6">📊</div>
        <h1 className="text-4xl font-bold text-elysion-primary mb-6 font-montserrat">
          Estimez votre âge de retraite et revenus en quelques clics
        </h1>
        <p className="text-xl text-elysion-text-light max-w-2xl mx-auto mb-8">
          Saisissez quelques informations de base pour obtenir un aperçu instantané de vos perspectives de retraite — aucun compte requis.
        </p>
        
        <button 
          onClick={handleNextStep}
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
          data-testid="simulator-start-btn"
        >
          Commencer la simulation
        </button>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-4 font-montserrat">Votre profil</h2>
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-elysion-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</div>
            <span className="text-elysion-primary font-medium">Informations personnelles</span>
            <div className="w-16 h-0.5 bg-gray-300 mx-3"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Date de naissance
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="input-elysion"
            required
            data-testid="simulator-birth-date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Statut professionnel
          </label>
          <select
            value={formData.professionalStatus}
            onChange={(e) => handleInputChange('professionalStatus', e.target.value)}
            className="input-elysion"
            required
            data-testid="simulator-professional-status"
          >
            <option value="">Sélectionnez votre statut</option>
            <option value="employee">Salarié</option>
            <option value="self_employed">Indépendant / Freelance</option>
            <option value="civil_servant">Fonctionnaire</option>
            <option value="business_owner">Chef d'entreprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Début de carrière (année du premier emploi)
          </label>
          <input
            type="number"
            placeholder="2005"
            min="1970"
            max={new Date().getFullYear()}
            value={formData.careerStart}
            onChange={(e) => handleInputChange('careerStart', e.target.value)}
            className="input-elysion"
            required
            data-testid="simulator-career-start"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={handlePrevStep}
          className="text-gray-500 hover:text-elysion-primary transition-colors"
          data-testid="simulator-cancel-btn"
        >
          Annuler
        </button>
        <button 
          onClick={handleNextStep}
          disabled={!formData.birthDate || !formData.professionalStatus || !formData.careerStart}
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="simulator-next-btn"
        >
          Suivant →
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-4 font-montserrat">Vos revenus</h2>
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-elysion-accent text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">✓</div>
            <span className="text-elysion-text-light font-medium">Informations personnelles</span>
            <div className="w-16 h-0.5 bg-elysion-accent mx-3"></div>
            <div className="w-8 h-8 bg-elysion-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Derniers revenus annuels bruts (€)
          </label>
          <input
            type="number"
            placeholder="45000"
            min="0"
            step="1000"
            value={formData.annualIncome}
            onChange={(e) => handleInputChange('annualIncome', e.target.value)}
            className="input-elysion"
            required
            data-testid="simulator-annual-income"
          />
          <p className="text-sm text-elysion-text-light mt-1">
            Indiquez vos revenus bruts annuels actuels ou récents
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Revenus souhaités à la retraite (€/mois)
          </label>
          <input
            type="number"
            placeholder="2500"
            min="0"
            step="100"
            value={formData.desiredIncome}
            onChange={(e) => handleInputChange('desiredIncome', e.target.value)}
            className="input-elysion"
            required
            data-testid="simulator-desired-income"
          />
          <p className="text-sm text-elysion-text-light mt-1">
            Montant mensuel net que vous aimeriez percevoir
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={handlePrevStep}
          className="border-2 border-elysion-primary text-elysion-primary hover:bg-elysion-primary hover:text-white font-semibold px-6 py-3 rounded-lg transition-all"
          data-testid="simulator-back-btn"
        >
          ← Retour
        </button>
        <button 
          onClick={handleNextStep}
          disabled={!formData.annualIncome || !formData.desiredIncome}
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="simulator-calculate-btn"
        >
          Calculer ma simulation
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-elysion-primary mb-4 font-montserrat">Vos résultats estimés</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-elysion-bg p-6 rounded-xl text-center">
          <div className="text-2xl mb-2">📅</div>
          <h3 className="font-semibold text-elysion-primary mb-2">Âge légal de retraite</h3>
          <div className="text-3xl font-bold text-elysion-primary" data-testid="result-legal-age">
            {results?.legalRetirementAge} ans
          </div>
        </div>

        <div className="bg-elysion-bg p-6 rounded-xl text-center">
          <div className="text-2xl mb-2">⭐</div>
          <h3 className="font-semibold text-elysion-primary mb-2">Âge taux plein possible</h3>
          <div className="text-3xl font-bold text-elysion-primary" data-testid="result-full-rate-age">
            {results?.fullRateAge} ans
          </div>
        </div>

        <div className="bg-elysion-bg p-6 rounded-xl text-center">
          <div className="text-2xl mb-2">💰</div>
          <h3 className="font-semibold text-elysion-primary mb-2">Pension estimée</h3>
          <div className="text-3xl font-bold text-elysion-accent" data-testid="result-pension">
            €{results?.estimatedPension?.toLocaleString()} / mois
          </div>
          <p className="text-sm text-elysion-text-light mt-1">Base + complémentaire</p>
        </div>

        <div className="bg-elysion-bg p-6 rounded-xl text-center">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-elysion-primary mb-2">Taux de remplacement</h3>
          <div className="text-3xl font-bold text-elysion-accent" data-testid="result-replacement-rate">
            {results?.replacementRate}%
          </div>
          <p className="text-sm text-elysion-text-light mt-1">de votre dernier salaire</p>
        </div>
      </div>

      {results?.yearsToRetirement > 0 && (
        <div className="bg-white p-6 rounded-xl border-l-4 border-elysion-accent mb-8">
          <p className="text-elysion-text-dark">
            <strong>Dans {results.yearsToRetirement} ans</strong>, vous pourrez partir à la retraite et percevoir environ <strong>€{results.estimatedPension?.toLocaleString()} par mois</strong>.
          </p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
        <p className="text-sm text-yellow-800">
          <strong>Avertissement :</strong> Ces résultats sont basés sur des hypothèses générales du système de retraite et peuvent varier selon vos cotisations individuelles et votre régime.
        </p>
      </div>
    </div>
  );

  const renderConversionSection = () => (
    <div className="bg-gradient-to-r from-elysion-primary to-elysion-secondary text-white p-8 rounded-2xl">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-3xl font-bold mb-4 font-montserrat">
            Obtenez une analyse de retraite complète et personnalisée
          </h3>
          <p className="text-xl mb-6 text-white/90">
            Sauvegardez votre simulation, téléchargez vos documents et recevez des recommandations d'experts adaptées à votre situation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleCreateAccount}
              className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              data-testid="conversion-create-account-btn"
            >
              Créer mon compte
            </button>
            <button 
              onClick={handleLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-elysion-primary font-semibold px-6 py-3 rounded-lg transition-all"
              data-testid="conversion-login-btn"
            >
              Se connecter
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-6xl mb-4">💻</div>
          <p className="text-white/80">Accédez à votre tableau de bord personnel</p>
        </div>
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
                onClick={() => navigate('/auth')}
                className="text-elysion-primary hover:text-elysion-accent font-medium transition-colors"
              >
                Se connecter
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="btn-elysion-accent"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro Section */}
        {currentStep === 'intro' && (
          <div className="text-center mb-12">
            {renderIntroSection()}
          </div>
        )}

        {/* Form Sections */}
        {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'results') && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {currentStep === 'step1' && renderStep1()}
              {currentStep === 'step2' && renderStep2()}
              {currentStep === 'results' && renderResults()}
            </div>
            
            {/* Conversion Section - shown after results */}
            {currentStep === 'results' && renderConversionSection()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;