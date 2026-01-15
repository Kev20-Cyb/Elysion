# Elysion - Simulateur de Retraite

## Description du projet
Elysion est une application de planification de retraite permettant aux utilisateurs français de simuler leur pension de retraite selon leur statut professionnel (Salarié ou Freelance).

## Stack Technique
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Backend**: FastAPI (Python) / Option Node.js+Express disponible
- **Base de données**: MongoDB

## Fonctionnalités implémentées

### Simulateurs de retraite
- **Simulateur Salarié** (`/simulator/employee`): 7 étapes avec module épargne
- **Simulateur Freelance** (`/simulator/freelance`): 4 étapes, régimes micro/classique, RCI
- **Routeur Simulateur** (`/simulator`): Page de choix entre Salarié et Freelance

### Tunnel Salarié (7 étapes)
1. Profil & carrière
2. Historique des salaires
3. Trimestres & enfants
4. Retraite complémentaire (Agirc-Arrco)
5. **NOUVEAU** : Épargne & Besoin (objectif de revenu, capital existant)
6. **NOUVEAU** : Profil de risque (3 questions, classification automatique)
7. Scénarios de départ (choix des âges)
→ Résultats avec projections d'épargne

### Calculs avancés
- Valeur du point: `1,4386€`
- +8 trimestres automatiques par enfant pour les femmes
- Périodes d'inactivité en jours ou mois (chômage, congé parental, maladie)
- Champ "Date de naissance" complet (jour/mois/année) au lieu de l'année seule
- **NOUVEAU** : Calcul du taux de remplacement
- **NOUVEAU** : Profils de risque (Prudent 1.5%, Équilibré 4%, Dynamique 7%)
- **NOUVEAU** : Calcul de l'effort d'épargne mensuel par profil
- Redirection finale vers `/onboarding`

### Design System
- Variables CSS complètes avec échelles de couleurs
- Classes utilitaires: `bg-elysion-*`, `text-elysion-*`, `border-elysion-*`
- Style d'input léger et moderne (`.input-elysion`)
- Système de boutons complet avec états

### Documentation
- `CALCUL_RETRAITE_SALARIE.md` - Logique de calcul salarié
- `CALCUL_RETRAITE_FREELANCE.md` - Logique de calcul freelance
- `DATABASE_SCHEMA.md` - Schéma MongoDB
- `DATABASE_SCHEMA.sql` - Schéma PostgreSQL hypothétique
- `ELYSION_DESIGN_SYSTEM_COMPLETE.md` - Design system complet

## Exports disponibles
- `/app/export/elysion-nodejs-postgresql.zip` - Version Node.js/Express/PostgreSQL
- `/app/export/Elysion-main-merged.zip` - Codebase fusionné avec toutes les modifications

## Tâches complétées (Session actuelle - Janvier 2025)
- [x] Fusion des fonctionnalités dans `/app/export/Elysion-main/`
- [x] Mise à jour complète de `App.css` avec toutes les classes utilitaires
- [x] Copie des fichiers de documentation
- [x] Création de l'archive `Elysion-main-merged.zip`

## Tâches en backlog

### P1 - Priorité haute
- [ ] Compléter le composant `Documents.js` (actuellement placeholder)
  - Upload de fichiers
  - Liste et gestion des documents
  - Téléchargement et suppression

### P2 - Priorité moyenne
- [ ] Connecter le Dashboard aux vraies données backend (utilise données mockées)
- [ ] Tests automatisés pour les simulateurs

## Architecture des fichiers clés
```
/app/export/Elysion-main/
├── frontend/src/
│   ├── App.js (routes configurées)
│   ├── App.css (classes utilitaires complètes)
│   └── components/
│       ├── Simulator.js (routeur)
│       ├── EmployeeSimulator.js (6 étapes)
│       ├── FreelanceSimulator.js (6 étapes)
│       └── Documents.js (placeholder)
├── CALCUL_RETRAITE_*.md
├── DATABASE_SCHEMA.*
└── ELYSION_DESIGN_SYSTEM_COMPLETE.md
```
