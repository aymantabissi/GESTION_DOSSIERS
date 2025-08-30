const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_profile: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profiles',
      key: 'id_profile'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  id_division: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'divisions',
      key: 'id_division'
    }
  },
  photo: { // FIXED: changed from 'avatar' to 'photo'
    type: DataTypes.STRING(255), // path to image on server
    allowNull: true
  },
  id_service: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'services',
      key: 'id_service'
    }
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;