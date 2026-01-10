-- ============================================
-- ELYSION - Schéma de Base de Données SQL
-- ============================================
-- Version : 1.0
-- Date : Janvier 2025
-- Application : Elysion - Plateforme de Retraite
-- Note : Adaptation SQL du schéma MongoDB
-- ============================================

-- Supprimer les tables existantes (ordre inverse des dépendances)
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS retirement_profiles;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

-- Supprimer les types ENUM existants
DROP TYPE IF EXISTS user_type;
DROP TYPE IF EXISTS document_category;
DROP TYPE IF EXISTS gender_type;

-- ============================================
-- TYPES ÉNUMÉRÉS
-- ============================================

-- Type d'utilisateur
CREATE TYPE user_type AS ENUM (
    'employee',       -- Salarié du privé
    'freelancer',     -- Freelance / Indépendant
    'business_owner'  -- Chef d'entreprise
);

-- Catégorie de document
CREATE TYPE document_category AS ENUM (
    'salary_slip',        -- Bulletins de salaire
    'career_statement',   -- Relevés de carrière
    'tax_declaration',    -- Déclarations fiscales
    'retirement_contract', -- Contrats de retraite
    'other'               -- Autres documents
);

-- Genre
CREATE TYPE gender_type AS ENUM (
    'M',  -- Homme
    'F'   -- Femme
);

-- ============================================
-- TABLE : users
-- Description : Comptes utilisateurs et authentification
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type user_type NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Contraintes
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS 'Comptes utilisateurs et authentification';
COMMENT ON COLUMN users.id IS 'Identifiant unique UUID';
COMMENT ON COLUMN users.email IS 'Adresse email unique de l''utilisateur';
COMMENT ON COLUMN users.hashed_password IS 'Mot de passe hashé (SHA-256)';
COMMENT ON COLUMN users.full_name IS 'Nom complet de l''utilisateur';
COMMENT ON COLUMN users.user_type IS 'Type de profil : employee, freelancer, business_owner';
COMMENT ON COLUMN users.created_at IS 'Date de création du compte';
COMMENT ON COLUMN users.is_active IS 'Indique si le compte est actif';

-- ============================================
-- TABLE : user_profiles
-- Description : Profils détaillés des utilisateurs
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Informations personnelles
    date_of_birth DATE,
    gender gender_type,
    family_situation VARCHAR(50),
    children_count INTEGER DEFAULT 0,
    
    -- Informations professionnelles (commun)
    career_start_year INTEGER,
    current_salary DECIMAL(12, 2),
    retirement_plans TEXT,
    validated_quarters INTEGER DEFAULT 0,
    
    -- Spécifique Freelance
    activity_type VARCHAR(100),
    legal_status VARCHAR(100),
    average_income DECIMAL(12, 2),
    pension_scheme VARCHAR(100),
    
    -- Spécifique Chef d'entreprise
    legal_form VARCHAR(100),
    gross_remuneration DECIMAL(12, 2),
    pension_regime VARCHAR(100),
    
    -- Périodes assimilées
    had_unemployment BOOLEAN DEFAULT FALSE,
    unemployment_duration INTEGER DEFAULT 0,
    unemployment_unit VARCHAR(10) DEFAULT 'months',
    
    had_parental_leave BOOLEAN DEFAULT FALSE,
    parental_leave_duration INTEGER DEFAULT 0,
    parental_leave_unit VARCHAR(10) DEFAULT 'months',
    
    had_sick_leave BOOLEAN DEFAULT FALSE,
    sick_leave_duration INTEGER DEFAULT 0,
    sick_leave_unit VARCHAR(10) DEFAULT 'days',
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Clé étrangère
    CONSTRAINT fk_user_profiles_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

COMMENT ON TABLE user_profiles IS 'Profils détaillés des utilisateurs pour la simulation de retraite';
COMMENT ON COLUMN user_profiles.user_id IS 'Référence vers l''utilisateur';
COMMENT ON COLUMN user_profiles.date_of_birth IS 'Date de naissance';
COMMENT ON COLUMN user_profiles.gender IS 'Genre : M (Homme) ou F (Femme)';
COMMENT ON COLUMN user_profiles.children_count IS 'Nombre d''enfants';
COMMENT ON COLUMN user_profiles.career_start_year IS 'Année de début de carrière';
COMMENT ON COLUMN user_profiles.validated_quarters IS 'Nombre de trimestres validés';
COMMENT ON COLUMN user_profiles.unemployment_duration IS 'Durée de chômage';
COMMENT ON COLUMN user_profiles.unemployment_unit IS 'Unité de durée : days ou months';

