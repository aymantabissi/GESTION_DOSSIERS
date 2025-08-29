const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const DossierInstruction = sequelize.define('DossierInstruction', {
  num_dossier: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'dossiers',
      key: 'num_dossier'
    }
  },
  num_situation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'situation_dossiers',
      key: 'num_situation'
    }
  },
  num_instruction: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'instructions',
      key: 'num_instruction'
    }
  }
}, {
  tableName: 'dossier_instructions',
  timestamps: false
});

module.exports = DossierInstruction;