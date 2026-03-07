# 📔 Journal de Bord - Projet Elysion

**Nom du projet** : Elysion (future-ready-9)  
**Date de début** : 1er Octobre 2025  
**Dernière mise à jour** : 20 Février 2026  

---

## 🗓️ Chronologie du projet

---

### 📅 Octobre 2025 - Lancement du projet

#### Semaine 1 (1-7 Octobre 2025)
**Objectif initial** : Créer une plateforme de simulation de retraite pour le marché français.

**Décisions techniques** :
- ✅ Stack technique choisie : React + FastAPI + MongoDB
- ✅ Framework CSS : Tailwind CSS
- ✅ Composants UI : Shadcn/UI
- ✅ Authentification : JWT tokens

**Travaux réalisés** :
- Mise en place de l'architecture de base du projet
- Création de la structure des dossiers (`/app/frontend`, `/app/backend`)
- Configuration de l'environnement de développement
- Création du fichier `server.py` (FastAPI)

#### Semaine 2-4 (8-31 Octobre 2025)
**Travaux réalisés** :
- 🎨 Création de la **Landing Page** avec :
  - Hero section
  - Présentation des fonctionnalités
  - Call-to-action vers le simulateur
  - Footer avec liens
- 🔐 Mise en place du système d'**authentification** :
  - Page de connexion/inscription (`AuthPage.js`)
  - Gestion des tokens JWT
  - Contexte d'authentification React (`useAuth`)
- 📝 Création de l'**Onboarding Flow** :
  - 5 étapes de création de profil
  - Collecte des informations personnelles et professionnelles

---

### 📅 Novembre 2025 - Simulateurs & Dashboard

#### Semaine 1-2 (1-15 Novembre 2025)
**Travaux réalisés** :
- 🧮 Création du **Simulateur Salarié** (`EmployeeSimulator.js`) :
  - Étape 1 : Profil (date de naissance, genre, enfants, type de salarié)
  - Étape 2 : Salaires (mode simplifié/détaillé)
  - Étape 3 : Trimestres
  - Étape 4 : Points Agirc-Arrco
  - Étape 5 : Épargne & Besoin
  - Étape 6 : Profil de risque
  - Étape 7 : Résultats et scénarios
- Distinction entre secteur **privé** et **public**
- Calculs de pension de base et complémentaire

#### Semaine 3-4 (16-30 Novembre 2025)
**Travaux réalisés** :
- 📊 Création du **Dashboard** (`Dashboard.js`) :
  - Affichage de la pension estimée
  - Taux de remplacement
  - Sélecteur d'âge de départ dynamique
  - Récapitulatif des trimestres
- 🧮 Création du **Simulateur Freelance** (version initiale) :
  - Adaptation des calculs pour les indépendants
  - Gestion des différents statuts (micro, EI, libéral)
- 📈 Création de la page **Axes d'investissement** (`InvestmentAxes.js`) :
  - Recommandations personnalisées
  - Répartition suggérée de l'épargne

---

### 📅 Décembre 2025 - Documents & Profil

#### Semaine 1-2 (1-15 Décembre 2025)
**Travaux réalisés** :
- 📄 Création de la page **Documents** (`Documents.js`) :
  - Upload de documents PDF
  - Catégorisation (bulletins de salaire, relevés de carrière, etc.)
  - Suppression et renommage
- 👤 Création de la page **Profil** (`ProfilePage.js`) :
  - Onglet "Informations personnelles"
  - Onglet "Sécurité" (changement de mot de passe)
  - Onglet "Préférences"

#### Semaine 3-4 (16-31 Décembre 2025)
**Travaux réalisés** :
- 📧 Ajout de la fonctionnalité **Newsletter** :
  - Modal d'inscription sur la landing page
  - Endpoint API `/api/newsletter/subscribe`
  - Table `newsletter_subscribers` en base de données
