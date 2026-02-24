import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL.replace(/\/$/, '') + '/api';


const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Newsletter modal state
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleTestSimulator = () => {
    navigate('/simulator');
  };

  const handleCreateAccount = () => {
    navigate('/onboarding');
  };

  const handleLogin = () => {
    navigate('/auth?mode=login');
  };

  const handleOpenNewsletter = () => {
    setShowNewsletterModal(true);
    setNewsletterEmail('');
    setNewsletterSuccess(false);
    setNewsletterError('');
  };

  const handleCloseNewsletter = () => {
    setShowNewsletterModal(false);
    setNewsletterEmail('');
    setNewsletterSuccess(false);
    setNewsletterError('');
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterError('');
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError('Veuillez entrer une adresse email valide.');
      return;
    }

    setNewsletterLoading(true);
    try {
      await axios.post(`${API}/newsletter/subscribe`, { email: newsletterEmail });
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    } catch (error) {
      if (error.response?.status === 409) {
        setNewsletterError('Cette adresse email est déjà inscrite.');
      } else {
        setNewsletterError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Target user types
  const targetUsers = [
    {
      title: "Salariés",
      description: "Estimez votre future retraite en fonction de votre salaire et trimestres validés.",
      icon: "./asset/salarie.svg"
    },
    {
      title: "Freelances",
      description: "Simulez votre pension à travers les régimes indépendants.",
      icon: "./asset/freelance.svg"
    },
    {
      title: "Chefs d'entreprise",
      description: "Visualisez l'impact de votre rémunération et dividendes sur votre retraite.",
      icon: "./asset/patron.svg"
    }
  ];

  // How it works steps
  const processSteps = [
    {
      step: "01",
      title: "Créez votre profil",
      description: "Formulaire simple pour définir votre statut professionnel."
    },
    {
      step: "02", 
      title: "Complétez votre onboarding",
      description: "Renseignez vos détails personnels et professionnels pour une estimation précise."
    },
    {
      step: "03",
      title: "Accédez à votre tableau de bord",
      description: "Découvrez vos projections et recommandations personnalisées."
    }
  ];

  // Key statistics
  const keyStats = [
    { number: "64 ans", label: "Âge légal de départ" },
    { number: "43 ans", label: "Durée de cotisations requise" },
    { number: "2 sur 3", label: "Sous-estime sa pension" },
    { number: "70%", label: "Ne sont pas assez informé de leur retraite" }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Marie Dubois",
      profession: "Salariée",
      status: "Employée",
      text: "Elysion m'a aidée à comprendre exactement quand je pourrais prendre ma retraite. Les projections sont très claires !",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Thomas Bernard",
      profession: "Freelance",
      status: "Indépendant",
      text: "En tant qu'indépendant, c'était compliqué de s'y retrouver. Maintenant j'ai une vision claire de mon avenir.",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      profession: "Dirigeante",
      status: "Chef d'entreprise",
      text: "Les simulations m'ont permis d'optimiser ma stratégie retraite. Un outil indispensable pour tout dirigeant.",
      avatar: "👩‍🏭",
      rating: 5
    },
    {
      name: "Pierre Moreau",
      profession: "Consultant",
      status: "Freelance",
      text: "Interface intuitive et conseils pertinents. Elysion a transformé ma façon de voir la planification retraite.",
      avatar: "👨‍💼",
      rating: 4
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // This old data has been replaced by the new structure above

  return (
  <>
    {/* Newsletter Modal */}
    {showNewsletterModal && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4"
        onClick={handleCloseNewsletter}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-elysion-primary font-montserrat">
              Newsletter Elysion
            </h3>
            <button
              onClick={handleCloseNewsletter}
              className="ml-4 rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
              aria-label="Fermer"
              type="button"
            >
              ✕
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Reçois les actus + tips retraite, sans spam (promis juré).
          </p>

          <form className="mt-4 space-y-3" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="ton.email@exemple.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-elysion-accent"
              required
            />

            {newsletterError && (
              <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
                {newsletterError}
              </div>
            )}

            {newsletterSuccess && (
              <div className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
                Inscription OK ✅ Check ta boîte mail (et les spams au cas où 👀)
              </div>
            )}

            <button
              type="submit"
              disabled={newsletterLoading}
              className="w-full rounded-xl bg-elysion-accent px-6 py-3 font-semibold text-white hover:bg-elysion-accent/90 disabled:opacity-60"
            >
              {newsletterLoading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    )}

    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-elysion-primary font-montserrat">Elysion</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className="btn-outline"
                data-testid="nav-login-btn"
              >
                Se connecter
              </button>
              <button 
                onClick={() => navigate('/auth?mode=register')}
                className="btn-accent"
                data-testid="nav-create-account-btn"
              >
                Créer un compte
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="landing-mobile-menu-toggle"
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
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => { navigate('/simulator'); setMobileMenuOpen(false); }}
                className="btn-secondary w-full"
              >
                Simulateur
              </button>
              
              <button
                onClick={() => { navigate('/auth?mode=login'); setMobileMenuOpen(false); }}
                className="btn-outline w-full"
              >
                Se connecter
              </button>
              
              <button
                onClick={() => { navigate('/auth?mode=register'); setMobileMenuOpen(false); }}
                className="btn-accent w-full"
              >
                Créer un compte
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-elysion-primary/5 via-transparent to-elysion-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-elysion-primary mb-6 leading-tight">
              Votre retraite,
              <span className="text-elysion-accent"> calculée simplement</span>
            </h2>
            <p className="text-lg sm:text-xl text-elysion-text-light mb-8 max-w-2xl mx-auto">
              Calculez facilement et précisément votre future pension de retraite. 
              Simulez différents scénarios pour mieux préparer votre avenir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTestSimulator}
                className="btn-primary text-lg px-8 py-4"
                data-testid="hero-test-simulator-btn"
              >
                Tester le simulateur
              </button>
              <button
                onClick={handleCreateAccount}
                className="btn-outline text-lg px-8 py-4"
                data-testid="hero-create-account-btn"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {keyStats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-3xl md:text-4xl font-bold text-elysion-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-elysion-text-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-16 bg-elysion-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-elysion-primary mb-4">
              Pour qui est Elysion ?
            </h3>
            <p className="text-elysion-text-light max-w-2xl mx-auto">
              Que vous soyez salarié, indépendant ou chef d'entreprise, 
              nous vous aidons à y voir plus clair.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {targetUsers.map((user, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={user.icon}
                  alt={user.title}
                  className="mb-4 object-contain"
                />

                <h3 className="text-lg font-semibold text-elysion-primary mb-2">
                  {user.title}
                </h3>

                <p className="text-sm text-elysion-text-light leading-relaxed">
                  {user.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-elysion-primary mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-elysion-text-light max-w-2xl mx-auto">
              En 3 étapes simples, obtenez une estimation précise de votre retraite.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elysion-primary text-white text-2xl font-bold mb-4">
                  {step.step}
                </div>
                <h4 className="text-xl font-bold text-elysion-primary mb-3">
                  {step.title}
                </h4>
                <p className="text-elysion-text-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Numbers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6 font-montserrat">La confiance de milliers de professionnels</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyStats.map((stat, index) => (
              <div key={index} className="text-center slide-up group" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-5xl font-bold text-elysion-accent mb-3 group-hover:scale-110 transition-transform font-montserrat">
                  {stat.number}
                </div>
                <div className="text-elysion-text-light font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-elysion-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 font-montserrat">Prêt à prendre le contrôle de votre avenir ?</h2>
            <p className="text-xl text-elysion-text-light max-w-2xl mx-auto py-5">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à Elysion !
            </p>
            <button 
              onClick={handleOpenNewsletter}
              className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
              data-testid="footer-newsletter-btn"
            >
              Abonnez vous à notre newsletter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Elysion</h3>
              <p className="text-gray-400">Votre partenaire pour une retraite sereine et bien planifiée.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elysion. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;