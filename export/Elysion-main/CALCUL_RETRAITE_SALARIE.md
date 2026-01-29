# Calcul de Retraite pour Salariés - Documentation Technique

## Vue d'ensemble

Le simulateur Elysion implémente un calcul détaillé de retraite spécifiquement adapté aux **salariés du secteur privé** affiliés au régime général de la Sécurité sociale et à la retraite complémentaire Agirc-Arrco.

---

## 1. Validation des Trimestres

### Principe
Un salarié valide des trimestres en fonction de son salaire soumis à cotisations.

### Règle générale
```javascript
// En 2024 : 1 trimestre validé = 150 heures au SMIC
// Soit environ 1 747€ brut pour valider 1 trimestre
// Maximum : 4 trimestres par an

// Temps plein : 4 trimestres/an automatiquement
// Temps partiel : au prorata du temps travaillé
```

### Trimestres assimilés
```javascript
// Périodes comptabilisées sans cotisation :
- Chômage indemnisé : 1 trimestre par période de 50 jours
- Congé parental : maximum 12 trimestres (3 ans)
- Maladie longue durée : 1 trimestre par 60 jours d'indemnisation
- Service militaire : 4 trimestres par an
```

### Calcul automatique avec conversion jours/mois
```javascript
// Fonction de conversion
const convertToMonths = (duration, unit) => {
  if (unit === 'days') {
    return duration / 30; // 30 jours = 1 mois
  }
  return duration;
};

const calculatePrivateQuarters = () => {
  // Trimestres travaillés
  let workedQuarters = (fullTimeYears * 4) + (partTimeYears * 2);
  
  // Conversion des durées saisies (jours ou mois) en mois
  const unemploymentMonths = convertToMonths(unemploymentDuration, unemploymentUnit);
  const parentalMonths = convertToMonths(parentalLeaveDuration, parentalLeaveUnit);
  const sickLeaveMonths = convertToMonths(sickLeaveDuration, sickLeaveUnit);
  
  // Trimestres chômage (1 trimestre par 50 jours ≈ 1.67 mois)
  const unemploymentQuarters = Math.floor(unemploymentMonths / 1.67);
  
  // Trimestres congé parental (max 12 trimestres)
  const parentalQuarters = Math.min(Math.floor(parentalMonths / 3), 12);
  
  // Trimestres maladie (1 trimestre par 60 jours ≈ 2 mois)
  const sickLeaveQuarters = Math.floor(sickLeaveMonths / 2);
  
  // Majorations pour enfants (femmes uniquement)
  // 8 trimestres par enfant : 4 (maternité) + 4 (éducation)
  let childrenQuarters = 0;
  if (gender === 'F' && children > 0) {
    childrenQuarters = children * 8;
  }
  
  return {
    worked: workedQuarters,
    unemployment: unemploymentQuarters,
    parental: parentalQuarters,
    sickLeave: sickLeaveQuarters,
    children: childrenQuarters,
    total: Math.min(worked + unemployment + parental + sickLeave + children, 172)
  };
};
```

### Durée d'assurance requise
| Année de naissance | Trimestres requis |
|-------------------|-------------------|
| Avant 1961        | 166 trimestres    |
| 1961-1972         | 168 trimestres    |
| À partir de 1973  | 172 trimestres    |

---

## 2. Calcul de la Retraite de Base (Régime Général)

### Formule générale
```
Pension de base = SAM × Taux × (Trimestres validés / Trimestres requis)
```

### Détails du calcul

#### 2.1 SAM (Salaire Annuel Moyen)
Moyenne des **25 meilleures années** de salaires bruts, revalorisés selon les coefficients officiels.

```javascript
const calculateSAM = (salaryPeriods) => {
  // Collecter tous les salaires annuels
  let allSalaries = [];
  salaryPeriods.forEach(period => {
    const years = period.endYear - period.startYear;
    for (let i = 0; i < years; i++) {
      allSalaries.push(period.averageSalary);
    }
  });
  
  // Trier par ordre décroissant et prendre les 25 meilleurs
  allSalaries.sort((a, b) => b - a);
  const best25 = allSalaries.slice(0, 25);
  
  // Calculer la moyenne
  return best25.reduce((sum, s) => sum + s, 0) / best25.length;
};
```

#### 2.2 Taux de pension
- **Taux plein** : 50% (0.50)
- **Âge légal de départ** : 62 ans (64 ans après réforme 2023)
- **Âge taux plein automatique** : 67 ans

#### 2.3 Décote et Surcote

