# Calcul de Retraite pour Freelances - Documentation Technique

## Vue d'ensemble

Le simulateur Elysion implémente un calcul détaillé de retraite spécifiquement adapté aux **freelances, indépendants et micro-entrepreneurs** affiliés au régime SSI (Sécurité Sociale des Indépendants).

---

## 1. Validation des Trimestres

### Principe
Un freelance valide des trimestres en fonction de son revenu professionnel annuel.

### Seuils 2024 (SSI)
```javascript
1 trimestre : 4 020€ de revenu annuel
2 trimestres : 8 040€ de revenu annuel
3 trimestres : 12 060€ de revenu annuel
4 trimestres : 16 080€ de revenu annuel
```

### Calcul automatique
```javascript
const QUARTER_THRESHOLDS = {
  1: 4020,
  2: 8040,
  3: 12060,
  4: 16080
};

const calculateQuarters = (annualRevenue) => {
  if (annualRevenue >= QUARTER_THRESHOLDS[4]) return 4;
  if (annualRevenue >= QUARTER_THRESHOLDS[3]) return 3;
  if (annualRevenue >= QUARTER_THRESHOLDS[2]) return 2;
  if (annualRevenue >= QUARTER_THRESHOLDS[1]) return 1;
  return 0;
};
```

### Durée d'assurance
- **Total trimestres** = Somme des trimestres cotisés sur toute la carrière
- **Trimestres requis** = 172 trimestres (43 ans) pour génération née après 1973
- **Maximum** = 172 trimestres comptabilisés

---

## 2. Trimestres Assimilés - Règles de conversion

### Saisie flexible (jours ou mois)
L'utilisateur peut saisir les durées en **jours** ou en **mois**. Le simulateur convertit automatiquement.

```javascript
// Fonction de conversion
const convertToMonths = (duration, unit) => {
  if (unit === 'days') {
    return duration / 30; // 30 jours = 1 mois
  }
  return duration;
};
```

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

### Arrêt maladie longue durée
```javascript
// Règle : 1 trimestre par période de 60 jours d'indemnisation
// Conversion : 60 jours ≈ 2 mois

const illnessMonths = convertToMonths(duration, unit);
const illnessQuarters = Math.floor(illnessMonths / 2);

// Exemples :
// 120 jours → 4 mois → 2 trimestres
// 6 mois → 3 trimestres
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

### Congé maternité
```javascript
// Règle : 4 trimestres par congé maternité

if (hadMaternity) {
  totalQuarters += maternityCount * 4;
}

// Exemples :
// 1 maternité → +4 trimestres
// 2 maternités → +8 trimestres
```

### Majoration pour enfants (femmes)
```javascript
// Règle : 8 trimestres par enfant
// - 4 trimestres pour maternité/adoption
// - 4 trimestres pour éducation

if (gender === 'F' && children > 0) {
  totalQuarters += children * 8;
}

// Exemples :
// 1 enfant → +8 trimestres
// 2 enfants → +16 trimestres
// 3 enfants → +24 trimestres
```

### Calcul total des trimestres
```javascript
const calculateTotalQuarters = () => {
  let totalQuarters = 0;
  
  // Trimestres cotisés (par année de revenu)
  revenueHistory.forEach(year => {
    const revenue = status === 'micro' 
      ? convertMicroRevenue(year.turnover, year.activityType)
      : year.professionalRevenue;
    totalQuarters += calculateQuarters(revenue);
  });

  // Conversion des durées saisies
  const unemploymentMonths = convertToMonths(unemploymentDuration, unemploymentUnit);
  const illnessMonths = convertToMonths(illnessDuration, illnessUnit);
  const parentalMonths = convertToMonths(parentalLeaveDuration, parentalLeaveUnit);

  // Trimestres assimilés
  if (hadUnemployment) {
    totalQuarters += Math.floor(unemploymentMonths / 1.67);
  }
  if (hadLongIllness) {
    totalQuarters += Math.floor(illnessMonths / 2);
  }
  if (hadParentalLeave) {
    totalQuarters += Math.min(Math.floor(parentalMonths / 3), 12);
  }
  if (hadMaternity) {
    totalQuarters += maternityCount * 4;
  }
  
  // Majorations enfants (femmes)
  if (gender === 'F' && children > 0) {
    totalQuarters += children * 8;
  }

  return Math.min(totalQuarters, 172);
};
```

---

## 3. Calcul de la Retraite de Base (SSI)

### Formule générale
```
Pension de base = Revenu annuel moyen × Taux × (Trimestres validés / Trimestres requis)
```

### Détails du calcul

#### 3.1 Revenu annuel moyen
- Moyenne des **25 meilleures années** de revenus professionnels
- Dans le simulateur (simplifié) : `revenu actuel × 0.9`

#### 3.2 Taux de pension
- **Taux plein** : 50% (0.50)
- **Âge légal** : 62 ans
- **Âge taux plein automatique** : 67 ans

#### 3.3 Décote et Surcote

**Décote** (si trimestres manquants avant 67 ans) :
```javascript
Décote = 1.25% par trimestre manquant
Maximum = 25% de réduction
Taux avec décote = 50% × (1 - décote)

