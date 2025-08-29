const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const SituationDossier = sequelize.define('SituationDossier', {
  num_situation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
libelle_situation: {
  type: DataTypes.ENUM('Dossier créé',  'Instruction ajoutée',  'Nouveau', 'En cours', 'Suspendu', 'En retard', 'Terminé', 'Clôturé'),
  allowNull: false
},
  observation_situation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_situation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_dernier_modification: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  num_dossier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dossiers',
      key: 'num_dossier'
    }
  }
}, {
  tableName: 'situation_dossiers',
  timestamps: false
});

module.exports = SituationDossier;