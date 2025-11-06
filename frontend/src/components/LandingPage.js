import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleStartSimulation = () => {
    if (isAuthenticated) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  const userPaths = [
    {
      type: "employee",
      title: "Salarié",
      description: "Vous êtes employé dans une entreprise avec des cotisations retraite automatiques.",
      icon: "👔",
      details: "Plans 401(k), cotisations patronales, régime général"
    },
    {
      type: "freelancer", 
      title: "Freelance",
      description: "Vous travaillez en indépendant et gérez vos propres cotisations retraite.",
      icon: "💻",
      details: "Auto-entrepreneur, professions libérales, régimes spéciaux"
    },
    {
      type: "business_owner",
      title: "Chef d'entreprise",
      description: "Vous dirigez une entreprise et optimisez votre stratégie retraite d'entreprise.",
      icon: "🏢", 
      details: "Dirigeant, société, plans retraite d'entreprise"
    }
  ];

  const values = [
    {
      title: "Clarté",
      description: "Visualisez votre avenir financier avec des projections claires et précises.",
      icon: "👁️"
    },
    {
      title: "Sécurité",
      description: "Vos documents et données sont protégés avec le plus haut niveau de sécurité.",
      icon: "🛡️"
    },
    {
      title: "Guidance",
      description: "Recevez des conseils personnalisés basés sur votre profil professionnel.",
      icon: "🧭"
    }
  ];

  const features = [
    {
      title: "Simulateur de Retraite",
      description: "Projections personnalisées selon votre profil professionnel et vos objectifs financiers.",
      icon: "🔮"
    },
    {
      title: "Stockage Sécurisé",
      description: "Centralisez tous vos documents importants dans un espace sécurisé et organisé.",
      icon: "📁"
    },
    {
      title: "Tableau de Bord Personnalisé",
      description: "Suivez vos progrès et visualisez vos métriques clés en temps réel.",
      icon: "📊"
    },
    {
      title: "Recommandations d'Expert",
      description: "Conseils personnalisés et stratégies optimisées pour votre situation unique.",
      icon: "💡"
    }
  ];

  const team = [
    {
      name: "Marie Laurent",
      role: "Experte en Planification Retraite",
      bio: "15 ans d'expérience en conseil financier et gestion de patrimoine.",
      avatar: "👩‍💼"
    },
    {
      name: "Jean Dubois",  
      role: "Directeur Technique",
      bio: "Ancien développeur chez une grande banque française, spécialiste fintech.",
      avatar: "👨‍💻"
    },
    {
      name: "Sophie Martin",
      role: "Responsable Produit",
      bio: "Experte UX avec une passion pour simplifier la planification financière.",
      avatar: "👩‍🎨"
    }
  ];

  const stats = [
    { number: "65+", label: "Average Retirement Age" },
    { number: "€1,800", label: "Avg Monthly Pension" },
    { number: "40%", label: "Income Replacement" },
    { number: "100%", label: "Secure & Encrypted" }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Marketing Manager",
      quote: "Elysion helped me understand exactly when I can retire and how much I need to save. The insights are invaluable!",
      avatar: "👩‍💼"
    },
    {
      name: "Jean-Pierre Martin",
      role: "Freelance Developer", 
      quote: "As a freelancer, retirement planning was confusing. Elysion made it simple and gave me a clear roadmap.",
      avatar: "👨‍💻"
    },
    {
      name: "Sophie Laurent",
      role: "Business Owner",
      quote: "The business owner features helped me optimize my retirement strategy while managing my company's needs.",
      avatar: "👩‍💼"
    }
  ];

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-elysion-primary">Elysion</h1>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-elysion-text-dark hover:text-elysion-primary transition-colors font-medium">
                Fonctionnalités
              </a>
              <a href="#simulator" className="text-elysion-text-dark hover:text-elysion-primary transition-colors font-medium">
                Simulateur
              </a>
              <a href="#documents" className="text-elysion-text-dark hover:text-elysion-primary transition-colors font-medium">
                Documents
              </a>
              <a href="#about" className="text-elysion-text-dark hover:text-elysion-primary transition-colors font-medium">
                À propos
              </a>
              <a href="#contact" className="text-elysion-text-dark hover:text-elysion-primary transition-colors font-medium">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth')}
                className="btn-outline-elysion"
                data-testid="nav-login-btn"
              >
                Se connecter
              </button>
              <button 
                onClick={handleGetStarted}
                className="btn-elysion-accent"
                data-testid="nav-get-started-btn"
              >
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-elysion-primary mb-6 slide-up">
                Préparez votre retraite
                <br />
                <span className="text-elysion-accent">en toute sérénité</span>
              </h1>
              <p className="text-xl md:text-2xl text-elysion-text-light mb-8 fade-in">
                Elysion vous aide à simuler, planifier et sécuriser votre retraite — quel que soit votre parcours professionnel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 fade-in">
                <button 
                  onClick={handleStartSimulation}
                  className="btn-elysion-accent text-lg px-8 py-4"
                  data-testid="hero-start-simulation-btn"
                >
                  Lancer la simulation
                </button>
                <button 
                  onClick={() => document.getElementById('choose-path').scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline-elysion text-lg px-8 py-4"
                  data-testid="hero-learn-more-btn"
                >
                  En savoir plus
                </button>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-96 h-96 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="text-8xl">📊</div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-elysion-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-elysion-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl font-bold text-elysion-primary mb-2">{stat.number}</div>
                <div className="text-elysion-text-light font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-elysion-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6">Fonctionnalités principales</h2>
            <p className="text-xl text-elysion-text-light max-w-3xl mx-auto">
              Découvrez comment Elysion vous aide à prendre le contrôle de votre avenir financier
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-elysion text-center slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-elysion-primary mb-4">{feature.title}</h3>
                <p className="text-elysion-text-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6">Témoignages</h2>
            <p className="text-xl text-elysion-text-light">Ce que nos utilisateurs disent d'Elysion</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-elysion slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-3xl mb-4">{testimonial.avatar}</div>
                <p className="text-elysion-text-light mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-elysion-primary">{testimonial.name}</div>
                  <div className="text-sm text-elysion-text-light">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-elysion-primary">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à planifier votre retraite ?</h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà pris le contrôle de leur avenir financier
          </p>
          <button 
            onClick={handleGetStarted}
            className="btn-elysion-accent text-lg px-8 py-4"
            data-testid="cta-get-started-btn"
          >
            Créer mon compte gratuitement
          </button>
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
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Simulateur</a></li>
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Tableau de bord</a></li>
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Documents</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-elysion-accent transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-elysion-accent transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-elysion-accent transition-colors">CGU</a></li>
              </ul>
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
