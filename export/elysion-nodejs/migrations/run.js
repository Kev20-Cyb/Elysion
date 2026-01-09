const { sequelize } = require('../src/config/database');
const { 
  User, 
  UserProfile, 
  RetirementProfile, 
  Document, 
  PasswordReset 
} = require('../src/models');

const runMigrations = async () => {
  const args = process.argv.slice(2);
  const fresh = args.includes('--fresh');

  console.log('🔄 Démarrage des migrations...');

  try {
    if (fresh) {
      console.log('⚠️  Mode fresh: suppression des tables existantes...');
      await sequelize.drop();
    }

    // Synchroniser tous les modèles
    await sequelize.sync({ force: fresh, alter: !fresh });

    console.log('✅ Migrations terminées avec succès');
    console.log('');
    console.log('Tables créées:');
    console.log('  • users');
    console.log('  • user_profiles');
    console.log('  • retirement_profiles');
    console.log('  • documents');
    console.log('  • password_resets');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  }
};

runMigrations();
