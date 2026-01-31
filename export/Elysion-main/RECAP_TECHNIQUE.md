# 📋 ELYSION - Récapitulatif Technique pour Push Branche "conflict"

**Date:** Janvier 2026  
**Production:** https://elysion-france.fr/

---

## 📁 STRUCTURE DU PROJET

```
Elysion-main/
├── 📂 frontend/                    # React App (Port 3000)
│   ├── src/
│   │   ├── App.js                  # ✅ Routes + AuthContext + ChatBubble
│   │   ├── App.css                 # ✅ Design System complet + Typographie
│   │   ├── index.css               # ✅ Variables CSS + Base styles
│   │   ├── components/
│   │   │   ├── LandingPage.js      # ✅ Page d'accueil
│   │   │   ├── AuthPage.js         # ✅ Login/Register
│   │   │   ├── Simulator.js        # ✅ Choix du type de simulateur
│   │   │   ├── EmployeeSimulator.js # ✅ Simulateur salarié (7 étapes)
│   │   │   ├── FreelanceSimulator.js # ✅ Simulateur freelance
│   │   │   ├── Dashboard.js        # ✅ Tableau de bord utilisateur
│   │   │   ├── InvestmentAxes.js   # ✅ Axes d'investissement dynamiques
│   │   │   ├── ProfilePage.js      # ✅ Page profil utilisateur
│   │   │   ├── Documents.js        # ✅ Gestion des documents
│   │   │   ├── OnboardingFlow.js   # ✅ Flux d'inscription post-simulation
│   │   │   ├── ChatBubble.jsx      # ✅ NEW - Chatbot flottant
│   │   │   ├── ForgotPassword.js   # ✅ Mot de passe oublié
│   │   │   ├── ResetPassword.js    # ✅ Réinitialisation mot de passe
│   │   │   └── ui/                 # Composants shadcn/ui
│   │   ├── lib/
│   │   │   ├── utils.js            # Utilitaires (cn, etc.)
│   │   │   └── chatClient.js       # ✅ NEW - Client API chatbot
│   │   └── hooks/
│   │       └── use-toast.js        # Hook pour les notifications
│   ├── package.json
│   └── tailwind.config.js
│
├── 📂 backend/                     # Python FastAPI (Port 8001) - LEGACY
│   ├── server.py                   # API Python complète
│   ├── .env                        # Configuration MongoDB + CORS
│   ├── .env.example                # Template de configuration
│   └── uploads/documents/          # Stockage des PDFs
│
├── 📂 backend-node/                # Node.js Express (Port 5000) - NOUVEAU
│   ├── src/
│   │   ├── server.js               # ✅ Serveur Express avec CORS
│   │   ├── db.js                   # Connexion MongoDB
│   │   ├── authMiddleware.js       # Middleware JWT
│   │   ├── routes/
│   │   │   ├── auth.routes.js      # /api/auth (login, register)
│   │   │   ├── user.routes.js      # /api/users (profil)
│   │   │   ├── dashboard.routes.js # /api/dashboard
│   │   │   ├── chat.routes.js      # /api/chat (chatbot)
│   │   │   └── chatConfig.routes.js
│   │   └── services/
│   │       ├── chatbotApi.js       # Service chatbot
│   │       └── orishaiApi.js       # API Orishai
│   └── package.json
│
├── 📄 DATABASE_SCHEMA.sql          # ✅ Schéma SQL v2.0 (PostgreSQL)
├── 📄 CALCUL_RETRAITE_SALARIE.md   # Documentation calcul salarié
├── 📄 CALCUL_RETRAITE_FREELANCE.md # Documentation calcul freelance
├── 📄 ELYSION_DESIGN_SYSTEM_COMPLETE.md # Design System
└── 📄 DATABASE_SCHEMA.md           # Documentation MongoDB
```

---

## ✅ CE QUI FONCTIONNE

### Frontend (React)

| Composant | Status | Description |
|-----------|--------|-------------|
| `LandingPage` | ✅ | Page d'accueil avec CTA |
| `AuthPage` | ✅ | Login/Register avec validation |
| `Simulator` | ✅ | Choix salarié/freelance |
| `EmployeeSimulator` | ✅ | 7 étapes complètes, calcul retraite |
| `FreelanceSimulator` | ✅ | Simulateur indépendants |
| `Dashboard` | ✅ | Données dynamiques depuis API |
| `InvestmentAxes` | ✅ | Recommandations basées sur simulation |
| `ProfilePage` | ✅ | Modification profil + mot de passe |
| `Documents` | ✅ | Upload/téléchargement PDFs |
| `OnboardingFlow` | ✅ | Inscription post-simulation |
| `ChatBubble` | ✅ | Chatbot flottant (visible si connecté) |
| `ForgotPassword` | ✅ | Demande de reset |
| `ResetPassword` | ✅ | Nouveau mot de passe |

### Routes Frontend

