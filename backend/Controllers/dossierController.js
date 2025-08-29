const { Dossier, Division, Service, SituationDossier, DossierInstruction, Instruction, User,Notification } = require('../Models');
const { Op } = require('sequelize');
exports.createDossier = async (req, res) => {
  try {
    const { intitule_dossier, id_division, id_service } = req.body;
    const userId = req.user.id_user;

    // التأكد من وجود division
    const division = await Division.findByPk(id_division);
    if (!division) return res.status(400).json({ message: '❌ Division introuvable' });

    // التأكد من وجود service إذا تم تمريره
    let service = null;
    if (id_service) {
      service = await Service.findByPk(id_service);
      if (!service) return res.status(400).json({ message: '❌ Service introuvable' });
    }

    // إنشاء الدوسيه
    const dossier = await Dossier.create({
      intitule_dossier,
      id_division,
      id_service: id_service || null,
      id_user: userId,
      date_creation: new Date(),
      date_dernier_modification: new Date()
    });

    // إنشاء Situation initiale
    const situation = await SituationDossier.create({
      num_dossier: dossier.num_dossier,
      libelle_situation: 'Nouveau',
      observation_situation: 'Situation initiale',
      date_situation: new Date()
    });

    // 🔔 إنشاء Notifications لكل المستخدمين النشطين
    const users = await User.findAll({ where: { is_active: true } });
    const notifications = users.map(u => ({
      user_id: u.id_user,
      type: 'dossier',
      message: `Nouveau dossier créé: ${dossier.intitule_dossier}`,
      link: `/dossiers/${dossier.num_dossier}`
    }));
    await Notification.bulkCreate(notifications);

    res.status(201).json({ message: '✅ Dossier créé avec situation initiale et notifications envoyées', dossier, situation });

  } catch (error) {
    console.error('createDossier error:', error);
    res.status(500).json({ message: '❌ Erreur lors de la création du dossier', error: error.message });
  }
};