-- ============================================
-- TABLE : retirement_profiles
-- Description : Données de simulation de retraite
-- ============================================
CREATE TABLE retirement_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Données de base
    current_age INTEGER NOT NULL,
    target_retirement_age INTEGER DEFAULT 65,
    
    -- Données financières
    monthly_income DECIMAL(12, 2) NOT NULL DEFAULT 0,
    current_savings DECIMAL(12, 2) DEFAULT 0,
    monthly_contributions DECIMAL(12, 2) DEFAULT 0,
    
    -- Estimations
    estimated_pension DECIMAL(12, 2) DEFAULT 0,
    estimated_base_pension DECIMAL(12, 2) DEFAULT 0,
    estimated_complementary_pension DECIMAL(12, 2) DEFAULT 0,
    replacement_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Trimestres
    total_quarters INTEGER DEFAULT 0,
    required_quarters INTEGER DEFAULT 172,
    missing_quarters INTEGER DEFAULT 0,
    
    -- Points retraite complémentaire
    agirc_arrco_points INTEGER DEFAULT 0,
    rci_points INTEGER DEFAULT 0,
    
    -- Métadonnées
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Clé étrangère
    CONSTRAINT fk_retirement_profiles_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Contraintes
    CONSTRAINT retirement_profiles_age_check 
        CHECK (current_age >= 18 AND current_age <= 100),
    CONSTRAINT retirement_profiles_target_age_check 
        CHECK (target_retirement_age >= 55 AND target_retirement_age <= 75)
);

COMMENT ON TABLE retirement_profiles IS 'Données de simulation et projection de retraite';
COMMENT ON COLUMN retirement_profiles.current_age IS 'Âge actuel de l''utilisateur';
COMMENT ON COLUMN retirement_profiles.target_retirement_age IS 'Âge cible de départ à la retraite';
COMMENT ON COLUMN retirement_profiles.estimated_pension IS 'Pension mensuelle estimée totale';
COMMENT ON COLUMN retirement_profiles.replacement_rate IS 'Taux de remplacement en pourcentage';
COMMENT ON COLUMN retirement_profiles.agirc_arrco_points IS 'Points Agirc-Arrco (salariés)';
COMMENT ON COLUMN retirement_profiles.rci_points IS 'Points RCI (indépendants)';

-- ============================================
-- TABLE : documents
-- Description : Métadonnées des documents PDF
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Informations fichier
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    category document_category NOT NULL DEFAULT 'other',
    file_size INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    
    -- Métadonnées
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Clé étrangère
    CONSTRAINT fk_documents_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Contraintes
    CONSTRAINT documents_file_size_check 
        CHECK (file_size > 0 AND file_size <= 10485760) -- Max 10MB
);

COMMENT ON TABLE documents IS 'Métadonnées des documents PDF uploadés';
COMMENT ON COLUMN documents.filename IS 'Nom du fichier (modifiable par l''utilisateur)';
COMMENT ON COLUMN documents.original_filename IS 'Nom original du fichier uploadé';
COMMENT ON COLUMN documents.category IS 'Catégorie du document';
COMMENT ON COLUMN documents.file_size IS 'Taille du fichier en octets (max 10MB)';
COMMENT ON COLUMN documents.file_path IS 'Chemin du fichier sur le serveur';

-- ============================================
-- TABLE : password_resets
-- Description : Tokens de réinitialisation de mot de passe
-- ============================================
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour'),
    used BOOLEAN DEFAULT FALSE,
    
    -- Index pour recherche rapide
    CONSTRAINT password_resets_email_check 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE password_resets IS 'Tokens de réinitialisation de mot de passe';
COMMENT ON COLUMN password_resets.token IS 'Token JWT de réinitialisation';
COMMENT ON COLUMN password_resets.expires_at IS 'Date d''expiration du token (1 heure)';
COMMENT ON COLUMN password_resets.used IS 'Indique si le token a été utilisé';

