import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import MobileTabBar from './MobileTabBar';

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

  // Get user type icon
  const getUserTypeIcon = () => {
    switch (user?.user_type) {
      case 'employee': return '💼';
      case 'freelancer': return '🚀';
      case 'business_owner': return '🏢';
      default: return '👤';
    }
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Tableau de bord' },
    { path: '/simulator', icon: '🔮', label: 'Simulateur' },
    { path: '/documents', icon: '📄', label: 'Documents' },
    { path: '/investment-axes', icon: '📈', label: 'Axes d\'investissement' },
    { path: '/profile', icon: '⚙️', label: 'Mon compte' },
  ];

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Sidebar - Desktop only */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 hidden lg:block ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-elysion-primary">Elysion</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? 'Étendre' : 'Réduire'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
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
        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-elysion-primary text-white'
                        : 'text-elysion-text-dark hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <span className="text-xl">{item.icon}</span>
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
            title={sidebarCollapsed ? 'Déconnexion' : ''}
          >
            <span className="text-xl">🚪</span>
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
              <h1 className="text-xl font-bold text-elysion-primary">Elysion</h1>

              {/* Mobile Menu Button */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-elysion-text-dark truncate max-w-[100px]">
                  {user?.first_name || user?.full_name?.split(' ')[0]}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
            <div className="bg-white border-t border-gray-100 shadow-lg">
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
                
                {/* Nav items */}
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-elysion-primary/10 text-elysion-primary'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
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

        {/* Desktop header */}
        <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-elysion-text-dark">{title}</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/simulator')}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  + Nouvelle simulation
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </div>
  );
};

export default DashboardLayout;