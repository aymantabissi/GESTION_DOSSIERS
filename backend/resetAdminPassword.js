const bcrypt = require('bcryptjs');
const { User, Profile } = require('./Models'); // confirm path dyal Models
require('dotenv').config();

(async () => {
  try {
    const email = 'admin@example.com';
    const newPassword = 'admin123';
    const username = 'admin';
    const profileId = 1; // Admin profile, confirm kayn f profiles table

    // Check if profile exists
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      console.log(`❌ Profile with id ${profileId} not found. Creating profile...`);
      await Profile.create({
        id_profile: profileId,
        name: 'Admin',
        description: 'Super admin',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Admin profile created.');
    }

    // Generate hash
    const hash = await bcrypt.hash(newPassword, 10);

    // Try to update user
    const [updated] = await User.update(
      { password: hash },
      { where: { email } }
    );

    if (updated) {
      console.log(`✅ Password updated successfully for ${email}`);
    } else {
      console.log(`⚠️ User not found. Creating admin user...`);
      await User.create({
        username,
        email,
        password: hash,
        id_profile: profileId,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Admin user created with email ${email} and password ${newPassword}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating/creating admin:', err);
    process.exit(1);
  }
})();
