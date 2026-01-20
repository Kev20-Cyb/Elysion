import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const InvestmentAxes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Récupérer les données passées depuis le Dashboard
  const { targetGap = 400, currentPension = 1800, targetIncome = 2200 } = location.state || {};

  // Calculer l'épargne mensuelle nécessaire pour combler l'écart
  // Hypothèse : 20 ans d'épargne avant retraite, capital nécessaire = écart * 12 * 25 (règle des 4%)
  const capitalNeeded = targetGap * 12 * 25; // Capital nécessaire pour générer le revenu
  const yearsToRetirement = 20; // Hypothèse moyenne
  const monthsToRetirement = yearsToRetirement * 12;
  
  // Répartition suggérée selon le profil équilibré
  const allocation = {
    secure: 0.15,      // 15% épargne sécurisée
    retirement: 0.35,  // 35% épargne retraite dédiée
    markets: 0.30,     // 30% marchés financiers
    realestate: 0.20   // 20% immobilier
  };

  // Calcul du montant mensuel par axe
  const calculateMonthlyAmount = (percentage) => {
    const totalMonthly = Math.round(capitalNeeded / monthsToRetirement);
    return Math.round(totalMonthly * percentage);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Les 4 axes d'investissement
  const investmentAxes = [
    {
      id: 'secure',
      icon: '🛡️',
      title: 'Épargne sécurisée / court terme',
      description: 'Livrets, comptes sur livret, épargne logement.',
      details: 'Capital garanti, rendement modéré. Idéal pour une épargne de précaution ou des projets à court terme.',
      color: 'green',
      examples: ['Livret A', 'LDDS', 'LEP', 'PEL', 'Compte sur livret'],
      pros: ['Capital garanti', 'Disponibilité immédiate', 'Fiscalité avantageuse'],
      cons: ['Rendement limité', 'Plafonds de versement'],
      percentage: allocation.secure,
      monthlyAmount: calculateMonthlyAmount(allocation.secure)
    },
    {
      id: 'retirement',
      icon: '🎯',
      title: 'Épargne longue & retraite dédiée',
      description: 'Assurance vie, PER individuel / d\'entreprise.',
      details: 'Horizon long, fiscalité spécifique à la retraite. Solutions dédiées à la constitution d\'un capital retraite.',
      color: 'blue',
      examples: ['PER Individuel', 'PER Entreprise', 'Assurance-vie', 'PERP', 'Madelin'],
      pros: ['Avantages fiscaux à l\'entrée', 'Sortie en capital ou rente', 'Transmission facilitée'],
      cons: ['Blocage jusqu\'à la retraite (PER)', 'Frais de gestion'],
      percentage: allocation.retirement,
      monthlyAmount: calculateMonthlyAmount(allocation.retirement)
    },
    {
      id: 'markets',
      icon: '📈',
      title: 'Marchés financiers (via fonds)',
      description: 'Fonds actions, obligations, diversifiés, via assurance vie, PER ou PEA.',
      details: 'Potentiel de performance plus élevé, risque de perte en capital. Pour les investisseurs avec un horizon long terme.',
      color: 'orange',
      examples: ['PEA', 'Compte-titres', 'OPCVM', 'ETF', 'UC en assurance-vie'],
      pros: ['Potentiel de rendement élevé', 'Diversification possible', 'Fiscalité du PEA'],
      cons: ['Risque de perte en capital', 'Volatilité des marchés', 'Nécessite un suivi'],
      percentage: allocation.markets,
      monthlyAmount: calculateMonthlyAmount(allocation.markets)
    },
    {
      id: 'realestate',
      icon: '🏠',
      title: 'Immobilier & épargne salariale',
      description: 'Immobilier locatif ou pierre-papier (SCPI, OPCI), PEE / PER d\'entreprise.',
      details: 'Source de revenus complémentaires à long terme, contraintes spécifiques. Diversification patrimoniale.',
      color: 'purple',
      examples: ['SCPI', 'OPCI', 'Immobilier locatif', 'PEE', 'PERCO', 'Crowdfunding immobilier'],
      pros: ['Revenus réguliers', 'Effet de levier crédit', 'Abondement employeur (épargne salariale)'],
      cons: ['Frais d\'entrée', 'Liquidité limitée', 'Gestion locative'],
      percentage: allocation.realestate,
      monthlyAmount: calculateMonthlyAmount(allocation.realestate)
    }
  ];

  // Total mensuel
  const totalMonthly = investmentAxes.reduce((sum, axis) => sum + axis.monthlyAmount, 0);

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'bg-green-100 text-green-600',
        badge: 'bg-green-100 text-green-700'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        badge: 'bg-blue-100 text-blue-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'bg-orange-100 text-orange-600',
        badge: 'bg-orange-100 text-orange-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'bg-purple-100 text-purple-600',
        badge: 'bg-purple-100 text-purple-700'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-2xl font-bold text-elysion-primary hover:text-elysion-accent transition-colors"
              >
                Elysion
              </button>
              <span className="text-elysion-text-light">|</span>
              <span className="text-elysion-text-dark font-medium">Axes d'investissement</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-elysion-text-dark font-medium">{user?.full_name}</span>
              <button 
                onClick={handleLogout}
                className="text-elysion-text-light hover:text-elysion-primary transition-colors"
                data-testid="logout-btn"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-elysion-primary hover:text-elysion-accent mb-4 transition-colors"
          >
            ← Retour au tableau de bord
          </button>
          
          <h1 className="text-3xl font-bold text-elysion-primary mb-4">
            Atteindre votre objectif retraite
          </h1>
          
          {/* Objectif affiché si disponible */}
          {targetGap && (
            <div className="bg-gradient-to-r from-elysion-primary to-elysion-accent p-6 rounded-xl mb-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-white/90 text-sm">Pension actuelle estimée</p>
                  <p className="text-2xl font-bold text-white">{currentPension?.toLocaleString()} €/mois</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-white/90 text-sm">Votre objectif</p>
                  <p className="text-2xl font-bold text-white">{targetIncome?.toLocaleString()} €/mois</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-white/90 text-sm">Écart à combler</p>
                  <p className="text-2xl font-bold text-white">{targetGap?.toLocaleString()} €/mois</p>
                </div>
                <div className="bg-white/30 rounded-lg p-3">
                  <p className="text-white/90 text-sm">Épargne mensuelle suggérée</p>
                  <p className="text-2xl font-bold text-white">{totalMonthly?.toLocaleString()} €/mois</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Introduction */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <p className="text-blue-800 text-lg leading-relaxed">
              <strong>Pour atteindre cet objectif</strong>, différentes familles de solutions existent. 
              Voici une répartition suggérée basée sur un profil équilibré. Consultez un professionnel pour l'adapter à votre situation.
            </p>
          </div>
        </div>

        {/* Axes d'investissement */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {investmentAxes.map((axis) => {
            const colorClasses = getColorClasses(axis.color);
            
            return (
              <div 
                key={axis.id}
                className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-xl p-6 hover:shadow-lg transition-shadow`}
                data-testid={`investment-axis-${axis.id}`}
              >
                {/* Header avec montant */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl ${colorClasses.icon} flex items-center justify-center text-2xl`}>
                    {axis.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{axis.title}</h3>
                    <p className="text-gray-600 text-sm">{axis.description}</p>
                  </div>
                </div>
                
                {/* Montant suggéré */}
                <div className={`${colorClasses.badge} rounded-lg p-4 mb-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase opacity-75">Épargne mensuelle suggérée</p>
                      <p className="text-2xl font-bold">{axis.monthlyAmount?.toLocaleString()} €/mois</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75">Répartition</p>
                      <p className="text-lg font-bold">{Math.round(axis.percentage * 100)}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <p className="text-gray-700 text-sm mb-4">{axis.details}</p>
                
                {/* Exemples */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Exemples de supports</p>
                  <div className="flex flex-wrap gap-2">
                    {axis.examples.map((example, idx) => (
                      <span 
                        key={idx} 
                        className={`${colorClasses.badge} text-xs px-2 py-1 rounded-full`}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Pros & Cons */}
                <details className="group">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 flex items-center gap-2">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    Avantages et contraintes
                  </summary>
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-1">Avantages</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {axis.pros.map((pro, idx) => (
                          <li key={idx}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-orange-600 mb-1">Points d'attention</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {axis.cons.map((con, idx) => (
                          <li key={idx}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {/* Section conseils pratiques */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span>
            Conseils pour bien choisir
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-elysion-primary-50 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Définir votre horizon</h4>
              <p className="text-sm text-gray-600">Plus votre horizon est long, plus vous pouvez envisager des placements dynamiques.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-elysion-primary-50 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Diversifier</h4>
              <p className="text-sm text-gray-600">Ne mettez pas tous vos œufs dans le même panier. Combinez plusieurs types de placements.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-elysion-primary-50 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Se faire accompagner</h4>
              <p className="text-sm text-gray-600">Un conseiller peut vous aider à construire une stratégie adaptée à votre situation.</p>
            </div>
          </div>
        </div>

        {/* Mention de prudence obligatoire */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Information importante</h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                Ces axes sont présentés <strong>à titre informatif et général</strong>. Ils ne constituent pas un conseil en investissement. 
                Pour choisir des produits adaptés à votre situation personnelle, votre profil de risque et vos objectifs, 
                <strong> rapprochez-vous d'un conseiller financier ou de votre établissement bancaire</strong>.
              </p>
              <p className="text-yellow-700 text-xs mt-3">
                Les performances passées ne préjugent pas des performances futures. 
                Tout investissement comporte des risques, y compris de perte en capital.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-elysion-primary to-elysion-accent p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Prêt à passer à l'action ?
          </h3>
          <p className="mb-6 text-white/90 bg-white/10 inline-block px-4 py-2 rounded-lg">
            Consultez un professionnel pour établir une stratégie d'épargne adaptée à votre situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/simulator')}
              className="bg-white text-elysion-primary hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Refaire une simulation
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAxes;
