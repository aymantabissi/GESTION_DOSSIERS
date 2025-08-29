const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

// Model Instruction
const Instruction = sequelize.define('Instruction', {
  id_instruction: {   // change from num_instruction
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle_instruction: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  }
}, {
  tableName: 'instructions',
  timestamps: true
});


module.exports = Instruction;