import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import components
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import OnboardingFlow from './components/OnboardingFlow';
import Simulator from './components/Simulator';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Documents from './components/Documents';
import FreelanceSimulator from './components/FreelanceSimulator';
import EmployeeSimulator from './components/EmployeeSimulator';
import InvestmentAxes from './components/InvestmentAxes';
import ProfilePage from './components/ProfilePage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('elysion_token'));

  // Axios interceptor to add token to requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check token validity on load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`);
          setUser(response.data.user || response.data);

        } catch (error) {
          console.error('Token invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password
      });
      
      const token = response.data.access_token || response.data.token;
      const userData = response.data.user;

      if (!token) {
        return { success: false, error: "Token manquant dans la réponse serveur" };
      }

      setToken(token);
      setUser(userData);
      localStorage.setItem('elysion_token', token);

      return { success: true };
    } catch (error) {
      // Handle Pydantic validation errors (array of objects) or simple string errors
      const detail = error.response?.data?.detail;
      let errorMessage = 'Échec de la connexion';
      
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        errorMessage = detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API}/auth/register`, userData);

      const token = response.data.access_token || response.data.token;
      const newUser = response.data.user;

      if (!token) {
        return { success: false, error: "Token manquant dans la réponse serveur" };
      }

      setToken(token);
      setUser(newUser || null);
      localStorage.setItem('elysion_token', token);

      return { success: true };
    } catch (error) {
      // Handle Pydantic validation errors (array of objects) or simple string errors
      const detail = error.response?.data?.detail;
      let errorMessage = 'Échec de l\'inscription';
      
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        // Pydantic validation error - extract the message
        errorMessage = detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('elysion_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-elysion-bg flex items-center justify-center">
        <div className="animate-pulse text-elysion-primary text-xl font-montserrat">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/simulator/freelance" element={<FreelanceSimulator />} />
            <Route path="/simulator/employee" element={<EmployeeSimulator />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

<<<<<<< HEAD
=======
            {/* Simulator (protégé) */}
            <Route
              path="/simulator"
              element={
                  <Simulator />
              }
            />
            <Route
              path="/simulator/freelance"
              element={
                <ProtectedRoute>
                  <FreelanceSimulator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulator/employee"
              element={
                <ProtectedRoute>
                  <EmployeeSimulator />
                </ProtectedRoute>
              }
            />

>>>>>>> 4a271ae41d8237738a54ce302e2dc3661c323bc6
            {/* Pages protégées */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investment-axes"
              element={
                <ProtectedRoute>
                  <InvestmentAxes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;