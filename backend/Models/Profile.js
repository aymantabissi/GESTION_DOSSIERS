const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Profile = sequelize.define('Profile', {
  id_profile: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'profiles',
  timestamps: true   // ✅ هادي كتخلي Sequelize يزيد createdAt / updatedAt أوتوماتيك
});

module.exports = Profile;