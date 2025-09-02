// controllers/dashboardController.js
const { Dossier, SituationDossier, Division, Service } = require('../Models');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const userProfile = req.user.Profile?.name;   // authMiddleware includ dyal auth midlware
    const userDivision = req.user.id_division;
    const userService = req.user.id_service;

    let whereClause = {};

    //  Admin / SG / Gouverneur 
    if (["Admin", "SG", "CabinetGouv"].includes(userProfile)) {
      whereClause = {};
    }
    //  Chef de Division
    else if (userProfile === "Chef") {
      whereClause = { id_division: userDivision };
    }
    //  Chef de Service
    else if (userProfile === "ChefService") {
      whereClause = { id_service: userService };
    }
    //  Fonctionnaire  
    else {
      whereClause = { id_user: userId };
    }

    //  associer all dossier with  situation
    const dossiers = await Dossier.findAll({
      where: whereClause,
      include: [
        { model: Division, as: 'division' },
        { model: Service, as: 'service' },
        {
          model: SituationDossier,
          as: 'situations',
          separate: true,
          limit: 1, 
          order: [['date_situation', 'DESC']]
        }
      ]
    });

    // statistic
    const stats = {
      totalDossiers: dossiers.length,
      dossiersEnCours: 0,
      dossiersTraites: 0,
      dossiersEnRetard: 0
    };

    dossiers.forEach(d => {
      const dernierEtat = d.situations[0]?.libelle_situation?.toLowerCase();
      if (dernierEtat === 'en cours') stats.dossiersEnCours++;
      else if (dernierEtat === 'terminé') stats.dossiersTraites++;
      else if (dernierEtat === 'en retard') stats.dossiersEnRetard++;
    });

    // repation division و service
    const repartition = { parDivision: {}, parService: {} };
    dossiers.forEach(d => {
      const div = d.division?.lib_division_fr || 'N/A';
      const serv = d.service?.lib_service_fr || 'N/A';
      repartition.parDivision[div] = (repartition.parDivision[div] || 0) + 1;
      repartition.parService[serv] = (repartition.parService[serv] || 0) + 1;
    });

    // ossier les en reard 
    const alertes = dossiers.filter(
      d => d.situations[0]?.libelle_situation?.toLowerCase() === 'en retard'
    );

    // nouveau
    const dossiersRecents = dossiers
      .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
      .slice(0, 5);

    res.json({ stats, repartition, alertes, dossiersRecents });
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
