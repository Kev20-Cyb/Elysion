import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
    navigate('/auth?mode=register');
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
      icon: "👔"
    },
    {
      title: "Freelances",
      description: "Simulez votre pension à travers les régimes indépendants.",
      icon: "💻"
    },
    {
      title: "Chefs d'entreprise",
      description: "Visualisez l'impact de votre rémunération et dividendes sur votre retraite.",
      icon: "🏢"
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
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-elysion-primary font-montserrat">Elysion</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className="text-elysion-primary hover:text-elysion-accent font-medium transition-colors"
                data-testid="nav-login-btn"
              >
                Se connecter
              </button>
              <button 
                onClick={() => navigate('/auth?mode=register')}
                className="btn-elysion-accent"
                data-testid="nav-create-account-btn"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Problem & Solution */}
      <section className="bg-gradient-to-br from-elysion-bg to-elysion-secondary/30 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              
              <h1 className="text-5xl md:text-6xl font-bold text-elysion-primary mb-6 slide-up font-montserrat">
                Planifier sa retraite
                <br />
                <span className="text-elysion-text-dark">ne devrait pas être</span>
                <br />
                <span className="text-elysion-accent">compliqué.</span>
              </h1>
              
              <p className="text-xl text-elysion-text-light mb-8 fade-in leading-relaxed">
                Elysion vous aide à comprendre vos perspectives de retraite, simuler des scénarios et prendre des décisions éclairées — le tout sur une plateforme sécurisée.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 fade-in">
                <button 
                  onClick={handleOpenNewsletter}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                  data-testid="hero-newsletter-btn"
                >
                  Abonnez vous à notre newsletter
                </button>
                <button 
                  onClick={handleTestSimulator}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                  data-testid="hero-test-simulator-btn"
                >
                  Testez notre simulateur
                </button>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 bg-white/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-elysion-primary font-semibold text-lg">Tableau de bord</div>
                    <div className="text-elysion-text-light text-sm">Projections personnalisées</div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-elysion-accent/20 rounded-2xl flex items-center justify-center animate-bounce">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-elysion-primary/20 rounded-xl flex items-center justify-center animate-pulse">
                  <span className="text-lg">💰</span>
                </div>
                <div className="absolute top-1/2 -left-8 w-14 h-14 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for? Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6 font-montserrat">Conçu pour chaque parcours professionnel</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {targetUsers.map((user, index) => (
              <div 
                key={user.title} 
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 slide-up group" 
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{user.icon}</div>
                <h3 className="text-xl font-bold text-elysion-primary mb-4 font-montserrat">{user.title}</h3>
                <p className="text-elysion-text-light leading-relaxed">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-elysion-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-4 font-montserrat">Comment fonctionne Elysion ?</h2>
            <p className="text-xl text-elysion-text-light max-w-2xl mx-auto">
              Un processus simple pour prendre le contrôle de votre avenir.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {processSteps.map((step, index) => (
              <div key={step.step} className="text-center slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-elysion-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-32 h-0.5 bg-elysion-secondary transform translate-x-full"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-elysion-primary mb-4 font-montserrat">{step.title}</h3>
                <p className="text-elysion-text-light">{step.description}</p>
              </div>
            ))}
          </div>
          
          {/* <div className="text-center">
            <button 
              onClick={handleTestSimulator}
              className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl mb-4"
              data-testid="process-test-simulator-btn"
            >
              Tester notre simulateur
            </button>
            <div>
              <a href="#" className="text-elysion-primary hover:text-elysion-accent text-sm underline transition-colors">
                En savoir plus sur notre technologie
              </a>
            </div>
          </div> */}
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
            <p className="text-xl text-white text-elysion-text-light max-w-2xl mx-auto py-5">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à Elysion !
            </p>
            <button 
              // onClick={handleTestSimulator} <-- Lien newsletter
                className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                data-testid="hero-test-simulator-btn"
            >
            Abonnez vous à notre newsletter
            </button>
          </div>
        </div>
      </section>

      {/* Simple Footer
      <footer className="bg-elysion-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold font-montserrat">Elysion</h3>
            <p className="text-white/80">Planification retraite intelligente</p>
          </div>
          <div className="border-t border-white/20 pt-4">
            <p className="text-white/60 text-sm">&copy; 2024 Elysion. Tous droits réservés.</p>
          </div>
        </div>
      </footer> */}

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
  );
};
export default LandingPage;