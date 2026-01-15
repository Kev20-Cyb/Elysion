import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FreelanceSimulator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 - Profil
    status: 'micro', // micro, independant, mixte
    birthDate: '',
    gender: '',
    children: 0,
    freelanceStartYear: '',
    hadSalariedPeriods: false,
    salariedPeriods: [],
    
    // Étape 2 - Historique revenus
    revenueHistory: [],
    detailedMode: false,
    
    // Étape 3 - Trimestres assimilés
    hadUnemployment: false,
    unemploymentDuration: 0,
    unemploymentUnit: 'months', // 'days' or 'months'
    hadLongIllness: false,
    illnessDuration: 0,
    illnessUnit: 'days', // 'days' or 'months'
    hadMaternity: false,
    maternityCount: 0,
    hadParentalLeave: false,
    parentalLeaveDuration: 0,
    parentalLeaveUnit: 'months', // 'days' or 'months'
    
    // NOUVEAU - Épargne & Besoin
    currentMonthlyIncome: 0,
    targetIncomeMode: 'percentage', // 'percentage' or 'amount'
    targetIncomePercentage: 70,
    targetIncomeAmount: 0,
    currentSavings: 0,
    wantsEpargneCalculation: true,
    
    // NOUVEAU - Profil de Risque
    investmentHorizon: '', // 'short', 'medium', 'long'
    lossToleranceLevel: '', // '5', '10', '20'
    marketKnowledge: '', // 'beginner', 'intermediate', 'advanced'
    riskProfile: '',
    
    // Calculs intermédiaires
    totalQuarters: 0,
    averageRevenue: 0,
    complementaryPoints: 0
  });

  const [results, setResults] = useState(null);

  // Configuration des profils de risque
  const RISK_PROFILES = {
    prudent: {
      name: 'Prudent',
      description: 'Faible tolérance à la baisse, horizon court',
      annualReturn: 0.015,
      color: 'green',
      recommendation: 'Fonds euros, livrets réglementés, obligations'
    },
    equilibre: {
      name: 'Équilibré',
      description: 'Accepte une certaine volatilité, horizon moyen',
      annualReturn: 0.04,
      color: 'blue',
      recommendation: 'Mix fonds euros/UC, PER équilibré, assurance-vie diversifiée'
    },
    dynamique: {
      name: 'Dynamique',
      description: 'Tolère de fortes variations pour plus de rendement',
      annualReturn: 0.07,
      color: 'orange',
      recommendation: 'Actions, ETF, PER dynamique, PEA'
    }
  };

  // Calcul du profil de risque automatique
  const calculateRiskProfile = () => {
    let score = 0;
    
    if (formData.investmentHorizon === 'long') score += 3;
    else if (formData.investmentHorizon === 'medium') score += 2;
    else if (formData.investmentHorizon === 'short') score += 1;
    
    if (formData.lossToleranceLevel === '20') score += 3;
    else if (formData.lossToleranceLevel === '10') score += 2;
    else if (formData.lossToleranceLevel === '5') score += 1;
    
    if (formData.marketKnowledge === 'advanced') score += 3;
    else if (formData.marketKnowledge === 'intermediate') score += 2;
    else if (formData.marketKnowledge === 'beginner') score += 1;
    
    if (score <= 4) return 'prudent';
    if (score <= 7) return 'equilibre';
    return 'dynamique';
  };

  // Calcul de l'épargne nécessaire
  const calculateRequiredSavings = (targetMonthlyIncome, currentPension, yearsUntilRetirement, profile) => {
    const monthlyGap = targetMonthlyIncome - currentPension;
    if (monthlyGap <= 0) return { monthlyContribution: 0, totalCapital: 0, message: 'Votre pension couvre déjà votre objectif' };
    
    const retirementDuration = 25;
    const annualReturn = RISK_PROFILES[profile]?.annualReturn || 0.03;
    const monthlyReturn = annualReturn / 12;
    
    const requiredCapital = monthlyGap * 12 * retirementDuration * 0.85;
    const currentSavingsProjected = formData.currentSavings * Math.pow(1 + annualReturn, yearsUntilRetirement);
    const capitalToAccumulate = Math.max(0, requiredCapital - currentSavingsProjected);
    
    const n = yearsUntilRetirement * 12;
    let monthlyContribution = 0;
    
    if (n > 0 && monthlyReturn > 0) {
      monthlyContribution = capitalToAccumulate * monthlyReturn / (Math.pow(1 + monthlyReturn, n) - 1);
    } else if (n > 0) {
      monthlyContribution = capitalToAccumulate / n;
    }
    
    return {
      monthlyGap,
      requiredCapital: Math.round(requiredCapital),
      currentSavingsProjected: Math.round(currentSavingsProjected),
      capitalToAccumulate: Math.round(capitalToAccumulate),
      monthlyContribution: Math.round(monthlyContribution),
      annualReturn: annualReturn * 100
    };
  };

  // Extraire l'année de naissance depuis la date
  const getBirthYear = () => {
    if (!formData.birthDate) return null;
    return new Date(formData.birthDate).getFullYear();
  };

  // Convertir la durée en mois selon l'unité
  const convertToMonths = (duration, unit) => {
    if (unit === 'days') {
      return duration / 30; // 30 jours = 1 mois approximativement
    }
    return duration;
  };

  // Seuils de validation des trimestres 2024
  const QUARTER_THRESHOLDS = {
    1: 4020,
    2: 8040,
    3: 12060,
    4: 16080
  };

  // Abattements micro selon activité
  const MICRO_ABATEMENTS = {
    'vente': 0.71,
    'service_bic': 0.50,
    'service_bnc': 0.34,
    'liberal': 0.34
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const handleArrayUpdate = (field, index, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? newItem : item)
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Calcul des trimestres pour un revenu donné
  const calculateQuarters = (revenue) => {
    if (revenue >= QUARTER_THRESHOLDS[4]) return 4;
    if (revenue >= QUARTER_THRESHOLDS[3]) return 3;
    if (revenue >= QUARTER_THRESHOLDS[2]) return 2;
    if (revenue >= QUARTER_THRESHOLDS[1]) return 1;
    return 0;
  };

  // Conversion CA micro en revenu retraite
  const convertMicroRevenue = (turnover, activityType) => {
    const abatement = MICRO_ABATEMENTS[activityType] || 0.50;
    return turnover * (1 - abatement);
  };

  // Étape 3 : Calcul total des trimestres
  const calculateTotalQuarters = () => {
    let totalQuarters = 0;
    
    // Trimestres cotisés
    formData.revenueHistory.forEach(year => {
      const revenue = formData.status === 'micro' 
        ? convertMicroRevenue(year.turnover, year.activityType)
        : year.professionalRevenue;
      
      totalQuarters += calculateQuarters(revenue);
      
      // Ajouter trimestres salariés si mixte
      if (year.hadSalary) {
        totalQuarters += calculateQuarters(year.salaryAmount || 0);
      }
    });

    // Convertir les durées en mois
    const unemploymentMonths = convertToMonths(formData.unemploymentDuration, formData.unemploymentUnit);
    const illnessMonths = convertToMonths(formData.illnessDuration, formData.illnessUnit);
    const parentalMonths = convertToMonths(formData.parentalLeaveDuration, formData.parentalLeaveUnit);

    // Trimestres assimilés
    if (formData.hadUnemployment) {
      totalQuarters += Math.floor(unemploymentMonths / 1.67); // 50 jours ≈ 1.67 mois = 1 trimestre
    }
    if (formData.hadLongIllness) {
      totalQuarters += Math.floor(illnessMonths / 2); // 60 jours ≈ 2 mois = 1 trimestre
    }
    if (formData.hadMaternity) {
      totalQuarters += formData.maternityCount * 4; // 4 trimestres par maternité
    }
    if (formData.hadParentalLeave) {
      totalQuarters += Math.min(Math.floor(parentalMonths / 3), 12); // max 12 trimestres
    }
    
    // Majorations pour enfants (femmes uniquement)
    // 8 trimestres par enfant : 4 (maternité/adoption) + 4 (éducation)
    if (formData.gender === 'F' && formData.children > 0) {
      totalQuarters += formData.children * 8;
    }

    return Math.min(totalQuarters, 172); // Max 172 trimestres
  };

  // Étape 4 : Calcul du revenu annuel moyen (25 meilleures années)
  const calculateAverageRevenue = () => {
    // Collecter tous les revenus retraite
    const allRevenues = formData.revenueHistory.map(year => {
      let revenue = formData.status === 'micro'
        ? convertMicroRevenue(year.turnover, year.activityType)
        : year.professionalRevenue;
      
      // Ajouter salaire si mixte
      if (year.hadSalary) {
        revenue += (year.salaryAmount || 0);
      }
      
      return revenue;
    });

    // Trier et prendre les 25 meilleures
    const best25 = allRevenues.sort((a, b) => b - a).slice(0, 25);
    
    // Moyenne
    const sum = best25.reduce((acc, val) => acc + val, 0);
    return best25.length > 0 ? sum / best25.length : 0;
  };

  // Étape 5 : Calcul de la retraite de base
  const calculateBasePension = (averageRevenue, totalQuarters) => {
    const birthYear = getBirthYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    // Trimestres requis selon année de naissance
    const requiredQuarters = birthYear >= 1973 ? 172 : 
                            birthYear >= 1961 ? 168 : 
                            birthYear >= 1955 ? 166 : 164;
    
    // Taux de base
    let rate = 0.50;
    let decote = 0;
    let surcote = 0;
    
    const legalAge = 62;
    const fullRateAge = 67;
    
    if (age >= legalAge) {
      const missingQuarters = Math.max(0, requiredQuarters - totalQuarters);
      const extraQuarters = Math.max(0, totalQuarters - requiredQuarters);
      
      if (missingQuarters > 0 && age < fullRateAge) {
        // Décote
        decote = Math.min(missingQuarters * 0.0125, 0.25);
        rate = 0.50 * (1 - decote);
      } else if (extraQuarters > 0 && age >= fullRateAge) {
        // Surcote
        surcote = extraQuarters * 0.0125;
        rate = 0.50 * (1 + surcote);
      }
    }
    
    const annualPension = averageRevenue * rate * (totalQuarters / requiredQuarters);
    
    return {
      annual: annualPension,
      monthly: annualPension / 12,
      rate: rate * 100,
      decote: decote * 100,
      surcote: surcote * 100,
      requiredQuarters,
      legalAge,
      fullRateAge
    };
  };

  // Étape 6 : Calcul des points complémentaires
  const calculateComplementaryPoints = () => {
    let totalPoints = 0;
    const pointCost = 12; // €12 pour 1 point (approximation)
    
    formData.revenueHistory.forEach(year => {
      const revenue = formData.status === 'micro'
        ? convertMicroRevenue(year.turnover, year.activityType)
        : year.professionalRevenue;
      
      // Cotisation ≈ 7% du revenu
      const cotisation = revenue * 0.07;
      const points = cotisation / pointCost;
      totalPoints += points;
    });
    
    return totalPoints;
  };

  const calculateComplementaryPension = (totalPoints) => {
    const pointValue = 1.4386; // Valeur du point RCI 2024
    const annualPension = totalPoints * pointValue;
    
    return {
      points: totalPoints,
      pointValue,
      annual: annualPension,
      monthly: annualPension / 12
    };
  };

  // Calcul final
  const calculateFullRetirement = () => {
    const totalQuarters = calculateTotalQuarters();
    const averageRevenue = calculateAverageRevenue();
    const basePension = calculateBasePension(averageRevenue, totalQuarters);
    const totalPoints = calculateComplementaryPoints();
    const complementaryPension = calculateComplementaryPension(totalPoints);
    
    const totalMonthly = basePension.monthly + complementaryPension.monthly;
    const totalAnnual = basePension.annual + complementaryPension.annual;
    
    // Taux de remplacement
    const currentRevenue = formData.revenueHistory[formData.revenueHistory.length - 1];
    const lastRevenue = formData.status === 'micro'
      ? convertMicroRevenue(currentRevenue?.turnover || 0, currentRevenue?.activityType)
      : (currentRevenue?.professionalRevenue || 0);
    
    const replacementRate = lastRevenue > 0 ? (totalAnnual / lastRevenue) * 100 : 0;
    
    // Calculer le profil de risque
    const riskProfile = calculateRiskProfile();
    handleInputChange('riskProfile', riskProfile);
    
    // Calculer les projections d'épargne
    const targetIncome = formData.targetIncomeMode === 'percentage' 
      ? formData.currentMonthlyIncome * (formData.targetIncomePercentage / 100)
      : formData.targetIncomeAmount;
    
    const currentAge = new Date().getFullYear() - getBirthYear();
    const yearsUntil62 = Math.max(0, 62 - currentAge);
    const yearsUntil64 = Math.max(0, 64 - currentAge);
    const yearsUntil67 = Math.max(0, 67 - currentAge);
    
    const savingsProjections = {};
    ['prudent', 'equilibre', 'dynamique'].forEach(profile => {
      savingsProjections[profile] = calculateRequiredSavings(
        targetIncome,
        totalMonthly,
        yearsUntil64,
        profile
      );
    });
    
    const results = {
      totalQuarters,
      requiredQuarters: basePension.requiredQuarters,
      averageRevenue,
      basePension,
      complementaryPension,
      totalMonthly: Math.round(totalMonthly),
      totalAnnual: Math.round(totalAnnual),
      replacementRate: Math.round(replacementRate),
      currentAge,
      targetIncome: Math.round(targetIncome),
      currentIncome: formData.currentMonthlyIncome,
      riskProfile,
      savingsProjections
    };
    
    setResults(results);
    setCurrentStep(7); // Résultats
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      calculateFullRetirement();
    }
  };

  const prevStep = () => {
    if (currentStep === 1) {
      // Retour vers la page de sélection du simulateur
      navigate('/simulator');
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Rendu Étape 1 : Profil
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre profil</h2>
        <p className="text-gray-600">Étape 1/6</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Statut professionnel
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="input-elysion"
        >
          <option value="micro">Micro-entrepreneur</option>
          <option value="independant">Indépendant classique (BIC/BNC)</option>
          <option value="mixte">Mixte (salarié + freelance)</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date de naissance
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="input-elysion"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Genre
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="input-elysion"
          >
            <option value="">Sélectionner</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre d'enfants
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={formData.children}
            onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
            className="input-elysion"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Début activité freelance
          </label>
          <input
            type="number"
            placeholder="2010"
            min="1980"
            max={new Date().getFullYear()}
            value={formData.freelanceStartYear}
            onChange={(e) => handleInputChange('freelanceStartYear', e.target.value)}
            className="input-elysion"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="hadSalariedPeriods"
          checked={formData.hadSalariedPeriods}
          onChange={(e) => handleInputChange('hadSalariedPeriods', e.target.checked)}
          className="checkbox-elysion"
        />
        <label htmlFor="hadSalariedPeriods" className="text-sm font-medium text-gray-700">
          J'ai eu des périodes salariées avant/après mon activité freelance
        </label>
      </div>
    </div>
  );

  // Rendu Étape 2 : Historique revenus
  const renderStep2 = () => {
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(formData.freelanceStartYear) || currentYear - 10;
    const years = [];
    
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">Historique de revenus</h2>
          <p className="text-gray-600">Étape 2/6</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Conseil :</strong> Remplissez au minimum les 5 dernières années. 
            Pour une estimation plus précise, ajoutez toutes vos années d'activité.
          </p>
        </div>

        <button
          onClick={() => {
            const newYear = {
              year: currentYear - formData.revenueHistory.length,
              turnover: '',
              professionalRevenue: '',
              activityType: 'service_bnc',
              hadSalary: false,
              salaryAmount: ''
            };
            handleArrayAdd('revenueHistory', newYear);
          }}
          className="btn-primary mb-4"
        >
          + Ajouter une année
        </button>

        <div className="space-y-4">
          {formData.revenueHistory.map((yearData, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Année {yearData.year}</h3>
                <button
                  onClick={() => handleArrayRemove('revenueHistory', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕ Supprimer
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {formData.status === 'micro' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chiffre d'affaires (€)
                      </label>
                      <input
                        type="number"
                        value={yearData.turnover}
                        onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                          ...yearData,
                          turnover: parseFloat(e.target.value) || 0
                        })}
                        className="input-elysion"
                        placeholder="35000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'activité
                      </label>
                      <select
                        value={yearData.activityType}
                        onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                          ...yearData,
                          activityType: e.target.value
                        })}
                        className="input-elysion"
                      >
                        <option value="vente">Vente de marchandises</option>
                        <option value="service_bic">Prestations de services (BIC)</option>
                        <option value="service_bnc">Prestations de services (BNC)</option>
                        <option value="liberal">Profession libérale</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenu professionnel net (€)
                    </label>
                    <input
                      type="number"
                      value={yearData.professionalRevenue}
                      onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                        ...yearData,
                        professionalRevenue: parseFloat(e.target.value) || 0
                      })}
                      className="input-elysion"
                      placeholder="45000"
                    />
                  </div>
                )}
              </div>

              {(formData.status === 'mixte' || formData.hadSalariedPeriods) && (
                <div className="mt-4">
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={yearData.hadSalary}
                      onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                        ...yearData,
                        hadSalary: e.target.checked
                      })}
                      className="checkbox-elysion"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      J'avais aussi un salaire cette année
                    </span>
                  </label>

                  {yearData.hadSalary && (
                    <input
                      type="number"
                      value={yearData.salaryAmount}
                      onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                        ...yearData,
                        salaryAmount: parseFloat(e.target.value) || 0
                      })}
                      className="input-elysion"
                      placeholder="Montant du salaire annuel brut"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {formData.revenueHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune année ajoutée. Cliquez sur "Ajouter une année" pour commencer.
          </div>
        )}
      </div>
    );
  };

  // Rendu Étape 3 : Trimestres assimilés
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Trimestres assimilés</h2>
        <p className="text-gray-600">Étape 3/6</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>💡 Info :</strong> Les trimestres assimilés sont des périodes qui comptent 
          pour votre retraite même sans cotisation (chômage, maladie, maternité...).
        </p>
      </div>

      {/* Chômage */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.hadUnemployment}
            onChange={(e) => handleInputChange('hadUnemployment', e.target.checked)}
            className="checkbox-elysion"
          />
          <span className="font-semibold text-gray-900">
            J'ai eu des périodes de chômage indemnisé
          </span>
        </label>

        {formData.hadUnemployment && (
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée totale
                </label>
                <input
                  type="number"
                  min="0"
                  max="3600"
                  value={formData.unemploymentDuration}
                  onChange={(e) => handleInputChange('unemploymentDuration', parseInt(e.target.value) || 0)}
                  className="input-elysion"
                  placeholder="12"
                />
              </div>
              <div className="w-32">
                <select
                  value={formData.unemploymentUnit}
                  onChange={(e) => handleInputChange('unemploymentUnit', e.target.value)}
                  className="input-elysion"
                >
                  <option value="days">Jours</option>
                  <option value="months">Mois</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              1 trimestre validé par période de 50 jours de chômage indemnisé
            </p>
          </div>
        )}
      </div>

      {/* Maladie */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.hadLongIllness}
            onChange={(e) => handleInputChange('hadLongIllness', e.target.checked)}
            className="checkbox-elysion"
          />
          <span className="font-semibold text-gray-900">
            J'ai eu des arrêts maladie de longue durée
          </span>
        </label>

        {formData.hadLongIllness && (
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée totale
                </label>
                <input
                  type="number"
                  min="0"
                  max="3600"
                  value={formData.illnessDuration}
                  onChange={(e) => handleInputChange('illnessDuration', parseInt(e.target.value) || 0)}
                  className="input-elysion"
                  placeholder="60"
                />
              </div>
              <div className="w-32">
                <select
                  value={formData.illnessUnit}
                  onChange={(e) => handleInputChange('illnessUnit', e.target.value)}
                  className="input-elysion"
                >
                  <option value="days">Jours</option>
                  <option value="months">Mois</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              1 trimestre validé par période de 60 jours d'indemnisation
            </p>
          </div>
        )}
      </div>

      {/* Congé parental */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            checked={formData.hadParentalLeave}
            onChange={(e) => handleInputChange('hadParentalLeave', e.target.checked)}
            className="checkbox-elysion"
          />
          <span className="font-semibold text-gray-900">
            J'ai eu des congés parentaux
          </span>
        </label>

        {formData.hadParentalLeave && (
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée totale
                </label>
                <input
                  type="number"
                  min="0"
                  max="1080"
                  value={formData.parentalLeaveDuration}
                  onChange={(e) => handleInputChange('parentalLeaveDuration', parseInt(e.target.value) || 0)}
                  className="input-elysion"
                  placeholder="6"
                />
              </div>
              <div className="w-32">
                <select
                  value={formData.parentalLeaveUnit}
                  onChange={(e) => handleInputChange('parentalLeaveUnit', e.target.value)}
                  className="input-elysion"
                >
                  <option value="days">Jours</option>
                  <option value="months">Mois</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Maximum 12 trimestres (3 ans) de congé parental
            </p>
          </div>
        )}
      </div>

      {/* Maternité */}
      {formData.gender === 'F' && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={formData.hadMaternity}
              onChange={(e) => handleInputChange('hadMaternity', e.target.checked)}
              className="checkbox-elysion"
            />
            <span className="font-semibold text-gray-900">
              J'ai eu des congés maternité
            </span>
          </label>

          {formData.hadMaternity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de congés maternité
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.maternityCount}
                onChange={(e) => handleInputChange('maternityCount', parseInt(e.target.value) || 0)}
                className="input-elysion"
                placeholder="2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Chaque maternité = 4 trimestres assimilés
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Rendu Étape 4 : Récapitulatif et validation
  const renderStep4 = () => {
    const totalQuarters = calculateTotalQuarters();
    const averageRevenue = calculateAverageRevenue();
    const totalPoints = calculateComplementaryPoints();

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">Récapitulatif</h2>
          <p className="text-gray-600">Étape 4/6</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-elysion-primary-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-elysion-primary mb-2">Trimestres validés</h3>
            <div className="text-3xl font-bold text-elysion-primary">{totalQuarters}</div>
            <p className="text-sm text-gray-600 mt-1">trimestres cotisés et assimilés</p>
          </div>

          <div className="bg-elysion-accent-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-elysion-primary mb-2">Revenu moyen</h3>
            <div className="text-3xl font-bold text-elysion-primary">
              €{Math.round(averageRevenue).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">25 meilleures années</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold text-elysion-primary mb-2">Points RCI</h3>
            <div className="text-3xl font-bold text-elysion-primary">
              {Math.round(totalPoints).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">points complémentaires</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-4">Détail de votre carrière</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Années d'activité :</span>
              <span className="font-semibold">{formData.revenueHistory.length} ans</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut :</span>
              <span className="font-semibold">
                {formData.status === 'micro' ? 'Micro-entrepreneur' : 
                 formData.status === 'independant' ? 'Indépendant classique' : 
                 'Mixte (salarié + freelance)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Enfants :</span>
              <span className="font-semibold">{formData.children}</span>
            </div>
            {formData.gender === 'F' && formData.children > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Majoration enfants :</span>
                <span className="font-semibold">+{formData.children * 8} trimestres</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>📋 Vérifiez</strong> que toutes les informations sont correctes avant de calculer votre retraite.
            Vous pouvez revenir en arrière pour modifier vos données.
          </p>
        </div>
      </div>
    );
  };

  // Rendu Étape 7 : Résultats
  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre estimation de retraite</h2>
        </div>

        {/* Montant principal */}
        <div className="bg-gradient-to-r from-elysion-primary to-elysion-accent text-white p-8 rounded-2xl text-center">
          <h3 className="text-xl mb-4">Pension mensuelle estimée</h3>
          <div className="text-5xl font-bold mb-2">
            €{results.totalMonthly.toLocaleString()}
          </div>
          <p className="text-white/80">par mois (base + complémentaire)</p>
        </div>

        {/* Détails */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-elysion-primary">
              Retraite de base (SSI)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trimestres validés :</span>
                <span className="font-semibold">{results.totalQuarters}/{results.requiredQuarters}</span>
              </div>
              <div className="flex justify-between">
                <span>Taux appliqué :</span>
                <span className="font-semibold">{results.basePension.rate.toFixed(2)}%</span>
              </div>
              {results.basePension.decote > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Décote :</span>
                  <span className="font-semibold">-{results.basePension.decote.toFixed(2)}%</span>
                </div>
              )}
              {results.basePension.surcote > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Surcote :</span>
                  <span className="font-semibold">+{results.basePension.surcote.toFixed(2)}%</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span>Montant mensuel :</span>
                <span className="font-bold text-lg">€{Math.round(results.basePension.monthly).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-elysion-primary">
              Retraite complémentaire (RCI)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Points acquis :</span>
                <span className="font-semibold">{Math.round(results.complementaryPension.points).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Valeur du point :</span>
                <span className="font-semibold">€{results.complementaryPension.pointValue}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span>Montant mensuel :</span>
                <span className="font-bold text-lg">€{Math.round(results.complementaryPension.monthly).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infos supplémentaires */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-elysion-bg p-6 rounded-lg">
            <h4 className="font-semibold mb-2">Taux de remplacement</h4>
            <div className="text-3xl font-bold text-elysion-accent">{results.replacementRate}%</div>
            <p className="text-sm text-gray-600 mt-1">de votre dernier revenu</p>
          </div>

          <div className="bg-elysion-bg p-6 rounded-lg">
            <h4 className="font-semibold mb-2">Revenu moyen de référence</h4>
            <div className="text-3xl font-bold text-elysion-primary">
              €{Math.round(results.averageRevenue).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">25 meilleures années</p>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Informations importantes</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Âge légal de départ : {results.basePension.legalAge} ans</li>
            <li>• Âge taux plein automatique : {results.basePension.fullRateAge} ans</li>
            <li>• Votre âge actuel : {results.currentAge} ans</li>
            <li>• Ces montants sont des estimations basées sur la législation 2024</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-elysion-primary to-elysion-secondary text-white p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">
            Créez votre compte pour sauvegarder cette simulation
          </h3>
          <p className="mb-6">
            Accédez à des recommandations personnalisées, gérez vos documents et suivez l'évolution de votre retraite.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/onboarding', { 
                state: { 
                  professionalStatus: 'freelance',
                  simulationData: formData,
                  results: results
                }
              })}
              className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg"
            >
              Créer mon compte
            </button>
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="border-2 border-white text-white hover:bg-white hover:text-elysion-primary font-semibold px-6 py-3 rounded-lg"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-elysion-bg font-montserrat">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-elysion-primary hover:text-elysion-accent transition-colors"
            >
              Elysion
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress bar */}
          {currentStep <= 4 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step === currentStep
                        ? 'bg-elysion-primary text-white'
                        : step < currentStep
                        ? 'bg-elysion-accent text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-elysion-accent rounded-full transition-all"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderResults()}

          {/* Navigation buttons */}
          {currentStep <= 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="btn-outline"
              >
                ← Retour
              </button>
              <button
                onClick={nextStep}
                className="btn-primary"
              >
                {currentStep === 4 ? 'Calculer ma retraite' : 'Suivant →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelanceSimulator;
