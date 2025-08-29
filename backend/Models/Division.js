const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Division = sequelize.define('Division', {
  id_division: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  lib_division_fr: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lib_division_ar: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'divisions',
  timestamps: true
});

module.exports = Division;
