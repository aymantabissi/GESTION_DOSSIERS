const { Profile } = require('./Models');

async function createProfiles() {
  try {
    // تحقق واش Admin profile موجود
    const existing = await Profile.findOne({ where: { id_profile: 1 } });
    if (!existing) {
      await Profile.create({
        id_profile: 1,
        name: 'Admin',
        description: 'Administrator profile',
        is_active: true
      });
      console.log('✅ Admin profile created');
    } else {
      console.log('Admin profile already exists');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating profile:', err);
    process.exit(1);
  }
}

createProfiles();
