// resetAdminPassword.js
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

// 🔹 Database configuration with fallbacks
let sequelize;

if (process.env.DATABASE_URL) {
  // Production configuration using DATABASE_URL
  console.log('📡 Using DATABASE_URL for connection...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local development configuration
  console.log('💻 Using local database configuration...');
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'gestiondb',
    username: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || 'admin'),
    logging: false
  });
}

// تعريف موديل User مؤقت للسكريبت
const User = sequelize.define('User', {
  id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  id_profile: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  id_division: { type: DataTypes.INTEGER, allowNull: true },
  photo: { type: DataTypes.STRING(255), allowNull: true },
  id_service: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'users',
  timestamps: true
});

const resetAdminPassword = async () => {
  try {
    // 🔹 Environment check
    console.log('🔍 Environment check:');
    if (process.env.DATABASE_URL) {
      console.log('DATABASE_URL: ***SET*** (Production mode)');
    } else {
      console.log('DB_HOST:', process.env.DB_HOST || 'localhost (default)');
      console.log('DB_PORT:', process.env.DB_PORT || '5432 (default)');
      console.log('DB_NAME:', process.env.DB_NAME || 'gestiondb (default)');
      console.log('DB_USER:', process.env.DB_USER || 'postgres (default)');
      console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'admin (default)');
    }
    console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('');

    // 🔹 Test database connection
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // 🔹 Configuration
    const userEmail = 'admin@example.com';
    const newPassword = 'admin123';

    console.log(`🔍 Looking for user with email: ${userEmail}`);

    // 🔹 Find user first
    const user = await User.findOne({ 
      where: { email: userEmail },
      attributes: ['id_user', 'username', 'email']
    });

    if (!user) {
      console.log(`❌ User with email ${userEmail} not found`);
      
      // List all users to help find the correct one
      console.log('\n📋 Available users in database:');
      const allUsers = await User.findAll({
        attributes: ['id_user', 'username', 'email', 'is_active'],
        order: [['id_user', 'ASC']]
      });
      
      if (allUsers.length === 0) {
        console.log('❌ No users found in database');
      } else {
        allUsers.forEach(u => {
          console.log(`- ID: ${u.id_user}, Username: ${u.username}, Email: ${u.email}, Active: ${u.is_active}`);
        });
      }
      
      process.exit(1);
    }

    console.log(`✅ User found: ${user.username} (ID: ${user.id_user})`);

    // 🔹 Hash new password
    console.log('🔐 Hashing new password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ Password hashed successfully');

    // 🔹 Update password
    console.log('💾 Updating password in database...');
    const [updatedRows] = await User.update(
      { password: hashedPassword },
      { where: { id_user: user.id_user } }
    );

    if (updatedRows > 0) {
      console.log('\n🎉 SUCCESS! Password reset completed!');
      console.log('========================================');
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`🔑 New Password: ${newPassword}`);
      console.log('========================================');
      
      // 🔹 Verify the new password works
      console.log('🔍 Verifying new password...');
      const updatedUser = await User.findByPk(user.id_user);
      const isPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
      
      if (isPasswordValid) {
        console.log('✅ Password verification successful!');
        console.log('🚀 You can now login with these credentials');
      } else {
        console.log('❌ Warning: Password verification failed!');
      }
    } else {
      console.log('❌ Failed to update password - no rows were affected');
    }

  } catch (error) {
    console.error('\n❌ Error occurred:');
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('🔌 Database connection failed!');
      console.error('\n💡 Troubleshooting steps:');
      console.error('1. Make sure PostgreSQL is running on your machine');
      console.error('2. Check your .env file is in the correct location');
      console.error('3. Verify database credentials are correct');
      console.error('4. Try connecting manually: psql -h localhost -U postgres -d gestiondb');
      
      if (error.message.includes('database') && error.message.includes('does not exist')) {
        console.error('5. Create the database first: createdb gestiondb');
      }
    } else if (error.name === 'SequelizeValidationError') {
      console.error('📝 Validation error:', error.message);
    } else {
      console.error('🔍 Full error details:', error.message);
    }
  } finally {
    try {
      await sequelize.close();
      console.log('\n🔌 Database connection closed');
    } catch (closeError) {
      // Ignore close errors
    }
    process.exit(0);
  }
};

// 🔹 Alternative functions for different scenarios

// Reset by username
const resetByUsername = async (username = 'admin', newPassword = 'admin123') => {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.log(`❌ Username '${username}' not found`);
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { username } });

    console.log(`✅ Password updated for username: ${username}`);
    console.log(`🔑 New password: ${newPassword}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

// Reset by user ID
const resetById = async (userId = 2, newPassword = 'admin123') => {
  try {
    await sequelize.authenticate();
    const user = await User.findByPk(userId);
    
    if (!user) {
      console.log(`❌ User ID ${userId} not found`);
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id_user: userId } });

    console.log(`✅ Password updated for user ID: ${userId}`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`🔑 New password: ${newPassword}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

// 🚀 Execute the script
console.log('🚀 Starting password reset script...\n');

// Choose ONE method to use:

// Method 1: Reset by email (default)
resetAdminPassword();

// Method 2: Reset by username (uncomment to use)
// resetByUsername('admin', 'admin123');

// Method 3: Reset by user ID (uncomment to use)
// resetById(2, 'admin123');