const sequelize = require('../Config/db');

// Import tous les modèles
const User = require('./User');
const Profile = require('./Profile');
const Permission = require('./Permission');
const ProfilePermission = require('./ProfilePermission');
const Division = require('./Division');
const Notification = require('./Notification ');
const Service = require('./Service');
const Dossier = require('./Dossier');
const Instruction = require('./Instruction');
const SituationDossier = require('./SituationDossier');
const DossierInstruction = require('./DossierInstruction');

// ============= RELATIONS IMPORTANTES POUR LES PERMISSIONS =============

// User belongs to Profile
User.belongsTo(Profile, { foreignKey: 'id_profile', as: 'Profile' });
Profile.hasMany(User, { 
  foreignKey: 'id_profile', 
  as: 'users' 
});
// Relation obligatoire: Notification → User
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

// Optional: si t7eb tie notifications l dossiers / instructions
Notification.belongsTo(Dossier, { foreignKey: 'dossier_id', as: 'dossier', allowNull: true });
Dossier.hasMany(Notification, { foreignKey: 'dossier_id', as: 'notifications' });

Notification.belongsTo(Instruction, { foreignKey: 'instruction_id', as: 'instruction', allowNull: true });
Instruction.hasMany(Notification, { foreignKey: 'instruction_id', as: 'notifications' });

// Profile - Permission (Many-to-Many)
Profile.belongsToMany(Permission, {
  through: ProfilePermission,
  foreignKey: 'id_profile',
  as: 'permissions'
});
Permission.belongsToMany(Profile, {
  through: ProfilePermission,
  foreignKey: 'id_permission',
  as: 'profiles'
});

ProfilePermission.belongsTo(Permission, {
  foreignKey: 'id_permission',
  as: 'permission'   // ✅ alias هنا
});
ProfilePermission.belongsTo(Profile, { foreignKey: 'id_profile', as: 'profile' });


// ============= RELATIONS DIVISIONS/SERVICES =============

User.belongsTo(Division, { 
  foreignKey: 'id_division', 
  as: 'division' 
});
Division.hasMany(User, { 
  foreignKey: 'id_division', 
  as: 'users' 
});

User.belongsTo(Service, { 
  foreignKey: 'id_service', 
  as: 'service' 
});
Service.hasMany(User, { 
  foreignKey: 'id_service', 
  as: 'users' 
});

Service.belongsTo(Division, { 
  foreignKey: 'id_division', 
  as: 'division' 
});
Division.hasMany(Service, { 
  foreignKey: 'id_division', 
  as: 'services' 
});

// ============= RELATIONS DOSSIERS =============

Dossier.belongsTo(Division, { 
  foreignKey: 'id_division', 
  as: 'division' 
});
Division.hasMany(Dossier, { 
  foreignKey: 'id_division', 
  as: 'dossiers' 
});

Dossier.belongsTo(Service, { 
  foreignKey: 'id_service', 
  as: 'service' 
});
Service.hasMany(Dossier, { 
  foreignKey: 'id_service', 
  as: 'dossiers' 
});

Dossier.belongsTo(User, { 
  foreignKey: 'id_user', 
  as: 'user' 
});
User.hasMany(Dossier, { 
  foreignKey: 'id_user', 
  as: 'dossiers' 
});

// ============= RELATIONS INSTRUCTIONS =============

Instruction.belongsTo(User, { 
  foreignKey: 'id_user', 
  as: 'user' 
});
User.hasMany(Instruction, { 
  foreignKey: 'id_user', 
  as: 'instructions' 
});

// ============= RELATIONS SITUATIONS =============

SituationDossier.belongsTo(Dossier, { 
  foreignKey: 'num_dossier', 
  as: 'dossier' 
});

// **CASCADE DELETE pour situations et dossierInstructions**
Dossier.hasMany(SituationDossier, { 
  foreignKey: 'num_dossier', 
  as: 'situations',
  onDelete: 'CASCADE',   
  hooks: true
});


// ============= RELATIONS DOSSIER_INSTRUCTIONS =============

DossierInstruction.belongsTo(Instruction, {
  foreignKey: 'num_instruction',
  as: 'instruction'
});
DossierInstruction.belongsTo(SituationDossier, {
  foreignKey: 'num_situation',
  as: 'situation'
});
DossierInstruction.belongsTo(Dossier, {
  foreignKey: 'num_dossier',
  as: 'dossier'
});

// Relations inverses avec CASCADE si nécessaire
Instruction.hasMany(DossierInstruction, {
  foreignKey: 'num_instruction',
  as: 'dossierInstructions'
});
SituationDossier.hasMany(DossierInstruction, {
  foreignKey: 'num_situation',
  as: 'dossierInstructions'
});
Dossier.hasMany(DossierInstruction, {
  foreignKey: 'num_dossier',
  as: 'dossierInstructions',
  onDelete: 'CASCADE',
  hooks: true
});

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
