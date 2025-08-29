const { User } = require('./Models'); // جايب الموديلات
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // تحقق واش الحساب موجود مسبقاً
    const existing = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existing) {
      console.log('Admin account already exists!');
      return process.exit(0);
    }

    // hash الباسوورد
    const hashedPassword = bcrypt.hashSync('admin123', 10);

    // إنشاء الحساب
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      id_profile: 1, // 1 = Admin
      is_active: true
    });

    console.log('✅ Admin account created:', admin.email);
    process.exit(0);

  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
