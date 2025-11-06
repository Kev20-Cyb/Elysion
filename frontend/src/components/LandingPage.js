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

  const features = [
    {
      title: "Smart Retirement Planning",
      description: "Get personalized retirement projections based on your profile and financial situation.",
      icon: "📊"
    },
    {
      title: "Secure Document Storage", 
      description: "Store and organize all your important financial documents in one secure place.",
      icon: "🔒"
    },
    {
      title: "Tailored Recommendations",
      description: "Receive customized advice based on whether you're an employee, freelancer, or business owner.",
      icon: "💡"
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
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-elysion-primary">Elysion</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth')}
                className="text-elysion-primary hover:text-elysion-accent font-semibold transition-colors"
                data-testid="nav-login-btn"
              >
                Se connecter
              </button>
              <button 
                onClick={handleGetStarted}
                className="btn-elysion-primary"
                data-testid="nav-get-started-btn"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-elysion-primary mb-6 slide-up">
            Planifiez votre retraite
            <br />
            <span className="text-elysion-accent">en toute sérénité</span>
          </h1>
          <p className="text-xl md:text-2xl text-elysion-text-light mb-8 max-w-3xl mx-auto fade-in">
            Une plateforme sécurisée et personnalisée pour simuler, optimiser et planifier votre retraite selon votre profil professionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in">
            <button 
              onClick={handleGetStarted}
              className="btn-elysion-primary text-lg px-8 py-4"
              data-testid="hero-get-started-btn"
            >
              Commencer la simulation
            </button>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline-elysion text-lg px-8 py-4"
              data-testid="hero-learn-more-btn"
            >
              En savoir plus
            </button>
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