Exemple : 8 trimestres manquants
Décote = 8 × 0.0125 = 0.10 (10%)
Taux appliqué = 50% × (1 - 0.10) = 45%
```

**Surcote** (si trimestres excédentaires après taux plein) :
```javascript
Surcote = 1.25% par trimestre supplémentaire
Pas de maximum
Taux avec surcote = 50% × (1 + surcote)

Exemple : 12 trimestres supplémentaires
Surcote = 12 × 0.0125 = 0.15 (15%)
Taux appliqué = 50% × (1 + 0.15) = 57.5%
```

#### 3.4 Calcul final
```javascript
const basePension = averageRevenue × rate × (totalQuarters / requiredQuarters);
const monthlyBasePension = basePension / 12;
```

---

## 4. Calcul de la Retraite Complémentaire (RCI)

### Principe
La retraite complémentaire des indépendants (RCI) fonctionne par **points**.

### Acquisition de points

#### Cotisations
```javascript
Cotisation annuelle ≈ Revenu professionnel × 7%
```

#### Conversion en points
```javascript
Points acquis par an = Cotisation annuelle / 12€
(En 2024, 1 point coûte environ 12€)
```

### Valeur du point (2024)
```javascript
Valeur du point RCI = 1,4386€
```

### Calcul de la pension complémentaire
```javascript
Pension complémentaire annuelle = Total points × Valeur du point
Pension complémentaire mensuelle = (Total points × 1.4386) / 12

Exemple avec 5 250 points :
Annuelle = 5 250 × 1.4386 = 7 553€
Mensuelle = 7 553 / 12 = 629€
```

---

## 5. Cas Particulier : Micro-Entrepreneur

### Revenu retraite
Le micro-entrepreneur doit appliquer un **abattement forfaitaire** sur son CA :

```javascript
const MICRO_ABATEMENTS = {
  'vente': 0.71,           // 71% pour vente de marchandises
  'service_bic': 0.50,     // 50% pour prestations de services BIC
  'service_bnc': 0.34,     // 34% pour prestations de services BNC
  'liberal': 0.34          // 34% pour professions libérales
};

const convertMicroRevenue = (turnover, activityType) => {
  const abatement = MICRO_ABATEMENTS[activityType] || 0.34;
  return turnover * (1 - abatement);
};

// Exemple :
// CA annuel : 60 000€ (prestations de services BNC)
// Abattement : 34%
// Revenu retraite = 60 000 × (1 - 0.34) = 39 600€
```

---

## 6. Calcul Total

### Formule finale
```javascript
Pension totale mensuelle = Pension de base + Pension complémentaire RCI
```

### Taux de remplacement
```javascript
Taux de remplacement = (Pension annuelle totale / Revenu annuel actuel) × 100
```

### Exemple complet

**Profil freelance :**
- Âge : 40 ans, Femme, 2 enfants
- Début carrière : 2010 (15 ans de carrière)
- Revenu actuel : 50 000€/an
- Chômage : 150 jours
- Congé parental : 12 mois

**Calcul des trimestres :**
1. Cotisés : 15 × 4 = 60 trimestres
2. Chômage : 150 jours ≈ 5 mois / 1.67 = 3 trimestres
3. Congé parental : 12 mois / 3 = 4 trimestres
4. Majoration enfants : 2 × 8 = 16 trimestres
5. **Total : 83 trimestres**

**Calcul à 62 ans (+22 ans) :**
- Trimestres totaux : 83 + (22 × 4) = 171 trimestres
- Taux : ~50% (presque taux plein)

---

## 7. Projections et Scénarios

### Scénarios testés automatiquement
1. **Départ à 62 ans** (âge légal)
2. **Départ à 64 ans** (âge intermédiaire)
3. **Départ à 67 ans** (taux plein automatique)

---

## 8. Limites et Avertissements

### Hypothèses simplificatrices
- Revenu constant ou moyen sur la carrière
- Pas de changement de régime
- Valeurs des points et seuils constants

### Non pris en compte
- Majorations familiales
- Minimum contributif
- Pension de réversion
- Cumul emploi-retraite
- Rachats de trimestres

### Précision
Les résultats sont des **estimations**. Pour un calcul exact :
- Consulter son relevé de carrière
- Contacter sa caisse de retraite
- Utiliser le simulateur officiel Info-Retraite

---

## 9. Implémentation Technique

### Fichier : `/app/frontend/src/components/FreelanceSimulator.js`

**Fonctions principales :**
```javascript
convertToMonths(duration, unit)
  → Convertit jours en mois si nécessaire

