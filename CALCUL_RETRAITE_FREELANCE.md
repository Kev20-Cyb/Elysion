# Calcul de Retraite pour Freelances - Documentation Technique

## Vue d'ensemble

Le simulateur Elysion implémente un calcul détaillé de retraite spécifiquement adapté aux **freelances, indépendants et chefs d'entreprise** affiliés au régime SSI (Sécurité Sociale des Indépendants).

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
const calculateFreelanceQuarters = (annualRevenue) => {
  const thresholds = {
    1: 4020,
    2: 8040,
    3: 12060,
    4: 16080
  };
  
  if (annualRevenue >= thresholds[4]) return 4;
  if (annualRevenue >= thresholds[3]) return 3;
  if (annualRevenue >= thresholds[2]) return 2;
  if (annualRevenue >= thresholds[1]) return 1;
  return 0;
};
```

### Durée d'assurance
- **Total trimestres** = Somme des trimestres cotisés sur toute la carrière
- **Trimestres requis** = 172 trimestres (43 ans) pour génération née après 1973
- **Maximum** = 172 trimestres comptabilisés

---

## 2. Calcul de la Retraite de Base (SSI)

### Formule générale
```
Pension de base = Revenu annuel moyen × Taux × (Trimestres validés / Trimestres requis)
```

### Détails du calcul

#### 2.1 Revenu annuel moyen
- Moyenne des **25 meilleures années** de revenus professionnels
- Dans le simulateur (simplifié) : `revenu actuel × 0.9`

#### 2.2 Taux de pension
- **Taux plein** : 50% (0.50)
- **Âge légal** : 62 ans
- **Âge taux plein automatique** : 67 ans

#### 2.3 Décote et Surcote

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

#### 2.4 Calcul final
```javascript
const basePension = averageRevenue × rate × (totalQuarters / requiredQuarters);
const monthlyBasePension = basePension / 12;
```

---

## 3. Calcul de la Retraite Complémentaire (RCI)

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

### Calcul de la pension complémentaire

#### Total des points
```javascript
Total points = Somme des points acquis sur toute la carrière

Exemple :
- 20 ans de carrière
- Revenu moyen : 45 000€/an
- Cotisation annuelle : 45 000 × 0.07 = 3 150€
- Points par an : 3 150 / 12 = 262.5 points
- Total : 262.5 × 20 = 5 250 points
```

#### Valeur du point (2024)
```javascript
Valeur du point RCI = 1.4386€
```

#### Pension annuelle
```javascript
Pension complémentaire annuelle = Total points × Valeur du point
Pension complémentaire mensuelle = (Total points × 1.4386) / 12

Exemple avec 5 250 points :
Annuelle = 5 250 × 1.4386 = 6 342€
Mensuelle = 6 342 / 12 = 528.5€
```

---

## 4. Calcul Total

### Formule finale
```javascript
Pension totale mensuelle = Pension de base mensuelle + Pension complémentaire mensuelle
```

### Taux de remplacement
```javascript
Taux de remplacement = (Pension annuelle totale / Revenu annuel actuel) × 100
```

### Exemple complet

**Profil freelance :**
- Âge : 40 ans
- Début carrière : 2004 (20 ans de carrière)
- Revenu actuel : 45 000€/an
- Trimestres validés : 80 (20 ans × 4)

**Calcul à 62 ans (22 ans supplémentaires) :**

1. **Trimestres totaux** : 80 + (22 × 4) = 168 trimestres
2. **Taux** : 50% (trimestres suffisants)
3. **Pension de base** :
   - Revenu moyen : 45 000 × 0.9 = 40 500€
   - Base annuelle : 40 500 × 0.50 × (168/172) = 19 802€
   - Base mensuelle : 19 802 / 12 = **1 650€**

4. **Pension complémentaire** :
   - Points totaux : (45 000 × 0.07 / 12) × 42 ans = 11 025 points
   - Complémentaire annuelle : 11 025 × 1.4386 = 13 318€
   - Complémentaire mensuelle : 13 318 / 12 = **1 110€**

5. **Total mensuel** : 1 650 + 1 110 = **2 760€**
6. **Taux de remplacement** : (33 120 / 45 000) × 100 = **73.6%**

---

## 5. Cas Particulier : Micro-Entrepreneur

### Revenu retraite
Le micro-entrepreneur doit appliquer un **abattement forfaitaire** sur son CA pour obtenir le revenu pris en compte :

```javascript
const abatements = {
  'vente': 0.71,           // 71% pour vente de marchandises
  'service_bic': 0.50,     // 50% pour prestations de services BIC
  'service_bnc': 0.34,     // 34% pour prestations de services BNC
  'liberal': 0.34          // 34% pour professions libérales
};

Revenu retraite = CA × (1 - abattement)
```

### Exemple
```
CA annuel : 60 000€ (prestations de services BNC)
Abattement : 34%
Revenu retraite = 60 000 × (1 - 0.34) = 39 600€

→ Ce revenu de 39 600€ est ensuite utilisé pour :
   - Valider les trimestres (39 600 > 16 080 → 4 trimestres)
   - Calculer la retraite de base
   - Calculer les points complémentaires
```

---

## 6. Projections et Scénarios

### Variables de projection
```javascript
- Âge de départ souhaité
- Revenu projeté jusqu'au départ
- Évolution du revenu (+ ou -)
- Trimestres supplémentaires à acquérir
```

### Scénarios testés automatiquement
1. **Départ à 62 ans** (âge légal)
2. **Départ à 67 ans** (taux plein automatique)
3. **Impact de la décote/surcote**

---

## 7. Limites et Avertissements

### Hypothèses simplificatrices
- Revenu constant ou moyen sur la carrière
- Pas de changement de régime
- Pas de périodes de chômage/maladie prolongées
- Valeurs des points et seuils constants

### Non pris en compte
- Majorations familiales
- Minimum contributif
- Pension de réversion
- Cumul emploi-retraite
- Rachats de trimestres

### Précision
Les résultats sont des **estimations** basées sur la législation 2024. Pour un calcul exact, il faut :
- Consulter son relevé de carrière
- Contacter sa caisse de retraite
- Utiliser le simulateur officiel Info-Retraite

---

## 8. Implémentation Technique

### Fichier : `/app/frontend/src/components/Simulator.js`

**Fonctions principales :**
```javascript
calculateFreelanceQuarters(revenue, year)
  → Retourne le nombre de trimestres validés

calculateFreelanceRetirement(income, careerLength, age)
  → Retourne objet complet avec :
    - totalQuarters
    - rate, decote, surcote
    - basePension, complementaryPension
    - totalPoints, pointValue
    - estimatedPension, replacementRate

calculateMicroEntrepreneurRetirement(turnover, activityType, ...)
  → Applique abattement puis calcul standard
```

### Affichage des résultats
- Résultats généraux (tous profils)
- Section détaillée spécifique freelance avec :
  - Trimestres (validés, requis, par an)
  - Taux (avec décote/surcote)
  - Décomposition base + complémentaire
  - Points RCI
  - Conseils personnalisés

---

## 9. Sources et Références

- **SSI (Sécurité Sociale des Indépendants)** : https://www.secu-independants.fr
- **RCI (Retraite Complémentaire des Indépendants)** : https://www.rci.fr
- **Info Retraite** : https://www.info-retraite.fr
- **Législation 2024** : Réforme des retraites applicable

---

**Document Version** : 1.0  
**Date** : Décembre 2024  
**Dernière mise à jour** : Intégration dans Elysion v1.0
