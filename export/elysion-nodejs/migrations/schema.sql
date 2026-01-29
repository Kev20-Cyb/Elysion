-- ============================================
-- ELYSION - Schéma PostgreSQL
-- ============================================
-- Ce fichier est généré automatiquement
-- Utilisez-le pour créer manuellement les tables
-- ou utilisez les migrations Sequelize (npm run migrate)
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL DEFAULT 'employee' 
        CHECK (user_type IN ('employee', 'freelancer', 'business_owner')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);

-- ============================================
-- TABLE: user_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Informations personnelles
    date_of_birth DATE,
    gender VARCHAR(1) CHECK (gender IN ('M', 'F')),
    family_situation VARCHAR(50),
    children_count INTEGER DEFAULT 0,
    
    -- Informations professionnelles
    career_start_year INTEGER,
    current_salary DECIMAL(12, 2),
    validated_quarters INTEGER DEFAULT 0,
    
    -- Spécifique Freelance
    activity_type VARCHAR(100),
    legal_status VARCHAR(100),
    average_income DECIMAL(12, 2),
    pension_scheme VARCHAR(100),
    
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- TABLE: retirement_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS retirement_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    current_age INTEGER NOT NULL,
    target_retirement_age INTEGER DEFAULT 65,
    
    monthly_income DECIMAL(12, 2) DEFAULT 0,
    current_savings DECIMAL(12, 2) DEFAULT 0,
    monthly_contributions DECIMAL(12, 2) DEFAULT 0,
    
    estimated_pension DECIMAL(12, 2) DEFAULT 0,
    estimated_base_pension DECIMAL(12, 2) DEFAULT 0,
    estimated_complementary_pension DECIMAL(12, 2) DEFAULT 0,
    replacement_rate DECIMAL(5, 2) DEFAULT 0,
    
    total_quarters INTEGER DEFAULT 0,
    required_quarters INTEGER DEFAULT 172,
    
    agirc_arrco_points INTEGER DEFAULT 0,
    rci_points INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_retirement_profiles_user_id ON retirement_profiles(user_id);

-- ============================================
-- TABLE: documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'other'
        CHECK (category IN ('salary_slip', 'career_statement', 'tax_declaration', 'retirement_contract', 'other')),
    file_size INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_user_category ON documents(user_id, category);

-- ============================================
-- TABLE: password_resets
-- ============================================
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_token ON password_resets(token);

-- ============================================
-- Trigger pour updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Données de test (optionnel)
-- ============================================
-- Mot de passe hashé pour: password123
-- INSERT INTO users (email, hashed_password, full_name, user_type)
-- VALUES ('test@elysion.fr', '$2a$10$...', 'Jean Dupont', 'employee');
