import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get professional status from simulator or default to employee
  const professionalStatus = location.state?.professionalStatus || 'employee';

  const [profileData, setProfileData] = useState({
    // Personal Info (Step 2)
    date_of_birth: '',
    gender: '',
    marital_status: '',
    number_of_children: 0,
    
    // Professional Info (Step 3) - varies by user type
    career_start: '',
    annual_salary: '',
    pension_schemes: [],
    validated_quarters: '',
    
    // Freelancer specific
    activity_type: '',
    legal_status: '',
    average_income: '',
    retirement_regimes: [],
    
    // Business owner specific
    company_legal_form: '',
    remuneration: '',
    regime_type: '',
    retirement_plans: [],
    
    // Account Setup (Step 5)
    email: '',
    password: '',
    confirm_password: '',
    agree_terms: false
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create account with collected data
      const response = await axios.post(`${API}/auth/register`, {
        email: profileData.email,
        password: profileData.password,
        full_name: `${profileData.email.split('@')[0]}`, // Simple name from email
        user_type: professionalStatus
      });
      
      // Login the user automatically
      const loginResult = await login(profileData.email, profileData.password);
      
      if (loginResult.success) {
        // Save profile data
        await axios.post(`${API}/profile/complete`, profileData);
        navigate('/dashboard');
      } else {
        setError(loginResult.error);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeInfo = () => {
    const types = {
      employee: { label: 'Salarié', icon: '👔' },
      freelancer: { label: 'Freelance', icon: '💻' }, 
      self_employed: { label: 'Indépendant', icon: '💻' },
      civil_servant: { label: 'Fonctionnaire', icon: '🏛️' },
      business_owner: { label: 'Chef d\'entreprise', icon: '🏢' }
    };
    return types[professionalStatus] || types.employee;
  };

  const renderStep1 = () => (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-elysion-primary mb-4">Bienvenue sur Elysion</h2>
      <div className="flex items-center justify-center mb-6">
        <span className="text-3xl mr-3">{getUserTypeInfo().icon}</span>
        <p className="text-xl text-elysion-text-light">
          Vous êtes enregistré comme <strong>{getUserTypeInfo().label}</strong>
        </p>
      </div>
      <div className="bg-elysion-bg p-6 rounded-lg mb-8">
        <p className="text-elysion-text-dark">
          Complétez votre profil pour obtenir une estimation retraite plus précise et personnalisée.
        </p>
      </div>
      <button 
        onClick={nextStep}
        className="btn-elysion-accent px-8 py-3"
        data-testid="onboarding-continue-btn"
      >
        Continuer
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-3xl font-bold text-elysion-primary mb-6 text-center">Informations personnelles</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Date de naissance
          </label>
          <input
            type="date"
            value={profileData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="input-elysion"
            data-testid="onboarding-birth-date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-3">
            Genre
          </label>
          <div className="grid grid-cols-2 gap-4">
            {['Homme', 'Femme'].map((gender) => (
              <label key={gender} className="cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={profileData.gender === gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="sr-only"
                  data-testid={`onboarding-gender-${gender.toLowerCase()}`}
                />
                <div className={`p-4 rounded-lg border-2 transition-all ${
                  profileData.gender === gender
                    ? 'border-elysion-primary bg-elysion-primary/5'
                    : 'border-gray-200 hover:border-elysion-secondary'
                }`}>
                  <span className="font-medium text-elysion-text-dark">{gender}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-3">
            Situation familiale
          </label>
          <div className="grid grid-cols-2 gap-4">
            {['Célibataire', 'En couple', 'Marié(e)', 'Divorcé(e)'].map((situation) => (
              <label key={situation} className="cursor-pointer">
                <input
                  type="radio"
                  name="family_situation"
                  value={situation}
                  checked={profileData.family_situation === situation}
                  onChange={(e) => handleInputChange('family_situation', e.target.value)}
                  className="sr-only"
                  data-testid={`onboarding-family-${situation.toLowerCase()}`}
                />
                <div className={`p-3 rounded-lg border-2 transition-all text-center ${
                  profileData.family_situation === situation
                    ? 'border-elysion-primary bg-elysion-primary/5'
                    : 'border-gray-200 hover:border-elysion-secondary'
                }`}>
                  <span className="text-sm font-medium text-elysion-text-dark">{situation}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep}
          className="btn-outline-elysion"
          data-testid="onboarding-prev-btn"
        >
          Précédent
        </button>
        <button 
          onClick={nextStep}
          className="btn-elysion-accent"
          data-testid="onboarding-next-btn"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const userTypeInfo = getUserTypeInfo();
    
    return (
      <div>
        <h2 className="text-3xl font-bold text-elysion-primary mb-2 text-center">Informations professionnelles</h2>
        <p className="text-center text-elysion-text-light mb-6 flex items-center justify-center">
          <span className="mr-2">{userTypeInfo.icon}</span>
          Profil {userTypeInfo.label}
        </p>

        <div className="space-y-6">
          {user?.user_type === 'employee' && (
            <>
              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Début de carrière (année)
                </label>
                <input
                  type="number"
                  placeholder="2010"
                  value={profileData.career_start}
                  onChange={(e) => handleInputChange('career_start', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-career-start"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Salaire annuel brut (€)
                </label>
                <input
                  type="number"
                  placeholder="45000"
                  value={profileData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-salary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Plans retraite entreprise
                </label>
                <select
                  value={profileData.retirement_plans}
                  onChange={(e) => handleInputChange('retirement_plans', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-retirement-plans"
                >
                  <option value="">Sélectionner...</option>
                  <option value="none">Aucun</option>
                  <option value="perco">PERCO</option>
                  <option value="per">PER Entreprise</option>
                  <option value="article83">Article 83</option>
                </select>
              </div>
            </>
          )}

          {user?.user_type === 'freelancer' && (
            <>
              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Type d'activité
                </label>
                <input
                  type="text"
                  placeholder="Consultant informatique, Graphiste..."
                  value={profileData.activity_type}
                  onChange={(e) => handleInputChange('activity_type', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-activity-type"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Statut juridique
                </label>
                <select
                  value={profileData.legal_status}
                  onChange={(e) => handleInputChange('legal_status', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-legal-status"
                >
                  <option value="">Sélectionner...</option>
                  <option value="auto-entrepreneur">Auto-entrepreneur</option>
                  <option value="eirl">EIRL</option>
                  <option value="eurl">EURL</option>
                  <option value="profession-liberale">Profession libérale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Revenus annuels moyens (€)
                </label>
                <input
                  type="number"
                  placeholder="35000"
                  value={profileData.average_income}
                  onChange={(e) => handleInputChange('average_income', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-average-income"
                />
              </div>
            </>
          )}

          {user?.user_type === 'business_owner' && (
            <>
              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Forme juridique de l'entreprise
                </label>
                <select
                  value={profileData.legal_form}
                  onChange={(e) => handleInputChange('legal_form', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-legal-form"
                >
                  <option value="">Sélectionner...</option>
                  <option value="sas">SAS</option>
                  <option value="sarl">SARL</option>
                  <option value="sa">SA</option>
                  <option value="sasu">SASU</option>
                  <option value="eurl">EURL</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Rémunération brute totale annuelle (€)
                </label>
                <input
                  type="number"
                  placeholder="80000"
                  value={profileData.gross_remuneration}
                  onChange={(e) => handleInputChange('gross_remuneration', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-gross-remuneration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Régime de retraite applicable
                </label>
                <select
                  value={profileData.pension_regime}
                  onChange={(e) => handleInputChange('pension_regime', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-pension-regime"
                >
                  <option value="">Sélectionner...</option>
                  <option value="rsi">RSI (ex-régime)</option>
                  <option value="ssi">SSI (Sécurité Sociale Indépendants)</option>
                  <option value="cipav">CIPAV</option>
                  <option value="cnbf">CNBF</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={prevStep}
            className="btn-outline-elysion"
            data-testid="onboarding-prev-btn"
          >
            Précédent
          </button>
          <button 
            onClick={nextStep}
            className="btn-elysion-accent"
            data-testid="onboarding-next-btn"
          >
            Suivant
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div>
      <h2 className="text-3xl font-bold text-elysion-primary mb-6 text-center">Récapitulatif de votre profil</h2>
      
      <div className="bg-elysion-bg p-6 rounded-lg mb-6">
        <h3 className="font-semibold text-elysion-primary mb-4">Informations personnelles:</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Date de naissance:</strong> {profileData.date_of_birth || 'Non renseigné'}</p>
          <p><strong>Genre:</strong> {profileData.gender || 'Non renseigné'}</p>
          <p><strong>Situation familiale:</strong> {profileData.family_situation || 'Non renseigné'}</p>
        </div>
      </div>

      <div className="bg-elysion-bg p-6 rounded-lg mb-8">
        <h3 className="font-semibold text-elysion-primary mb-4">Informations professionnelles:</h3>
        <div className="space-y-2 text-sm">
          {user?.user_type === 'employee' && (
            <>
              <p><strong>Début de carrière:</strong> {profileData.career_start || 'Non renseigné'}</p>
              <p><strong>Salaire:</strong> {profileData.salary ? `${parseInt(profileData.salary).toLocaleString()} €` : 'Non renseigné'}</p>
              <p><strong>Plans retraite:</strong> {profileData.retirement_plans || 'Non renseigné'}</p>
            </>
          )}
          {user?.user_type === 'freelancer' && (
            <>
              <p><strong>Activité:</strong> {profileData.activity_type || 'Non renseigné'}</p>
              <p><strong>Statut:</strong> {profileData.legal_status || 'Non renseigné'}</p>
              <p><strong>Revenus:</strong> {profileData.average_income ? `${parseInt(profileData.average_income).toLocaleString()} €` : 'Non renseigné'}</p>
            </>
          )}
          {user?.user_type === 'business_owner' && (
            <>
              <p><strong>Forme juridique:</strong> {profileData.legal_form || 'Non renseigné'}</p>
              <p><strong>Rémunération:</strong> {profileData.gross_remuneration ? `${parseInt(profileData.gross_remuneration).toLocaleString()} €` : 'Non renseigné'}</p>
              <p><strong>Régime retraite:</strong> {profileData.pension_regime || 'Non renseigné'}</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" data-testid="onboarding-error">
          {error}
        </div>
      )}

      <div className="text-center">
        <button 
          onClick={handleComplete}
          disabled={loading}
          className={`btn-elysion-accent px-8 py-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          data-testid="onboarding-complete-btn"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Sauvegarde...
            </div>
          ) : (
            'Confirmer et sauvegarder mon profil'
          )}
        </button>
        
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">
            ✅ Votre profil est complet ! Bienvenue sur Elysion.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep}
          className="btn-outline-elysion"
          data-testid="onboarding-prev-btn"
        >
          Précédent
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-elysion-bg flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-elysion-bg to-elysion-secondary/30 font-montserrat">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-elysion-primary">Elysion</h1>
            <div className="text-elysion-text-light">
              Bienvenue, {user.full_name}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep 
                      ? 'bg-elysion-primary text-white' 
                      : step < currentStep 
                        ? 'bg-elysion-accent text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-elysion-accent' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Card */}
          <div className="card-elysion max-w-2xl mx-auto fade-in">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;