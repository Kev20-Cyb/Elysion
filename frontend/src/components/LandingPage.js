import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleTestSimulator = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };

  const handleLogin = () => {
    navigate('/auth');
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
    { number: "+10 000", label: "Profils analysés" },
    { number: "98%", label: "Satisfaction utilisateur" },
    { number: "+20%", label: "Valeur retraite optimisée en moyenne" },
    { number: "100%", label: "Données sécurisées" }
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
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-elysion-primary font-montserrat">Elysion</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogin}
                className="text-elysion-primary hover:text-elysion-accent font-medium transition-colors"
                data-testid="nav-login-btn"
              >
                Se connecter
              </button>
              <button 
                onClick={handleCreateAccount}
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
              <div className="inline-flex items-center bg-white/80 rounded-full px-4 py-2 mb-6 slide-up">
                <span className="text-elysion-accent font-medium text-sm">🆓 Outil gratuit — Sans engagement</span>
              </div>
              
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
                  onClick={handleTestSimulator}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                  data-testid="hero-test-simulator-btn"
                >
                  Tester notre simulateur
                </button>
                <button 
                  onClick={handleCreateAccount}
                  className="border-2 border-elysion-primary text-elysion-primary hover:bg-elysion-primary hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
                  data-testid="hero-create-account-btn"
                >
                  Créer mon compte
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
          
          <div className="text-center">
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

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6">Fonctionnalités clés</h2>
            <p className="text-xl text-elysion-text-light max-w-3xl mx-auto">
              Une suite complète d'outils pour maîtriser votre planification retraite
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-elysion text-center slide-up hover:shadow-xl transition-all" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-elysion-primary mb-3">{feature.title}</h3>
                <p className="text-elysion-text-light text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={handleGetStarted}
              className="btn-elysion-accent text-lg px-8 py-4"
              data-testid="features-create-account-btn"
            >
              Créer mon compte
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="about" className="py-20 bg-elysion-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6">Rencontrez l'équipe Elysion</h2>
            <p className="text-xl text-elysion-text-light max-w-3xl mx-auto">
              Des experts passionnés dédiés à votre réussite financière
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="card-elysion text-center slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="text-5xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-elysion-primary mb-2">{member.name}</h3>
                <p className="text-elysion-accent font-medium mb-3">{member.role}</p>
                <p className="text-elysion-text-light text-sm">{member.bio}</p>
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

      {/* CTA Footer Section */}
      <section className="py-20 bg-elysion-primary">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à prendre le contrôle de votre avenir ?</h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers d'utilisateurs qui font déjà confiance à Elysion
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 hover:shadow-xl"
            data-testid="cta-get-started-btn"
          >
            Créer mon compte gratuit
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