calculateQuarters(annualRevenue)
  → Retourne le nombre de trimestres validés

convertMicroRevenue(turnover, activityType)
  → Applique l'abattement micro-entrepreneur

calculateTotalQuarters()
  → Calcule tous les trimestres (cotisés + assimilés + majorations)

calculateBasePension(sam, rate, quarters)
  → Calcule la pension de base SSI

calculateComplementaryPension(points)
  → Calcule la pension complémentaire RCI

calculateScenarios()
  → Génère les scénarios pour différents âges de départ
```

---

## 10. Sources et Références

- **SSI (Sécurité Sociale des Indépendants)** : https://www.secu-independants.fr
- **RCI (Retraite Complémentaire des Indépendants)** : https://www.rci.fr
- **Info Retraite** : https://www.info-retraite.fr

---

**Document Version** : 1.2  
**Date** : Janvier 2025  
**Valeur du point RCI** : 1,4386€

---

## 8. Module Épargne & Besoin TNS (NOUVEAU)

### Spécificités des indépendants
Les régimes TNS (Travailleurs Non Salariés) sont généralement **moins généreux** que ceux des salariés :
- Taux de remplacement moyen : **30 à 50%** (contre 50-70% pour les salariés)
- L'épargne complémentaire est donc **essentielle** pour maintenir le niveau de vie

### Étape 5 : Épargne & Besoin (adapté TNS)

#### Données collectées
```javascript
currentMonthlyIncome: 0,      // Revenu professionnel net moyen (3 dernières années)
targetIncomeMode: 'percentage', // 'percentage' ou 'amount'
targetIncomePercentage: 70,    // % du revenu moyen souhaité
targetIncomeAmount: 0,         // Montant fixe en euros
currentSavings: 0,             // PER, assurance-vie, trésorerie, immobilier
wantsEpargneCalculation: true
```

#### Calcul du taux de remplacement TNS
```javascript
// Seuils adaptés aux TNS (plus bas que salariés)
if (replacementRate >= 50) return 'Au-dessus de la moyenne TNS';
if (replacementRate >= 35) return 'Dans la moyenne TNS - épargne recommandée';
return 'En dessous de la moyenne - épargne indispensable';
```

### Conseil fiscal TNS
> 💡 Les versements PER sont déductibles du revenu imposable, 
> optimisant la fiscalité tout en préparant la retraite.

---

## 9. Profil de Risque TNS (NOUVEAU)

### Particularités freelance
- Revenus souvent **variables** → influence sur la tolérance au risque
- Importance d'une **épargne de précaution** (6-12 mois de charges)
- Possibilité d'**épargne irrégulière** (versements ponctuels quand CA favorable)

### Questionnaire identique au salarié
- Horizon : arrêt d'activité dans <10 / 10-20 / >20 ans
- Tolérance aux pertes : 5% / 10% / 20%
- Connaissance des marchés : débutant / intermédiaire / avancé

### Classification
Même mapping que salariés :
- **Prudent** : 1.5%/an - Fonds euros, livrets
- **Équilibré** : 4%/an - Mix UC, PER équilibré
- **Dynamique** : 7%/an - Actions, ETF, PEA

---

## 10. Calcul de l'Effort d'Épargne TNS (NOUVEAU)

### Formule identique au salarié
```javascript
const calculateRequiredSavings = (targetIncome, currentPension, yearsUntilRetirement, profile) => {
  // Même logique que salarié
  // Seules les entrées changent (pension TNS, revenu professionnel)
};
```

### Restitution adaptée
Pour chaque profil de risque, afficher :
- Pension obligatoire TNS estimée (base + complémentaire indépendants)
- Revenu cible (en % ou en €)
- Épargne mensuelle indicative par profil

### Mention obligatoire
> ⚠️ Hypothèses de rendement non garanties, à adapter avec un conseiller 
> en fonction des produits utilisés (PER individuel, Madelin, assurance vie, immobilier, etc.)

---

## 11. Synthèse du Tunnel Freelance (NOUVEAU)

### Parcours utilisateur en 6 étapes
1. **Profil & statut** - Micro/EI/Libéral, données personnelles
2. **Revenus & historique** - CA ou bénéfices par année
3. **Trimestres assimilés** - Chômage, maladie, maternité, congé parental
4. **Récapitulatif** - Validation avant calcul
5. **Épargne & Besoin** - Objectif de revenu et capital existant
6. **Profil de risque** - 3 questions pour classification
→ Résultats avec projections d'épargne

### Module mutualisé
Le module Épargne & Risque est **identique** entre salarié et freelance, avec :
- Entrées différentes (pension TNS vs pension salarié)
- Wording adapté (arrêt d'activité vs retraite)
- Seuils ajustés (taux de remplacement moyen plus bas)

