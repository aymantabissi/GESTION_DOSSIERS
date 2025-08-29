const { sequelize, Profile, Permission, ProfilePermission } = require('../Models');

const setupRolesPermissions = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Render database successfully');

    await sequelize.sync({ alter: true }); // تحديث الجداول إذا محتاج

    // === Profiles ===
    const profilesData = [
      { id_profile: 1, name: 'Admin', description: 'Super admin' },
      { id_profile: 2, name: 'Chef', description: 'Chef de Division/Service' },
      { id_profile: 3, name: 'Fonctionnaire', description: 'Fonctionnaire standard' },
      { id_profile: 4, name: 'SG', description: 'Secrétaire Général' },
      { id_profile: 5, name: 'CabinetGouv', description: 'Cabinet du Gouverneur' },
      { id_profile: 6, name: 'Gouv', description: 'Gouverneur' }
    ];

    for (const p of profilesData) {
      await Profile.upsert(p);
    }

    // === Permissions ===
    const permissionsData = [
      { code_name: 'CREATE_DOSSIER', name: 'Créer dossier' },
      { code_name: 'VIEW_DOSSIERS', name: 'Voir dossiers' },
      { code_name: 'UPDATE_DOSSIER', name: 'Modifier dossier' },
      { code_name: 'DELETE_DOSSIER', name: 'Supprimer dossier' },
      { code_name: 'ADD_INSTRUCTION', name: 'Ajouter instruction' },
      { code_name: 'VIEW_DOSSIER', name: 'Voir dossier spécifique' },
      { code_name: 'VIEW_INSTRUCTION', name: 'Voir instruction' },
      { code_name: 'MANAGE_USERS', name: 'Gérer les utilisateurs' },
      { code_name: 'VIEW_REPORTING', name: 'VIEW_REPORTING' },
      { code_name: 'VIEW_DIVISION', name: 'voir le division' },
      { code_name: 'VIEW_SERVICE', name: 'voir le service' },
      { code_name: 'EDIT_ETAT', name: 'update les etats' },
      { code_name: 'ADD_DIVISION', name: 'ajouter les DIVISION' },
      { code_name: 'EDIT_DIVISION', name: 'update les DIVISION' },
      { code_name: 'DELETE_DIVISION', name: 'supprimer les DIVISION' },
      { code_name: 'DELETE_INSTRUCTION', name: 'supprimer les instruction' },
    ];

    const permissions = [];
    for (const perm of permissionsData) {
      const p = await Permission.upsert(perm);
      permissions.push(p[0]);
    }

    // === ProfilePermissions Map ===
    const profilePermissionsMap = {
      Admin: [
        'CREATE_DOSSIER','VIEW_DOSSIERS','UPDATE_DOSSIER','DELETE_DOSSIER',
        'VIEW_DOSSIER','VIEW_SERVICE','VIEW_DIVISION','ADD_INSTRUCTION','EDIT_ETAT','DELETE_INSTRUCTION',
        'VIEW_INSTRUCTION','VIEW_REPORTING','MANAGE_USERS','ADD_DIVISION', 'EDIT_DIVISION', 'DELETE_DIVISION'
      ],
      Chef: [
        'CREATE_DOSSIER','VIEW_DOSSIERS','UPDATE_DOSSIER','DELETE_DOSSIER',
        'VIEW_DOSSIER','VIEW_SERVICE','VIEW_DIVISION','EDIT_ETAT','ADD_DIVISION', 'EDIT_DIVISION', 'DELETE_DIVISION'
      ],
      Gouv: [
        'ADD_INSTRUCTION','VIEW_REPORTING','VIEW_DOSSIERS','VIEW_INSTRUCTION','DELETE_INSTRUCTION'
      ],
      SG: [
        'ADD_INSTRUCTION','VIEW_REPORTING','VIEW_DOSSIERS','VIEW_INSTRUCTION','DELETE_INSTRUCTION'
      ],
      Fonctionnaire: [
        'VIEW_DOSSIER','VIEW_DOSSIERS','VIEW_INSTRUCTION','VIEW_DIVISION','VIEW_SERVICE','VIEW_REPORTING'
      ],
      CabinetGouv: [
        'VIEW_DOSSIER','VIEW_DOSSIERS','VIEW_INSTRUCTION','VIEW_DIVISION','VIEW_DIVISION','VIEW_REPORTING'
      ]
    };

    for (const profile of await Profile.findAll()) {
      const allowedPerms = profilePermissionsMap[profile.name] || [];
      for (const code_name of allowedPerms) {
        const perm = await Permission.findOne({ where: { code_name } });
        if (perm) {
          await ProfilePermission.findOrCreate({
            where: { id_profile: profile.id_profile, id_permission: perm.id_permission }
          });
        }
      }
    }

    console.log('✅ Profiles, Permissions, ProfilePermissions created successfully on Render DB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error setting up roles and permissions on Render DB:', err);
    process.exit(1);
  }
};

setupRolesPermissions();
