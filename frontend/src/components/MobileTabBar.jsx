import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Icons, getUserTypeIcon } from './ui/icons';

const MobileTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { path: '/dashboard', icon: Icons.Dashboard, label: 'Accueil' },
    { path: '/simulator', icon: Icons.Simulator, label: 'Simuler' },
    { path: '/documents', icon: Icons.Documents, label: 'Documents' },
    { path: '/investment-axes', icon: Icons.Investment, label: 'Investir' },
    { path: '/profile', icon: Icons.Profile, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-elysion-primary'
                  : 'text-gray-500 hover:text-elysion-primary'
              }`}
              data-testid={`mobile-tab-${tab.label.toLowerCase()}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComponent size={22} className="mb-1" aria-hidden="true" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
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
                aria-label="Retour au tableau de bord"
              >
                <Icons.ChevronLeft size={20} aria-hidden="true" />
              </button>
            )}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src="/asset/Elysion - logo.png" alt="Elysion" className="h-7 sm:h-8" />
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
              {getUserTypeIcon(user?.user_type, { size: 18, className: "text-elysion-primary" })}
              <span className="text-elysion-text-dark font-medium">{user?.full_name}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="text-elysion-text-light hover:text-elysion-primary transition-colors flex items-center space-x-1"
            >
              <Icons.Logout size={18} aria-hidden="true" />
              <span>Déconnexion</span>
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
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <Icons.Close size={24} className="text-gray-600" aria-hidden="true" />
              ) : (
                <Icons.Menu size={24} className="text-gray-600" aria-hidden="true" />
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
                {getUserTypeIcon(user?.user_type, { size: 24, className: "text-elysion-primary" })}
                <div>
                  <p className="font-medium text-elysion-text-dark">{user?.full_name}</p>
                  <p className="text-sm text-elysion-text-light">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <button
              onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icons.Profile size={20} className="text-gray-600" aria-hidden="true" />
              <span className="font-medium">Mon compte</span>
            </button>
            
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <Icons.Logout size={20} aria-hidden="true" />
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