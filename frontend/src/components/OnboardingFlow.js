import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Check if user comes from simulator (has state) or from landing page (no state)
  const comesFromSimulator = location.state?.professionalStatus !== undefined;
  
  // Get data from simulator or defaults
  const [selectedStatus, setSelectedStatus] = useState(location.state?.professionalStatus || '');
  const professionalStatus = selectedStatus || 'employee';
  const simulationData = location.state?.simulationData || {};
  const simulationResults = location.state?.results || null;

  const [profileData, setProfileData] = useState({
    // Personal Info (Step 2)
    date_of_birth: simulationData.birthDate || '',
    gender: '',
    marital_status: '',
    number_of_children: 0,
    
    // Professional Info (Step 3) - varies by user type
    career_start: simulationData.careerStart || '',
    annual_salary: simulationData.annualIncome || '',
    pension_schemes: [],
    validated_quarters: '',
    
    // Freelancer specific
    activity_type: '',
    legal_status: '',
    average_income: simulationData.annualIncome || '',
    retirement_regimes: [],
    
    // Business owner specific
    company_legal_form: '',
    remuneration: simulationData.annualIncome || '',
    regime_type: '',
    retirement_plans: [],
    
    // Account Setup (Step 5)
    first_name: '',
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
    if (currentStep < 5) {
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
        full_name: profileData.first_name || profileData.email.split('@')[0],
        user_type: professionalStatus
      });
      
      // Get token from registration response (support both 'token' and 'access_token')
      const token = response.data.token || response.data.access_token;
      const user = response.data.user;
      
      if (token) {
        // Store token in localStorage for persistence
        localStorage.setItem('elysion_token', token);
        
        // Set axios default header for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Save profile data with the token
        try {
          await axios.post(`${API}/profile/complete`, {
            ...profileData,
            user_id: user?.id
          });
        } catch (profileErr) {
          // Profile save failed but account created - continue to dashboard
          console.warn('Profile save failed:', profileErr);
        }
        
        // Save simulation results if available
        if (simulationResults) {
          try {
            await axios.post(`${API}/simulation/save`, {
              simulator_type: professionalStatus,
              form_data: simulationData,
              results: simulationResults,
              saved_at: new Date().toISOString()
            });
          } catch (simErr) {
            console.warn('Simulation save failed:', simErr);
          }
        }
        
        // Login to update React state
        await login(profileData.email, profileData.password);
        
        navigate('/dashboard');
      } else {
        setError('Erreur lors de la création du compte - token manquant');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      
      // If email already registered, try to login instead
      if (typeof detail === 'string' && detail.toLowerCase().includes('already registered')) {
        try {
          const loginResult = await login(profileData.email, profileData.password);
          if (loginResult.success) {
            // Also save simulation if login succeeded
            if (simulationResults) {
              try {
                await axios.post(`${API}/simulation/save`, {
                  simulator_type: professionalStatus,
                  form_data: simulationData,
                  results: simulationResults,
                  saved_at: new Date().toISOString()
                });
              } catch (simErr) {
                console.warn('Simulation save failed:', simErr);
              }
            }
            navigate('/dashboard');
            return;
          } else {
            setError('Cet email est déjà utilisé. Vérifiez votre mot de passe ou connectez-vous.');
          }
        } catch (loginErr) {
          setError('Cet email est déjà utilisé. Veuillez vous connecter avec votre mot de passe.');
        }
      } else {
        // Handle other errors
        let errorMessage = 'Erreur lors de la création du compte';
        
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
        }
        
        setError(errorMessage);
      }
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

  // Step 1: Welcome & Context (with status selection if coming from landing)
  const renderStep1 = () => {
    // If user comes directly from landing page, show status selection cards
    if (!comesFromSimulator) {
      return (
        <div className="text-center">
          <div className="text-5xl mb-6">📊</div>
          <h2 className="text-3xl font-bold text-elysion-primary mb-4 font-montserrat">
            Quel est votre statut professionnel ?
          </h2>
          <p className="text-lg text-elysion-text-light mb-8 max-w-2xl mx-auto">
            Sélectionnez votre profil pour que nous adaptions les questions à votre situation.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {/* Salarié Card */}
            <button
              onClick={() => setSelectedStatus('employee')}
              className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                selectedStatus === 'employee'
                  ? 'border-elysion-primary bg-elysion-primary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-elysion-primary'
              }`}
            >
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-elysion-primary mb-2">Salarié</h3>
              <p className="text-gray-600 text-sm">
                CDI, CDD, intérim, fonctionnaire...
              </p>
            </button>

            {/* Freelance Card */}
            <button
              onClick={() => setSelectedStatus('freelancer')}
              className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                selectedStatus === 'freelancer'
                  ? 'border-elysion-accent bg-elysion-accent-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-elysion-accent'
              }`}
            >
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold text-elysion-primary mb-2">Freelance</h3>
              <p className="text-gray-600 text-sm">
                Micro-entrepreneur, indépendant, profession libérale...
              </p>
            </button>

            {/* Dirigeant Card */}
            <button
              onClick={() => setSelectedStatus('business_owner')}
              className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                selectedStatus === 'business_owner'
                  ? 'border-elysion-secondary bg-elysion-secondary-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-elysion-secondary'
              }`}
            >
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-elysion-primary mb-2">Dirigeant</h3>
              <p className="text-gray-600 text-sm">
                Chef d'entreprise, gérant, président...
              </p>
            </button>
          </div>
          
          <button 
            onClick={nextStep}
            disabled={!selectedStatus}
            className={`font-semibold px-8 py-4 rounded-xl text-lg transition-all ${
              selectedStatus 
                ? 'bg-elysion-accent hover:bg-elysion-accent/90 text-white hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            data-testid="onboarding-continue-btn"
          >
            Continuer
          </button>
        </div>
      );
    }
    
    // If user comes from simulator, show the profile they selected
    return (
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
  };

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

  // Step 4: Summary & Confirmation
  const renderStep4 = () => (
    <div>
      <h2 className="text-3xl font-bold text-elysion-primary mb-4 text-center font-montserrat">Vérifiez vos informations</h2>
      <p className="text-center text-elysion-text-light mb-8">
        Voici un récapitulatif de vos données avant de continuer vers votre espace personnel.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Personal Data Card */}
        <div className="bg-elysion-bg p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-elysion-primary">Informations personnelles</h3>
            <button 
              onClick={() => setCurrentStep(2)}
              className="text-elysion-accent hover:text-elysion-accent/70 text-sm"
              data-testid="edit-personal-btn"
            >
              ✏️ Modifier
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Date de naissance:</strong> {profileData.date_of_birth || 'Non renseigné'}</p>
            <p><strong>Genre:</strong> {
              profileData.gender === 'male' ? 'Homme' : 
              profileData.gender === 'female' ? 'Femme' : 
              profileData.gender === 'prefer_not_say' ? 'Préfère ne pas dire' :
              'Non renseigné'
            }</p>
            <p><strong>Situation:</strong> {
              profileData.marital_status === 'single' ? 'Célibataire' :
              profileData.marital_status === 'married' ? 'Marié(e)' :
              profileData.marital_status === 'divorced' ? 'Divorcé(e)' :
              profileData.marital_status === 'widowed' ? 'Veuf(ve)' :
              'Non renseigné'
            }</p>
            <p><strong>Enfants:</strong> {profileData.number_of_children}</p>
          </div>
        </div>

        {/* Professional Data Card */}
        <div className="bg-elysion-bg p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-elysion-primary">Informations professionnelles</h3>
            <button 
              onClick={() => setCurrentStep(3)}
              className="text-elysion-accent hover:text-elysion-accent/70 text-sm"
              data-testid="edit-professional-btn"
            >
              ✏️ Modifier
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Profil:</strong> {getUserTypeInfo().label}</p>
            
            {professionalStatus === 'employee' && (
              <>
                <p><strong>Début carrière:</strong> {profileData.career_start || 'Non renseigné'}</p>
                <p><strong>Salaire:</strong> {profileData.annual_salary ? `${parseInt(profileData.annual_salary).toLocaleString()} €` : 'Non renseigné'}</p>
                <p><strong>Trimestres:</strong> {profileData.validated_quarters || 'Non renseigné'}</p>
              </>
            )}
            
            {(professionalStatus === 'freelancer' || professionalStatus === 'self_employed') && (
              <>
                <p><strong>Activité:</strong> {profileData.activity_type || 'Non renseigné'}</p>
                <p><strong>Statut:</strong> {profileData.legal_status || 'Non renseigné'}</p>
                <p><strong>Revenus:</strong> {profileData.average_income ? `${parseInt(profileData.average_income).toLocaleString()} €` : 'Non renseigné'}</p>
              </>
            )}
            
            {professionalStatus === 'business_owner' && (
              <>
                <p><strong>Forme juridique:</strong> {profileData.company_legal_form || 'Non renseigné'}</p>
                <p><strong>Rémunération:</strong> {profileData.remuneration ? `${parseInt(profileData.remuneration).toLocaleString()} €` : 'Non renseigné'}</p>
                <p><strong>Type:</strong> {profileData.regime_type || 'Non renseigné'}</p>
              </>
            )}
          </div>
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
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          data-testid="onboarding-confirm-btn"
        >
          Confirmer et continuer →
        </button>
      </div>
    </div>
  );

  // Step 5: Account Setup
  const renderStep5 = () => (
    <div>
      <h2 className="text-3xl font-bold text-elysion-primary mb-4 text-center font-montserrat">Créez votre compte</h2>
      <p className="text-center text-elysion-text-light mb-8">
        Finalisez votre inscription pour accéder à votre espace personnel Elysion.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" data-testid="onboarding-error">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Prénom
          </label>
          <input
            type="text"
            placeholder="Votre prénom"
            value={profileData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-first-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Adresse email
          </label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={profileData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-password"
          />
          <p className="text-sm text-elysion-text-light mt-1">
            Minimum 8 caractères recommandés
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-elysion-text-dark mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={profileData.confirm_password}
            onChange={(e) => handleInputChange('confirm_password', e.target.value)}
            className="input-elysion"
            required
            data-testid="onboarding-confirm-password"
          />
          {profileData.password && profileData.confirm_password && profileData.password !== profileData.confirm_password && (
            <p className="text-sm text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <div className="bg-elysion-bg p-4 rounded-lg">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={profileData.agree_terms}
              onChange={(e) => handleInputChange('agree_terms', e.target.checked)}
              className="mr-3 mt-1"
              required
              data-testid="onboarding-terms"
            />
            <span className="text-sm text-elysion-text-dark">
              J'accepte les <a href="#" className="text-elysion-primary underline">conditions d'utilisation</a> et la <a href="#" className="text-elysion-primary underline">politique de confidentialité</a> d'Elysion.
            </span>
          </label>
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
          onClick={handleComplete}
          disabled={loading || !profileData.first_name || !profileData.email || !profileData.password || !profileData.confirm_password || profileData.password !== profileData.confirm_password || !profileData.agree_terms}
          className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="onboarding-create-account-btn"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Création du compte...
            </div>
          ) : (
            'Créer mon compte'
          )}
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
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  // Loading state for component initialization
  if (loading && currentStep === 5) {
    return (
      <div className="min-h-screen bg-elysion-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-elysion-primary">Création de votre compte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-elysion-bg to-elysion-secondary/30 font-montserrat">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-elysion-primary hover:text-elysion-accent transition-colors"
            >
              <img src="/asset/Elysion - logo.png" alt="Elysion" className="h-8" />
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className="hover:opacity-80 transition-opacity"
              >
                Déjà un compte ?
              </button>
              <div className="text-elysion-text-light text-sm">
                Finalisation du profil
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="card-elysion max-w-2xl mx-auto fade-in p-8">
            {/* Progress bar */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 py-4 px-4 sm:px-2">
                {[1, 2, 3, 4, 5].map((step, index) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          step < currentStep
                            ? 'bg-elysion-primary'
                            : step === currentStep
                            ? 'bg-elysion-accent'
                            : 'bg-gray-300'
                        }`}
                      >
                        {step < currentStep ? (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-white text-sm sm:text-base font-semibold">{step}</span>
                        )}
                      </div>
                    </div>
                    {index < 4 && (
                      <div
                        className={`w-3 sm:w-6 h-1 mx-0.5 sm:mx-1 transition-all duration-300 ${
                          step < currentStep
                            ? 'bg-elysion-primary'
                            : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;