const bcrypt = require('bcryptjs');
const { User } = require('./Models'); // check path dyal User model

(async () => {
  try {
    const email = 'admin@example.com'; // Admin email
    const newPassword = 'admin123';    // password jdida

    // Generate hash
    const hash = await bcrypt.hash(newPassword, 10);

    // Update user
    const [updated] = await User.update(
      { password: hash },
      { where: { email } }
    );

    if (updated) {
      console.log(`✅ Password updated successfully for ${email}`);
    } else {
      console.log(`❌ User with email ${email} not found`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
})();