exports.getDossiers = async (req, res) => {
  try {
    const user = req.user;
    let whereClause = {};

    // 🔹 Role-based filter
    if (user.role === "Chef") {
      whereClause = {};
    } else if (user.role === "Manager") {
      whereClause = { id_division: user.id_division };
    } else if (user.role === "User") {
      whereClause = { id_service: user.id_service };
    }

    // 🔹 Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 🔹 Search param
    const search = req.query.search;
    const status = req.query.status;

    // 🔹 Build search conditions safely
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { intitule_dossier: { [Op.iLike]: `%${search}%` } },
          { '$user.username$': { [Op.iLike]: `%${search}%` } },
          { '$service.lib_service_fr$': { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    // 🔹 Include array
    const includeArray = [
      { model: Division, as: 'division', attributes: ['lib_division_fr'], required: false },
      { model: Service, as: 'service', attributes: ['lib_service_fr'], required: false },
      { model: User, as: 'user', attributes: ['username'], required: false },
      { 
        model: SituationDossier, 
        as: 'situations', 
        required: false,
        include: [
          { 
            model: DossierInstruction, 
            as: 'dossierInstructions', 
            required: false,
            include: [
              { model: Instruction, as: 'instruction', required: false, include: [
                  { model: User, as: 'user', attributes: ['username'], required: false }
              ]}
            ]
          }
        ]
      }
    ];

    // 🔹 Status filtering safely
    if (status && status !== 'all') {
      includeArray[3].required = true;
      switch (status) {
        case 'new':
          includeArray[3].where = { libelle_situation: 'Dossier créé' };
          break;
        case 'completed':
          includeArray[3].where = { libelle_situation: 'Terminé' };
          break;
        case 'progress':
          includeArray[3].where = { 
            libelle_situation: { 
              [Op.and]: [
                { [Op.ne]: 'Dossier créé' },
                { [Op.ne]: 'Terminé' }
              ]
            }
          };
          break;
        default:
          includeArray[3].required = false;
      }
    }

    // 🔹 Debug: log queries
    console.log("WhereClause:", JSON.stringify(whereClause, null, 2));
    console.log("IncludeArray:", includeArray.map(i => i.as));

    // 🔹 Fetch data safely
    const result = await Dossier.findAndCountAll({
      where: whereClause,
      include: includeArray,
      order: [[{ model: SituationDossier, as: 'situations' }, 'date_situation', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    res.json({
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      dossiers: result.rows
    });

  } catch (error) {
    console.error("❌ getDossiers error:", error);
    res.json({
      total: 0,
      page: 1,
      totalPages: 0,
      dossiers: [],
      error: error.message
    });
  }
};
exports.updateDossier = async (req, res) => {
  try {
    const { id } = req.params;
    const { intitule_dossier } = req.body;
    const dossier = await Dossier.findByPk(id);
    if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });

    dossier.intitule_dossier = intitule_dossier || dossier.intitule_dossier;
    dossier.date_dernier_modification = new Date();
    await dossier.save();

    res.json({ message: '✅ Dossier mis à jour', dossier });
  } catch (error) {
    console.error('updateDossier error:', error);
    res.status(500).json({ message: '❌ Erreur lors de la mise à jour', error });
  }
};

exports.deleteDossier = async (req, res) => {
  try {
    const { id } = req.params;
    const dossier = await Dossier.findByPk(id);
    if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });

    // Delete will cascade automatically to situations and dossierInstructions
    await dossier.destroy();

    res.json({ message: '✅ Dossier, situations et instructions supprimés' });
  } catch (error) {
    console.error('deleteDossier error:', error);
    res.status(500).json({ message: '❌ Erreur lors de la suppression', error });
  }
};
// 📌 Suivi d’un dossier
exports.getSuiviByDossier = async (req, res) => {
  try {
    const { id } = req.params;

    const dossier = await Dossier.findByPk(id, {
      include: [
        {
          model: SituationDossier,
          as: 'situations',
          include: [
            {
              model: DossierInstruction,
              as: 'dossierInstructions',
              include: [
                { model: Instruction, as: 'instruction' }
              ]
            }
          ],
          order: [['date_situation', 'ASC']]
        }
      ]
    });

    if (!dossier) return res.status(404).json({ message: '❌ Dossier introuvable' });

    res.json(dossier.situations);

  } catch (error) {
    console.error("getSuiviByDossier error:", error);
    res.status(500).json({ message: "❌ Erreur lors de la récupération du suivi", error: error.message });
  }
};
// controllers/dossierController.js

exports.addInstructionToDossier = async (req, res) => {
  try {
    const { num_dossier, id_instruction } = req.body;

    if (!num_dossier || !id_instruction) {
      return res.status(400).json({ message: 'Dossier et instruction requis' });
    }

    // Vérifier si l'instruction existe
    const instruction = await Instruction.findByPk(id_instruction);
    if (!instruction) return res.status(404).json({ message: 'Instruction non trouvée' });

    // Vérifier si le dossier existe
    const dossier = await Dossier.findByPk(num_dossier);
    if (!dossier) return res.status(404).json({ message: 'Dossier non trouvé' });

    // Créer une nouvelle situation pour cette instruction
    const newSituation = await SituationDossier.create({
      num_dossier: dossier.num_dossier,
      libelle_situation: 'Instruction ajoutée',
      observation_situation: `Instruction: ${instruction.libelle_instruction}`,
      date_situation: new Date()
    });

    // Ajouter l'instruction liée à cette nouvelle situation
    await DossierInstruction.create({
      num_dossier: dossier.num_dossier,
      num_instruction: instruction.id_instruction,
      num_situation: newSituation.num_situation
    });

    res.status(200).json({ message: 'Instruction ajoutée et nouvelle situation créée', situation: newSituation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
exports.getDossierInstructions = async (req, res) => {
  try {
    const { num_dossier } = req.params;

    // Vérifier si dossier كاين
    const dossier = await Dossier.findByPk(num_dossier, {
      include: [
        {
          model: Instruction,
          through: { attributes: [] } // باش ميظهرش table pivot
        }
      ]
    });

    if (!dossier) {
      return res.status(404).json({ message: "Dossier non trouvé" });
    }

    res.status(200).json(dossier.Instructions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};