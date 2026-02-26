import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

// ============================================
// BARÈMES 2026
// ============================================
const BAREME_2026 = {
  // Plafond Annuel Sécurité Sociale
  PASS: 48060,
  
  // Seuils de validation des trimestres (150 × SMIC horaire)
  // SMIC horaire 2026 estimé à 12.50€
  QUARTER_THRESHOLDS: {
    1: 1875,   // 150 × 12.50
    2: 3750,   // 300 × 12.50
    3: 5625,   // 450 × 12.50
    4: 7500    // 600 × 12.50
  },
  
  // Valeurs RCI (Retraite Complémentaire des Indépendants)
  RCI: {
    POINT_VALUE: 1.347,      // Valeur de service du point 2026
    POINT_COST: 21.726       // Valeur d'acquisition du point 2026
  },
  
  // Valeur point Agirc-Arrco 2026
  AGIRC_ARRCO_POINT_VALUE: 1.4386,
  
  // Abattements micro-entrepreneur
  MICRO_ABATEMENTS: {
    'vente': 0.71,           // Vente de marchandises
    'service_bic': 0.50,     // Prestations BIC
    'service_bnc': 0.34,     // Prestations BNC
    'liberal': 0.34          // Profession libérale
  },
  
  // Taux de cotisation retraite base
  COTISATION_BASE_RATE: 0.1775,  // 17.75% jusqu'au PASS
  
  // Trimestres requis selon année de naissance
  getRequiredQuarters: (birthYear) => {
    if (birthYear >= 1973) return 172;
    if (birthYear >= 1961) return 168;
    if (birthYear >= 1955) return 166;
    return 164;
  }
};

// ============================================
// PROFILS DE RISQUE
// ============================================
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

