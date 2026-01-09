# Elysion - Schéma de Base de Données

**Version** : 1.0  
**Date** : Janvier 2025  
**Base de données** : MongoDB  
**Nom de la base** : Défini dans `DB_NAME` (.env)

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Collections](#2-collections)
   - 2.1 [users](#21-users)
   - 2.2 [user_profiles](#22-user_profiles)
   - 2.3 [retirement_profiles](#23-retirement_profiles)
   - 2.4 [documents](#24-documents)
   - 2.5 [password_resets](#25-password_resets)
3. [Énumérations](#3-énumérations)
4. [Relations](#4-relations)
5. [Index recommandés](#5-index-recommandés)
6. [Exemples de requêtes](#6-exemples-de-requêtes)

---

## 1. Vue d'ensemble

L'application Elysion utilise MongoDB comme base de données NoSQL. Les collections principales sont :

| Collection | Description |
|------------|-------------|
| `users` | Comptes utilisateurs et authentification |
| `user_profiles` | Profils détaillés des utilisateurs |
| `retirement_profiles` | Données de simulation de retraite |
| `documents` | Métadonnées des documents PDF uploadés |
| `password_resets` | Tokens de réinitialisation de mot de passe |

---

## 2. Collections

### 2.1 users

**Description** : Stocke les informations de compte utilisateur et d'authentification.

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `id` | `string` (UUID) | Identifiant unique | ✅ |
| `email` | `string` (email) | Adresse email unique | ✅ |
| `hashed_password` | `string` | Mot de passe hashé (SHA-256) | ✅ |
| `full_name` | `string` | Nom complet | ✅ |
| `user_type` | `UserType` | Type d'utilisateur | ✅ |
| `created_at` | `datetime` | Date de création | ✅ |
| `is_active` | `boolean` | Compte actif | ✅ (défaut: true) |

**Exemple de document** :
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "jean.dupont@email.com",
  "hashed_password": "a1b2c3d4e5f6...",
  "full_name": "Jean Dupont",
  "user_type": "employee",
  "created_at": "2025-01-08T10:30:00Z",
  "is_active": true
}
```

---

### 2.2 user_profiles

**Description** : Stocke les informations détaillées du profil utilisateur pour la simulation de retraite.

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `user_id` | `string` (UUID) | Référence vers users.id | ✅ |
| `date_of_birth` | `string` | Date de naissance | ❌ |
| `gender` | `string` | Genre (M/F) | ❌ |
| `family_situation` | `string` | Situation familiale | ❌ |
| `career_start` | `string` | Année de début de carrière | ❌ |
| `salary` | `string` | Salaire actuel | ❌ |
| `retirement_plans` | `string` | Plans de retraite | ❌ |
| `validated_quarters` | `string` | Trimestres validés | ❌ |
| `activity_type` | `string` | Type d'activité (freelance) | ❌ |
| `legal_status` | `string` | Statut juridique (freelance) | ❌ |
| `average_income` | `string` | Revenu moyen (freelance) | ❌ |
| `pension_scheme` | `string` | Régime de retraite | ❌ |
| `legal_form` | `string` | Forme juridique (business) | ❌ |
| `gross_remuneration` | `string` | Rémunération brute (business) | ❌ |
| `pension_regime` | `string` | Régime de pension | ❌ |

**Exemple de document** :
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "date_of_birth": "1985-06-15",
  "gender": "M",
  "family_situation": "married",
  "career_start": "2008",
  "salary": "48000",
  "validated_quarters": "68"
}
```

---

### 2.3 retirement_profiles

**Description** : Stocke les données de simulation et projection de retraite.

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `id` | `string` (UUID) | Identifiant unique | ✅ |
| `user_id` | `string` (UUID) | Référence vers users.id | ✅ |
| `current_age` | `integer` | Âge actuel | ✅ |
| `target_retirement_age` | `integer` | Âge cible de départ | ✅ (défaut: 65) |
| `monthly_income` | `float` | Revenu mensuel actuel | ✅ |
| `current_savings` | `float` | Épargne actuelle | ✅ (défaut: 0) |
| `monthly_contributions` | `float` | Cotisations mensuelles | ✅ (défaut: 0) |
| `estimated_pension` | `float` | Pension estimée | ✅ (défaut: 0) |
| `last_updated` | `datetime` | Dernière mise à jour | ✅ |

**Exemple de document** :
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "current_age": 40,
  "target_retirement_age": 64,
  "monthly_income": 4000.00,
  "current_savings": 50000.00,
  "monthly_contributions": 500.00,
  "estimated_pension": 2800.00,
  "last_updated": "2025-01-08T14:00:00Z"
}
```

---

### 2.4 documents

**Description** : Stocke les métadonnées des documents PDF uploadés par les utilisateurs.

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `id` | `string` (UUID) | Identifiant unique | ✅ |
| `user_id` | `string` (UUID) | Référence vers users.id | ✅ |
| `filename` | `string` | Nom du fichier (modifiable) | ✅ |
| `original_filename` | `string` | Nom original du fichier | ✅ |
| `category` | `DocumentCategory` | Catégorie du document | ✅ |
| `file_size` | `integer` | Taille en octets | ✅ |
| `file_path` | `string` | Chemin du fichier sur le serveur | ✅ |
| `uploaded_at` | `datetime` | Date d'upload | ✅ |
| `updated_at` | `datetime` | Date de modification | ✅ |

**Exemple de document** :
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "bulletin_salaire_janvier_2025.pdf",
  "original_filename": "scan_001.pdf",
  "category": "salary_slip",
  "file_size": 245760,
  "file_path": "/app/backend/uploads/550e8400.../770e8400...pdf",
  "uploaded_at": "2025-01-08T15:30:00Z",
  "updated_at": "2025-01-08T15:30:00Z"
}
```

---

### 2.5 password_resets

**Description** : Stocke les tokens de réinitialisation de mot de passe.

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `email` | `string` (email) | Email de l'utilisateur | ✅ |
| `token` | `string` | Token JWT de réinitialisation | ✅ |
| `created_at` | `datetime` | Date de création | ✅ |
| `used` | `boolean` | Token utilisé | ✅ (défaut: false) |

**Exemple de document** :
```json
{
  "email": "jean.dupont@email.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "created_at": "2025-01-08T16:00:00Z",
  "used": false
}
```

---

## 3. Énumérations

### UserType
Types d'utilisateurs supportés.

| Valeur | Description |
|--------|-------------|
| `employee` | Salarié du privé |
| `freelancer` | Freelance / Indépendant |
| `business_owner` | Chef d'entreprise |

### DocumentCategory
Catégories de documents.

| Valeur | Description |
|--------|-------------|
| `salary_slip` | Bulletins de salaire |
| `career_statement` | Relevés de carrière |
| `tax_declaration` | Déclarations fiscales |
| `retirement_contract` | Contrats de retraite |
| `other` | Autres documents |

---

## 4. Relations

```
┌─────────────┐      1:1      ┌─────────────────┐
│   users     │──────────────▶│  user_profiles  │
│             │               │                 │
│  id (PK)    │               │  user_id (FK)   │
└─────────────┘               └─────────────────┘
       │
       │ 1:1
       ▼
┌─────────────────────┐
│  retirement_profiles │
│                     │
│  user_id (FK)       │
└─────────────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│  documents  │
│             │
│  user_id (FK)│
└─────────────┘

┌─────────────┐
│password_resets│
│             │
│  email      │ (référence indirecte via email)
└─────────────┘
```

---

## 5. Index recommandés

```javascript
// Collection users
db.users.createIndex({ "id": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Collection user_profiles
db.user_profiles.createIndex({ "user_id": 1 }, { unique: true })

// Collection retirement_profiles
db.retirement_profiles.createIndex({ "user_id": 1 }, { unique: true })

// Collection documents
db.documents.createIndex({ "id": 1 }, { unique: true })
db.documents.createIndex({ "user_id": 1 })
db.documents.createIndex({ "category": 1 })
db.documents.createIndex({ "user_id": 1, "category": 1 })

// Collection password_resets
db.password_resets.createIndex({ "email": 1 })
db.password_resets.createIndex({ "token": 1 })
db.password_resets.createIndex({ "created_at": 1 }, { expireAfterSeconds: 3600 })
```

---

## 6. Exemples de requêtes

### Récupérer un utilisateur par email
```python
user = await db.users.find_one({"email": "jean.dupont@email.com"}, {"_id": 0})
```

### Récupérer le profil d'un utilisateur
```python
profile = await db.user_profiles.find_one({"user_id": user_id}, {"_id": 0})
```

### Récupérer les documents d'un utilisateur par catégorie
```python
documents = await db.documents.find(
    {"user_id": user_id, "category": "salary_slip"},
    {"_id": 0}
).sort("uploaded_at", -1).to_list(length=None)
```

### Créer un nouvel utilisateur
```python
user_dict = {
    "id": str(uuid.uuid4()),
    "email": "nouveau@email.com",
    "hashed_password": get_password_hash(password),
    "full_name": "Nouveau Utilisateur",
    "user_type": "employee",
    "created_at": datetime.utcnow(),
    "is_active": True
}
await db.users.insert_one(user_dict)
```

### Mettre à jour un document
```python
await db.documents.update_one(
    {"id": document_id, "user_id": user_id},
    {"$set": {"filename": "nouveau_nom.pdf", "updated_at": datetime.utcnow()}}
)
```

### Supprimer les tokens expirés
```python
await db.password_resets.delete_many({
    "created_at": {"$lt": datetime.utcnow() - timedelta(hours=1)}
})
```

---

## 7. Notes importantes

### Exclusion de `_id`
Toutes les requêtes doivent exclure le champ `_id` de MongoDB pour éviter les erreurs de sérialisation :
```python
# ✅ Correct
user = await db.users.find_one({"id": user_id}, {"_id": 0})

# ❌ Incorrect (causera une erreur ObjectId)
user = await db.users.find_one({"id": user_id})
```

### Identifiants personnalisés
L'application utilise des UUID v4 comme identifiants au lieu des ObjectId MongoDB natifs :
```python
"id": str(uuid.uuid4())  # "550e8400-e29b-41d4-a716-446655440000"
```

### Stockage des fichiers
Les fichiers PDF sont stockés sur le système de fichiers dans `/app/backend/uploads/` :
```
/app/backend/uploads/
└── {user_id}/
    ├── {document_id}.pdf
    └── {document_id}.pdf
```

---

**Document généré automatiquement**  
**Dernière mise à jour** : Janvier 2025
