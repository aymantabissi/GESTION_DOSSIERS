const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Service = sequelize.define('Service', {
  id_service: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_division: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'divisions',
      key: 'id_division'
    }
  },
  lib_service_fr: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lib_service_ar: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'services',
  timestamps: true
});

module.exports = Service;