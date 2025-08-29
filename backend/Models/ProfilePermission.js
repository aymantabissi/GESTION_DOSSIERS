const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const ProfilePermission = sequelize.define('ProfilePermission', {
  id_profile: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'profiles',
      key: 'id_profile'
    }
  },
  id_permission: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id_permission'
    }
  }
}, {
  tableName: 'profile_permissions',
  timestamps: false
});

module.exports = ProfilePermission;