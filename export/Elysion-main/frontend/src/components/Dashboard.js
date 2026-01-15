import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);
      setDashboardData(response.data);
    } catch (err) {
      setError('Erreur lors du chargement du tableau de bord');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-elysion-primary">Elysion</h1>
              <span className="text-elysion-text-light">|</span>
              <span className="text-elysion-text-dark font-medium">Tableau de bord</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{userTypeInfo.icon}</span>
                <span className="text-elysion-text-dark font-medium">{user?.full_name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-elysion-text-light hover:text-elysion-primary transition-colors"
                data-testid="dashboard-logout-btn"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 fade-in" data-testid="dashboard-welcome-section">
          <h1 className="text-4xl font-bold text-elysion-primary mb-2">
            Bonjour {user?.full_name} !
          </h1>
          <p className="text-xl text-elysion-text-light flex items-center">
            <span className="mr-2">{userTypeInfo.icon}</span>
            Tableau de bord {userTypeInfo.label}
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="dashboard-metrics-section">
          {/* Retirement Age Card */}
          <div className="card-elysion slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-elysion-text-dark">Âge de retraite projeté</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-elysion-primary mb-2" data-testid="dashboard-retirement-age">
              {dashboardData?.projected_retirement_age} ans
            </div>
            <p className="text-sm text-elysion-text-light">
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
            
            {/* Écart à combler */}
            <div className="bg-gradient-to-r from-elysion-primary-50 to-elysion-accent-50 p-6 rounded-xl mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Écart mensuel à combler</p>
                <p className="text-4xl font-bold text-elysion-primary mb-2">
                  {dashboardData?.estimated_monthly_pension 
                    ? Math.max(0, Math.round(dashboardData.estimated_monthly_pension * 0.3)).toLocaleString()
                    : '400'} €
                </p>
                <p className="text-xs text-gray-500">
                  pour atteindre votre objectif de revenus
                </p>
              </div>
            </div>
            
            {/* Axes rapides */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-gray-700">Axes à explorer :</p>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-xl">🛡️</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Épargne sécurisée</p>
                  <p className="text-xs text-gray-500">Livrets, épargne logement</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-xl">🎯</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Épargne retraite</p>
                  <p className="text-xs text-gray-500">PER, Assurance-vie</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-xl">📈</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Marchés financiers</p>
                  <p className="text-xs text-gray-500">PEA, Fonds diversifiés</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/investment-axes', {
                state: {
                  targetGap: dashboardData?.estimated_monthly_pension 
                    ? Math.max(0, Math.round(dashboardData.estimated_monthly_pension * 0.3))
                    : 400,
                  currentPension: dashboardData?.estimated_monthly_pension || 1800,
                  targetIncome: dashboardData?.estimated_monthly_pension 
                    ? Math.round(dashboardData.estimated_monthly_pension * 1.3)
                    : 2200
                }
              })}
              className="w-full btn-elysion-primary" 
              data-testid="dashboard-view-all-recommendations-btn"
            >
              Atteindre cet objectif →
            </button>
          </div>

          {/* Recent Documents Section */}
          <div className="card-elysion slide-up" style={{animationDelay: '0.1s'}} data-testid="dashboard-documents-section">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-elysion-text-dark">Documents récents</h3>
              <span className="text-2xl">📄</span>
            </div>
            <div className="space-y-3">
              {dashboardData?.recent_documents?.map((doc, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-elysion-bg rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  data-testid={`dashboard-document-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {doc.type === 'tax' && '📊'}
                      {doc.type === 'retirement' && '🏦'}
                      {doc.type === 'income' && '💵'}
                    </span>
                    <div>
                      <p className="font-medium text-elysion-text-dark">{doc.name}</p>
                      <p className="text-sm text-elysion-text-light">{doc.date}</p>
                    </div>
                  </div>
                  <span className="text-elysion-primary">→</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/documents')} 
              className="w-full mt-6 btn-elysion-primary" 
              data-testid="dashboard-upload-document-btn"
            >
              Gérer mes documents
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card-elysion slide-up" data-testid="dashboard-quick-actions-section">
          <h3 className="text-xl font-semibold text-elysion-text-dark mb-6 flex items-center">
            <span className="mr-2">⚡</span>
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-start-simulation-btn"
            >
              <div className="text-2xl mb-2">🔮</div>
              <h4 className="font-semibold text-elysion-text-dark mb-1">Nouvelle simulation</h4>
              <p className="text-sm text-elysion-text-light">Testez différents scénarios de retraite</p>
            </button>
            
            <button 
              className="p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-update-profile-btn"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <h4 className="font-semibold text-elysion-text-dark mb-1">Mettre à jour profil</h4>
              <p className="text-sm text-elysion-text-light">Ajustez vos informations financières</p>
            </button>
            
            <button 
              className="p-6 bg-elysion-bg rounded-lg border border-elysion-secondary hover:bg-elysion-secondary/20 transition-all text-left"
              data-testid="dashboard-export-data-btn"
            >
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-elysion-text-dark mb-1">Exporter données</h4>
              <p className="text-sm text-elysion-text-light">Téléchargez un rapport complet</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
