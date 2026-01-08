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
- Congé parental : maximum 12 trimestres
- Maladie longue durée : selon durée
- Service militaire : 4 trimestres par an
```

### Calcul automatique
```javascript
const calculatePrivateQuarters = () => {
  // Trimestres travaillés
  let workedQuarters = (fullTimeYears * 4) + (partTimeYears * 2);
  
  // Trimestres chômage (1 trimestre par 50 jours)
  const unemploymentQuarters = Math.floor(unemploymentMonths / 1.7);
  
  // Trimestres congé parental (max 12)
  const parentalQuarters = Math.min(Math.floor(parentalLeaveMonths / 3), 12);
  
  return {
    worked: workedQuarters,
    unemployment: unemploymentQuarters,
    parental: parentalQuarters,
    total: Math.min(workedQuarters + unemploymentQuarters + parentalQuarters, 172)
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

### Calcul des points

Si l'utilisateur connaît son nombre de points (via son relevé Agirc-Arrco) :
```javascript
// Saisie directe du nombre total de points
totalPoints = userInputPoints;
```

Sinon, estimation approximative :
```javascript
// Estimation : environ 10% du dernier salaire annuel
const estimatedComplementary = lastAnnualSalary * 0.10 / 12;
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
  
  // Mode estimation
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

## 4. Calcul Total

### Formule finale
```javascript
Pension totale mensuelle = Pension de base + Pension complémentaire Agirc-Arrco
```

### Taux de remplacement
```javascript
Taux de remplacement = (Pension annuelle totale / Dernier salaire annuel) × 100
```

### Exemple complet

**Profil salarié :**
- Âge : 45 ans
- Début carrière : 2003 (22 ans de carrière)
- Dernier salaire brut : 48 000€/an
- Points Agirc-Arrco : 6 200 points
- Trimestres validés : 88 (22 ans × 4)

**Calcul à 62 ans (17 ans supplémentaires) :**

1. **Trimestres totaux** : 88 + (17 × 4) = 156 trimestres
2. **Trimestres manquants** : 172 - 156 = 16 trimestres
3. **Décote** : 16 × 1.25% = 20%
4. **Taux appliqué** : 50% × (1 - 0.20) = 40%

5. **Pension de base** :
   - SAM : 42 000€ (moyenne 25 meilleures années)
   - Base annuelle : 42 000 × 0.40 × (156/172) = 15 233€
   - Base mensuelle : **1 269€**

6. **Pension complémentaire** :
   - Points estimés à 62 ans : 6 200 + (17 × 300) = 11 300 points
   - Complémentaire annuelle : 11 300 × 1,4386 = 16 256€
   - Complémentaire mensuelle : **1 355€**

7. **Total mensuel** : 1 269 + 1 355 = **2 624€**
8. **Taux de remplacement** : (31 489 / 48 000) × 100 = **65.6%**

---

## 5. Périodes Assimilées

### Chômage
```javascript
// Chômage indemnisé : 1 trimestre par 50 jours
const unemploymentQuarters = Math.floor(unemploymentDays / 50);

// Chômage non indemnisé : limité à 4 trimestres (1ère période)
// + 4 trimestres supplémentaires si > 55 ans et > 20 ans de cotisation
```

### Congé parental
```javascript
// Maximum 12 trimestres (3 ans)
const parentalQuarters = Math.min(Math.floor(parentalMonths / 3), 12);
```

### Maladie / Maternité
```javascript
// 1 trimestre par 60 jours d'indemnisation
// Congé maternité : trimestres assimilés selon durée
```

---

## 6. Projections et Scénarios

### Variables de projection
```javascript
- Âge de départ souhaité (62, 64, 67 ans)
- Évolution salariale jusqu'au départ
- Trimestres supplémentaires à acquérir
- Points complémentaires futurs estimés
```

### Scénarios testés automatiquement
1. **Départ à 62 ans** - Impact décote si trimestres insuffisants
2. **Départ à 64 ans** - Équilibre décote/pension
3. **Départ à 67 ans** - Taux plein automatique

---

## 7. Limites et Avertissements

### Hypothèses simplificatrices
- Salaire constant ou moyenne par période
- Pas de changement de régime (toujours salarié privé)
- Coefficients de revalorisation non appliqués
- Carrière complète dans le privé

### Non pris en compte
- Majorations familiales (+10% si 3 enfants ou plus)
- Minimum contributif
- Pension de réversion
- Cumul emploi-retraite
- Rachats de trimestres
- Carrière longue (départ anticipé)

### Précision
Les résultats sont des **estimations** basées sur la législation 2024. Pour un calcul exact :
- Consulter son relevé de carrière sur info-retraite.fr
- Vérifier ses points Agirc-Arrco sur agirc-arrco.fr
- Demander une estimation personnalisée à sa caisse

---

## 8. Implémentation Technique

### Fichier : `/app/frontend/src/components/EmployeeSimulator.js`

**Fonctions principales :**
```javascript
calculatePrivateQuarters()
  → Retourne les trimestres par catégorie (travaillés, chômage, parental)

calculateSAM(salaryPeriods)
  → Calcule le Salaire Annuel Moyen des 25 meilleures années

calculatePrivateBasePension(age, totalQuarters)
  → Calcule la pension de base avec décote/surcote

calculateAgircArrco()
  → Calcule la pension complémentaire (points ou estimation)

calculateScenarios()
  → Génère les projections pour 62, 64, 67 ans
```

### Affichage des résultats
- Tableau comparatif par âge de départ
- Détails : SAM, trimestres, taux, décote/surcote
- Décomposition base + complémentaire
- Points Agirc-Arrco
- Taux de remplacement
- Messages clés personnalisés

---

## 9. Sources et Références

- **L'Assurance Retraite** : https://www.lassuranceretraite.fr
- **Agirc-Arrco** : https://www.agirc-arrco.fr
- **Info Retraite** : https://www.info-retraite.fr
- **Législation 2024** : Réforme des retraites 2023 applicable

---

**Document Version** : 1.0  
**Date** : Janvier 2025  
**Valeur du point Agirc-Arrco** : 1,4386€