**Décote** (si trimestres manquants avant 67 ans) :
```javascript
Décote = 1.25% par trimestre manquant
Maximum = 20 trimestres (soit 25% de réduction)
Taux avec décote = 50% × (1 - décote)

Exemple : 10 trimestres manquants
Décote = 10 × 0.0125 = 0.125 (12.5%)
Taux appliqué = 50% × (1 - 0.125) = 43.75%
```

**Surcote** (si trimestres excédentaires après l'âge légal et taux plein) :
```javascript
Surcote = 1.25% par trimestre supplémentaire
Pas de maximum
Taux avec surcote = 50% × (1 + surcote)

Exemple : 8 trimestres supplémentaires
Surcote = 8 × 0.0125 = 0.10 (10%)
Taux appliqué = 50% × (1 + 0.10) = 55%
```

#### 2.4 Calcul final
```javascript
const calculateBasePension = (age, totalQuarters) => {
  const sam = calculateSAM();
  const requiredQuarters = birthYear >= 1973 ? 172 : 168;
  
  let rate = 0.50;
  let decote = 0;
  let surcote = 0;
  
  const missingQuarters = Math.max(0, requiredQuarters - totalQuarters);
  const extraQuarters = Math.max(0, totalQuarters - requiredQuarters);
  
  if (missingQuarters > 0 && age < 67) {
    decote = Math.min(missingQuarters * 0.0125, 0.25);
    rate = 0.50 * (1 - decote);
  } else if (extraQuarters > 0 && age >= 62) {
    surcote = extraQuarters * 0.0125;
    rate = 0.50 * (1 + surcote);
  }
  
  const annual = sam * rate * (totalQuarters / requiredQuarters);
  return {
    sam,
    rate: rate * 100,
    decote: decote * 100,
    surcote: surcote * 100,
    annual,
    monthly: annual / 12
  };
};
```

---

## 3. Calcul de la Retraite Complémentaire (Agirc-Arrco)

### Principe
La retraite complémentaire Agirc-Arrco fonctionne par **points** acquis tout au long de la carrière.

### Acquisition de points

#### Cotisations
```javascript
// Tranche 1 : jusqu'au plafond Sécurité sociale (46 368€ en 2024)
// Taux de cotisation : 7.87% (dont 60% à charge employeur)

// Tranche 2 : de 1 à 8 plafonds SS
// Taux de cotisation : 21.59%
```

#### Prix d'achat du point (2024)
```javascript
Prix d'achat = 19,6321€
```

### Valeur du point (2024)
```javascript
Valeur du point Agirc-Arrco = 1,4386€
```

### Calcul de la pension complémentaire
```javascript
const calculateAgircArrco = () => {
  const pointValue = 1.4386;
  
  if (knowsPoints) {
    const annual = agircArrcoPoints * pointValue;
    return {
      points: agircArrcoPoints,
      pointValue,
      annual,
      monthly: annual / 12
    };
  }
  
  // Mode estimation (environ 10% du dernier salaire)
  return {
    points: 'Estimation',
    pointValue,
    annual: lastSalary * 0.10,
    monthly: lastSalary * 0.10 / 12
  };
};
```

### Exemple avec points connus
```
Points Agirc-Arrco : 8 500 points
Valeur du point : 1,4386€

Pension complémentaire annuelle = 8 500 × 1,4386 = 12 228€
Pension complémentaire mensuelle = 12 228 / 12 = 1 019€
```

---

## 4. Périodes Assimilées - Règles de conversion

### Saisie flexible (jours ou mois)
L'utilisateur peut saisir les durées en **jours** ou en **mois**. Le simulateur convertit automatiquement.

### Chômage indemnisé
```javascript
// Règle : 1 trimestre par période de 50 jours
// Conversion : 50 jours ≈ 1.67 mois

const unemploymentMonths = convertToMonths(duration, unit);
const unemploymentQuarters = Math.floor(unemploymentMonths / 1.67);

// Exemples :
// 100 jours → 100/30 = 3.33 mois → 3.33/1.67 = 2 trimestres
// 6 mois → 6/1.67 = 3 trimestres
```

### Congé parental
```javascript
// Règle : 1 trimestre par 3 mois, maximum 12 trimestres (3 ans)

const parentalMonths = convertToMonths(duration, unit);
const parentalQuarters = Math.min(Math.floor(parentalMonths / 3), 12);

// Exemples :
// 180 jours → 6 mois → 2 trimestres
// 24 mois → 8 trimestres
// 48 mois → 12 trimestres (plafonné)
```

### Arrêt maladie longue durée
```javascript
// Règle : 1 trimestre par période de 60 jours d'indemnisation
// Conversion : 60 jours ≈ 2 mois

const sickLeaveMonths = convertToMonths(duration, unit);
const sickLeaveQuarters = Math.floor(sickLeaveMonths / 2);

// Exemples :
// 120 jours → 4 mois → 2 trimestres
// 6 mois → 3 trimestres
```

### Majoration pour enfants (femmes)
```javascript
// Règle : 8 trimestres par enfant
// - 4 trimestres pour maternité/adoption
// - 4 trimestres pour éducation

if (gender === 'F' && children > 0) {
  childrenQuarters = children * 8;
}

// Exemples :
// 1 enfant → +8 trimestres
// 2 enfants → +16 trimestres
// 3 enfants → +24 trimestres
```

---

## 5. Calcul Total

### Formule finale
```javascript
Pension totale mensuelle = Pension de base + Pension complémentaire Agirc-Arrco
```

### Taux de remplacement
```javascript
Taux de remplacement = (Pension annuelle totale / Dernier salaire annuel) × 100
```

### Exemple complet

**Profil salariée :**
- Âge : 45 ans, Femme, 2 enfants
- Début carrière : 2003 (22 ans de carrière)
- Dernier salaire brut : 48 000€/an
- Points Agirc-Arrco : 6 200 points
- Congé parental : 18 mois
- Chômage : 100 jours

**Calcul des trimestres :**
1. Travaillés : 22 × 4 = 88 trimestres
2. Congé parental : 18 mois / 3 = 6 trimestres
3. Chômage : 100 jours ≈ 3.33 mois / 1.67 = 2 trimestres
4. Majoration enfants : 2 × 8 = 16 trimestres
5. **Total : 112 trimestres**

**Calcul à 62 ans (+17 ans) :**
- Trimestres totaux : 112 + (17 × 4) = 180 trimestres (plafonné à 172)
- Pas de décote (172 trimestres atteints)

---

## 6. Limites et Avertissements

### Hypothèses simplificatrices
- Salaire constant ou moyenne par période
- Carri��re complète dans le privé
- Coefficients de revalorisation non appliqués

### Non pris en compte
- Majorations familiales (+10% si 3 enfants ou plus)
- Minimum contributif
- Pension de réversion
- Cumul emploi-retraite
- Rachats de trimestres
- Carrière longue (départ anticipé)

### Précision
Les résultats sont des **estimations**. Pour un calcul exact :
- Consulter son relevé de carrière sur info-retraite.fr
- Vérifier ses points Agirc-Arrco sur agirc-arrco.fr

---

## 7. Implémentation Technique

### Fichier : `/app/frontend/src/components/EmployeeSimulator.js`

**Fonctions principales :**
```javascript
convertToMonths(duration, unit)
  → Convertit jours en mois si nécessaire

calculatePrivateQuarters()
  → Retourne les trimestres par catégorie

calculateSAM(salaryPeriods)
  → Calcule le Salaire Annuel Moyen (25 meilleures années)

calculatePrivateBasePension(age, totalQuarters)
  → Calcule la pension de base avec décote/surcote

calculateAgircArrco()
  → Calcule la pension complémentaire

calculateScenarios()
  → Génère les projections pour 62, 64, 67 ans
```

---

## 8. Sources et Références

- **L'Assurance Retraite** : https://www.lassuranceretraite.fr
- **Agirc-Arrco** : https://www.agirc-arrco.fr
- **Info Retraite** : https://www.info-retraite.fr

---

**Document Version** : 1.1  
**Date** : Janvier 2025  
**Valeur du point Agirc-Arrco** : 1,4386€

---

## 8. Module Épargne & Besoin (NOUVEAU)

### Objectif
Déterminer si l'utilisateur aura besoin d'une épargne complémentaire pour maintenir son niveau de vie à la retraite.

### Étape 5 : Épargne & Besoin

#### Données collectées
```javascript
currentMonthlyIncome: 0,      // Revenu mensuel net actuel
targetIncomeMode: 'percentage', // 'percentage' ou 'amount'
targetIncomePercentage: 70,    // % du revenu actuel souhaité
targetIncomeAmount: 0,         // Montant fixe en euros
currentSavings: 0,             // Capital déjà épargné
wantsEpargneCalculation: true  // Calcul souhaité ou non
```

#### Calcul du taux de remplacement
```javascript
const replacementRate = (pensionEstimée / revenuActuel) * 100;
// < 50% : Niveau faible - épargne conseillée
// 50-70% : Niveau modéré - épargne recommandée
// >= 70% : Bon niveau de remplacement
```

---

## 9. Profils de Risque (NOUVEAU)

### Questionnaire de Profilage

#### Question 1 : Horizon de placement
```javascript
'short'  : < 10 ans  → Score +1
'medium' : 10-20 ans → Score +2
'long'   : > 20 ans  → Score +3
```

#### Question 2 : Tolérance aux pertes
```javascript
'5%'  : Très prudent       → Score +1
'10%' : Modéré             → Score +2
'20%' : Tolérant au risque → Score +3
```

#### Question 3 : Connaissance des marchés
```javascript
'beginner'     : Débutant      → Score +1
'intermediate' : Intermédiaire → Score +2
'advanced'     : Avancé        → Score +3
```

### Classification automatique
```javascript
const calculateRiskProfile = () => {
  let score = horizonScore + toleranceScore + knowledgeScore;
  
  if (score <= 4) return 'prudent';
  if (score <= 7) return 'equilibre';
  return 'dynamique';
};
```

### Paramètres par profil
```javascript
const RISK_PROFILES = {
  prudent: {
    name: 'Prudent',
    annualReturn: 0.015,  // 1.5% réel
    recommendation: 'Fonds euros, livrets réglementés, obligations'
  },
  equilibre: {
    name: 'Équilibré',
    annualReturn: 0.04,   // 4% réel
    recommendation: 'Mix fonds euros/UC, PER équilibré, assurance-vie diversifiée'
  },
  dynamique: {
    name: 'Dynamique',
    annualReturn: 0.07,   // 7% réel
    recommendation: 'Actions, ETF, PER dynamique, PEA'
  }
};
```

---

## 10. Calcul de l'Effort d'Épargne (NOUVEAU)

### Formule de calcul
```javascript
const calculateRequiredSavings = (targetIncome, currentPension, yearsUntilRetirement, profile) => {
  // Écart mensuel à combler
  const monthlyGap = targetIncome - currentPension;
  if (monthlyGap <= 0) return { monthlyContribution: 0, message: 'Pension suffisante' };
  
  // Durée de consommation estimée (25 ans)
  const retirementDuration = 25;
  const annualReturn = RISK_PROFILES[profile].annualReturn;
  const monthlyReturn = annualReturn / 12;
  
  // Capital nécessaire pour générer le revenu complémentaire
  const requiredCapital = monthlyGap * 12 * retirementDuration * 0.85; // 0.85 = ajustement inflation
  
  // Capital déjà épargné avec projection des rendements
  const currentSavingsProjected = currentSavings * Math.pow(1 + annualReturn, yearsUntilRetirement);
  
  // Capital restant à constituer
  const capitalToAccumulate = Math.max(0, requiredCapital - currentSavingsProjected);
  
  // Versement mensuel nécessaire (formule d'annuité)
  const n = yearsUntilRetirement * 12;
  const monthlyContribution = capitalToAccumulate * monthlyReturn / (Math.pow(1 + monthlyReturn, n) - 1);
  
  return {
    monthlyGap,
    requiredCapital,
    currentSavingsProjected,
    capitalToAccumulate,
    monthlyContribution,
    annualReturn: annualReturn * 100
  };
};
```

### Résultat affiché
Pour chaque scénario d'âge de départ :
- Pension obligatoire estimée (base + complémentaire)
- Revenu cible souhaité
- Écart mensuel à combler
- Capital nécessaire
- Versement mensuel indicatif par profil (Prudent / Équilibré / Dynamique)

### Avertissement légal
> ⚠️ Ces estimations sont indicatives et basées sur des hypothèses de rendement non garanties. 
> Les performances passées ne préjugent pas des performances futures. 
> Consultez un conseiller financier pour une stratégie personnalisée.

---

## 11. Synthèse du Tunnel (NOUVEAU)

### Parcours utilisateur en 7 étapes
1. **Profil & carrière** - Données personnelles et professionnelles
2. **Salaires** - Historique des revenus
3. **Trimestres & enfants** - Validation des trimestres + bonus enfants
4. **Complémentaire** - Points Agirc-Arrco
5. **Épargne & Besoin** - Objectif de revenu et capital existant
6. **Profil de risque** - 3 questions pour classification
7. **Scénarios** - Choix des âges de départ

### Résultats finaux
- Tableau comparatif des pensions par âge
- Projections d'épargne par profil de risque
- Recommandations de supports d'investissement
- Points clés et conseils personnalisés

