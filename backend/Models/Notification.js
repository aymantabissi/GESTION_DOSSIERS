const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const User = require('./User');
const Dossier = require('./Dossier');
const Instruction = require('./Instruction');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {                   // li ghad ytsal lih notification
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user'
    }
  },
  type: {                      // ex: 'dossier', 'instruction', 'situation'
    type: DataTypes.STRING(50),
    allowNull: false
  },
  message: {                   // le message li yban f notification
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: {                      // lien li yredirecti user
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: false
});

module.exports = Notification;
