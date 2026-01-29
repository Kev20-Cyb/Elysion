const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ============================================
// ENUM Types
// ============================================
const UserType = {
  EMPLOYEE: 'employee',
  FREELANCER: 'freelancer',
  BUSINESS_OWNER: 'business_owner'
};

const DocumentCategory = {
  SALARY_SLIP: 'salary_slip',
  CAREER_STATEMENT: 'career_statement',
  TAX_DECLARATION: 'tax_declaration',
  RETIREMENT_CONTRACT: 'retirement_contract',
  OTHER: 'other'
};

const Gender = {
  MALE: 'M',
  FEMALE: 'F'
};

// ============================================
// Model: User
// ============================================
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  hashedPassword: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'hashed_password'
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'full_name'
  },
  userType: {
    type: DataTypes.ENUM(Object.values(UserType)),
    allowNull: false,
    defaultValue: UserType.EMPLOYEE,
    field: 'user_type'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// ============================================
// Model: UserProfile
// ============================================
const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Informations personnelles
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.ENUM(Object.values(Gender)),
    field: 'gender'
  },
  familySituation: {
    type: DataTypes.STRING(50),
    field: 'family_situation'
  },
  childrenCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'children_count'
  },
  // Informations professionnelles
  careerStartYear: {
    type: DataTypes.INTEGER,
    field: 'career_start_year'
  },
  currentSalary: {
    type: DataTypes.DECIMAL(12, 2),
    field: 'current_salary'
  },
  validatedQuarters: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'validated_quarters'
  },
  // Spécifique Freelance
  activityType: {
    type: DataTypes.STRING(100),
    field: 'activity_type'
  },
  legalStatus: {
    type: DataTypes.STRING(100),
    field: 'legal_status'
  },
  averageIncome: {
    type: DataTypes.DECIMAL(12, 2),
    field: 'average_income'
  },
  pensionScheme: {
    type: DataTypes.STRING(100),
    field: 'pension_scheme'
  },
  // Périodes assimilées
  hadUnemployment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'had_unemployment'
  },
  unemploymentDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'unemployment_duration'
  },
  unemploymentUnit: {
    type: DataTypes.STRING(10),
    defaultValue: 'months',
    field: 'unemployment_unit'
  },
  hadParentalLeave: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'had_parental_leave'
  },
  parentalLeaveDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'parental_leave_duration'
  },
  parentalLeaveUnit: {
    type: DataTypes.STRING(10),
    defaultValue: 'months',
    field: 'parental_leave_unit'
  },
  hadSickLeave: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'had_sick_leave'
  },
  sickLeaveDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sick_leave_duration'
  },
  sickLeaveUnit: {
    type: DataTypes.STRING(10),
    defaultValue: 'days',
    field: 'sick_leave_unit'
  }
}, {
  tableName: 'user_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// ============================================
// Model: RetirementProfile
// ============================================
const RetirementProfile = sequelize.define('RetirementProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  currentAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'current_age'
  },
  targetRetirementAge: {
    type: DataTypes.INTEGER,
    defaultValue: 65,
    field: 'target_retirement_age'
  },
  monthlyIncome: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'monthly_income'
  },
  currentSavings: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'current_savings'
  },
  monthlyContributions: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'monthly_contributions'
  },
  estimatedPension: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'estimated_pension'
  },
  estimatedBasePension: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'estimated_base_pension'
  },
  estimatedComplementaryPension: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'estimated_complementary_pension'
  },
  replacementRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'replacement_rate'
  },
  totalQuarters: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_quarters'
  },
  requiredQuarters: {
    type: DataTypes.INTEGER,
    defaultValue: 172,
    field: 'required_quarters'
  },
  agircArrcoPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'agirc_arrco_points'
  },
  rciPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'rci_points'
  }
}, {
  tableName: 'retirement_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'last_updated'
});

// ============================================
// Model: Document
// ============================================
const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  originalFilename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'original_filename'
  },
  category: {
    type: DataTypes.ENUM(Object.values(DocumentCategory)),
    allowNull: false,
    defaultValue: DocumentCategory.OTHER
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'file_size'
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_path'
  },
  mimeType: {
    type: DataTypes.STRING(100),
    defaultValue: 'application/pdf',
    field: 'mime_type'
  }
}, {
  tableName: 'documents',
  timestamps: true,
  createdAt: 'uploaded_at',
  updatedAt: 'updated_at'
});

// ============================================
// Model: PasswordReset
// ============================================
const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'password_resets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// ============================================
// Associations
// ============================================
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(RetirementProfile, { foreignKey: 'userId', as: 'retirementProfile', onDelete: 'CASCADE' });
RetirementProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Document, { foreignKey: 'userId', as: 'documents', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ============================================
// Exports
// ============================================
module.exports = {
  User,
  UserProfile,
  RetirementProfile,
  Document,
  PasswordReset,
  UserType,
  DocumentCategory,
  Gender
};
