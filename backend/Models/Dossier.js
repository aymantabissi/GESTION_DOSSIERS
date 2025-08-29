const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Dossier = sequelize.define('Dossier', {
  num_dossier: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  intitule_dossier: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  id_division: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'divisions',
      key: 'id_division'
    }
  },
  id_service: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'services',
      key: 'id_service'
    }
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_dernier_modification: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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
  tableName: 'dossiers',
  timestamps: false
});

module.exports = Dossier;