- 🔧 Corrections de bugs divers
- 🎄 Pause fêtes de fin d'année

---

### 📅 Janvier 2026 - Responsive & UX

#### Semaine 1-2 (1-15 Janvier 2026)
**Travaux réalisés** :
- 📱 **Refonte responsive complète** :
  - Adaptation de toutes les pages pour mobile/tablette
  - Création du **MobileTabBar** (barre de navigation mobile)
  - Menu hamburger pour la navigation
- 🎨 Améliorations UI/UX :
  - Indicateur d'étape circulaire dans les simulateurs
  - Amélioration des formulaires
  - Cohérence des boutons et couleurs

#### Semaine 3-4 (16-31 Janvier 2026)
**Travaux réalisés** :
- 💾 **Sauvegarde automatique des simulations** :
  - Endpoint `POST /api/simulation/save`
  - Endpoint `GET /api/simulation/latest`
  - Sauvegarde automatique quand l'utilisateur est connecté
- 🔄 Synchronisation frontend ↔ backend :
  - Le dashboard affiche les données de la dernière simulation
  - Possibilité de relancer une simulation depuis le dashboard

---

### 📅 Février 2026 - Sidebar & Refonte Freelance

#### Semaine 1 (1-7 Février 2026)
**Travaux réalisés** :
- 🗂️ **Implémentation de la Sidebar** (`DashboardLayout.jsx`) :
  - Sidebar persistante sur toutes les pages authentifiées
  - Affichage des infos utilisateur (nom, email, type)
  - Navigation vers : Dashboard, Simulateur, Documents, Axes d'investissement, Profil
  - Sidebar pliable/dépliable
  - Bouton de déconnexion
- 🔧 **Correction du breakpoint** entre sidebar et MobileTabBar

#### Semaine 2 (8-14 Février 2026)
**Travaux réalisés** :
- 🔍 **Vérification du bug des cards** :
  - Bug signalé : toutes les cards affichaient "Salariés"
  - Vérification : bug non présent dans le code actuel
- 📝 **Mise à jour du schéma de base de données** :
  - Ajout de `simulation_data` (JSONB) dans `retirement_profiles`
  - Ajout de `last_simulation_at`
  - Création de `DATABASE_SCHEMA.sql` v3.0

#### Semaine 3 (15-20 Février 2026)
**Travaux réalisés** :
- 🔄 **Harmonisation de la navigation** :
  - Menu hamburger sur toutes les pages non-authentifiées
  - Boutons stylisés dans le menu mobile
  - Masquage du bouton "Simulateur" sur desktop (visible uniquement en mobile)
- 📄 **Refonte des filtres Documents** :
  - Remplacement des boutons par des **tabs** scrollables
- 🔴 **Ajout du bouton Déconnexion** dans le menu mobile des simulateurs
- 👤 **Affichage du prénom** à côté du menu hamburger (mobile)

#### Session du 20 Février 2026 (Aujourd'hui)
**Travaux réalisés** :
- 🎯 **Modification du flux "Créer un compte"** :
  - Redirection vers `/onboarding` au lieu de `/auth?mode=register`
  - Étape 1 adaptative : 3 cards de choix de statut si venu de la landing
- 🧮 **REFONTE COMPLÈTE du Simulateur Freelance** :
  - Nouvelle structure en 7 étapes :
    1. Profil & Statuts (micro/EI/libéral + "déjà salarié ?")
    2. Carrière freelance (mode simple/détaillé)
    3. Carrière salariée (si applicable)
    4. Trimestres & Majorations
    5. Épargne & Besoin
    6. Profil de risque
    7. Scénarios + Synthèse
  - **Barèmes 2026** intégrés :
    - PASS : 48 060 €
    - Seuils trimestres : 1 875 € / 7 500 €
    - Valeur point RCI : 1,347 € (service) / 21,726 € (acquisition)
  - Calculs complets : RAM, pension base, RCI, Agirc-Arrco, majorations
  - Profils de risque avec calcul d'épargne
