import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import { Icons } from './ui/icons';

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
      title: 'Salariés',
      description:
        'Estimez votre future retraite en fonction de votre salaire et trimestres validés.',
      icon: "./asset/salarie.svg",
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
      step: '01',
      title: 'Créez votre profil',
      description: 'Formulaire simple pour définir votre statut professionnel.',
    },
    {
      step: '02',
      title: 'Complétez votre onboarding',
      description:
        'Renseignez vos détails personnels et professionnels pour une estimation précise.',
    },
    {
      step: '03',
      title: 'Accédez à votre tableau de bord',
      description:
        'Découvrez vos projections et recommandations personnalisées.',
    },
  ];
  // Key statistics
  const keyStats = [
    { number: '64 ans', label: 'Âge légal de départ' },
    { number: '43 ans', label: 'Durée de cotisations requise' },
    { number: '2 sur 3', label: 'Sous-estime sa pension' },
    { number: '70%', label: 'Ne sont pas assez informé de leur retraite' },
  ];
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
      <nav className='bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <img src='/asset/Elysion - logo.png' alt='Elysion' className='h-8' />
            </div>
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-3'>
              <button
                onClick={() => navigate('/auth?mode=login')}
                className='btn-primary'
                data-testid='nav-login-btn'
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate('/onboarding')}
                className='btn-outline'
                data-testid='nav-create-account-btn'
              >
                Créer un compte
              </button>
            </div>
            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                data-testid='landing-mobile-menu-toggle'
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {mobileMenuOpen ? (
                  <Icons.Close size={24} className="text-gray-600" aria-hidden="true" />
                ) : (
                  <Icons.Menu size={24} className="text-gray-600" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden bg-white border-t border-gray-100 shadow-lg'>
            <div className='px-4 py-4 space-y-3'>
              <button
                onClick={() => {
                  navigate('/simulator');
                  setMobileMenuOpen(false);
                }}
                className='btn-secondary w-full'
              >
                Simulateur
              </button>
              <button
                onClick={() => {
                  navigate('/auth?mode=login');
                  setMobileMenuOpen(false);
                }}
                className='btn-primary w-full'
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  navigate('/onboarding');
                  setMobileMenuOpen(false);
                }}
                className='btn-outline w-full'
              >
                Créer un compte
              </button>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section - Problem & Solution */}
      <section className='bg-gradient-to-br from-elysion-bg to-elysion-secondary/30 py-24 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div className='text-left'>
              <h1 className='text-5xl md:text-6xl font-bold text-elysion-primary mb-6 slide-up font-montserrat'>
                Planifier sa retraite
                <br />
                <span className='text-elysion-text-dark'>
                  ne devrait pas être
                </span>
                <br />
                <span className='text-elysion-accent'>compliqué.</span>
              </h1>
              <p className='text-xl text-elysion-text-light mb-8 fade-in leading-relaxed'>
                Elysion vous aide à comprendre vos perspectives de retraite,
                simuler des scénarios et prendre des décisions éclairées — le
                tout sur une plateforme sécurisée.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 fade-in'>
                <button
                  onClick={handleOpenNewsletter}
                  className='btn-outline'
                  data-testid='hero-newsletter-btn'
                >
                  Abonnez vous à notre newsletter
                </button>
                <button
                  onClick={handleTestSimulator}
                  className='btn-primary'
                  data-testid='hero-test-simulator-btn'
                >
                  Testez notre simulateur
                </button>
              </div>
            </div>
            {/* Hero Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="./asset/IllustrationHome.png" 
                  alt="Illustration tableau de bord"
                  className="mx-auto mb-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Who is it for? Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-elysion-primary mb-6 font-montserrat'>
              Conçu pour chaque parcours professionnel
            </h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {targetUsers.map((user, index) => (
              <div
                key={user.title}
                className='bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 slide-up group'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='w-16 h-16 mx-auto mb-6 bg-elysion-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <img src={user.icon} alt={user.title} className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className='text-xl font-bold text-elysion-primary mb-4 font-montserrat'>
                  {user.title}
                </h3>
                <p className='text-elysion-text-light leading-relaxed'>
                  {user.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How it Works Section */}
      <section className='py-20 bg-elysion-bg'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-elysion-primary mb-4 font-montserrat'>
              Comment fonctionne Elysion ?
            </h2>
            <p className='text-xl text-elysion-text-light max-w-2xl mx-auto'>
              Un processus simple pour prendre le contrôle de votre avenir.
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-12 mb-12'>
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className='text-center slide-up'
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className='relative mb-8'>
                  <div className='w-20 h-20 bg-elysion-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className='hidden md:block absolute top-10 left-1/2 w-32 h-0.5 bg-elysion-secondary transform translate-x-full'></div>
                  )}
                </div>
                <h3 className='text-xl font-bold text-elysion-primary mb-4 font-montserrat'>
                  {step.title}
                </h3>
                <p className='text-elysion-text-light'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Key Numbers Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-elysion-primary mb-6 font-montserrat'>
              La confiance de milliers de professionnels
            </h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {keyStats.map((stat, index) => (
              <div
                key={index}
                className='text-center slide-up group'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='text-5xl font-bold text-elysion-accent mb-3 group-hover:scale-110 transition-transform font-montserrat'>
                  {stat.number}
                </div>
                <div className='text-elysion-text-light font-medium'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className='py-20 bg-elysion-primary text-white py-8'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-white mb-6 font-montserrat'>
              Prêt à prendre le contrôle de votre avenir ?
            </h2>
            <p className='text-xl text-elysion-text-light max-w-2xl mx-auto py-5'>
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à
              Elysion !
            </p>
            <button
              onClick={handleOpenNewsletter}
              className='btn-accent'
              data-testid='footer-newsletter-btn'
            >
              Abonnez vous à notre newsletter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <img src='/asset/Elysion - logo.png' alt='Elysion' className='h-8 brightness-0 invert' />
              <p className='text-gray-400'>
                Votre partenaire pour une retraite sereine et bien planifiée.
              </p>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-12 pt-8 text-center text-gray-400'>
            <p>&copy; 2026 Elysion. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};
export default LandingPage;
