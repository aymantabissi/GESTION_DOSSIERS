// scripts/giveAdminPermissions.js
const { sequelize, Profile, Permission } = require('../Models');

async function giveAdminPermissions() {
  try {
    // 1️⃣ نجيب profile ديال admin
    const adminProfile = await Profile.findByPk(1); // نفترض id_profile = 1
    if (!adminProfile) {
      console.log('❌ Admin profile not found!');
      return;
    }

    // 2️⃣ نجيب جميع permissions
    const permissions = await Permission.findAll();

    // 3️⃣ نضيف كل permission للـ admin profile
    await adminProfile.setPermissions(permissions);

    console.log('✅ All permissions assigned to Admin successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error assigning permissions:', error);
    process.exit(1);
  }
}

// نعمل run للfunction
giveAdminPermissions();
