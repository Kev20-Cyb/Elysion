import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put(`${API}/user/profile`, profileData);
      setSuccess('Profil mis à jour avec succès');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      await axios.put(`${API}/user/password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setSuccess('Mot de passe modifié avec succès');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserTypeLabel = (type) => {
    const types = {
      employee: 'Salarié',
      freelancer: 'Indépendant / Freelance',
      business_owner: 'Chef d\'entreprise',
      civil_servant: 'Fonctionnaire'
    };
    return types[type] || type;
  };

  const tabs = [
    { id: 'profile', label: 'Informations personnelles', icon: '👤' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'preferences', label: 'Préférences', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-2xl font-bold text-elysion-primary"
              >
                Elysion
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-elysion-text-dark font-medium">
                {user?.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="text-elysion-text-light hover:text-elysion-primary transition-colors"
                data-testid="profile-logout-btn"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-elysion-primary hover:text-elysion-accent mb-4 transition-colors"
          >
            ← Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-elysion-primary">Mon compte</h1>
          <p className="text-elysion-text-light mt-2">Gérez vos informations personnelles et vos préférences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-elysion-primary to-elysion-accent p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl">
                {user?.full_name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.full_name || 'Utilisateur'}</h2>
                <p className="text-white/80">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  {getUserTypeLabel(user?.user_type)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-elysion-primary border-b-2 border-elysion-primary bg-elysion-primary/5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                data-testid={`profile-tab-${tab.id}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => handleProfileChange('full_name', e.target.value)}
                      className="input-elysion"
                      placeholder="Votre nom"
                      data-testid="profile-fullname-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="input-elysion bg-gray-50 cursor-not-allowed"
                      data-testid="profile-email-input"
                    />
                    <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="input-elysion"
                      placeholder="06 12 34 56 78"
                      data-testid="profile-phone-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={profileData.date_of_birth}
                      onChange={(e) => handleProfileChange('date_of_birth', e.target.value)}
                      className="input-elysion"
                      data-testid="profile-birthdate-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className="input-elysion min-h-[80px]"
                    placeholder="Votre adresse postale"
                    data-testid="profile-address-input"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-elysion-primary disabled:opacity-50"
                    data-testid="profile-save-btn"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                        className="input-elysion"
                        placeholder="••••••••"
                        required
                        data-testid="profile-current-password-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                        className="input-elysion"
                        placeholder="••••••••"
                        required
                        data-testid="profile-new-password-input"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                        className="input-elysion"
                        placeholder="••••••••"
                        required
                        data-testid="profile-confirm-password-input"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-elysion-primary disabled:opacity-50"
                      data-testid="profile-change-password-btn"
                    >
                      {loading ? 'Modification...' : 'Modifier le mot de passe'}
                    </button>
                  </form>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions actives</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💻</span>
                        <div>
                          <p className="font-medium text-gray-900">Session actuelle</p>
                          <p className="text-sm text-gray-500">Navigateur web • Connecté maintenant</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Notifications par email</p>
                        <p className="text-sm text-gray-500">Recevez des rappels et conseils par email</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 text-elysion-primary rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Newsletter mensuelle</p>
                        <p className="text-sm text-gray-500">Actualités et conseils retraite</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 text-elysion-primary rounded"
                      />
                    </label>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone de danger</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">Supprimer mon compte</p>
                        <p className="text-sm text-red-600">Cette action est irréversible</p>
                      </div>
                      <button 
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                            // Handle account deletion
                            alert('Fonctionnalité en cours de développement');
                          }
                        }}
                        data-testid="profile-delete-account-btn"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
