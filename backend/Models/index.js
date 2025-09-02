const { Sequelize } = require('sequelize');
require('dotenv').config();

// ============= DATABASE CONNECTION CONFIGURATION ============
let sequelize;

if (process.env.DATABASE_URL) {
  console.log('🚀 Connecting to production database...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  console.log('🏠 Connecting to local database...');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'gestiondb',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'admin',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
    }
  );
}

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ DB connection error:', err.message));

// ============= IMPORT MODELS ============
const User = require('./User');
const Profile = require('./Profile');
const Permission = require('./Permission');
const ProfilePermission = require('./ProfilePermission');
const Division = require('./Division');
const Service = require('./Service');
const Dossier = require('./Dossier');
const Instruction = require('./Instruction');
const SituationDossier = require('./SituationDossier');
const DossierInstruction = require('./DossierInstruction');
const Notification = require('./Notification');

// ============= RELATIONS ============

// ---- Profile & User ----
User.belongsTo(Profile, { foreignKey: 'id_profile', as: 'Profile' });
Profile.hasMany(User, { foreignKey: 'id_profile', as: 'users' });

// ---- Notifications ----
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE', hooks: true });

Notification.belongsTo(Dossier, { foreignKey: 'dossier_id', as: 'dossier', allowNull: true });
Dossier.hasMany(Notification, { foreignKey: 'dossier_id', as: 'notifications', onDelete: 'CASCADE', hooks: true });

Notification.belongsTo(Instruction, { foreignKey: 'instruction_id', as: 'instruction', allowNull: true });
Instruction.hasMany(Notification, { foreignKey: 'instruction_id', as: 'notifications', onDelete: 'CASCADE', hooks: true });

// ---- Profile & Permission (Many-to-Many) ----
Profile.belongsToMany(Permission, { through: ProfilePermission, foreignKey: 'id_profile', as: 'permissions' });
Permission.belongsToMany(Profile, { through: ProfilePermission, foreignKey: 'id_permission', as: 'profiles' });

ProfilePermission.belongsTo(Permission, { foreignKey: 'id_permission', as: 'permission' });
ProfilePermission.belongsTo(Profile, { foreignKey: 'id_profile', as: 'profile' });

// ---- Division & Service & User ----
User.belongsTo(Division, { foreignKey: 'id_division', as: 'division' });
Division.hasMany(User, { foreignKey: 'id_division', as: 'users' });

User.belongsTo(Service, { foreignKey: 'id_service', as: 'service' });
Service.hasMany(User, { foreignKey: 'id_service', as: 'users' });

Service.belongsTo(Division, { foreignKey: 'id_division', as: 'division' });
Division.hasMany(Service, { foreignKey: 'id_division', as: 'services' });

// ---- Dossier ----
Dossier.belongsTo(Division, { foreignKey: 'id_division', as: 'division' });
Division.hasMany(Dossier, { foreignKey: 'id_division', as: 'dossiers' });

Dossier.belongsTo(Service, { foreignKey: 'id_service', as: 'service' });
Service.hasMany(Dossier, { foreignKey: 'id_service', as: 'dossiers' });

Dossier.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
User.hasMany(Dossier, { foreignKey: 'id_user', as: 'dossiers' });

// ---- Instruction ----
Instruction.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
User.hasMany(Instruction, { foreignKey: 'id_user', as: 'instructions' });

// ---- SituationDossier ----
SituationDossier.belongsTo(Dossier, { foreignKey: 'num_dossier', as: 'dossier' });
Dossier.hasMany(SituationDossier, { foreignKey: 'num_dossier', as: 'situations', onDelete: 'CASCADE', hooks: true });

// ---- DossierInstruction ----
DossierInstruction.belongsTo(Instruction, { foreignKey: 'num_instruction', as: 'instruction' });
DossierInstruction.belongsTo(SituationDossier, { foreignKey: 'num_situation', as: 'situation' });
DossierInstruction.belongsTo(Dossier, { foreignKey: 'num_dossier', as: 'dossier' });

Instruction.hasMany(DossierInstruction, { foreignKey: 'num_instruction', as: 'dossierInstructions', onDelete: 'CASCADE', hooks: true });
SituationDossier.hasMany(DossierInstruction, { foreignKey: 'num_situation', as: 'dossierInstructions', onDelete: 'CASCADE', hooks: true });
Dossier.hasMany(DossierInstruction, { foreignKey: 'num_dossier', as: 'dossierInstructions', onDelete: 'CASCADE', hooks: true });

console.log('✅ Models and relations configured correctly');

module.exports = {
  sequelize,
  User,
  Profile,
  Permission,
  ProfilePermission,
  Division,
  Service,
  Dossier,
  Instruction,
  SituationDossier,
  DossierInstruction,
  Notification
};
