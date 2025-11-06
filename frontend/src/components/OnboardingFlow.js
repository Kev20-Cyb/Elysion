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

  // Step 1: Welcome & Context
  const renderStep1 = () => (
    <div className="text-center">
      <div className="text-5xl mb-6">📊</div>
      <h2 className="text-3xl font-bold text-elysion-primary mb-4 font-montserrat">
        Complétez votre profil pour une estimation retraite précise
      </h2>
      <p className="text-xl text-elysion-text-light mb-8 max-w-2xl mx-auto">
        En fonction de votre situation — que vous soyez salarié, freelance ou dirigeant — Elysion adapte vos prévisions pour vous donner les résultats les plus précis.
      </p>
      
      <div className="bg-elysion-bg p-6 rounded-xl mb-8 border-l-4 border-elysion-accent">
        <div className="flex items-center justify-center mb-3">
          <span className="text-3xl mr-3">{getUserTypeInfo().icon}</span>
          <p className="text-lg text-elysion-text-dark">
            Profil sélectionné: <strong>{getUserTypeInfo().label}</strong>
          </p>
        </div>
        <p className="text-elysion-text-light text-sm">
          Nous adapterons les questions selon votre statut professionnel
        </p>
      </div>
      
      <button 
        onClick={nextStep}
        className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
        data-testid="onboarding-continue-btn"
      >
        Continuer
      </button>
    </div>
  );

  // Step 2: Personal Information (Universal)
  const renderStep2 = () => (
    <div>
      <h2 className="text-3xl font-bold text-elysion-primary mb-6 text-center font-montserrat">Informations personnelles</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Date de naissance
          </label>
          <input
            type="date"
            value={profileData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-birth-date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Genre
          </label>
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-gender"
          >
            <option value="">Sélectionner</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="prefer_not_say">Préfère ne pas dire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Situation matrimoniale
          </label>
          <select
            value={profileData.marital_status}
            onChange={(e) => handleInputChange('marital_status', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-marital-status"
          >
            <option value="">Sélectionner</option>
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)</option>
            <option value="divorced">Divorcé(e)</option>
            <option value="widowed">Veuf(ve)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Nombre d'enfants
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={profileData.number_of_children}
            onChange={(e) => handleInputChange('number_of_children', parseInt(e.target.value) || 0)}
            className="input-elysion"
            data-testid="onboarding-children"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep}
          className="text-elysion-primary hover:text-elysion-accent transition-colors"
          data-testid="onboarding-back-btn"
        >
          ← Retour
        </button>
        <button 
          onClick={nextStep}
          disabled={!profileData.date_of_birth || !profileData.gender || !profileData.marital_status}
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="onboarding-next-btn"
        >
          Suivant →
        </button>
      </div>
    </div>
  );

  // Step 3: Professional Information (Conditional)
  const renderStep3 = () => {
    const userTypeInfo = getUserTypeInfo();
    
    return (
      <div>
        <h2 className="text-3xl font-bold text-elysion-primary mb-2 text-center font-montserrat">Informations professionnelles</h2>
        <p className="text-center text-elysion-text-light mb-6 flex items-center justify-center">
          <span className="mr-2">{userTypeInfo.icon}</span>
          Profil {userTypeInfo.label}
        </p>

        <div className="space-y-6">
          {/* Employee Fields */}
          {professionalStatus === 'employee' && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                    Début de carrière (année)
                  </label>
                  <input
                    type="number"
                    placeholder="2010"
                    min="1970"
                    max={new Date().getFullYear()}
                    value={profileData.career_start}
                    onChange={(e) => handleInputChange('career_start', e.target.value)}
                    className="input-elysion"
                    data-testid="onboarding-career-start"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                    Salaire annuel brut actuel (€)
                  </label>
                  <input
                    type="number"
                    placeholder="45000"
                    step="1000"
                    value={profileData.annual_salary}
                    onChange={(e) => handleInputChange('annual_salary', e.target.value)}
                    className="input-elysion"
                    data-testid="onboarding-salary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-3">
                  Régimes de retraite (cochez tous les applicables)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Régime général', 'Complémentaire AGIRC-ARRCO'].map((scheme) => (
                    <label key={scheme} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.pension_schemes.includes(scheme)}
                        onChange={(e) => {
                          const schemes = [...profileData.pension_schemes];
                          if (e.target.checked) {
                            schemes.push(scheme);
                          } else {
                            schemes.splice(schemes.indexOf(scheme), 1);
                          }
                          handleInputChange('pension_schemes', schemes);
                        }}
                        className="mr-2"
                        data-testid={`pension-scheme-${scheme.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <span className="text-sm">{scheme}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Trimestres validés (estimation)
                </label>
                <input
                  type="number"
                  placeholder="120"
                  min="0"
                  max="200"
                  value={profileData.validated_quarters}
                  onChange={(e) => handleInputChange('validated_quarters', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-validated-quarters"
                />
                <p className="text-sm text-elysion-text-light mt-1">
                  Environ 4 trimestres par année travaillée
                </p>
              </div>
            </>
          )}

          {/* Freelancer/Self-employed Fields */}
          {(professionalStatus === 'freelancer' || professionalStatus === 'self_employed') && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                    Type d'activité
                  </label>
                  <select
                    value={profileData.activity_type}
                    onChange={(e) => handleInputChange('activity_type', e.target.value)}
                    className="input-elysion"
                    data-testid="onboarding-activity-type"
                  >
                    <option value="">Sélectionner</option>
                    <option value="consulting">Conseil / Consulting</option>
                    <option value="it">Informatique / Développement</option>
                    <option value="creative">Créatif / Design</option>
                    <option value="trade">Commerce / Vente</option>
                    <option value="service">Services</option>
                    <option value="other">Autre</option>
                  </select>
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
                    <option value="">Sélectionner</option>
                    <option value="micro">Micro-entrepreneur</option>
                    <option value="ei">Entrepreneur individuel</option>
                    <option value="eurl">EURL</option>
                    <option value="liberal">Profession libérale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Revenus annuels moyens (€)
                </label>
                <input
                  type="number"
                  placeholder="35000"
                  step="1000"
                  value={profileData.average_income}
                  onChange={(e) => handleInputChange('average_income', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-average-income"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-3">
                  Régimes de retraite
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['SSI', 'CIPAV', 'CNBF', 'Autre caisse'].map((regime) => (
                    <label key={regime} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.retirement_regimes.includes(regime)}
                        onChange={(e) => {
                          const regimes = [...profileData.retirement_regimes];
                          if (e.target.checked) {
                            regimes.push(regime);
                          } else {
                            regimes.splice(regimes.indexOf(regime), 1);
                          }
                          handleInputChange('retirement_regimes', regimes);
                        }}
                        className="mr-2"
                        data-testid={`retirement-regime-${regime.toLowerCase()}`}
                      />
                      <span className="text-sm">{regime}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Business Owner Fields */}
          {professionalStatus === 'business_owner' && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                    Forme juridique
                  </label>
                  <select
                    value={profileData.company_legal_form}
                    onChange={(e) => handleInputChange('company_legal_form', e.target.value)}
                    className="input-elysion"
                    data-testid="onboarding-legal-form"
                  >
                    <option value="">Sélectionner</option>
                    <option value="sas">SAS</option>
                    <option value="sarl">SARL</option>
                    <option value="sa">SA</option>
                    <option value="sasu">SASU</option>
                    <option value="eurl">EURL</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                    Rémunération annuelle (€)
                  </label>
                  <input
                    type="number"
                    placeholder="80000"
                    step="5000"
                    value={profileData.remuneration}
                    onChange={(e) => handleInputChange('remuneration', e.target.value)}
                    className="input-elysion"
                    data-testid="onboarding-remuneration"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-2">
                  Type de rémunération
                </label>
                <select
                  value={profileData.regime_type}
                  onChange={(e) => handleInputChange('regime_type', e.target.value)}
                  className="input-elysion"
                  data-testid="onboarding-regime-type"
                >
                  <option value="">Sélectionner</option>
                  <option value="salary_only">Salaire uniquement</option>
                  <option value="dividends_only">Dividendes uniquement</option>
                  <option value="mixed">Salaire + Dividendes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-elysion-text-dark mb-3">
                  Plans de retraite associés
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Madelin', 'PER', 'Article 83', 'Retraite supplémentaire'].map((plan) => (
                    <label key={plan} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.retirement_plans.includes(plan)}
                        onChange={(e) => {
                          const plans = [...profileData.retirement_plans];
                          if (e.target.checked) {
                            plans.push(plan);
                          } else {
                            plans.splice(plans.indexOf(plan), 1);
                          }
                          handleInputChange('retirement_plans', plans);
                        }}
                        className="mr-2"
                        data-testid={`retirement-plan-${plan.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <span className="text-sm">{plan}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={prevStep}
            className="text-elysion-primary hover:text-elysion-accent transition-colors"
            data-testid="onboarding-back-btn"
          >
            ← Retour
          </button>
          <button 
            onClick={nextStep}
            className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            data-testid="onboarding-validate-btn"
          >
            Valider mes informations →
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