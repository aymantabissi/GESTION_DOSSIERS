// controllers/serviceController.js
const { Service, Division } = require('../Models');

// 🔹 Get all services avec division join
exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{
        model: Division,
        as: 'division',
        attributes: ['id_division', 'lib_division_fr']
      }]
    });
    res.json(services);
  } catch (error) {
    console.error('❌ getServices error:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des services' });
  }
};

// 🔹 Create service
exports.createService = async (req, res) => {
  try {
    const { lib_service_fr, lib_service_ar, id_division } = req.body;
    if (!lib_service_fr || !id_division) {
      return res.status(400).json({ message: 'Nom service et division obligatoires' });
    }
    const service = await Service.create({ lib_service_fr, lib_service_ar, id_division });
    res.status(201).json(service);
  } catch (error) {
    console.error('❌ createService error:', error);
    res.status(500).json({ message: 'Erreur création service' });
  }
};

// 🔹 Update service
exports.updateService = async (req, res) => {
  try {
    const { lib_service_fr, lib_service_ar, id_division } = req.body;
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable' });

    await service.update({ lib_service_fr, lib_service_ar, id_division });
    res.json(service);
  } catch (error) {
    console.error('❌ updateService error:', error);
    res.status(500).json({ message: 'Erreur mise à jour service' });
  }
};

// 🔹 Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable' });

    await service.destroy(); // Sequelize CASCADE si défini côté relation
    res.json({ message: 'Service supprimé' });
  } catch (error) {
    console.error('❌ deleteService error:', error);
    res.status(500).json({ message: 'Erreur suppression service' });
  }
};