-- ============================================
-- TABLE : simulation_scenarios
-- Description : Scénarios de simulation sauvegardés
-- ============================================
CREATE TABLE simulation_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Paramètres du scénario
    scenario_name VARCHAR(100) NOT NULL,
    retirement_age INTEGER NOT NULL,
    
    -- Résultats
    base_pension DECIMAL(12, 2) DEFAULT 0,
    complementary_pension DECIMAL(12, 2) DEFAULT 0,
    total_pension DECIMAL(12, 2) DEFAULT 0,
    replacement_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Détails calcul
    quarters_at_retirement INTEGER DEFAULT 0,
    decote_rate DECIMAL(5, 2) DEFAULT 0,
    surcote_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Clé étrangère
    CONSTRAINT fk_simulation_scenarios_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

COMMENT ON TABLE simulation_scenarios IS 'Scénarios de simulation de retraite sauvegardés';
COMMENT ON COLUMN simulation_scenarios.scenario_name IS 'Nom du scénario (ex: Départ à 62 ans)';
COMMENT ON COLUMN simulation_scenarios.retirement_age IS 'Âge de départ simulé';
COMMENT ON COLUMN simulation_scenarios.decote_rate IS 'Taux de décote appliqué';
COMMENT ON COLUMN simulation_scenarios.surcote_rate IS 'Taux de surcote appliqué';

-- ============================================
-- INDEX
-- ============================================

-- Index users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Index user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Index retirement_profiles
CREATE INDEX idx_retirement_profiles_user_id ON retirement_profiles(user_id);

-- Index documents
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_user_category ON documents(user_id, category);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- Index password_resets
CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);

-- Index simulation_scenarios
CREATE INDEX idx_simulation_scenarios_user_id ON simulation_scenarios(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger sur user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger sur documents
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger sur retirement_profiles
CREATE TRIGGER update_retirement_profiles_last_updated
    BEFORE UPDATE ON retirement_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VUES
-- ============================================

-- Vue : Résumé utilisateur complet
CREATE OR REPLACE VIEW v_user_summary AS
SELECT 
    u.id AS user_id,
    u.email,
    u.full_name,
    u.user_type,
    u.created_at AS account_created,
    u.is_active,
    up.date_of_birth,
    up.gender,
    up.children_count,
    up.career_start_year,
    up.validated_quarters,
    rp.current_age,
    rp.target_retirement_age,
    rp.estimated_pension,
    rp.replacement_rate,
    COUNT(d.id) AS document_count
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN retirement_profiles rp ON u.id = rp.user_id
LEFT JOIN documents d ON u.id = d.user_id
GROUP BY u.id, up.id, rp.id;

COMMENT ON VIEW v_user_summary IS 'Vue résumée de toutes les informations utilisateur';

-- Vue : Documents par catégorie
CREATE OR REPLACE VIEW v_documents_by_category AS
SELECT 
    user_id,
    category,
    COUNT(*) AS document_count,
    SUM(file_size) AS total_size,
    MAX(uploaded_at) AS last_upload
FROM documents
GROUP BY user_id, category;

COMMENT ON VIEW v_documents_by_category IS 'Statistiques des documents par utilisateur et catégorie';

-- ============================================
-- DONNÉES DE TEST (Optionnel)
-- ============================================

-- Utilisateur de test
-- INSERT INTO users (email, hashed_password, full_name, user_type)
-- VALUES ('test@elysion.fr', 'hashed_password_here', 'Utilisateur Test', 'employee');

-- ============================================
-- VALEURS DE RÉFÉRENCE
-- ============================================

-- Table des seuils de trimestres (informative)
CREATE TABLE IF NOT EXISTS ref_quarter_thresholds (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    threshold_1_quarter DECIMAL(10, 2),
    threshold_2_quarters DECIMAL(10, 2),
    threshold_3_quarters DECIMAL(10, 2),
    threshold_4_quarters DECIMAL(10, 2),
    point_value_agirc_arrco DECIMAL(6, 4),
    point_value_rci DECIMAL(6, 4)
);

COMMENT ON TABLE ref_quarter_thresholds IS 'Valeurs de référence pour le calcul des trimestres';

-- Valeurs 2024
INSERT INTO ref_quarter_thresholds 
(year, threshold_1_quarter, threshold_2_quarters, threshold_3_quarters, threshold_4_quarters, point_value_agirc_arrco, point_value_rci)
VALUES 
(2024, 4020.00, 8040.00, 12060.00, 16080.00, 1.4386, 1.4386);

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Afficher les tables créées
-- \dt

-- Afficher les vues créées
-- \dv
