import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Icons, getUserTypeIcon, getDocumentCategoryIcon } from './ui/icons';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRetirementAge, setSelectedRetirementAge] = useState(null);

  // Available retirement ages for selection
  const retirementAgeOptions = [62, 63, 64, 65, 66, 67];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch dashboard data, simulation and documents in parallel
      const [dashboardResponse, simulationResponse, documentsResponse] = await Promise.all([
        axios.get(`${API}/dashboard`),
        axios.get(`${API}/simulation/latest`).catch(() => ({ data: { simulation: null } })),
        axios.get(`${API}/documents`).catch(() => ({ data: [] }))
      ]);
      
      setDashboardData(dashboardResponse.data);
      setSimulationData(simulationResponse.data?.simulation);
      
      // Get the 3 most recent documents
      const docs = documentsResponse.data || [];
      setRecentDocuments(docs.slice(0, 3));
      
    } catch (err) {
      console.error('Dashboard error:', err);
      if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement du tableau de bord');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate investment data from simulation results based on selected retirement age
  const getInvestmentData = useCallback(() => {
    if (simulationData?.results) {
      const results = simulationData.results;
      const formData = simulationData.form_data || {};
      
      // Get base retirement age from simulation or default
      const baseRetirementAge = results.scenarios?.[0]?.age || results.retirementAge || 64;
      const effectiveAge = selectedRetirementAge || baseRetirementAge;
      
      // Set initial selected age if not set
      if (selectedRetirementAge === null && baseRetirementAge) {
        setSelectedRetirementAge(baseRetirementAge);
      }
      
      // Calculate user's current age
      const birthDate = formData.birthDate ? new Date(formData.birthDate) : null;
      const currentAge = birthDate 
        ? Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000))
        : 40;
      
      // Years until retirement
      const yearsToRetirement = Math.max(1, effectiveAge - currentAge);
      
      // Find scenario matching selected age if available
      const matchingScenario = results.scenarios?.find(s => s.age === effectiveAge);
      
      // Get annual income
      const annualIncome = formData.annualIncome || formData.annualRevenue || formData.currentMonthlyIncome * 12 || 0;
      const monthlyIncome = Math.round(annualIncome / 12);
      
      // Calculate pension based on age (simplified model)
      // Earlier retirement = lower pension, later = higher
      const ageDifference = effectiveAge - 64; // 64 as reference age
      const pensionAdjustmentFactor = 1 + (ageDifference * 0.05); // ±5% per year
      
      let basePension = 0;
      if (matchingScenario) {
        basePension = matchingScenario.totalMonthly || 0;
      } else if (results.currentPension !== undefined) {
        basePension = Math.round(results.currentPension * pensionAdjustmentFactor);
      } else {
        const scenario = results.scenarios?.[0] || results;
        basePension = Math.round((scenario.totalMonthly || results.totalMonthly || 0) * pensionAdjustmentFactor);
      }
      
      // Calculate replacement rate based on age
      let replacementRate = results.replacementRate || 0;
      if (replacementRate > 0) {
        replacementRate = Math.round(replacementRate * pensionAdjustmentFactor);
        replacementRate = Math.min(100, Math.max(30, replacementRate)); // Cap between 30-100%
      }
      
      // Target: maintain 70% of current income
      const targetIncome = Math.round(monthlyIncome * 0.7);
      const targetGap = Math.max(0, targetIncome - basePension);
      
      // Calculate required savings based on years to retirement
      const capitalNeeded = targetGap * 12 * 25; // 25 years of retirement
      const monthsToRetirement = yearsToRetirement * 12;
      const totalMonthlySavings = monthsToRetirement > 0 ? Math.round(capitalNeeded / monthsToRetirement) : 0;
      
      // Savings allocation based on time horizon
      let allocation = {};
      if (yearsToRetirement > 15) {
        // Long horizon - more aggressive
        allocation = {
          secure: Math.round(totalMonthlySavings * 0.10),
          retirement: Math.round(totalMonthlySavings * 0.30),
          markets: Math.round(totalMonthlySavings * 0.40),
          realestate: Math.round(totalMonthlySavings * 0.20)
        };
      } else if (yearsToRetirement > 8) {
        // Medium horizon - balanced
        allocation = {
          secure: Math.round(totalMonthlySavings * 0.15),
          retirement: Math.round(totalMonthlySavings * 0.35),
          markets: Math.round(totalMonthlySavings * 0.30),
          realestate: Math.round(totalMonthlySavings * 0.20)
        };
      } else {
        // Short horizon - more secure
        allocation = {
          secure: Math.round(totalMonthlySavings * 0.30),
          retirement: Math.round(totalMonthlySavings * 0.40),
          markets: Math.round(totalMonthlySavings * 0.15),
          realestate: Math.round(totalMonthlySavings * 0.15)
        };
      }
      
      return {
        currentPension: basePension,
        targetIncome,
        targetGap,
        totalMonthlySavings,
        savingsAllocation: allocation,
        hasSimulation: true,
        replacementRate,
        retirementAge: effectiveAge,
        yearsToRetirement,
        currentAge
      };
    }
    
    // Default values if no simulation
    return {
      currentPension: 0,
      targetIncome: 0,
      targetGap: 0,
      totalMonthlySavings: 0,
      savingsAllocation: {},
      hasSimulation: false,
      replacementRate: 0,
      retirementAge: selectedRetirementAge || 64,
      yearsToRetirement: 20,
      currentAge: 40
    };
  }, [simulationData, selectedRetirementAge]);

  const investmentData = getInvestmentData();

  const getUserTypeInfo = (userType) => {
    const types = {
      employee: { label: 'Salarié', icon: Icons.Employee, color: 'text-blue-600' },
      freelancer: { label: 'Freelance', icon: Icons.Freelancer, color: 'text-green-600' },
      business_owner: { label: 'Chef d\'entreprise', icon: Icons.BusinessOwner, color: 'text-purple-600' }
    };
    return types[userType] || types.employee;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-elysion-accent';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-elysion-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-elysion-primary font-montserrat">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-elysion-bg flex items-center justify-center">
        <div className="card-elysion text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="btn-elysion-primary"
            data-testid="dashboard-retry-btn"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const userTypeInfo = getUserTypeInfo(user?.user_type);

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 fade-in" data-testid="dashboard-welcome-section">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-elysion-primary mb-2">
            Bonjour {user?.first_name || user?.full_name} !
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-elysion-text-light flex items-center">
            <span className="mr-2">{React.createElement(userTypeInfo.icon, { size: 20 })}</span>
            Tableau de bord {userTypeInfo.label}
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8" data-testid="dashboard-metrics-section">
          {/* Retirement Age Card - Interactive */}
          <div className="card-elysion p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-elysion-text-dark">Âge de retraite souhaité</h3>
              <Icons.Target size={24} className="text-elysion-primary" aria-hidden="true" />
            </div>
            
            {/* Age Selector */}
            <div className="mb-3">
              <div 
                className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap"
                role="radiogroup"
                aria-label="Sélection de l'âge de départ à la retraite"
              >
                {retirementAgeOptions.map((age) => {
                  const isSelected = (selectedRetirementAge || investmentData.retirementAge) === age;
                  return (
                    <button
                      key={age}
                      onClick={() => setSelectedRetirementAge(age)}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${age} ans`}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm sm:text-base transition-all ${
                        isSelected
                          ? 'bg-elysion-primary text-white shadow-lg scale-110'
                          : 'bg-gray-100 text-gray-600 hover:bg-elysion-primary/20 hover:text-elysion-primary'
                      }`}
                      data-testid={`retirement-age-${age}`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-elysion-primary mb-1" data-testid="dashboard-retirement-age">
                {selectedRetirementAge || investmentData.retirementAge || dashboardData?.projected_retirement_age} ans
              </div>
              <p className="text-xs sm:text-sm text-elysion-text-light">
                {investmentData.yearsToRetirement > 0 
                  ? `Dans ${investmentData.yearsToRetirement} ans`
                  : 'Basé sur votre profil'}
              </p>
            </div>
            
            {/* Impact indicator */}
            {selectedRetirementAge && selectedRetirementAge !== 64 && (
              <div className={`mt-3 text-xs text-center p-2 rounded-lg ${
                selectedRetirementAge > 64 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-orange-50 text-orange-700'
              }`}>
                {selectedRetirementAge > 64 
                  ? `+${(selectedRetirementAge - 64) * 5}% de pension estimée`
                  : `${(selectedRetirementAge - 64) * 5}% de pension estimée`}
              </div>
            )}
          </div>

          {/* Monthly Pension Card */}
          <div className="card-elysion p-4 sm:p-6" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-elysion-text-dark">Pension mensuelle estimée</h3>
              <Icons.Money size={24} className="text-elysion-accent" aria-hidden="true" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-elysion-accent mb-1 sm:mb-2" data-testid="dashboard-monthly-pension">
              {investmentData.hasSimulation 
                ? `${investmentData.currentPension.toLocaleString()} €`
                : `€${dashboardData?.estimated_monthly_pension?.toLocaleString() || 0}`}
            </div>
            <p className="text-xs sm:text-sm text-elysion-text-light">
              {investmentData.hasSimulation && investmentData.replacementRate > 0
                ? `Taux de remplacement: ${investmentData.replacementRate}%`
                : 'Projection basée sur vos cotisations'}
            </p>
          </div>

          {/* Savings Progress Card */}
          <div className="card-elysion p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-elysion-text-dark">Épargne suggérée</h3>
              <Icons.Investment size={24} className="text-elysion-primary" aria-hidden="true" />
            </div>
            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-elysion-primary" data-testid="dashboard-savings-progress">
                  {investmentData.hasSimulation 
                    ? `${investmentData.totalMonthlySavings.toLocaleString()} €`
                    : `${dashboardData?.savings_progress || 0}%`}
                </span>
                {investmentData.hasSimulation && (
                  <span className="text-xs sm:text-sm text-elysion-text-light">/mois</span>
                )}
              </div>
              {!investmentData.hasSimulation && (
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(dashboardData?.savings_progress)}`}
                    style={{width: `${dashboardData?.savings_progress}%`}}
                  ></div>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-elysion-text-light">
              {investmentData.hasSimulation 
                ? `Pour combler l'écart de ${investmentData.targetGap.toLocaleString()} €/mois`
                : 'De votre objectif retraite'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Objectif & Axes Section */}
          <div className="card-elysion" data-testid="dashboard-recommendations-section">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-elysion-text-dark">Votre objectif retraite</h3>
              <Icons.Target size={24} className="text-elysion-primary" aria-hidden="true" />
            </div>
            
            {investmentData.hasSimulation ? (
              <>
                {/* Résumé de simulation */}
                <div className="bg-elysion-primary p-6 rounded-xl mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Pension estimée</p>
                      <p className="text-xl font-bold text-elysion-primary">
                        {investmentData.currentPension.toLocaleString()} €
                      </p>
                      <p className="text-xs text-gray-400">/mois</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Objectif revenus</p>
                      <p className="text-xl font-bold text-elysion-accent">
                        {investmentData.targetIncome.toLocaleString()} €
                      </p>
                      <p className="text-xs text-gray-400">/mois</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-lg p-3 text-center">
                    <p className="text-white text-sm">Écart mensuel à combler</p>
                    <p className="text-3xl font-bold text-white">
                      {investmentData.targetGap.toLocaleString()} €
                    </p>
                  </div>
                  {investmentData.totalMonthlySavings > 0 && (
                    <div className="mt-3 bg-elysion-accent rounded-lg p-3 text-center">
                      <p className="text-white text-sm">Épargne mensuelle suggérée</p>
                      <p className="text-2xl font-bold text-white">
                        {investmentData.totalMonthlySavings.toLocaleString()} €/mois
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Axes rapides avec montants */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-700">Répartition suggérée :</p>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <Icons.Shield size={20} className="text-blue-600" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Épargne sécurisée</p>
                      <p className="text-xs text-gray-500">Livrets, épargne logement</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">
                        {(investmentData.savingsAllocation?.secure || 0).toLocaleString()} €
                      </p>
                      <p className="text-xs text-green-600">15%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Icons.Target size={20} className="text-blue-600" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Épargne retraite</p>
                      <p className="text-xs text-gray-500">PER, Assurance-vie</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-700">
                        {(investmentData.savingsAllocation?.retirement || 0).toLocaleString()} €
                      </p>
                      <p className="text-xs text-blue-600">35%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <Icons.Investment size={20} className="text-orange-600" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Marchés financiers</p>
                      <p className="text-xs text-gray-500">PEA, Fonds diversifiés</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-700">
                        {(investmentData.savingsAllocation?.markets || 0).toLocaleString()} €
                      </p>
                      <p className="text-xs text-orange-600">30%</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Pas de simulation */}
                <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
                  <Icons.Simulator size={40} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
                  <p className="text-gray-600 mb-2">Aucune simulation effectuée</p>
                  <p className="text-sm text-gray-500">
                    Réalisez une simulation pour obtenir des recommandations personnalisées
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('/simulator')}
                  className="w-full btn-elysion-primary mb-4" 
                  data-testid="dashboard-start-simulation-btn-alt"
                >
                  Faire une simulation →
                </button>
              </>
            )}
            
            {investmentData.hasSimulation && (
              <button 
                onClick={() => navigate('/investment-axes', {
                  state: {
                    targetGap: investmentData.targetGap,
                    currentPension: investmentData.currentPension,
                    targetIncome: investmentData.targetIncome,
                    totalMonthlySavings: investmentData.totalMonthlySavings,
                    savingsAllocation: investmentData.savingsAllocation,
                    replacementRate: investmentData.replacementRate,
                    retirementAge: investmentData.retirementAge
                  }
                })}
                className="w-full btn-elysion-primary" 
                data-testid="dashboard-view-all-recommendations-btn"
              >
                Voir les axes d'investissement →
              </button>
            )}
          </div>

          {/* Recent Documents Section */}
          <div className="card-elysion" style={{animationDelay: '0.1s'}} data-testid="dashboard-documents-section">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-elysion-text-dark">Documents récents</h3>
              <Icons.Documents size={24} className="text-elysion-primary" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc, index) => (
                  <div 
                    key={doc.id || index} 
                    className="flex items-center justify-between p-3 bg-elysion-bg rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/documents')}
                    data-testid={`dashboard-document-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {getDocumentCategoryIcon(doc.category, { size: 20, className: "text-elysion-primary" })}
                      </span>
                      <div>
                        <p className="font-medium text-elysion-text-dark truncate max-w-[200px]">{doc.filename}</p>
                        <p className="text-sm text-elysion-text-light">
                          {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                    </div>
                    <Icons.ArrowRight size={16} className="text-elysion-primary" aria-hidden="true" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-elysion-text-light">
                  <Icons.Folder size={32} className="mx-auto mb-2 text-gray-400" aria-hidden="true" />
                  <p>Aucun document téléchargé</p>
                  <p className="text-sm mt-1">Ajoutez vos documents pour les retrouver ici</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/documents')} 
              className="w-full mt-6 btn-elysion-primary" 
              data-testid="dashboard-upload-document-btn"
            >
              {recentDocuments.length > 0 ? 'Gérer mes documents' : 'Ajouter un document'}
            </button>
          </div>
        </div>

        {/* Quick Actions - Hidden on mobile (replaced by tab bar) */}
        <div className="hidden lg:block mt-6 sm:mt-8 card-elysion" data-testid="dashboard-quick-actions-section">
          <h3 className="text-lg sm:text-xl font-semibold text-elysion-text-dark mb-4 sm:mb-6 flex items-center">
            <Icons.Zap size={20} className="mr-2 text-elysion-accent" aria-hidden="true" />
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/simulator')}
              className="p-4 sm:p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-start-simulation-btn"
            >
              <Icons.Simulator size={28} className="mb-2 text-elysion-primary" aria-hidden="true" />
              <h4 className="font-semibold text-elysion-text-dark mb-1 text-sm sm:text-base">Nouvelle simulation</h4>
              <p className="text-xs sm:text-sm text-elysion-text-light">Testez différents scénarios de retraite</p>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="p-4 sm:p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-update-profile-btn"
            >
              <Icons.Profile size={28} className="mb-2 text-elysion-primary" aria-hidden="true" />
              <h4 className="font-semibold text-elysion-text-dark mb-1 text-sm sm:text-base">Mettre à jour profil</h4>
              <p className="text-xs sm:text-sm text-elysion-text-light">Gérez vos informations personnelles</p>
            </button>
            
            <button 
              onClick={() => navigate('/documents')}
              className="p-4 sm:p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-export-data-btn"
            >
              <Icons.Chart size={28} className="mb-2 text-elysion-primary" aria-hidden="true" />
              <h4 className="font-semibold text-elysion-text-dark mb-1 text-sm sm:text-base">Mes documents</h4>
              <p className="text-xs sm:text-sm text-elysion-text-light">Gérez vos justificatifs et relevés</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;