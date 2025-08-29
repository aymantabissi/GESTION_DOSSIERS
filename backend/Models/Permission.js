const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Permission = sequelize.define('Permission', {
  id_permission: {
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
  code_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'permissions',
  timestamps: true
});

module.exports = Permission;