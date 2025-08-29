const { Sequelize } = require('sequelize');
require('dotenv').config();
const { Profile } = require('./Models'); // Profile model

// Connect to Render database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

async function createProfiles() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Render database successfully');

    // تحقق واش Admin profile موجود
    const existing = await Profile.findOne({ where: { id_profile: 1 } });
    if (!existing) {
      await Profile.create({
        id_profile: 1,
        name: 'Admin',
        description: 'Administrator profile',
        is_active: true
      });
      console.log('✅ Admin profile created on Render DB');
    } else {
      console.log('Admin profile already exists on Render DB');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating profile on Render DB:', err);
    process.exit(1);
  }
}

createProfiles();
