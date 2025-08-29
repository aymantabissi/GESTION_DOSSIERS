// scripts/seedDivisionsServices.js
const { Division, Service, sequelize } = require('../Models');

const seed = async () => {
  try {
    await sequelize.sync({ force: false }); // force:true يمسح البيانات القديمة

    // إضافة Divisions
    const divisions = await Division.bulkCreate([
      { lib_division_fr: 'Division A', lib_division_ar: 'القسم أ' },
      { lib_division_fr: 'Division B', lib_division_ar: 'القسم ب' }
    ]);

    // إضافة Services مرتبطين بالDivisions
    await Service.bulkCreate([
      { lib_service_fr: 'Service 1', lib_service_ar: 'الخدمة 1', id_division: divisions[0].id_division },
      { lib_service_fr: 'Service 2', lib_service_ar: 'الخدمة 2', id_division: divisions[1].id_division }
    ]);

    console.log('✅ Divisions et Services insérés avec succès');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors de l’insertion:', err);
  }
};

seed();
