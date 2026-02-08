import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileTabBar from './MobileTabBar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Calculate investment data from simulation results
  const getInvestmentData = () => {
    if (simulationData?.results) {
      const results = simulationData.results;
      
      // Use pre-calculated values if available
      if (results.currentPension !== undefined) {
        return {
          currentPension: results.currentPension || 0,
          targetIncome: results.targetIncome || 0,
          targetGap: results.targetGap || 0,
          totalMonthlySavings: results.totalMonthlySavings || 0,
          savingsAllocation: results.savingsAllocation || {},
          hasSimulation: true,
          replacementRate: results.replacementRate || 0,
          retirementAge: results.scenarios?.[0]?.age || 64
        };
      }
      
      // Fallback: calculate from scenarios
      const scenario = results.scenarios?.[0] || results;
      const currentPension = scenario.totalMonthly || results.totalMonthly || 0;
      
      // Get form data for income
      const formData = simulationData.form_data || {};
      const annualIncome = formData.annualIncome || formData.annualRevenue || formData.currentMonthlyIncome * 12 || 0;
      const monthlyIncome = Math.round(annualIncome / 12);
      
      // Target: maintain 70% of current income
      const targetIncome = Math.round(monthlyIncome * 0.7);
      const targetGap = Math.max(0, targetIncome - currentPension);
      
      // Calculate savings
      const capitalNeeded = targetGap * 12 * 25;
      const monthsToRetirement = 20 * 12;
      const totalMonthlySavings = Math.round(capitalNeeded / monthsToRetirement);
      
      return {
        currentPension,
        targetIncome,
        targetGap,
        totalMonthlySavings,
        savingsAllocation: {
          secure: Math.round(totalMonthlySavings * 0.15),
          retirement: Math.round(totalMonthlySavings * 0.35),
          markets: Math.round(totalMonthlySavings * 0.30),
          realestate: Math.round(totalMonthlySavings * 0.20)
        },
        hasSimulation: true,
        replacementRate: results.replacementRate || scenario.replacementRate || 0,
        retirementAge: scenario.age || results.retirementAge || 64
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
      retirementAge: 64
    };
  };

  const investmentData = getInvestmentData();

  const getUserTypeInfo = (userType) => {
    const types = {
      employee: { label: 'Salarié', icon: '👔', color: 'text-blue-600' },
      freelancer: { label: 'Freelance', icon: '💻', color: 'text-green-600' },
      business_owner: { label: 'Chef d\'entreprise', icon: '🏢', color: 'text-purple-600' }
    };
    return types[userType] || types.employee;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-elysion-accent';
    return 'bg-red-500';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <div className="min-h-screen bg-elysion-bg font-montserrat pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-elysion-primary">Elysion</h1>
              <span className="text-elysion-text-light hidden sm:inline">|</span>
              <span className="text-elysion-text-dark font-medium hidden sm:inline">Tableau de bord</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                data-testid="dashboard-profile-link"
              >
                <span className="text-lg">{userTypeInfo.icon}</span>
                <span className="text-elysion-text-dark font-medium">{user?.full_name}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="text-elysion-text-light hover:text-elysion-primary transition-colors"
                data-testid="dashboard-logout-btn"
              >
                Déconnexion
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <span className="text-sm font-medium text-elysion-text-dark truncate max-w-[120px]">
                {user?.full_name}
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="mobile-menu-toggle"
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
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">{userTypeInfo.icon}</span>
                <span className="font-medium text-elysion-text-dark">Mon profil</span>
              </button>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 fade-in" data-testid="dashboard-welcome-section">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-elysion-primary mb-2">
            Bonjour {user?.first_name || user?.full_name} !
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-elysion-text-light flex items-center">
            <span className="mr-2">{userTypeInfo.icon}</span>
            Tableau de bord {userTypeInfo.label}
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8" data-testid="dashboard-metrics-section">
          {/* Retirement Age Card */}
          <div className="card-elysion slide-up p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-elysion-text-dark">Âge de retraite projeté</h3>
              <span className="text-xl sm:text-2xl">🎯</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-elysion-primary mb-1 sm:mb-2" data-testid="dashboard-retirement-age">
              {dashboardData?.projected_retirement_age} ans
            </div>
            <p className="text-xs sm:text-sm text-elysion-text-light">
              Basé sur votre profil {userTypeInfo.label.toLowerCase()}
            </p>
          </div>

          {/* Monthly Pension Card */}
          <div className="card-elysion slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-elysion-text-dark">Pension mensuelle estimée</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-elysion-accent mb-2" data-testid="dashboard-monthly-pension">
              €{dashboardData?.estimated_monthly_pension?.toLocaleString()}
            </div>
            <p className="text-sm text-elysion-text-light">
              Projection basée sur vos cotisations
            </p>
          </div>

          {/* Savings Progress Card */}
          <div className="card-elysion slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-elysion-text-dark">Progrès épargne</h3>
              <span className="text-2xl">📈</span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-elysion-primary" data-testid="dashboard-savings-progress">
                  {dashboardData?.savings_progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(dashboardData?.savings_progress)}`}
                  style={{width: `${dashboardData?.savings_progress}%`}}
                ></div>
              </div>
            </div>
            <p className="text-sm text-elysion-text-light">
              De votre objectif retraite
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Objectif & Axes Section */}
          <div className="card-elysion slide-up" data-testid="dashboard-recommendations-section">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-elysion-text-dark">Votre objectif retraite</h3>
              <span className="text-2xl">🎯</span>
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
                    <span className="text-xl">🛡️</span>
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
                    <span className="text-xl">🎯</span>
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
                    <span className="text-xl">📈</span>
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
                  <span className="text-4xl mb-4 block">🔮</span>
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
          <div className="card-elysion slide-up" style={{animationDelay: '0.1s'}} data-testid="dashboard-documents-section">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-elysion-text-dark">Documents récents</h3>
              <span className="text-2xl">📄</span>
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
                        {doc.category === 'salary_slip' && '💵'}
                        {doc.category === 'career_statement' && '📋'}
                        {doc.category === 'tax_declaration' && '📊'}
                        {doc.category === 'retirement_contract' && '🏦'}
                        {doc.category === 'other' && '📄'}
                        {!doc.category && '📄'}
                      </span>
                      <div>
                        <p className="font-medium text-elysion-text-dark truncate max-w-[200px]">{doc.filename}</p>
                        <p className="text-sm text-elysion-text-light">
                          {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                    </div>
                    <span className="text-elysion-primary">→</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-elysion-text-light">
                  <span className="text-3xl block mb-2">📁</span>
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
        <div className="hidden md:block mt-6 sm:mt-8 card-elysion slide-up" data-testid="dashboard-quick-actions-section">
          <h3 className="text-lg sm:text-xl font-semibold text-elysion-text-dark mb-4 sm:mb-6 flex items-center">
            <span className="mr-2">⚡</span>
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/simulator')}
              className="p-4 sm:p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-start-simulation-btn"
            >
              <div className="text-xl sm:text-2xl mb-2">🔮</div>
              <h4 className="font-semibold text-elysion-text-dark mb-1 text-sm sm:text-base">Nouvelle simulation</h4>
              <p className="text-xs sm:text-sm text-elysion-text-light">Testez différents scénarios de retraite</p>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="p-4 sm:p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-update-profile-btn"
            >
              <div className="text-xl sm:text-2xl mb-2">⚙️</div>
              <h4 className="font-semibold text-elysion-text-dark mb-1 text-sm sm:text-base">Mettre à jour profil</h4>
              <p className="text-xs sm:text-sm text-elysion-text-light">Gérez vos informations personnelles</p>
            </button>
            
            <button 
              onClick={() => navigate('/documents')}
              className="p-4 sm:p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-export-data-btn"
            >
              <div className="text-xl sm:text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-elysion-text-dark mb-1 text-sm sm:text-base">Mes documents</h4>
              <p className="text-xs sm:text-sm text-elysion-text-light">Gérez vos justificatifs et relevés</p>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
};

export default Dashboard;
