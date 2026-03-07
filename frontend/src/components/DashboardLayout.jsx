import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import MobileTabBar from './MobileTabBar';
import { 
  Home, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Briefcase, 
  Rocket, 
  Building2, 
  User,
  ChevronLeft,
  Menu,
  X,
  Plus
} from 'lucide-react';

const DashboardLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user type icon component
  const getUserTypeIcon = () => {
    const iconProps = { size: 20, className: "text-elysion-primary" };
    switch (user?.user_type) {
      case 'employee': return <Briefcase {...iconProps} />;
      case 'freelancer': return <Rocket {...iconProps} />;
      case 'business_owner': return <Building2 {...iconProps} />;
      default: return <User {...iconProps} />;
    }
  };

  // Navigation items with Lucide icons
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { path: '/simulator', icon: Sparkles, label: 'Simulateur' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/investment-axes', icon: TrendingUp, label: 'Axes d\'investissement' },
    { path: '/profile', icon: Settings, label: 'Mon compte' },
  ];

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Skip to main content - Accessibility */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      
      {/* Sidebar - Desktop only */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 hidden lg:block ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`} role="navigation" aria-label="Menu principal">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!sidebarCollapsed && (
            <img src="/asset/Elysion - logo.png" alt="Elysion" className="h-8" />
          )}
          {sidebarCollapsed && (
            <img src="/asset/Elysion - navicon.png" alt="Elysion" className="h-8 w-8 mx-auto" />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={sidebarCollapsed ? 'Étendre le menu' : 'Réduire le menu'}
            aria-expanded={!sidebarCollapsed}
          >
            <ChevronLeft 
              size={20} 
              className={`text-gray-500 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* User info */}
        <div className={`p-4 border-b border-gray-100 ${sidebarCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-elysion-primary/10 rounded-full flex items-center justify-center text-xl">
              {getUserTypeIcon()}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-elysion-text-dark truncate">
                  {user?.full_name || 'Utilisateur'}
                </p>
                <p className="text-xs text-elysion-text-light truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1" aria-label="Navigation principale">
          <ul className="space-y-1" role="list">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-elysion-primary text-white'
                        : 'text-elysion-text-dark hover:bg-gray-100'
                    }`}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent size={20} aria-hidden="true" />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors`}
            aria-label="Se déconnecter"
          >
            <LogOut size={20} aria-hidden="true" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Déconnexion</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top navigation - Mobile & Tablet */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 lg:hidden">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <img src="/asset/Elysion - logo.png" alt="Elysion" className="h-8" />

              {/* Mobile Menu Button */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-elysion-text-dark truncate max-w-[100px]">
                  {user?.first_name || user?.full_name?.split(' ')[0]}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X size={24} className="text-gray-600" aria-hidden="true" />
                  ) : (
                    <Menu size={24} className="text-gray-600" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown Menu - Simplifié car la navigation est dans la TabBar */}
          {mobileMenuOpen && (
            <div className="bg-white border-t border-gray-100 shadow-lg">
              <div className="px-4 py-4">
                {/* User info */}
                <div className="px-3 py-3 bg-elysion-primary-50 rounded-xl mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-elysion-primary/10 rounded-full flex items-center justify-center">
                      {getUserTypeIcon()}
                    </div>
                    <div>
                      <p className="font-semibold text-elysion-text-dark">{user?.full_name}</p>
                      <p className="text-sm text-elysion-text-light">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Actions avec boutons stylisés */}
                <div className="space-y-3">
                  <button
                    onClick={() => { navigate('/simulator'); setMobileMenuOpen(false); }}
                    className="btn-accent w-full flex items-center justify-center space-x-2"
                    aria-label="Nouvelle simulation"
                  >
                    <Plus size={18} aria-hidden="true" />
                    <span>Nouvelle simulation</span>
                  </button>
                  
                  <button
                    onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                    className="btn-outline w-full flex items-center justify-center space-x-2"
                    aria-label="Mon compte"
                  >
                    <Settings size={18} aria-hidden="true" />
                    <span>Mon compte</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="btn-danger w-full flex items-center justify-center space-x-2"
                    aria-label="Se déconnecter"
                  >
                    <LogOut size={18} aria-hidden="true" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-elysion-text-dark">{title}</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/simulator')}
                  className="btn-accent flex items-center space-x-2"
                >
                  <Plus size={18} aria-hidden="true" />
                  <span>Nouvelle simulation</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="pb-20 lg:pb-6" role="main" tabIndex="-1">
          {children}
        </main>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
};

export default DashboardLayout;