- 🔄 **Harmonisation des pages de résultats** (Salarié/Freelance)
- 📊 **Mode de saisie carrière salariée** :
  - Suppression du mode "Simplifié"
  - Ajout du mode "Année par année"
- ⌨️ **Auto-sélection au focus** sur tous les champs numériques
- 📝 **Mise à jour DATABASE_SCHEMA.sql v3.1** :
  - Nouvelles tables : `ref_rci_values`, `ref_micro_abatements`
  - Nouveau type : `freelance_status_type`
  - Barèmes 2026 officiels
- 📖 **Mise à jour DATABASE_SCHEMA.md v3.1**

---

## 📊 Statistiques du projet

| Métrique | Valeur |
|----------|--------|
| **Durée du projet** | ~5 mois |
| **Fichiers frontend** | ~20 composants React |
| **Fichiers backend** | server.py + backend-node |
| **Pages principales** | 10+ |
| **Endpoints API** | 15+ |
| **Tables/Collections DB** | 10+ |

---

## 🗂️ Structure actuelle du projet

```
/app/
├── backend/
│   └── server.py                    # FastAPI (environnement Emergent)
├── backend-node/                    # Node.js (production)
│   └── src/
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── dashboard.routes.js
│       │   └── newsletter.routes.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── App.js
│       └── components/
│           ├── DashboardLayout.jsx   # Sidebar
│           ├── MobileTabBar.jsx      # Navigation mobile
│           ├── Dashboard.js
│           ├── Documents.js
│           ├── InvestmentAxes.js
│           ├── ProfilePage.js
│           ├── Simulator.js          # Choix salarié/freelance
│           ├── EmployeeSimulator.js  # Simulateur salarié
│           ├── FreelanceSimulator.js # Simulateur freelance (refait)
│           ├── OnboardingFlow.js
│           ├── AuthPage.js
│           └── LandingPage.js
├── DATABASE_SCHEMA.sql               # v3.1
├── DATABASE_SCHEMA.md                # Documentation
└── memory/
    ├── PRD.md
    └── CHANGELOG.md                  # Ce fichier
```

---

## ✅ Fonctionnalités complètes

| Fonctionnalité | Status |
|----------------|--------|
| Landing Page | ✅ |
| Authentification (JWT) | ✅ |
| Onboarding | ✅ |
| Simulateur Salarié (privé/public) | ✅ |
| Simulateur Freelance (micro/EI/libéral) | ✅ |
| Dashboard dynamique | ✅ |
| Axes d'investissement | ✅ |
| Gestion de documents | ✅ |
| Page Profil (3 onglets) | ✅ |
| Newsletter | ✅ |
| Sidebar (desktop) | ✅ |
| Navigation mobile (TabBar + Hamburger) | ✅ |
| Sauvegarde auto des simulations | ✅ |
| Responsive design | ✅ |

---

## 🔜 Prochaines étapes

### P1 - Priorité haute
- [ ] Export PDF des résultats de simulation
- [ ] Graphiques avec Recharts dans le Dashboard
- [ ] Tests complets du flux d'authentification

### P2 - Priorité moyenne
- [ ] Comparateur d'investissements interactif
- [ ] Avertissement "modifications non sauvegardées"
- [ ] Validation de l'âge (date de naissance)

### P3 - Priorité basse
- [ ] Cohérence UI des boutons radio
- [ ] Correction des warnings linter (apostrophes JSX)

---

## 📝 Notes importantes

- **Langue utilisateur** : Français
- **Double backend** : FastAPI (dev Emergent) + Node.js (production)
- **Base de données** : MongoDB (dev) / PostgreSQL (production)
- **Barèmes** : Mis à jour pour 2026

---

**Document créé le** : 20 Février 2026  
**Auteur** : Agent Emergent (E1)