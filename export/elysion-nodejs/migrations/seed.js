const { User, UserProfile, RetirementProfile } = require('../src/models');
const { hashPassword } = require('../src/utils/helpers');

const seedDatabase = async () => {
  console.log('🌱 Insertion des données de test...');

  try {
    // Utilisateur de test
    const hashedPassword = await hashPassword('password123');
    
    const user = await User.create({
      email: 'test@elysion.fr',
      hashedPassword,
      fullName: 'Jean Dupont',
      userType: 'employee',
      isActive: true
    });

    console.log('✅ Utilisateur créé:', user.email);

    // Profil utilisateur
    const profile = await UserProfile.create({
      userId: user.id,
      dateOfBirth: '1985-06-15',
      gender: 'M',
      familySituation: 'married',
      childrenCount: 2,
      careerStartYear: 2008,
      currentSalary: 48000,
      validatedQuarters: 68,
      hadUnemployment: true,
      unemploymentDuration: 6,
      unemploymentUnit: 'months'
    });

    console.log('✅ Profil créé');

    // Profil retraite
    const retirementProfile = await RetirementProfile.create({
      userId: user.id,
      currentAge: 40,
      targetRetirementAge: 64,
      monthlyIncome: 4000,
      currentSavings: 25000,
      monthlyContributions: 300,
      estimatedPension: 2500,
      estimatedBasePension: 1600,
      estimatedComplementaryPension: 900,
      replacementRate: 62.5,
      totalQuarters: 68,
      requiredQuarters: 172,
      agircArrcoPoints: 4500
    });

    console.log('✅ Profil retraite créé');
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('Compte de test:');
    console.log('  Email: test@elysion.fr');
    console.log('  Mot de passe: password123');
    console.log('═══════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seedDatabase();
