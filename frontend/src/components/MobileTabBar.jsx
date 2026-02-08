import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const MobileTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { path: '/dashboard', icon: '🏠', label: 'Accueil' },
    { path: '/simulator', icon: '🔮', label: 'Simuler' },
    { path: '/documents', icon: '📄', label: 'Documents' },
    { path: '/investment-axes', icon: '📈', label: 'Investir' },
    { path: '/profile', icon: '⚙️', label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === tab.path
                ? 'text-elysion-primary'
                : 'text-gray-500 hover:text-elysion-primary'
            }`}
            data-testid={`mobile-tab-${tab.label.toLowerCase()}`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Navigation Header Component for sub-pages with hamburger menu
export const PageHeader = ({ title, showBackButton = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Get user type icon
  const getUserTypeIcon = () => {
    switch (user?.user_type) {
      case 'employee': return '💼';
      case 'freelancer': return '🚀';
      case 'business_owner': return '🏢';
      default: return '👤';
    }
  };
  
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back button + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showBackButton && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-elysion-text-light hover:text-elysion-primary transition-colors"
                data-testid="back-to-dashboard-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-elysion-primary">Elysion</h1>
              <span className="text-elysion-text-light hidden sm:inline">|</span>
              <span className="text-elysion-text-dark font-medium text-sm sm:text-base hidden sm:inline">{title}</span>
            </div>
          </div>
          
          {/* Right side - Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-lg">{getUserTypeIcon()}</span>
              <span className="text-elysion-text-dark font-medium">{user?.full_name}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="text-elysion-text-light hover:text-elysion-primary transition-colors"
            >
              Déconnexion
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <span className="text-sm font-medium text-elysion-text-dark truncate max-w-[100px]">
              {user?.first_name || user?.full_name?.split(' ')[0]}
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
          <div className="px-4 py-3 space-y-1">
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100 mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getUserTypeIcon()}</span>
                <div>
                  <p className="font-medium text-elysion-text-dark">{user?.full_name}</p>
                  <p className="text-sm text-elysion-text-light">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Menu items */}
            <button
              onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium text-elysion-text-dark">Tableau de bord</span>
            </button>
            
            <button
              onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">⚙️</span>
              <span className="font-medium text-elysion-text-dark">Mon profil</span>
            </button>
            
            <button
              onClick={() => { navigate('/simulator'); setMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🔮</span>
              <span className="font-medium text-elysion-text-dark">Nouvelle simulation</span>
            </button>
            
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileTabBar;