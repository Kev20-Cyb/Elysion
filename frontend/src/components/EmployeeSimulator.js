import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeSimulator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [branch, setBranch] = useState(null); // 'private' or 'public'
  
  const [formData, setFormData] = useState({
    // Écran 1 - Profil
    birthYear: '',
    gender: '',
    children: 0,
    employeeType: '', // 'private' or 'public'
    careerStartYear: '',
    hadUnemployment: false,
    unemploymentMonths: 0,
    hadParentalLeave: false,
    parentalLeaveMonths: 0,
    
    // Branche Privé - Salaires
    salaryMode: 'simple', // 'simple' or 'detailed'
    salaryPeriods: [], // Pour mode simple
    detailedSalaries: [], // Pour mode détaillé (25 dernières années)
    
    // Branche Privé - Trimestres
    fullTimeYears: 0,
    partTimeYears: 0,
    
    // Branche Privé - Agirc-Arrco
    knowsPoints: false,
    agircArrcoPoints: 0,
    
    // Branche Public - Carrière
    publicServiceType: '', // 'state', 'territorial', 'hospital'
    permanentSinceYear: '',
    fullTime: true,
    lastIndexedSalary: '',
    
    // Branche Public - Trimestres
    publicServiceYears: 0,
    bonusQuarters: 0,
    otherRegimeQuarters: 0,
    
    // Branche Public - RAFP
    knowsRAFP: false,
    rafpAmount: 0,
    
    // Scénarios communs
    retirementAges: [62, 64, 67]
  });
  
  const [results, setResults] = useState(null);

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

  // Calcul trimestres pour salarié privé
  const calculatePrivateQuarters = () => {
    const currentYear = new Date().getFullYear();
    const careerYears = currentYear - parseInt(formData.careerStartYear);
    
    // Trimestres travaillés
    let workedQuarters = (formData.fullTimeYears * 4) + (formData.partTimeYears * 2); // Approximation temps partiel
    
    // Trimestres chômage (1 trimestre par période de 50 jours)
    const unemploymentQuarters = Math.floor(formData.unemploymentMonths / 1.7);
    
    // Trimestres congé parental (max 12 trimestres)
    const parentalQuarters = Math.min(Math.floor(formData.parentalLeaveMonths / 3), 12);
    
    return {
      worked: workedQuarters,
      unemployment: unemploymentQuarters,
      parental: parentalQuarters,
      total: Math.min(workedQuarters + unemploymentQuarters + parentalQuarters, 172)
    };
  };

  // Calcul SAM (Salaire Annuel Moyen) pour privé
  const calculateSAM = () => {
    let salaries = [];
    
    if (formData.salaryMode === 'simple') {
      // Mode simple : répliquer les périodes
      formData.salaryPeriods.forEach(period => {
        const years = period.endYear - period.startYear + 1;
        for (let i = 0; i < years; i++) {
          salaries.push(period.averageSalary);
        }
      });
    } else {
      // Mode détaillé
      salaries = formData.detailedSalaries.map(s => s.salary);
    }
    
    // Prendre les 25 meilleures années
    const best25 = salaries.sort((a, b) => b - a).slice(0, 25);
    const sum = best25.reduce((acc, val) => acc + val, 0);
    
    return best25.length > 0 ? sum / best25.length : 0;
  };

  // Calcul retraite de base privé
  const calculatePrivateBasePension = (age, quarters) => {
    const birthYear = parseInt(formData.birthYear);
    const requiredQuarters = birthYear >= 1973 ? 172 : 
                            birthYear >= 1961 ? 168 : 166;
    
    const sam = calculateSAM();
    let rate = 0.50;
    let decote = 0;
    let surcote = 0;
    
    const legalAge = 62;
    const fullRateAge = 67;
    
    if (age >= legalAge) {
      const missingQuarters = Math.max(0, requiredQuarters - quarters);
      const extraQuarters = Math.max(0, quarters - requiredQuarters);
      
      if (missingQuarters > 0 && age < fullRateAge) {
        // Décote : 1.25% par trimestre manquant
        decote = Math.min(missingQuarters * 0.0125, 0.25);
        rate = 0.50 * (1 - decote);
      } else if (extraQuarters > 0 && age >= legalAge) {
        // Surcote : 1.25% par trimestre supplémentaire
        surcote = extraQuarters * 0.0125;
        rate = 0.50 * (1 + surcote);
      }
    }
    
    const annualPension = sam * rate * (quarters / requiredQuarters);
    
    return {
      sam,
      rate: rate * 100,
      decote: decote * 100,
      surcote: surcote * 100,
      annual: annualPension,
      monthly: annualPension / 12,
      requiredQuarters
    };
  };

  // Calcul complémentaire Agirc-Arrco
  const calculateAgircArrco = () => {
    const pointValue = 1.4159; // Valeur 2024
    
    if (formData.knowsPoints) {
      const annual = formData.agircArrcoPoints * pointValue;
      return {
        points: formData.agircArrcoPoints,
        pointValue,
        annual,
        monthly: annual / 12
      };
    } else {
      // Estimation : ~25-30% du salaire de base
      const lastSalary = formData.detailedSalaries[formData.detailedSalaries.length - 1]?.salary || 
                         formData.salaryPeriods[formData.salaryPeriods.length - 1]?.averageSalary || 0;
      const estimatedMonthly = (lastSalary / 12) * 0.27;
      return {
        points: 0,
        pointValue,
        annual: estimatedMonthly * 12,
        monthly: estimatedMonthly,
        estimated: true
      };
    }
  };

  // Calcul trimestres fonction publique
  const calculatePublicQuarters = () => {
    // Trimestres services effectifs
    const serviceQuarters = formData.publicServiceYears * 4;
    
    // Bonifications (enfants, services actifs)
    const bonusQuarters = formData.bonusQuarters;
    
    // Autres régimes (privé avant/après)
    const otherQuarters = formData.otherRegimeQuarters;
    
    // Trimestres chômage
    const unemploymentQuarters = Math.floor(formData.unemploymentMonths / 3);
    
    // Trimestres congé parental
    const parentalQuarters = Math.min(Math.floor(formData.parentalLeaveMonths / 3), 12);
    
    return {
      service: serviceQuarters,
      bonus: bonusQuarters,
      liquidable: serviceQuarters + bonusQuarters, // Pour calcul pension
      other: otherQuarters,
      unemployment: unemploymentQuarters,
      parental: parentalQuarters,
      totalAllRegimes: serviceQuarters + bonusQuarters + otherQuarters + unemploymentQuarters + parentalQuarters
    };
  };

  // Calcul pension fonction publique
  const calculatePublicPension = (age, quarters) => {
    const birthYear = parseInt(formData.birthYear);
    const requiredQuarters = birthYear >= 1973 ? 172 : 
                            birthYear >= 1961 ? 168 : 166;
    
    const lastSalary = parseFloat(formData.lastIndexedSalary) || 0;
    const liquidableQuarters = quarters.liquidable;
    const allRegimesQuarters = quarters.totalAllRegimes;
    
    // Pension de base = 75% du traitement × (trimestres liquidables / requis)
    let basePension = lastSalary * 12 * 0.75 * (liquidableQuarters / requiredQuarters);
    
    // Décote/Surcote
    let decote = 0;
    let surcote = 0;
    const legalAge = 62;
    const fullRateAge = 67;
    
    if (age >= legalAge) {
      const missingQuarters = Math.max(0, requiredQuarters - allRegimesQuarters);
      const extraQuarters = Math.max(0, allRegimesQuarters - requiredQuarters);
      
      if (missingQuarters > 0 && age < fullRateAge) {
        // Décote : 1.25% par trimestre (max 20 trimestres)
        const quartersForDecote = Math.min(missingQuarters, 20);
        decote = quartersForDecote * 0.0125;
        basePension = basePension * (1 - decote);
      } else if (extraQuarters > 0 && age >= legalAge) {
        // Surcote : 1.25% par trimestre
        surcote = extraQuarters * 0.0125;
        basePension = basePension * (1 + surcote);
      }
    }
    
    return {
      lastSalary,
      liquidableQuarters,
      allRegimesQuarters,
      requiredQuarters,
      decote: decote * 100,
      surcote: surcote * 100,
      annual: basePension,
      monthly: basePension / 12
    };
  };

  // Calcul RAFP
  const calculateRAFP = () => {
    if (formData.knowsRAFP) {
      return {
        monthly: formData.rafpAmount,
        annual: formData.rafpAmount * 12
      };
    }
    return {
      monthly: 0,
      annual: 0
    };
  };

  // Calcul des scénarios
  const calculateScenarios = () => {
    const scenarios = [];
    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - parseInt(formData.birthYear);
    
    if (branch === 'private') {
      const baseQuarters = calculatePrivateQuarters();
      
      formData.retirementAges.forEach(age => {
        const yearsUntilRetirement = Math.max(0, age - currentAge);
        const additionalQuarters = yearsUntilRetirement * 4;
        const totalQuarters = Math.min(baseQuarters.total + additionalQuarters, 172);
        
        const basePension = calculatePrivateBasePension(age, totalQuarters);
        const complementary = calculateAgircArrco();
        const totalMonthly = basePension.monthly + complementary.monthly;
        
        const lastSalary = formData.detailedSalaries[formData.detailedSalaries.length - 1]?.salary || 
                           formData.salaryPeriods[formData.salaryPeriods.length - 1]?.averageSalary || 0;
        const replacementRate = lastSalary > 0 ? (totalMonthly * 12 / lastSalary) * 100 : 0;
        
        scenarios.push({
          age,
          yearsUntil: yearsUntilRetirement,
          totalQuarters,
          basePension: basePension.monthly,
          complementary: complementary.monthly,
          totalMonthly: Math.round(totalMonthly),
          replacementRate: Math.round(replacementRate),
          details: {
            sam: basePension.sam,
            rate: basePension.rate,
            decote: basePension.decote,
            surcote: basePension.surcote
          }
        });
      });
    } else if (branch === 'public') {
      const baseQuarters = calculatePublicQuarters();
      
      formData.retirementAges.forEach(age => {
        const yearsUntilRetirement = Math.max(0, age - currentAge);
        const additionalServiceQuarters = yearsUntilRetirement * 4;
        
        const updatedQuarters = {
          ...baseQuarters,
          service: baseQuarters.service + additionalServiceQuarters,
          liquidable: baseQuarters.liquidable + additionalServiceQuarters,
          totalAllRegimes: baseQuarters.totalAllRegimes + additionalServiceQuarters
        };
        
        const publicPension = calculatePublicPension(age, updatedQuarters);
        const rafp = calculateRAFP();
        const totalMonthly = publicPension.monthly + rafp.monthly;
        
        const lastSalary = parseFloat(formData.lastIndexedSalary) * 12 || 0;
        const replacementRate = lastSalary > 0 ? (totalMonthly * 12 / lastSalary) * 100 : 0;
        
        scenarios.push({
          age,
          yearsUntil: yearsUntilRetirement,
          liquidableQuarters: updatedQuarters.liquidable,
          totalQuarters: updatedQuarters.totalAllRegimes,
          publicPension: publicPension.monthly,
          rafp: rafp.monthly,
          totalMonthly: Math.round(totalMonthly),
          replacementRate: Math.round(replacementRate),
          details: {
            lastSalary: publicPension.lastSalary,
            decote: publicPension.decote,
            surcote: publicPension.surcote
          }
        });
      });
    }
    
    return scenarios;
  };

  const handleCalculate = () => {
    const scenarios = calculateScenarios();
    setResults({
      branch,
      scenarios,
      currentAge: new Date().getFullYear() - parseInt(formData.birthYear)
    });
    
    if (branch === 'private') {
      setCurrentStep(7); // Écran résultats privé
    } else {
      setCurrentStep(7); // Écran résultats public
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Automatiquement en mode Salarié du Privé
      setBranch('private');
      setCurrentStep(2);
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      handleCalculate();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Écran 1 : Profil et choix statut
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre profil</h2>
        <p className="text-gray-600">Étape 1</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Année de naissance
          </label>
          <input
            type="number"
            placeholder="1985"
            min="1950"
            max="2005"
            value={formData.birthYear}
            onChange={(e) => handleInputChange('birthYear', e.target.value)}
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
            Début de carrière
          </label>
          <input
            type="number"
            placeholder="2005"
            min="1980"
            max={new Date().getFullYear()}
            value={formData.careerStartYear}
            onChange={(e) => handleInputChange('careerStartYear', e.target.value)}
            className="input-elysion"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hadUnemployment"
            checked={formData.hadUnemployment}
            onChange={(e) => handleInputChange('hadUnemployment', e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="hadUnemployment" className="text-sm font-medium text-gray-700">
            J'ai eu des périodes de chômage
          </label>
        </div>

        {formData.hadUnemployment && (
          <div className="ml-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée totale (en mois)
            </label>
            <input
              type="number"
              min="0"
              value={formData.unemploymentMonths}
              onChange={(e) => handleInputChange('unemploymentMonths', parseInt(e.target.value) || 0)}
              className="input-elysion"
              placeholder="12"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hadParentalLeave"
            checked={formData.hadParentalLeave}
            onChange={(e) => handleInputChange('hadParentalLeave', e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="hadParentalLeave" className="text-sm font-medium text-gray-700">
            J'ai eu des congés parentaux
          </label>
        </div>

        {formData.hadParentalLeave && (
          <div className="ml-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée totale (en mois)
            </label>
            <input
              type="number"
              min="0"
              value={formData.parentalLeaveMonths}
              onChange={(e) => handleInputChange('parentalLeaveMonths', parseInt(e.target.value) || 0)}
              className="input-elysion"
              placeholder="6"
            />
          </div>
        )}
      </div>
    </div>
  );

  // BRANCHE PRIVÉ - Écran 2 : Salaires
  const renderPrivateStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Vos salaires</h2>
        <p className="text-gray-600">Salarié - Étape 2/6</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Mode de saisie
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('salaryMode', 'simple')}
            className={`p-4 rounded-lg border-2 text-left ${
              formData.salaryMode === 'simple'
                ? 'border-elysion-primary bg-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="font-semibold">📊 Simplifié</div>
            <p className="text-xs text-gray-600">Salaire moyen par période</p>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('salaryMode', 'detailed')}
            className={`p-4 rounded-lg border-2 text-left ${
              formData.salaryMode === 'detailed'
                ? 'border-elysion-primary bg-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="font-semibold">📋 Détaillé</div>
            <p className="text-xs text-gray-600">Année par année (25 dernières)</p>
          </button>
        </div>
      </div>

      {formData.salaryMode === 'simple' ? (
        <div className="space-y-4">
          <button
            onClick={() => {
              handleArrayAdd('salaryPeriods', {
                startYear: 2000,
                endYear: 2010,
                averageSalary: ''
              });
            }}
            className="btn-primary"
          >
            + Ajouter une période
          </button>

          {formData.salaryPeriods.map((period, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Période {index + 1}</h4>
                <button
                  onClick={() => {
                    const newPeriods = formData.salaryPeriods.filter((_, i) => i !== index);
                    handleInputChange('salaryPeriods', newPeriods);
                  }}
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
                    type="number"
                    value={period.startYear}
                    onChange={(e) => handleArrayUpdate('salaryPeriods', index, {
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
                    type="number"
                    value={period.endYear}
                    onChange={(e) => handleArrayUpdate('salaryPeriods', index, {
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
                    type="number"
                    value={period.averageSalary}
                    onChange={(e) => handleArrayUpdate('salaryPeriods', index, {
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
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Saisissez vos salaires annuels bruts des 25 dernières années (ou moins si carrière plus courte)
          </p>
          
          <button
            onClick={() => {
              handleArrayAdd('detailedSalaries', {
                year: new Date().getFullYear() - formData.detailedSalaries.length,
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
                  <span className="font-semibold min-w-[60px]">{yearData.year}</span>
                  <input
                    type="number"
                    value={yearData.salary}
                    onChange={(e) => handleArrayUpdate('detailedSalaries', index, {
                      ...yearData,
                      salary: parseFloat(e.target.value) || 0
                    })}
                    className="input-elysion"
                    placeholder="35000 €"
                  />
                  <button
                    onClick={() => {
                      const newSalaries = formData.detailedSalaries.filter((_, i) => i !== index);
                      handleInputChange('detailedSalaries', newSalaries);
                    }}
                    className="text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // BRANCHE PRIVÉ - Écran 3 : Trimestres
  const renderPrivateStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Vos trimestres</h2>
        <p className="text-gray-600">Salarié - Étape 3/6</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Info :</strong> 4 trimestres validés par an en temps plein, 
          environ 2 trimestres en temps partiel (50%).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Années travaillées à temps plein
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.fullTimeYears}
            onChange={(e) => handleInputChange('fullTimeYears', parseInt(e.target.value) || 0)}
            className="input-elysion"
            placeholder="15"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Années travaillées à temps partiel
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.partTimeYears}
            onChange={(e) => handleInputChange('partTimeYears', parseInt(e.target.value) || 0)}
            className="input-elysion"
            placeholder="5"
          />
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="bg-white p-6 rounded-lg border border-elysion-primary">
        <h3 className="font-semibold text-lg mb-4">Récapitulatif des trimestres</h3>
        {(() => {
          const quarters = calculatePrivateQuarters();
          return (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trimestres travaillés :</span>
                <span className="font-semibold">{quarters.worked}</span>
              </div>
              {formData.hadUnemployment && (
                <div className="flex justify-between">
                  <span>Trimestres chômage :</span>
                  <span className="font-semibold">{quarters.unemployment}</span>
                </div>
              )}
              {formData.hadParentalLeave && (
                <div className="flex justify-between">
                  <span>Trimestres congé parental :</span>
                  <span className="font-semibold">{quarters.parental}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold">Total :</span>
                <span className="font-bold text-lg text-elysion-primary">{quarters.total}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  // BRANCHE PRIVÉ - Écran 4 : Retraite de base (automatique, juste affichage)
  // BRANCHE PRIVÉ - Écran 5 : Agirc-Arrco
  const renderPrivateStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Retraite complémentaire</h2>
        <p className="text-gray-600">Salarié - Étape 5/6</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Info :</strong> La retraite complémentaire Agirc-Arrco s'ajoute à votre retraite de base.
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={formData.knowsPoints}
            onChange={(e) => handleInputChange('knowsPoints', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-semibold text-gray-900">
            Je connais mon nombre de points Agirc-Arrco
          </span>
        </label>

        {formData.knowsPoints ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de points Agirc-Arrco
            </label>
            <input
              type="number"
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
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Mode estimation :</strong> Nous estimerons votre retraite complémentaire 
              à environ 25-30% de votre retraite de base (approximation courante).
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // BRANCHE PRIVÉ - Écran 6 : Scénarios d'âge
  const renderPrivateStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Scénarios de départ</h2>
        <p className="text-gray-600">Salarié - Étape 6/6</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Conseil :</strong> Testez différents âges de départ pour comparer vos pensions estimées.
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
                className="w-4 h-4"
                disabled={!formData.retirementAges.includes(age) && formData.retirementAges.length >= 3}
              />
              <span className="text-sm font-medium">{age} ans</span>
            </label>
          ))}
        </div>

        {formData.retirementAges.length === 0 && (
          <p className="text-xs text-red-600 mt-2">Sélectionnez au moins un âge</p>
        )}
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

  // BRANCHE PUBLIC - Écrans similaires mais adaptés
  // Écran 2 : Carrière fonction publique
  const renderPublicStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Votre carrière</h2>
        <p className="text-gray-600">Fonctionnaire - Étape 2/6</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Type de fonction publique
        </label>
        <select
          value={formData.publicServiceType}
          onChange={(e) => handleInputChange('publicServiceType', e.target.value)}
          className="input-elysion"
        >
          <option value="">Sélectionner</option>
          <option value="state">État (SRE)</option>
          <option value="territorial">Territoriale (CNRACL)</option>
          <option value="hospital">Hospitalière (CNRACL)</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Année de titularisation
          </label>
          <input
            type="number"
            min="1980"
            max={new Date().getFullYear()}
            value={formData.permanentSinceYear}
            onChange={(e) => handleInputChange('permanentSinceYear', e.target.value)}
            className="input-elysion"
            placeholder="2005"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Temps de travail
          </label>
          <select
            value={formData.fullTime ? 'full' : 'part'}
            onChange={(e) => handleInputChange('fullTime', e.target.value === 'full')}
            className="input-elysion"
          >
            <option value="full">Temps plein</option>
            <option value="part">Temps partiel</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dernier traitement indiciaire brut mensuel (€)
        </label>
        <input
          type="number"
          min="0"
          value={formData.lastIndexedSalary}
          onChange={(e) => handleInputChange('lastIndexedSalary', e.target.value)}
          className="input-elysion"
          placeholder="3500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Traitement hors primes (seul le traitement indiciaire compte pour la retraite)
        </p>
      </div>
    </div>
  );

  // Écran 3 : Trimestres fonction publique
  const renderPublicStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Vos trimestres</h2>
        <p className="text-gray-600">Fonctionnaire - Étape 3/6</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Années de service effectif comme fonctionnaire
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={formData.publicServiceYears}
          onChange={(e) => handleInputChange('publicServiceYears', parseInt(e.target.value) || 0)}
          className="input-elysion"
          placeholder="20"
        />
        <p className="text-xs text-gray-500 mt-1">
          Années en tant que titulaire uniquement
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Trimestres de bonification (enfants, services actifs, etc.)
        </label>
        <input
          type="number"
          min="0"
          max="40"
          value={formData.bonusQuarters}
          onChange={(e) => handleInputChange('bonusQuarters', parseInt(e.target.value) || 0)}
          className="input-elysion"
          placeholder="8"
        />
        <p className="text-xs text-gray-500 mt-1">
          Exemple : 4 trimestres par enfant
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Trimestres dans d'autres régimes (privé avant/après)
        </label>
        <input
          type="number"
          min="0"
          max="172"
          value={formData.otherRegimeQuarters}
          onChange={(e) => handleInputChange('otherRegimeQuarters', parseInt(e.target.value) || 0)}
          className="input-elysion"
          placeholder="20"
        />
      </div>

      {/* Récapitulatif */}
      <div className="bg-white p-6 rounded-lg border border-elysion-primary">
        <h3 className="font-semibold text-lg mb-4">Récapitulatif des trimestres</h3>
        {(() => {
          const quarters = calculatePublicQuarters();
          return (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Services effectifs :</span>
                <span className="font-semibold">{quarters.service}</span>
              </div>
              <div className="flex justify-between">
                <span>Bonifications :</span>
                <span className="font-semibold">{quarters.bonus}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-semibold">Trimestres liquidables :</span>
                <span className="font-semibold text-elysion-primary">{quarters.liquidable}</span>
              </div>
              <div className="flex justify-between">
                <span>Autres régimes :</span>
                <span className="font-semibold">{quarters.other}</span>
              </div>
              {formData.hadUnemployment && (
                <div className="flex justify-between">
                  <span>Chômage :</span>
                  <span className="font-semibold">{quarters.unemployment}</span>
                </div>
              )}
              {formData.hadParentalLeave && (
                <div className="flex justify-between">
                  <span>Congé parental :</span>
                  <span className="font-semibold">{quarters.parental}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-bold">Total tous régimes :</span>
                <span className="font-bold text-lg text-elysion-primary">{quarters.totalAllRegimes}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  // Écran 5 : RAFP
  const renderPublicStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-elysion-primary mb-2">Retraite additionnelle</h2>
        <p className="text-gray-600">Fonctionnaire - Étape 5/6</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Info :</strong> Le RAFP (Retraite Additionnelle de la Fonction Publique) 
          s'ajoute à votre pension principale.
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={formData.knowsRAFP}
            onChange={(e) => handleInputChange('knowsRAFP', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="font-semibold text-gray-900">
            Je connais le montant estimé de mon RAFP
          </span>
        </label>

        {formData.knowsRAFP ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Montant mensuel estimé du RAFP (€)
            </label>
            <input
              type="number"
              min="0"
              value={formData.rafpAmount}
              onChange={(e) => handleInputChange('rafpAmount', parseFloat(e.target.value) || 0)}
              className="input-elysion"
              placeholder="150"
            />
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Non renseigné :</strong> Le RAFP ne sera pas inclus dans le calcul. 
              Vous pouvez obtenir une estimation sur votre espace personnel sur ensap.gouv.fr
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Écran 6 : Scénarios (identique au privé)
  const renderPublicStep6 = () => renderPrivateStep6(); // Même interface

  // Écran 7 : Résultats
  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-elysion-primary mb-2">
            Vos estimations de retraite
          </h2>
          <p className="text-gray-600">
            Salarié
          </p>
        </div>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-elysion-primary-50">
              <tr>
                <th className="p-4 text-left font-semibold">Âge de départ</th>
                <th className="p-4 text-right font-semibold">Dans X ans</th>
                <th className="p-4 text-right font-semibold">Pension mensuelle</th>
                <th className="p-4 text-right font-semibold">Taux de remplacement</th>
              </tr>
            </thead>
            <tbody>
              {results.scenarios.map((scenario, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4">
                    <span className="text-lg font-bold text-elysion-primary">{scenario.age} ans</span>
                  </td>
                  <td className="p-4 text-right text-gray-600">
                    {scenario.yearsUntil > 0 ? `${scenario.yearsUntil} ans` : 'Maintenant'}
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-xl font-bold text-elysion-accent">
                      €{scenario.totalMonthly.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-lg font-semibold">
                      {scenario.replacementRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Détails par scénario */}
        <div className="space-y-4">
          {results.scenarios.map((scenario, index) => (
            <details key={index} className="bg-white rounded-lg border border-gray-200">
              <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                📋 Détails pour un départ à {scenario.age} ans
              </summary>
              <div className="p-4 border-t border-gray-200">
                {branch === 'private' ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Retraite de base :</span>
                      <span className="font-semibold">€{Math.round(scenario.basePension).toLocaleString()}/mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complémentaire Agirc-Arrco :</span>
                      <span className="font-semibold">€{Math.round(scenario.complementary).toLocaleString()}/mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trimestres totaux :</span>
                      <span className="font-semibold">{scenario.totalQuarters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux appliqué :</span>
                      <span className="font-semibold">{scenario.details.rate.toFixed(2)}%</span>
                    </div>
                    {scenario.details.decote > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Décote :</span>
                        <span className="font-semibold">-{scenario.details.decote.toFixed(2)}%</span>
                      </div>
                    )}
                    {scenario.details.surcote > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Surcote :</span>
                        <span className="font-semibold">+{scenario.details.surcote.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Pension fonction publique :</span>
                      <span className="font-semibold">€{Math.round(scenario.publicPension).toLocaleString()}/mois</span>
                    </div>
                    {scenario.rafp > 0 && (
                      <div className="flex justify-between">
                        <span>RAFP :</span>
                        <span className="font-semibold">€{Math.round(scenario.rafp).toLocaleString()}/mois</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Trimestres liquidables :</span>
                      <span className="font-semibold">{scenario.liquidableQuarters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trimestres tous régimes :</span>
                      <span className="font-semibold">{scenario.totalQuarters}</span>
                    </div>
                    {scenario.details.decote > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Décote :</span>
                        <span className="font-semibold">-{scenario.details.decote.toFixed(2)}%</span>
                      </div>
                    )}
                    {scenario.details.surcote > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Surcote :</span>
                        <span className="font-semibold">+{scenario.details.surcote.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Messages clés */}
        <div className="bg-gradient-to-r from-elysion-primary to-elysion-accent text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">💡 Points clés</h3>
          <ul className="space-y-2 text-sm">
            {results.scenarios.map((scenario, index) => (
              <li key={index}>
                • À <strong>{scenario.age} ans</strong>, estimation de <strong>€{scenario.totalMonthly.toLocaleString()}/mois</strong>, 
                soit <strong>{scenario.replacementRate}%</strong> de votre revenu actuel
              </li>
            ))}
            {results.scenarios.length > 1 && (
              <li className="mt-4 pt-4 border-t border-white/30">
                • Travailler jusqu'à <strong>{results.scenarios[results.scenarios.length - 1].age} ans</strong> au lieu de{' '}
                <strong>{results.scenarios[0].age} ans</strong> vous ferait gagner environ{' '}
                <strong>
                  {Math.round(((results.scenarios[results.scenarios.length - 1].totalMonthly - results.scenarios[0].totalMonthly) / results.scenarios[0].totalMonthly) * 100)}%
                </strong> de pension
              </li>
            )}
          </ul>
        </div>

        {/* Avertissement */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Avertissement :</strong> Ces estimations sont basées sur la législation 2024 et vos données actuelles. 
            Pour un calcul exact et personnalisé, consultez votre caisse de retraite ou utilisez le simulateur officiel Info-Retraite.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-elysion-primary to-elysion-secondary text-white p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">
            Créez votre compte pour sauvegarder cette simulation
          </h3>
          <p className="mb-6">
            Accédez à des recommandations personnalisées et suivez l'évolution de votre retraite.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/onboarding', { 
                state: { 
                  professionalStatus: branch === 'private' ? 'employee' : 'civil_servant',
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
          {currentStep <= 6 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4, 5, 6].map((step) => (
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
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          {currentStep === 1 && renderStep1()}
          {branch === 'private' && currentStep === 2 && renderPrivateStep2()}
          {branch === 'private' && currentStep === 3 && renderPrivateStep3()}
          {branch === 'private' && currentStep === 4 && <div className="text-center py-8 text-gray-600">Calcul automatique de la retraite de base...</div>}
          {branch === 'private' && currentStep === 5 && renderPrivateStep5()}
          {branch === 'private' && currentStep === 6 && renderPrivateStep6()}
          
          {currentStep === 7 && renderResults()}

          {/* Navigation buttons */}
          {currentStep <= 6 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-outline disabled:opacity-50"
              >
                ← Retour
              </button>
              <button
                onClick={nextStep}
                className="btn-primary disabled:opacity-50"
              >
                {currentStep === 6 ? 'Calculer ma retraite' : 'Suivant →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSimulator;
