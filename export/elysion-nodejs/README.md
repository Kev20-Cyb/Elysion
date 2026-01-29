# Elysion - Version Node.js/Express.js + PostgreSQL

Application de simulation de retraite convertie depuis Python/FastAPI/MongoDB.

## 🚀 Installation

### Prérequis

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Modifier les valeurs dans .env
   ```

3. **Créer la base de données PostgreSQL**
   ```bash
   # Se connecter à PostgreSQL
   psql -U postgres
   
   # Créer la base
   CREATE DATABASE elysion;
   
   # Quitter
   \q
   ```

4. **Exécuter les migrations**
   ```bash
   npm run migrate
   ```

5. **[Optionnel] Insérer les données de test**
   ```bash
   npm run seed
   ```

6. **Démarrer le serveur**
   ```bash
   # Mode développement (avec hot reload)
   npm run dev
   
   # Mode production
   npm start
   ```

## 📁 Structure du projet

```
elysion-nodejs/
├── src/
│   ├── config/
│   │   └── database.js      # Configuration PostgreSQL/Sequelize
│   ├── middleware/
│   │   └── auth.js          # Middleware JWT
│   ├── models/
│   │   └── index.js         # Modèles Sequelize
│   ├── routes/
│   │   ├── auth.js          # Routes authentification
│   │   ├── profile.js       # Routes profil
│   │   ├── documents.js     # Routes documents
│   │   └── dashboard.js     # Routes tableau de bord
│   ├── utils/
│   │   └── helpers.js       # Fonctions utilitaires
│   └── server.js            # Point d'entrée
├── migrations/
│   ├── run.js               # Script de migration
│   └── seed.js              # Données de test
├── uploads/                  # Dossier des fichiers uploadés
├── .env.example             # Template de configuration
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur actuel |
| POST | `/api/auth/request-password-reset` | Demande réinitialisation |
| POST | `/api/auth/reset-password` | Réinitialiser mot de passe |

### Profil
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/profile` | Récupérer le profil |
| PUT | `/api/profile` | Mettre à jour le profil |
| GET | `/api/profile/retirement` | Profil retraite |
| PUT | `/api/profile/retirement` | Mettre à jour profil retraite |

### Documents
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/documents` | Liste des documents |
| POST | `/api/documents/upload` | Upload un document |
| GET | `/api/documents/download/:id` | Télécharger |
| PUT | `/api/documents/:id` | Renommer/changer catégorie |
| DELETE | `/api/documents/:id` | Supprimer |

### Dashboard
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard` | Données du tableau de bord |

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens).

```bash
# Exemple de requête authentifiée
curl -X GET http://localhost:8001/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🗄️ Base de données

### Schéma PostgreSQL

Les tables sont créées automatiquement via Sequelize :

- `users` - Comptes utilisateurs
- `user_profiles` - Profils détaillés
- `retirement_profiles` - Données de simulation
- `documents` - Métadonnées des fichiers
- `password_resets` - Tokens de réinitialisation

### Réinitialiser la base

```bash
npm run migrate:fresh
```

## 📝 Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port du serveur | 8001 |
| `NODE_ENV` | Environnement | development |
| `DB_HOST` | Hôte PostgreSQL | localhost |
| `DB_PORT` | Port PostgreSQL | 5432 |
| `DB_NAME` | Nom de la base | elysion |
| `DB_USER` | Utilisateur | postgres |
| `DB_PASSWORD` | Mot de passe | - |
| `JWT_SECRET` | Clé secrète JWT | - |
| `JWT_EXPIRES_IN` | Durée du token | 30m |
| `UPLOAD_DIR` | Dossier uploads | ./uploads |
| `MAX_FILE_SIZE` | Taille max fichier | 10485760 |
| `FRONTEND_URL` | URL frontend (CORS) | http://localhost:3000 |

## 🔄 Différences avec la version Python

| Aspect | Python/FastAPI | Node.js/Express |
|--------|---------------|-----------------|
| Runtime | Python 3.10+ | Node.js 18+ |
| Framework | FastAPI | Express.js |
| ORM | Motor (async) | Sequelize |
| Base de données | MongoDB | PostgreSQL |
| Validation | Pydantic | express-validator |
| Auth | python-jose | jsonwebtoken |

## 🧪 Tests

```bash
# Test de santé
curl http://localhost:8001/api/health

# Test de connexion
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@elysion.fr","password":"password123"}'
```

## 📄 Licence

MIT License - Elysion Team 2025
