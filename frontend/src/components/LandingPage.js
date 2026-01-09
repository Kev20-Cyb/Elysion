import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleTestSimulator = () => {
    navigate('/simulator');
  };

  const handleCreateAccount = () => {
    navigate('/auth?mode=register');
  };

  const handleLogin = () => {
    navigate('/auth?mode=login');
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
                  // onClick={handleTestSimulator} <-- Lien newsletter
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                  data-testid="hero-test-simulator-btn"
                >
                  Abonnez vous à notre newsletter
                </button>
                {<button 
                  onClick={handleTestSimulator}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                  data-testid="hero-test-simulator-btn"
                >
                  Testez notre simulateur
                </button>
                /*<button 
                  onClick={handleCreateAccount}
                  className="border-2 border-elysion-primary text-elysion-primary hover:bg-elysion-primary hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
                  data-testid="hero-create-account-btn"
                >
                  Créer mon compte
                </button> */}
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

      {/* Registration / Login Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center"> */}
            {/* Left Side - Content */}
            {/* <div>
              <h2 className="text-4xl font-bold text-elysion-primary mb-6 font-montserrat">
                Prêt à prendre le contrôle de votre retraite ?
              </h2>
              <p className="text-xl text-elysion-text-light mb-8 leading-relaxed">
                Rejoignez Elysion et commencez votre simulation personnalisée en quelques clics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={handleCreateAccount}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                  data-testid="final-create-account-btn"
                >
                  Créer un compte
                </button>
                <button 
                  onClick={handleLogin}
                  className="border-2 border-elysion-primary text-elysion-primary hover:bg-elysion-primary hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
                  data-testid="final-login-btn"
                >
                  Se connecter
                </button>
              </div> */}
              
              {/* Trust Indicators */}
              {/* <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm text-elysion-text-light">Données sécurisées</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🆓</div>
                  <div className="text-sm text-elysion-text-light">Gratuit</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm text-elysion-text-light">Résultats instantanés</div>
                </div>
              </div>
            </div> */}
            
            {/* Right Side - Illustration */}
            {/* <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-elysion-primary/10 to-elysion-secondary/20 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <div className="text-elysion-primary font-bold text-xl mb-2">Commencez maintenant</div>
                    <div className="text-elysion-text-light">Votre simulation en 5 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      {/* <section className="py-20 bg-elysion-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-elysion-primary mb-6 font-montserrat">Ce que disent nos utilisateurs</h2>
            
            {/* Rating Display */}
            {/* <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-1 mr-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-elysion-accent text-xl">⭐</span>
                ))}
              </div>
              <span className="text-elysion-text-light font-medium">4.8/5 sur 1,247 avis</span>
            </div>
          </div> */}
          
          {/* Testimonial Carousel */}
          {/* <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{transform: `translateX(-${currentTestimonial * 100}%)`}}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-2xl p-8 shadow-lg mx-4 text-center">
                      <div className="text-4xl mb-4">{testimonial.avatar}</div> */}
                      
                      {/* Stars */}
                      {/* <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-elysion-accent text-lg">⭐</span>
                        ))}
                      </div>
                      
                      <p className="text-elysion-text-light text-lg italic mb-6 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      
                      <div>
                        <div className="font-bold text-elysion-primary text-lg">{testimonial.name}</div>
                        <div className="text-elysion-text-light">{testimonial.profession} • {testimonial.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            
            {/* Carousel Indicators */}
            {/* <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-elysion-primary' : 'bg-elysion-secondary'
                  }`}
                  data-testid={`testimonial-indicator-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Newsletter Section */}
      <section className="py-20 bg-elysion-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 font-montserrat">Prêt à prendre le contrôle de votre avenir ?</h2>
            <p className="text-xl text-elysion-text-light max-w-2xl mx-auto py-5">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à Elysion !
            </p>
            <button 
              // onClick={handleTestSimulator} <-- Lien newsletter
                className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                data-testid="hero-test-simulator-btn"
            >
            Abonnez vous à notre newsletter
            </button>
            {/* <button 
              // onClick={handleTestSimulator} <-- Lien newsletter
                className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl"
                data-testid="hero-test-simulator-btn"
            >
            Testez notre simulateur
            </button> */}
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
            {/* <div>
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
            </div> */}
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