```
/                    → LandingPage
/auth                → AuthPage (login/register)
/simulator           → Simulator (choix)
/simulator/employee  → EmployeeSimulator
/simulator/freelance → FreelanceSimulator
/dashboard           → Dashboard (protégé)
/documents           → Documents (protégé)
/investment-axes     → InvestmentAxes (protégé)
/profile             → ProfilePage (protégé)
/onboarding          → OnboardingFlow
/forgot-password     → ForgotPassword
/reset-password      → ResetPassword
```

### Backend Python (Port 8001) - LEGACY

| Endpoint | Méthode | Status |
|----------|---------|--------|
| `/api/auth/register` | POST | ✅ |
| `/api/auth/login` | POST | ✅ |
| `/api/user/profile` | GET/PUT | ✅ |
| `/api/user/password` | POST | ✅ |
| `/api/dashboard` | GET | ✅ |
| `/api/simulation/save` | POST | ✅ |
| `/api/simulation/latest` | GET | ✅ |
| `/api/documents/*` | CRUD | ✅ |

### Backend Node.js (Port 5000) - NOUVEAU

| Endpoint | Méthode | Status |
|----------|---------|--------|
| `/api/auth/register` | POST | ✅ |
| `/api/auth/login` | POST | ✅ |
| `/api/users/profile` | GET | ✅ |
| `/api/dashboard` | GET | ✅ |
| `/api/chat` | POST | ✅ (Chatbot) |
| `/api/health` | GET | ✅ |

---

## 🔧 MODIFICATIONS DE CETTE SESSION

### 1. UI/UX
- ❌ Suppression fond bleu sur radio buttons (étape 6 risque)
- ✅ Ajout typographie complète (font-size, font-weight, line-height)
- ✅ Classes utilitaires CSS ajoutées

### 2. Nouveaux fichiers
- `ChatBubble.jsx` - Chatbot flottant
- `chatClient.js` - Client API pour le chat
- `backend-node/` - Backend Node.js complet
- `.env.example` - Template de configuration

### 3. Configuration CORS
```javascript
// Domaines autorisés
"https://elysion-france.fr"
"http://localhost:3000"
"http://localhost:3001"
```

### 4. Schéma SQL v2.0
- Nouvelle table `simulation_results`
- Champs profil de risque
- Champ `first_name` dans `users`
- Vues et fonctions utilitaires

---

## ⚠️ DIFFÉRENCES API ENTRE BACKENDS

| Fonctionnalité | Backend Python | Backend Node.js |
|----------------|----------------|-----------------|
| Token response | `access_token` | `token` |
| Profile endpoint | `/api/user/profile` | `/api/users/profile` |
| User data | `response.data` | `response.data.user` |
| Port | 8001 | 5000 |

**Le frontend actuel est configuré pour le backend Python.**  
Si vous utilisez le backend Node.js, modifiez `App.js` :
- Ligne 54: `/api/users/profile` au lieu de `/api/user/profile`
- Lignes 70, 99: `token` au lieu de `access_token`

---

## 📝 FICHIERS .ENV

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://elysion-france.fr
# ou pour le dev local:
# REACT_APP_BACKEND_URL=http://localhost:5000
```

### Backend Python (.env)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="elysion_db"
CORS_ORIGINS="https://elysion-france.fr,http://localhost:3000,http://localhost:3001"
```

### Backend Node.js (.env)
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/elysion
JWT_SECRET=your_secret_key
FRONTEND_ORIGIN=https://elysion-france.fr
ORISHAI_API_BASE_URL=https://api.orishai.com
```

---

## 🚀 COMMANDES DE DÉMARRAGE

### Frontend
```bash
cd frontend
yarn install
yarn start  # Port 3000
```

### Backend Python
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Backend Node.js
```bash
cd backend-node
npm install
npm start  # Port 5000
```

---

## ⚡ POINTS D'ATTENTION POUR LE MERGE

1. **Ne pas écraser** les fichiers CSS mis à jour (App.css, index.css)
2. **Vérifier** quelle version du backend vous utilisez (Python ou Node.js)
3. **Adapter** les endpoints API si vous passez au backend Node.js
4. **Configurer** le CORS avec votre domaine de production
5. **Le ChatBubble** nécessite le backend Node.js avec `/api/chat`

---

## 📊 BASE DE DONNÉES

### Collections MongoDB
- `users` - Comptes utilisateurs
- `user_profiles` - Profils détaillés
- `retirement_profiles` - Données de retraite
- `simulation_results` - Résultats de simulation
- `documents` - Métadonnées des fichiers
- `password_resets` - Tokens de reset

### Schéma SQL (PostgreSQL)
Le fichier `DATABASE_SCHEMA.sql` contient l'équivalent SQL pour une migration future.

---

## 🐛 BUGS CONNUS

1. **Dashboard Loading** - Peut échouer si la structure des données ne correspond pas au modèle attendu
2. **Apostrophes JSX** - Warnings ESLint sur les apostrophes non échappées (mineur)

---

## 📞 SUPPORT

- **Domaine Production:** https://elysion-france.fr/
- **Technos:** React 18, TailwindCSS 3, shadcn/ui, FastAPI (Python), Express (Node.js), MongoDB