const FreelanceSimulator = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [savingResults, setSavingResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    // ============================================
    // ÉTAPE 1 - Profil & Statuts
    // ============================================
    birthDate: '',
    gender: '',
    children: 0,
    isMother: false,
    
    // Statut freelance
    freelanceStatus: '', // 'micro', 'ei', 'liberal'
    liberalCaisse: '',   // 'cipav', 'other'
    
    // Question clé : a déjà été salarié ?
    hadSalariedPeriods: false,
    
    // ============================================
    // ÉTAPE 2 - Carrière et revenus freelance
    // ============================================
    freelanceStartYear: '',
    activityContinuous: true,
    interruptionYears: 0,
    activityTrend: 'stable', // 'stable', 'up', 'down'
    
    // Mode simple
    revenueMode: 'simple', // 'simple' or 'detailed'
    averageAnnualRevenue: 0,
    activityType: 'service_bnc', // pour micro
    
    // Mode détaillé
    revenueHistory: [],
    
    // ============================================
    // ÉTAPE 3 - Carrière salariée (si hadSalariedPeriods)
    // ============================================
    salariedYears: 0,
    averageSalary: 0,
    salariedMode: 'periods', // 'periods' or 'detailed'
    salariedPeriods: [],
    detailedSalaries: [], // Pour le mode année par année
    knowsAgircArrcoPoints: false,
    agircArrcoPoints: 0,
    
    // ============================================
    // ÉTAPE 4 - Trimestres
    // ============================================
    hadUnemployment: false,
    unemploymentDuration: 0,
    unemploymentUnit: 'months',
    hadLongIllness: false,
    illnessDuration: 0,
    illnessUnit: 'months',
    hadMaternity: false,
    maternityCount: 0,
    hadParentalLeave: false,
    parentalLeaveDuration: 0,
    parentalLeaveUnit: 'months',
    hadDisabledChild: false,
    disabledChildMonths: 0,
    childrenRaisedOver9Years: 0,
    
    // ============================================
    // ÉTAPE 5 - Épargne & Risque
    // ============================================
    currentMonthlyIncome: 0,
    targetIncomeMode: 'percentage',
    targetIncomePercentage: 70,
    targetIncomeAmount: 0,
    currentSavings: 0,
    wantsEpargneCalculation: true,
    
    // Profil de risque
    investmentHorizon: '',
    lossToleranceLevel: '',
    marketKnowledge: '',
    riskProfile: '',
    
    // ============================================
    // ÉTAPE 6 - Scénarios d'âge
    // ============================================
    retirementAges: [62, 64, 67]
  });
  
  const [results, setResults] = useState(null);

  // ============================================
  // SAUVEGARDE AUTOMATIQUE
  // ============================================
  useEffect(() => {
    const saveResultsToBackend = async () => {
      if (user && results) {
        setSavingResults(true);
        try {
          await axios.post(`${API}/simulation/save`, {
            simulator_type: 'freelance',
            form_data: formData,
            results: results,
            saved_at: new Date().toISOString()
          });
          console.log('Résultats de simulation freelance sauvegardés');
        } catch (err) {
          console.error('Erreur sauvegarde simulation:', err);
        } finally {
          setSavingResults(false);
        }
      }
    };
    saveResultsToBackend();
  }, [results, user, formData]);

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================
  const getBirthYear = () => {
    if (!formData.birthDate) return null;
    return new Date(formData.birthDate).getFullYear();
  };

  const convertToMonths = (duration, unit) => {
    if (unit === 'days') return duration / 30;
    return duration;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // ============================================
  // CALCULS MÉTIER
  // ============================================
  
  // Convertir CA micro en revenu retraite
  const convertMicroRevenue = (turnover, activityType) => {
    const abatement = BAREME_2026.MICRO_ABATEMENTS[activityType] || 0.34;
    return turnover * (1 - abatement);
  };

  // Calculer trimestres pour un revenu donné
  const calculateQuartersForRevenue = (revenue) => {
    const thresholds = BAREME_2026.QUARTER_THRESHOLDS;
    if (revenue >= thresholds[4]) return 4;
    if (revenue >= thresholds[3]) return 3;
    if (revenue >= thresholds[2]) return 2;
    if (revenue >= thresholds[1]) return 1;
    return 0;
  };

  // Calculer tous les revenus freelance
  const calculateFreelanceRevenues = () => {
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(formData.freelanceStartYear) || currentYear - 5;
    const years = currentYear - startYear;
    
    if (formData.revenueMode === 'simple') {
      // Mode simple : utiliser le revenu moyen
      let revenue = formData.averageAnnualRevenue;
      if (formData.freelanceStatus === 'micro') {
        revenue = convertMicroRevenue(revenue, formData.activityType);
      }
      
      const revenues = [];
      for (let i = 0; i < years; i++) {
        let yearRevenue = revenue;
        // Ajuster selon tendance
        if (formData.activityTrend === 'up') {
          yearRevenue = revenue * (0.7 + (0.6 * i / years));
        } else if (formData.activityTrend === 'down') {
          yearRevenue = revenue * (1.3 - (0.6 * i / years));
        }
        revenues.push({
          year: startYear + i,
          revenue: yearRevenue
        });
      }
      return revenues;
    } else {
      // Mode détaillé
      return formData.revenueHistory.map(item => ({
        year: item.year,
        revenue: formData.freelanceStatus === 'micro' 
          ? convertMicroRevenue(item.turnover || item.revenue, item.activityType || formData.activityType)
          : (item.professionalRevenue || item.revenue || 0)
      }));
    }
  };

  // Calculer revenus salariés
  const calculateSalariedRevenues = () => {
    if (!formData.hadSalariedPeriods) return [];
    
    if (formData.salariedMode === 'periods') {
      // Mode période par période
      const revenues = [];
      formData.salariedPeriods.forEach(period => {
        const years = (period.endYear || period.startYear) - period.startYear + 1;
        for (let i = 0; i < years; i++) {
          revenues.push({
            year: period.startYear + i,
            revenue: period.averageSalary || 0
          });
        }
      });
      return revenues;
    } else {
      // Mode année par année (detailed)
      return formData.detailedSalaries.map(item => ({
        year: item.year,
        revenue: item.salary || 0
      }));
    }
  };

  // Calculer trimestres freelance
  const calculateFreelanceQuarters = () => {
    const revenues = calculateFreelanceRevenues();
    let total = 0;
    revenues.forEach(item => {
      total += calculateQuartersForRevenue(item.revenue);
    });
    
    // Soustraire interruptions
    if (!formData.activityContinuous) {
      total -= formData.interruptionYears * 4;
    }
    
    return Math.max(0, total);
  };

  // Calculer trimestres salariés
  const calculateSalariedQuarters = () => {
    if (!formData.hadSalariedPeriods) return 0;
    
    if (formData.salariedMode === 'periods') {
      let total = 0;
      formData.salariedPeriods.forEach(period => {
        const years = (period.endYear || period.startYear) - period.startYear + 1;
        total += years * 4; // 4 trimestres par an (temps plein)
      });
      return total;
    } else {
      // Mode détaillé : compter les années avec salaire
      return formData.detailedSalaries.filter(item => item.salary > 0).length * 4;
    }
  };

  // Calculer trimestres assimilés
  const calculateAssimilatedQuarters = () => {
    let total = 0;
    
    // Chômage (1 trimestre par 50 jours ≈ 1.67 mois)
    if (formData.hadUnemployment) {
      const months = convertToMonths(formData.unemploymentDuration, formData.unemploymentUnit);
      total += Math.floor(months / 1.67);
    }
    
    // Maladie longue (1 trimestre par 60 jours ≈ 2 mois)
    if (formData.hadLongIllness) {
      const months = convertToMonths(formData.illnessDuration, formData.illnessUnit);
      total += Math.floor(months / 2);
    }
    
    // Maternité (trimestres inclus dans majoration enfants)
    
    return total;
  };

  // Calculer majorations enfants
  const calculateChildrenQuarters = () => {
    let total = 0;
    
    // Majoration mère : 8 trimestres par enfant (4 maternité + 4 éducation)
    if (formData.isMother && formData.children > 0) {
      total += formData.children * 8;
    }
    
    // Congé parental : 1 trimestre par 90 jours (max 12 trimestres)
    // Non cumulable avec les 8 trimestres si déjà comptés - garder le plus favorable
    if (formData.hadParentalLeave) {
      const months = convertToMonths(formData.parentalLeaveDuration, formData.parentalLeaveUnit);
      const parentalQuarters = Math.min(Math.floor(months / 3), 12);
      // Si pas mère, ajouter directement
      if (!formData.isMother) {
        total += parentalQuarters;
      }
      // Si mère, garder le plus favorable (déjà 8 trimestres par enfant)
    }
    
    // Enfant handicapé : +1 trimestre par 30 mois (max 8 trimestres)
    if (formData.hadDisabledChild) {
      const handicapQuarters = Math.min(Math.floor(formData.disabledChildMonths / 30), 8);
      total += handicapQuarters;
    }
    
    return total;
  };

  // Calculer total trimestres
  const calculateTotalQuarters = () => {
    const freelanceQ = calculateFreelanceQuarters();
    const salariedQ = calculateSalariedQuarters();
    const assimilatedQ = calculateAssimilatedQuarters();
    const childrenQ = calculateChildrenQuarters();
    
    return Math.min(freelanceQ + salariedQ + assimilatedQ + childrenQ, 172);
  };

  // Calculer RAM (Revenu Annuel Moyen - 25 meilleures années)
  const calculateRAM = () => {
    const freelanceRevenues = calculateFreelanceRevenues();
    const salariedRevenues = calculateSalariedRevenues();
    
    // Fusionner tous les revenus
    const allRevenues = [...freelanceRevenues, ...salariedRevenues]
      .map(item => item.revenue)
      .filter(r => r > 0)
      .sort((a, b) => b - a)
      .slice(0, 25);
    
    if (allRevenues.length === 0) return 0;
    
    const sum = allRevenues.reduce((acc, val) => acc + val, 0);
    return sum / allRevenues.length;
  };

  // Calculer retraite de base
  const calculateBasePension = (totalQuarters, ram) => {
    const birthYear = getBirthYear();
    const requiredQuarters = BAREME_2026.getRequiredQuarters(birthYear);
    
    let rate = 0.50;
    let decote = 0;
    let surcote = 0;
    
    const missingQuarters = Math.max(0, requiredQuarters - totalQuarters);
    const extraQuarters = Math.max(0, totalQuarters - requiredQuarters);
    
    if (missingQuarters > 0) {
      // Décote : 1.25% par trimestre manquant (max 25%)
      decote = Math.min(missingQuarters * 0.0125, 0.25);
      rate = 0.50 * (1 - decote);
    } else if (extraQuarters > 0) {
      // Surcote : 1.25% par trimestre supplémentaire
      surcote = extraQuarters * 0.0125;
      rate = 0.50 * (1 + surcote);
    }
    
    const annualPension = ram * rate * Math.min(totalQuarters / requiredQuarters, 1);
    
    return {
      ram,
      rate: rate * 100,
      decote: decote * 100,
      surcote: surcote * 100,
      requiredQuarters,
      annual: annualPension,
      monthly: annualPension / 12
    };
  };

  // Calculer points RCI
  const calculateRCIPoints = () => {
    const revenues = calculateFreelanceRevenues();
    let totalPoints = 0;
    
    revenues.forEach(item => {
      // Cotisation complémentaire ≈ 7% du revenu
      const cotisation = Math.min(item.revenue, BAREME_2026.PASS * 4) * 0.07;
      const points = cotisation / BAREME_2026.RCI.POINT_COST;
      totalPoints += points;
    });
    
    return totalPoints;
  };

  // Calculer pension complémentaire RCI
  const calculateRCIPension = () => {
    const points = calculateRCIPoints();
    const annual = points * BAREME_2026.RCI.POINT_VALUE;
    
    return {
      points: Math.round(points),
      pointValue: BAREME_2026.RCI.POINT_VALUE,
      annual,
      monthly: annual / 12
    };
  };

  // Calculer pension Agirc-Arrco (si salarié)
  const calculateAgircArrcoPension = () => {
    if (!formData.hadSalariedPeriods) return { points: 0, annual: 0, monthly: 0 };
    
    if (formData.knowsAgircArrcoPoints && formData.agircArrcoPoints > 0) {
      const annual = formData.agircArrcoPoints * BAREME_2026.AGIRC_ARRCO_POINT_VALUE;
      return {
        points: formData.agircArrcoPoints,
        pointValue: BAREME_2026.AGIRC_ARRCO_POINT_VALUE,
        annual,
        monthly: annual / 12
      };
    } else {
      // Estimation : 25-30% du salaire de base
      const estimatedMonthly = (formData.averageSalary / 12) * 0.27;
      return {
        points: 0,
        estimated: true,
        annual: estimatedMonthly * 12,
        monthly: estimatedMonthly
      };
    }
  };

  // Appliquer majoration 3+ enfants
  const applyChildrenBonus = (basePension) => {
    if (formData.childrenRaisedOver9Years >= 3) {
      return basePension * 1.10;
    }
    return basePension;
  };

  // Calculer profil de risque
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

  // Calculer épargne nécessaire
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

  // Calculer scénarios complets
  const calculateScenarios = () => {
    const scenarios = [];
    const currentYear = new Date().getFullYear();
    const birthYear = getBirthYear();
    const currentAge = currentYear - birthYear;
    
    const baseQuarters = calculateTotalQuarters();
    const ram = calculateRAM();
    
    formData.retirementAges.forEach(age => {
      const yearsUntilRetirement = Math.max(0, age - currentAge);
      const additionalQuarters = yearsUntilRetirement * 4;
      const totalQuarters = Math.min(baseQuarters + additionalQuarters, 172);
      
      // Retraite de base
      const basePension = calculateBasePension(totalQuarters, ram);
      let adjustedBasePension = applyChildrenBonus(basePension.monthly);
      
      // Retraites complémentaires
      const rciPension = calculateRCIPension();
      const agircArrcoPension = calculateAgircArrcoPension();
      
      const totalMonthly = adjustedBasePension + rciPension.monthly + agircArrcoPension.monthly;
      
      // Taux de remplacement
      const lastRevenue = formData.currentMonthlyIncome || (formData.averageAnnualRevenue / 12);
      const replacementRate = lastRevenue > 0 ? (totalMonthly / lastRevenue) * 100 : 0;
      
      // Calcul épargne
      const targetIncome = formData.targetIncomeMode === 'percentage'
        ? formData.currentMonthlyIncome * (formData.targetIncomePercentage / 100)
        : formData.targetIncomeAmount;
      
      const savingsProjections = {};
      ['prudent', 'equilibre', 'dynamique'].forEach(profile => {
        savingsProjections[profile] = calculateRequiredSavings(
          targetIncome,
          totalMonthly,
          yearsUntilRetirement,
          profile
        );
      });
      
      scenarios.push({
        age,
        yearsUntil: yearsUntilRetirement,
        totalQuarters,
        basePension: Math.round(adjustedBasePension),
        rciPension: Math.round(rciPension.monthly),
        agircArrcoPension: Math.round(agircArrcoPension.monthly),
        totalMonthly: Math.round(totalMonthly),
        totalAnnual: Math.round(totalMonthly * 12),
        replacementRate: Math.round(replacementRate),
        targetIncome: Math.round(targetIncome),
        savingsProjections,
        details: {
          ram: basePension.ram,
          rate: basePension.rate,
          decote: basePension.decote,
          surcote: basePension.surcote,
          requiredQuarters: basePension.requiredQuarters,
          rciPoints: rciPension.points,
          agircArrcoPoints: agircArrcoPension.points || 0
        }
      });
    });
    
    return scenarios;
  };

  // Handler calcul final
  const handleCalculate = () => {
    const riskProfile = calculateRiskProfile();
    handleInputChange('riskProfile', riskProfile);
    
    const scenarios = calculateScenarios();
    const currentAge = new Date().getFullYear() - getBirthYear();
    
    setResults({
      scenarios,
      currentAge,
      riskProfile,
      totalQuarters: calculateTotalQuarters(),
      freelanceQuarters: calculateFreelanceQuarters(),
      salariedQuarters: calculateSalariedQuarters(),
      assimilatedQuarters: calculateAssimilatedQuarters(),
      childrenQuarters: calculateChildrenQuarters(),
      ram: calculateRAM(),
      hadSalariedPeriods: formData.hadSalariedPeriods,
      freelanceStatus: formData.freelanceStatus
    });
    
    setCurrentStep(7);
  };

  // Navigation
  const getTotalSteps = () => formData.hadSalariedPeriods ? 7 : 7;
  
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      handleCalculate();
    }
  };

  const prevStep = () => {
    if (currentStep === 1) {
      navigate('/simulator');
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ============================================
  // RENDU DES ÉTAPES
  // ============================================

  // ÉTAPE 1 : Profil & Statuts
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre profil</h2>
        <p className="text-gray-600">Freelance - Étape 1/7</p>
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
            required
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
            type="number" onFocus={(e) => e.target.select()}
            min="0"
            max="10"
            value={formData.children}
            onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
            className="input-elysion"
          />
        </div>

        {formData.children > 0 && (
          <div className="flex items-center">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isMother}
                onChange={(e) => handleInputChange('isMother', e.target.checked)}
                className="checkbox-elysion"
              />
              <span className="text-sm font-medium text-gray-700">
                Je suis la mère
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Statut freelance */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Votre statut actuel
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('freelanceStatus', 'micro')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              formData.freelanceStatus === 'micro'
                ? 'border-elysion-primary bg-elysion-primary-50'
                : 'border-gray-200 bg-white hover:border-elysion-primary'
            }`}
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="font-semibold text-elysion-primary">Micro-entrepreneur</div>
            <p className="text-xs text-gray-600 mt-1">Auto-entrepreneur</p>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('freelanceStatus', 'ei')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              formData.freelanceStatus === 'ei'
                ? 'border-elysion-accent bg-elysion-accent-50'
                : 'border-gray-200 bg-white hover:border-elysion-accent'
            }`}
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="font-semibold text-elysion-primary">Entrepreneur individuel</div>
            <p className="text-xs text-gray-600 mt-1">BIC / BNC (TNS SSI)</p>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('freelanceStatus', 'liberal')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              formData.freelanceStatus === 'liberal'
                ? 'border-elysion-secondary bg-elysion-secondary-50'
                : 'border-gray-200 bg-white hover:border-elysion-secondary'
            }`}
          >
            <div className="text-2xl mb-2">⚖️</div>
            <div className="font-semibold text-elysion-primary">Profession libérale</div>
            <p className="text-xs text-gray-600 mt-1">Cipav / Autre caisse</p>
          </button>
        </div>
      </div>

      {formData.freelanceStatus === 'liberal' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Votre caisse de retraite
          </label>
          <select
            value={formData.liberalCaisse}
            onChange={(e) => handleInputChange('liberalCaisse', e.target.value)}
            className="input-elysion"
          >
            <option value="">Sélectionner</option>
            <option value="cipav">CIPAV</option>
            <option value="other">Autre caisse libérale</option>
          </select>
        </div>
      )}

      {/* Question clé : salarié */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.hadSalariedPeriods}
            onChange={(e) => handleInputChange('hadSalariedPeriods', e.target.checked)}
            className="checkbox-elysion"
          />
          <span className="font-semibold text-gray-900">
            J'ai déjà travaillé comme salarié (avant ou pendant mon activité freelance)
          </span>
        </label>
        <p className="text-xs text-gray-600 mt-2 ml-8">
          Cela nous permettra d'intégrer vos trimestres et points de retraite salariée
        </p>
      </div>
    </div>
  );

  // ÉTAPE 2 : Carrière et revenus freelance
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Carrière freelance</h2>
        <p className="text-gray-600">Freelance - Étape 2/7</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Depuis quelle année êtes-vous freelance ?
          </label>
          <input
            type="number" onFocus={(e) => e.target.select()}
            placeholder="2015"
            min="1980"
            max={new Date().getFullYear()}
            value={formData.freelanceStartYear}
            onChange={(e) => handleInputChange('freelanceStartYear', e.target.value)}
            className="input-elysion"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Votre activité est plutôt...
          </label>
          <select
            value={formData.activityTrend}
            onChange={(e) => handleInputChange('activityTrend', e.target.value)}
            className="input-elysion"
          >
            <option value="stable">Stable</option>
            <option value="up">En hausse</option>
            <option value="down">En baisse</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.activityContinuous}
            onChange={(e) => handleInputChange('activityContinuous', e.target.checked)}
            className="checkbox-elysion"
          />
          <span className="text-sm font-medium text-gray-700">
            Mon activité a été continue (sans interruption majeure)
          </span>
        </label>

        {!formData.activityContinuous && (
          <div className="ml-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'années d'interruption (total)
            </label>
            <input
              type="number" onFocus={(e) => e.target.select()}
              min="0"
              max="20"
              value={formData.interruptionYears}
              onChange={(e) => handleInputChange('interruptionYears', parseInt(e.target.value) || 0)}
              className="input-elysion w-32"
            />
          </div>
        )}
      </div>

      {/* Mode de saisie */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Mode de saisie des revenus
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('revenueMode', 'simple')}
            className={`p-4 rounded-lg border-2 text-left ${
              formData.revenueMode === 'simple'
                ? 'border-elysion-primary bg-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="font-semibold">📊 Simplifié</div>
            <p className="text-xs text-gray-600">Revenu moyen sur les dernières années</p>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('revenueMode', 'detailed')}
            className={`p-4 rounded-lg border-2 text-left ${
              formData.revenueMode === 'detailed'
                ? 'border-elysion-primary bg-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="font-semibold">📋 Détaillé</div>
            <p className="text-xs text-gray-600">Année par année</p>
          </button>
        </div>
      </div>

      {formData.revenueMode === 'simple' ? (
        <div className="space-y-4">
          {formData.freelanceStatus === 'micro' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type d'activité principale
              </label>
              <select
                value={formData.activityType}
                onChange={(e) => handleInputChange('activityType', e.target.value)}
                className="input-elysion"
              >
                <option value="vente">Vente de marchandises (71% abattement)</option>
                <option value="service_bic">Prestations de services BIC (50% abattement)</option>
                <option value="service_bnc">Prestations de services BNC (34% abattement)</option>
                <option value="liberal">Profession libérale (34% abattement)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {formData.freelanceStatus === 'micro' 
                ? "Chiffre d'affaires annuel moyen (€)"
                : "Revenu professionnel annuel moyen (€)"}
            </label>
            <input
              type="number" onFocus={(e) => e.target.select()}
              min="0"
              value={formData.averageAnnualRevenue}
              onChange={(e) => handleInputChange('averageAnnualRevenue', parseFloat(e.target.value) || 0)}
              className="input-elysion"
              placeholder={formData.freelanceStatus === 'micro' ? "50000" : "35000"}
            />
            <p className="text-xs text-gray-500 mt-1">
              Moyenne sur les 3 à 5 dernières années
            </p>
          </div>

          {formData.freelanceStatus === 'micro' && formData.averageAnnualRevenue > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Revenu retraite estimé :</strong>{' '}
                {Math.round(convertMicroRevenue(formData.averageAnnualRevenue, formData.activityType)).toLocaleString()} €/an
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Après abattement forfaitaire de {Math.round(BAREME_2026.MICRO_ABATEMENTS[formData.activityType] * 100)}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => {
              handleArrayAdd('revenueHistory', {
                year: new Date().getFullYear() - formData.revenueHistory.length,
                turnover: '',
                professionalRevenue: '',
                activityType: formData.activityType
              });
            }}
            className="btn-primary"
          >
            + Ajouter une année
          </button>

          {formData.revenueHistory.map((yearData, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Année {yearData.year}</h4>
                <button
                  onClick={() => handleArrayRemove('revenueHistory', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année
                  </label>
                  <input
                    type="number" onFocus={(e) => e.target.select()}
                    value={yearData.year}
                    onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                      ...yearData,
                      year: parseInt(e.target.value)
                    })}
                    className="input-elysion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.freelanceStatus === 'micro' ? "CA annuel (€)" : "Revenu pro (€)"}
                  </label>
                  <input
                    type="number" onFocus={(e) => e.target.select()}
                    value={formData.freelanceStatus === 'micro' ? yearData.turnover : yearData.professionalRevenue}
                    onChange={(e) => handleArrayUpdate('revenueHistory', index, {
                      ...yearData,
                      [formData.freelanceStatus === 'micro' ? 'turnover' : 'professionalRevenue']: parseFloat(e.target.value) || 0
                    })}
                    className="input-elysion"
                    placeholder="35000"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.revenueHistory.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Cliquez sur "Ajouter une année" pour commencer
            </p>
          )}
        </div>
      )}
    </div>
  );

  // ÉTAPE 3 : Carrière salariée (si applicable)
  const renderStep3 = () => {
    if (!formData.hadSalariedPeriods) {
      return renderStep4Content();
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">Carrière salariée</h2>
          <p className="text-gray-600">Freelance - Étape 3/7</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Info :</strong> Ces informations permettent d'intégrer vos droits acquis en tant que salarié à votre estimation de retraite globale.
          </p>
        </div>

        {/* Mode de saisie */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Mode de saisie
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('salariedMode', 'periods')}
              className={`p-4 rounded-lg border-2 text-left ${
                formData.salariedMode === 'periods'
                  ? 'border-elysion-primary bg-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="font-semibold">📊 Période par période</div>
              <p className="text-xs text-gray-600">Ex: 2000-2010, 2010-2015...</p>
            </button>

            <button
              type="button"
              onClick={() => handleInputChange('salariedMode', 'detailed')}
              className={`p-4 rounded-lg border-2 text-left ${
                formData.salariedMode === 'detailed'
                  ? 'border-elysion-primary bg-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="font-semibold">📋 Année par année</div>
              <p className="text-xs text-gray-600">Chaque année individuellement</p>
            </button>
          </div>
        </div>

        {formData.salariedMode === 'periods' ? (
          <div className="space-y-4">
            <button
              onClick={() => {
                handleArrayAdd('salariedPeriods', {
                  startYear: 2000,
                  endYear: 2010,
                  averageSalary: ''
                });
              }}
              className="btn-primary"
            >
              + Ajouter une période
            </button>

            {formData.salariedPeriods.map((period, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Période {index + 1}</h4>
                  <button
                    onClick={() => handleArrayRemove('salariedPeriods', index)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Année début
                    </label>
                    <input
                      type="number" onFocus={(e) => e.target.select()}
                      value={period.startYear}
                      onChange={(e) => handleArrayUpdate('salariedPeriods', index, {
                        ...period,
                        startYear: parseInt(e.target.value)
                      })}
                      className="input-elysion"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Année fin
                    </label>
                    <input
                      type="number" onFocus={(e) => e.target.select()}
                      value={period.endYear}
                      onChange={(e) => handleArrayUpdate('salariedPeriods', index, {
                        ...period,
                        endYear: parseInt(e.target.value)
                      })}
                      className="input-elysion"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salaire annuel brut moyen (€)
                    </label>
                    <input
                      type="number" onFocus={(e) => e.target.select()}
                      value={period.averageSalary}
                      onChange={(e) => handleArrayUpdate('salariedPeriods', index, {
                        ...period,
                        averageSalary: parseFloat(e.target.value) || 0
                      })}
                      className="input-elysion"
                      placeholder="35000"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.salariedPeriods.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Cliquez sur "+ Ajouter une période" pour commencer
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Saisissez vos salaires annuels bruts année par année
            </p>
            
            <button
              onClick={() => {
                handleArrayAdd('detailedSalaries', {
                  year: new Date().getFullYear() - formData.detailedSalaries.length - 1,
                  salary: ''
                });
              }}
              className="btn-primary"
            >
              + Ajouter une année
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              {formData.detailedSalaries.map((yearData, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="number" onFocus={(e) => e.target.select()}
                      value={yearData.year}
                      onChange={(e) => handleArrayUpdate('detailedSalaries', index, {
                        ...yearData,
                        year: parseInt(e.target.value)
                      })}
                      className="input-elysion w-24"
                      placeholder="2020"
                    />
                    <input
                      type="number" onFocus={(e) => e.target.select()}
                      value={yearData.salary}
                      onChange={(e) => handleArrayUpdate('detailedSalaries', index, {
                        ...yearData,
                        salary: parseFloat(e.target.value) || 0
                      })}
                      className="input-elysion flex-1"
                      placeholder="35000 €"
                    />
                    <button
                      onClick={() => handleArrayRemove('detailedSalaries', index)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {formData.detailedSalaries.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Cliquez sur "+ Ajouter une année" pour commencer
              </p>
            )}
          </div>
        )}

        {/* Points Agirc-Arrco */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={formData.knowsAgircArrcoPoints}
              onChange={(e) => handleInputChange('knowsAgircArrcoPoints', e.target.checked)}
              className="checkbox-elysion"
            />
            <span className="font-semibold text-gray-900">
              Je connais mon nombre de points Agirc-Arrco
            </span>
          </label>

          {formData.knowsAgircArrcoPoints ? (
            <div className="ml-8">
              <input
                type="number" onFocus={(e) => e.target.select()}
                min="0"
                value={formData.agircArrcoPoints}
                onChange={(e) => handleInputChange('agircArrcoPoints', parseFloat(e.target.value) || 0)}
                className="input-elysion"
                placeholder="5000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Vous pouvez trouver ce nombre sur votre relevé de carrière
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 ml-8">
              Nous estimerons votre complémentaire salariée à environ 27% de votre salaire de base
            </p>
          )}
        </div>
      </div>
    );
  };

  // ÉTAPE 4 : Trimestres (contenu réutilisable)
  const renderStep4Content = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Trimestres & Majorations</h2>
        <p className="text-gray-600">Freelance - Étape {formData.hadSalariedPeriods ? '4' : '3'}/7</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Info :</strong> Les trimestres assimilés sont des périodes qui comptent pour votre retraite même sans cotisation.
        </p>
      </div>

      {/* Périodes assimilées */}
      <div className="space-y-4">
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
            <div className="ml-8 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée totale</label>
                <input
                  type="number" onFocus={(e) => e.target.select()}
                  min="0"
                  value={formData.unemploymentDuration}
                  onChange={(e) => handleInputChange('unemploymentDuration', parseInt(e.target.value) || 0)}
                  className="input-elysion"
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
            <div className="ml-8 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée totale</label>
                <input
                  type="number" onFocus={(e) => e.target.select()}
                  min="0"
                  value={formData.illnessDuration}
                  onChange={(e) => handleInputChange('illnessDuration', parseInt(e.target.value) || 0)}
                  className="input-elysion"
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
              J'ai eu des congés parentaux à temps plein
            </span>
          </label>

          {formData.hadParentalLeave && (
            <div className="ml-8 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée totale</label>
                <input
                  type="number" onFocus={(e) => e.target.select()}
                  min="0"
                  value={formData.parentalLeaveDuration}
                  onChange={(e) => handleInputChange('parentalLeaveDuration', parseInt(e.target.value) || 0)}
                  className="input-elysion"
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
          )}
        </div>

        {/* Enfant handicapé */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={formData.hadDisabledChild}
              onChange={(e) => handleInputChange('hadDisabledChild', e.target.checked)}
              className="checkbox-elysion"
            />
            <span className="font-semibold text-gray-900">
              J'ai élevé un enfant lourdement handicapé (≥80%)
            </span>
          </label>

          {formData.hadDisabledChild && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de mois d'éducation (≥30 mois avant 20 ans)
              </label>
              <input
                type="number" onFocus={(e) => e.target.select()}
                min="30"
                value={formData.disabledChildMonths}
                onChange={(e) => handleInputChange('disabledChildMonths', parseInt(e.target.value) || 0)}
                className="input-elysion w-32"
              />
              <p className="text-xs text-gray-500 mt-1">+1 trimestre par 30 mois (max 8 trimestres)</p>
            </div>
          )}
        </div>
      </div>

      {/* Majoration 3+ enfants */}
      {formData.children >= 3 && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Combien d'enfants avez-vous élevés pendant au moins 9 ans avant leurs 16 ans ?
          </label>
          <input
            type="number" onFocus={(e) => e.target.select()}
            min="0"
            max={formData.children}
            value={formData.childrenRaisedOver9Years}
            onChange={(e) => handleInputChange('childrenRaisedOver9Years', parseInt(e.target.value) || 0)}
            className="input-elysion w-32"
          />
          <p className="text-xs text-green-700 mt-2">
            Si ≥ 3 enfants élevés, votre pension de base sera majorée de 10%
          </p>
        </div>
      )}

      {/* Récapitulatif */}
      <div className="bg-elysion-primary-50 p-6 rounded-xl border border-elysion-primary">
        <h3 className="font-semibold text-lg mb-4 text-elysion-primary">Récapitulatif des trimestres</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Trimestres freelance :</span>
            <span className="font-semibold">{calculateFreelanceQuarters()}</span>
          </div>
          {formData.hadSalariedPeriods && (
            <div className="flex justify-between">
              <span>Trimestres salariés :</span>
              <span className="font-semibold">{calculateSalariedQuarters()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Trimestres assimilés :</span>
            <span className="font-semibold">{calculateAssimilatedQuarters()}</span>
          </div>
          {(formData.isMother || formData.hadParentalLeave || formData.hadDisabledChild) && (
            <div className="flex justify-between text-green-700">
              <span>Majorations enfants :</span>
              <span className="font-semibold">+{calculateChildrenQuarters()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-elysion-primary/30">
            <span className="font-bold">Total :</span>
            <span className="font-bold text-lg text-elysion-primary">{calculateTotalQuarters()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Wrapper pour étape 4
  const renderStep4 = () => {
    if (formData.hadSalariedPeriods) {
      return renderStep4Content();
    }
    return renderStep5Content();
  };

  // ÉTAPE 5 : Épargne & Risque (contenu)
  const renderStep5Content = () => {
    const estimatedPension = calculateScenarios()[0]?.totalMonthly || 0;
    const replacementRate = formData.currentMonthlyIncome > 0 
      ? Math.round((estimatedPension / formData.currentMonthlyIncome) * 100) 
      : 0;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">Épargne & Besoin</h2>
          <p className="text-gray-600">Freelance - Étape {formData.hadSalariedPeriods ? '5' : '4'}/7</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Important pour les indépendants :</strong> Les régimes TNS sont généralement moins généreux que ceux des salariés. Le taux de remplacement moyen est souvent de 30 à 50%. L'épargne complémentaire est donc essentielle.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Votre revenu professionnel mensuel net moyen (€)
          </label>
          <input
            type="number" onFocus={(e) => e.target.select()}
            min="0"
            value={formData.currentMonthlyIncome}
            onChange={(e) => handleInputChange('currentMonthlyIncome', parseFloat(e.target.value) || 0)}
            className="input-elysion"
            placeholder="3500"
          />
        </div>

        {formData.currentMonthlyIncome > 0 && estimatedPension > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Estimation préliminaire</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Revenu actuel</p>
                <p className="text-xl font-bold text-gray-900">{formData.currentMonthlyIncome.toLocaleString()} €</p>
              </div>
              <div className="text-center p-4 bg-elysion-primary-50 rounded-lg">
                <p className="text-sm text-gray-600">Pension estimée</p>
                <p className="text-xl font-bold text-elysion-primary">{estimatedPension.toLocaleString()} €</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Écart mensuel</p>
                <p className="text-xl font-bold text-red-500">
                  -{Math.max(0, formData.currentMonthlyIncome - estimatedPension).toLocaleString()} €
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Taux de remplacement estimé</p>
              <p className={`text-3xl font-bold ${replacementRate >= 50 ? 'text-green-600' : replacementRate >= 35 ? 'text-orange-500' : 'text-red-500'}`}>
                {replacementRate}%
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quel revenu mensuel net souhaitez-vous à la retraite ?
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="targetMode"
                checked={formData.targetIncomeMode === 'percentage'}
                onChange={() => handleInputChange('targetIncomeMode', 'percentage')}
                className="checkbox-elysion"
              />
              <span className="text-sm">En % du revenu actuel</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="targetMode"
                checked={formData.targetIncomeMode === 'amount'}
                onChange={() => handleInputChange('targetIncomeMode', 'amount')}
                className="checkbox-elysion"
              />
              <span className="text-sm">En montant fixe (€)</span>
            </label>
          </div>
          
          {formData.targetIncomeMode === 'percentage' ? (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="100"
                value={formData.targetIncomePercentage}
                onChange={(e) => handleInputChange('targetIncomePercentage', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="font-bold text-elysion-primary w-16 text-right">{formData.targetIncomePercentage}%</span>
            </div>
          ) : (
            <input
              type="number" onFocus={(e) => e.target.select()}
              min="0"
              value={formData.targetIncomeAmount}
              onChange={(e) => handleInputChange('targetIncomeAmount', parseFloat(e.target.value) || 0)}
              className="input-elysion"
              placeholder="2500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Capital déjà épargné pour la retraite (€)
          </label>
          <input
            type="number" onFocus={(e) => e.target.select()}
            min="0"
            value={formData.currentSavings}
            onChange={(e) => handleInputChange('currentSavings', parseFloat(e.target.value) || 0)}
            className="input-elysion"
            placeholder="30000"
          />
          <p className="text-xs text-gray-500 mt-1">PER individuel, assurance-vie, trésorerie disponible...</p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="wantsCalculation"
            checked={formData.wantsEpargneCalculation}
            onChange={(e) => handleInputChange('wantsEpargneCalculation', e.target.checked)}
            className="checkbox-elysion"
          />
          <label htmlFor="wantsCalculation" className="text-sm text-gray-700">
            Je souhaite que le simulateur calcule l'épargne nécessaire
          </label>
        </div>
      </div>
    );
  };

  // Wrapper étape 5
  const renderStep5 = () => {
    if (formData.hadSalariedPeriods) {
      return renderStep5Content();
    }
    return renderStep6Content();
  };

  // ÉTAPE 6 : Profil de risque (contenu)
  const renderStep6Content = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre relation au risque</h2>
        <p className="text-gray-600">Freelance - Étape {formData.hadSalariedPeriods ? '6' : '5'}/7</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Important :</strong> Ces questions permettent d'adapter les recommandations d'épargne à votre profil.
        </p>
      </div>

      {/* Horizon */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">1. Votre horizon de placement</h3>
        <p className="text-sm text-gray-600 mb-3">Dans combien de temps envisagez-vous d'arrêter votre activité ?</p>
        <div className="space-y-2">
          {[
            { value: 'short', label: 'Moins de 10 ans', desc: 'Horizon court - privilégier la sécurité' },
            { value: 'medium', label: '10 à 20 ans', desc: 'Horizon moyen - équilibre rendement/risque' },
            { value: 'long', label: 'Plus de 20 ans', desc: 'Horizon long - potentiel de croissance' }
          ].map(option => (
            <label key={option.value} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.investmentHorizon === option.value ? 'border-elysion-primary bg-elysion-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="horizon"
                value={option.value}
                checked={formData.investmentHorizon === option.value}
                onChange={(e) => handleInputChange('investmentHorizon', e.target.value)}
                className="checkbox-elysion"
              />
              <div>
                <span className="font-medium">{option.label}</span>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Tolérance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">2. Votre tolérance aux fluctuations</h3>
        <p className="text-sm text-gray-600 mb-3">Quelle baisse temporaire de votre épargne accepteriez-vous ?</p>
        <div className="space-y-2">
          {[
            { value: '5', label: 'Maximum 5%', desc: 'Très prudent - je préfère la stabilité' },
            { value: '10', label: 'Jusqu\'à 10%', desc: 'Modéré - j\'accepte quelques fluctuations' },
            { value: '20', label: 'Jusqu\'à 20% ou plus', desc: 'Tolérant - je vise le long terme' }
          ].map(option => (
            <label key={option.value} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.lossToleranceLevel === option.value ? 'border-elysion-primary bg-elysion-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="lossTolerance"
                value={option.value}
                checked={formData.lossToleranceLevel === option.value}
                onChange={(e) => handleInputChange('lossToleranceLevel', e.target.value)}
                className="checkbox-elysion"
              />
              <div>
                <span className="font-medium">{option.label}</span>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Connaissance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">3. Votre connaissance des marchés</h3>
        <p className="text-sm text-gray-600 mb-3">Comment évaluez-vous votre expérience en investissement ?</p>
        <div className="space-y-2">
          {[
            { value: 'beginner', label: 'Débutant', desc: 'Je découvre l\'épargne financière' },
            { value: 'intermediate', label: 'Intermédiaire', desc: 'J\'ai déjà investi (assurance-vie, PER...)' },
            { value: 'advanced', label: 'Avancé', desc: 'Je suis à l\'aise avec les marchés' }
          ].map(option => (
            <label key={option.value} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.marketKnowledge === option.value ? 'border-elysion-primary bg-elysion-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="knowledge"
                value={option.value}
                checked={formData.marketKnowledge === option.value}
                onChange={(e) => handleInputChange('marketKnowledge', e.target.value)}
                className="checkbox-elysion"
              />
              <div>
                <span className="font-medium">{option.label}</span>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Aperçu profil */}
      {formData.investmentHorizon && formData.lossToleranceLevel && formData.marketKnowledge && (
        <div className="bg-gradient-to-r from-elysion-primary-50 to-elysion-accent-50 p-6 rounded-lg border border-elysion-primary-200">
          <h3 className="font-semibold text-gray-900 mb-2">Votre profil de risque estimé</h3>
          {(() => {
            const profile = calculateRiskProfile();
            const profileData = RISK_PROFILES[profile];
            return (
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                  profile === 'prudent' ? 'bg-green-500' : profile === 'equilibre' ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  {profile === 'prudent' ? '🛡️' : profile === 'equilibre' ? '⚖️' : '🚀'}
                </div>
                <div>
                  <p className="text-xl font-bold text-elysion-primary">{profileData.name}</p>
                  <p className="text-sm text-gray-600">{profileData.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Rendement moyen attendu : {profileData.annualReturn * 100}% / an</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  // Wrapper étape 6
  const renderStep6 = () => {
    if (formData.hadSalariedPeriods) {
      return renderStep6Content();
    }
    return renderStep7Content();
  };

  // ÉTAPE 7 : Scénarios d'âge (contenu)
  const renderStep7Content = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Scénarios de départ</h2>
        <p className="text-gray-600">Freelance - Étape {formData.hadSalariedPeriods ? '7' : '6'}/7</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Conseil :</strong> Testez différents âges d'arrêt d'activité pour comparer vos pensions estimées.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Âges de départ à tester (sélectionnez 1 à 3 âges)
        </label>
        
        <div className="grid grid-cols-3 gap-4">
          {[60, 62, 64, 65, 67, 70].map(age => (
            <label key={age} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.retirementAges.includes(age)}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (formData.retirementAges.length < 3) {
                      handleInputChange('retirementAges', [...formData.retirementAges, age].sort((a,b) => a-b));
                    }
                  } else {
                    handleInputChange('retirementAges', formData.retirementAges.filter(a => a !== age));
                  }
                }}
                className="checkbox-elysion"
                disabled={!formData.retirementAges.includes(age) && formData.retirementAges.length >= 3}
              />
              <span className="text-sm font-medium">{age} ans</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-3">Âges sélectionnés :</h3>
        <div className="flex gap-3">
          {formData.retirementAges.map(age => (
            <div key={age} className="bg-elysion-primary text-white px-4 py-2 rounded-lg font-semibold">
              {age} ans
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Wrapper étape 7 (devient étape calcul)
  const renderStep7 = () => {
    if (formData.hadSalariedPeriods) {
      return renderStep7Content();
    }
    // Si pas de période salariée, on est déjà passé par les bonnes étapes
    return null;
  };

  // ÉTAPE RÉSULTATS
  const renderResults = () => {
    if (!results) return null;
    
    const profileData = RISK_PROFILES[results.riskProfile];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre estimation de retraite</h2>
          <p className="text-gray-600">Freelance - Synthèse complète</p>
        </div>

        {/* Récap objectif */}
        {results.scenarios[0]?.targetIncome > 0 && (
          <div className="bg-gradient-to-r from-elysion-primary-50 to-elysion-secondary-50 p-6 rounded-xl border border-elysion-primary-200">
            <h3 className="font-semibold text-gray-900 mb-4">🎯 Votre objectif</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Revenu actuel</p>
                <p className="text-xl font-bold text-gray-900">{formData.currentMonthlyIncome?.toLocaleString()} €/mois</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Objectif retraite</p>
                <p className="text-xl font-bold text-elysion-primary">{results.scenarios[0]?.targetIncome?.toLocaleString()} €/mois</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profil de risque</p>
                <p className={`text-xl font-bold ${results.riskProfile === 'prudent' ? 'text-green-600' : results.riskProfile === 'equilibre' ? 'text-blue-600' : 'text-orange-500'}`}>
                  {profileData?.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tableau scénarios */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-elysion-primary p-4">
            <h3 className="text-white font-semibold text-lg">Scénarios par âge de départ</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Âge</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Base</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">RCI</th>
                  {results.hadSalariedPeriods && (
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Agirc-Arrco</th>
                  )}
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Taux</th>
                </tr>
              </thead>
              <tbody>
                {results.scenarios.map((scenario, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-elysion-primary">{scenario.age} ans</td>
                    <td className="px-4 py-3 text-right">{scenario.basePension?.toLocaleString()} €</td>
                    <td className="px-4 py-3 text-right">{scenario.rciPension?.toLocaleString()} €</td>
                    {results.hadSalariedPeriods && (
                      <td className="px-4 py-3 text-right">{scenario.agircArrcoPension?.toLocaleString()} €</td>
                    )}
                    <td className="px-4 py-3 text-right font-bold text-elysion-primary">{scenario.totalMonthly?.toLocaleString()} €</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        scenario.replacementRate >= 50 ? 'bg-green-100 text-green-700' : 
                        scenario.replacementRate >= 35 ? 'bg-orange-100 text-orange-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {scenario.replacementRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Détails calcul */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-elysion-primary">📊 Vos trimestres</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trimestres freelance :</span>
                <span className="font-semibold">{results.freelanceQuarters}</span>
              </div>
              {results.hadSalariedPeriods && (
                <div className="flex justify-between">
                  <span>Trimestres salariés :</span>
                  <span className="font-semibold">{results.salariedQuarters}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Trimestres assimilés :</span>
                <span className="font-semibold">{results.assimilatedQuarters}</span>
              </div>
              {results.childrenQuarters > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Majorations enfants :</span>
                  <span className="font-semibold">+{results.childrenQuarters}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold">Total :</span>
                <span className="font-bold text-elysion-primary">{results.totalQuarters}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-elysion-primary">💰 Revenu Annuel Moyen</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-elysion-primary">{Math.round(results.ram).toLocaleString()} €</p>
              <p className="text-sm text-gray-500 mt-2">Calculé sur les 25 meilleures années</p>
            </div>
          </div>
        </div>

        {/* Épargne nécessaire */}
        {formData.wantsEpargneCalculation && results.scenarios[0]?.savingsProjections && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-elysion-accent p-4">
              <h3 className="text-white font-semibold text-lg">💰 Épargne complémentaire nécessaire</h3>
            </div>
            <div className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                {['prudent', 'equilibre', 'dynamique'].map(profile => {
                  const proj = results.scenarios[0]?.savingsProjections[profile];
                  const profileInfo = RISK_PROFILES[profile];
                  const isSelected = profile === results.riskProfile;
                  
                  return (
                    <div 
                      key={profile}
                      className={`p-4 rounded-lg border-2 ${isSelected ? 'border-elysion-primary bg-elysion-primary-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          profile === 'prudent' ? 'bg-green-500' : profile === 'equilibre' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}>
                          {profile === 'prudent' ? '🛡️' : profile === 'equilibre' ? '⚖️' : '🚀'}
                        </span>
                        <span className="font-semibold text-sm">{profileInfo.name}</span>
                        {isSelected && <span className="text-xs bg-elysion-primary text-white px-2 py-0.5 rounded">Votre profil</span>}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Rendement : {proj?.annualReturn}%/an</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capital nécessaire :</span>
                          <span className="font-semibold">{proj?.requiredCapital?.toLocaleString()} €</span>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Versement mensuel :</span>
                          <span className={`text-lg font-bold ${isSelected ? 'text-elysion-primary' : 'text-gray-900'}`}>
                            {proj?.monthlyContribution?.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recommandations */}
        {profileData && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📈 Recommandations pour votre profil {profileData.name}</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Supports d'épargne adaptés :</p>
              <p className="text-sm text-gray-600">{profileData.recommendation}</p>
            </div>
          </div>
        )}

        {/* Info TNS */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Bon à savoir pour les indépendants</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Vos versements PER sont déductibles de votre revenu imposable</li>
            <li>• Pensez à garder une épargne de précaution (6-12 mois de charges)</li>
            <li>• Ces montants sont des estimations basées sur les barèmes 2026</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6">
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Voir mon tableau de bord
              </button>
              <button
                onClick={() => { setCurrentStep(1); setResults(null); }}
                className="btn-outline"
              >
                Nouvelle simulation
              </button>
            </div>
          ) : (
            <div className="bg-elysion-primary p-6 sm:p-8 rounded-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Créez votre compte pour sauvegarder cette simulation
              </h3>
              <p className="mb-6 bg-white/20 text-white px-4 py-2 rounded-lg text-sm sm:text-base">
                Accédez à des recommandations personnalisées et suivez l'évolution de votre retraite.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/onboarding', { 
                    state: { 
                      professionalStatus: 'freelancer',
                      simulationData: formData,
                      results: results
                    }
                  })}
                  className="bg-white text-elysion-primary hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors"
                  data-testid="create-account-btn"
                >
                  Créer mon compte
                </button>
                <button
                  onClick={() => navigate('/auth?mode=login')}
                  className="bg-elysion-accent hover:bg-elysion-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  data-testid="login-btn"
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDU PRINCIPAL
  // ============================================
  
  // Déterminer quelle étape afficher selon le flux
  const getCurrentStepContent = () => {
    if (results) return renderResults();
    
    if (formData.hadSalariedPeriods) {
      // Flux avec périodes salariées : 7 étapes
      switch (currentStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4Content();
        case 5: return renderStep5Content();
        case 6: return renderStep6Content();
        default: return renderStep7Content();
      }
    } else {
      // Flux freelance pur : 6 étapes
      switch (currentStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep4Content(); // Trimestres
        case 4: return renderStep5Content(); // Épargne
        case 5: return renderStep6Content(); // Risque
        default: return renderStep7Content(); // Scénarios
      }
    }
  };

  const getTotalStepsDisplay = () => formData.hadSalariedPeriods ? 7 : 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-elysion-bg to-white font-montserrat">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-elysion-primary font-montserrat hover:text-elysion-accent transition-colors"
            >
              Elysion
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary"
                  >
                    Tableau de bord
                  </button>
                  <div className="flex items-center space-x-2 bg-elysion-primary/10 px-3 py-1.5 rounded-full">
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-medium text-elysion-primary">
                      {user.first_name || user.full_name?.split(' ')[0]}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/auth?mode=login')}
                    className="btn-primary"
                  >
                    Se connecter
                  </button>
                  <button 
                    onClick={() => navigate('/auth?mode=register')}
                    className="btn-outline"
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>

            {/* Mobile: User name + Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <span className="text-sm font-medium text-elysion-primary">
                  {user.first_name || user.full_name?.split(' ')[0]}
                </span>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="freelance-sim-mobile-menu-btn"
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
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className="btn-ghost w-full text-left"
              >
                Accueil
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                    className="btn-secondary w-full"
                  >
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                    className="btn-outline w-full"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full py-2 px-4 rounded-lg text-red-600 font-medium bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/auth?mode=login'); setMobileMenuOpen(false); }}
                    className="btn-primary w-full"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => { navigate('/auth?mode=register'); setMobileMenuOpen(false); }}
                    className="btn-outline w-full"
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stepper */}
        {!results && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {Array.from({ length: getTotalStepsDisplay() }, (_, i) => i + 1).map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-elysion-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {index < getTotalStepsDisplay() - 1 && (
                    <div className={`w-8 md:w-16 h-1 ${
                      currentStep > step ? 'bg-elysion-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {getCurrentStepContent()}
        </div>

        {/* Navigation buttons */}
        {!results && (
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              className="btn-outline"
              data-testid="freelance-back-btn"
            >
              ← Retour
            </button>
            
            <button
              onClick={nextStep}
              className="btn-primary"
              disabled={
                (currentStep === 1 && !formData.freelanceStatus) ||
                (formData.retirementAges.length === 0 && 
                  ((formData.hadSalariedPeriods && currentStep === 7) || (!formData.hadSalariedPeriods && currentStep === 6)))
              }
              data-testid="freelance-next-btn"
            >
              {((formData.hadSalariedPeriods && currentStep === 7) || (!formData.hadSalariedPeriods && currentStep === 6)) 
                ? 'Calculer ma retraite' 
                : 'Suivant →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelanceSimulator;