const { Division, Service, sequelize } = require('../backend/Models');

const run = async () => {
  try {
    await sequelize.sync();

    // إنشاء Divisions
    const div1 = await Division.create({ lib_division_fr: 'Division A', lib_division_ar: 'الإدارة أ' });
    const div2 = await Division.create({ lib_division_fr: 'Division B', lib_division_ar: 'الإدارة ب' });

    // إنشاء Services لكل Division
    await Service.bulkCreate([
      { lib_service_fr: 'Service 1', lib_service_ar: 'الخدمة 1', id_division: div1.id_division },
      { lib_service_fr: 'Service 2', lib_service_ar: 'الخدمة 2', id_division: div1.id_division },
      { lib_service_fr: 'Service 3', lib_service_ar: 'الخدمة 3', id_division: div2.id_division },
      { lib_service_fr: 'Service 4', lib_service_ar: 'الخدمة 4', id_division: div2.id_division }
    ]);

    console.log('✅ Divisions et Services créés avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l’insertion:', error);
    process.exit(1);
  }
};

run();
