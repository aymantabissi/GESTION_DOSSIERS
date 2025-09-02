const { 
  Dossier, Division, Service, SituationDossier, DossierInstruction, Instruction, User, Notification 
} = require('../Models');
const { Op } = require('sequelize');
const { sequelize } = require('../Models'); // باش نستعمل transaction

// ================= CREATE DOSSIER =================
exports.createDossier = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { intitule_dossier, id_division, id_service } = req.body;
    const userId = req.user.id_user;

    const division = await Division.findByPk(id_division, { transaction: t });
    if (!division) throw new Error('❌ Division introuvable');

    let service = null;
    if (id_service) {
      service = await Service.findByPk(id_service, { transaction: t });
      if (!service) throw new Error('❌ Service introuvable');
    }

    const dossier = await Dossier.create({
      intitule_dossier,
      id_division,
      id_service: id_service || null,
      id_user: userId,
      date_creation: new Date(),
      date_dernier_modification: new Date()
    }, { transaction: t });

    const situation = await SituationDossier.create({
      num_dossier: dossier.num_dossier,
      libelle_situation: 'Nouveau',
      observation_situation: 'Situation initiale',
      date_situation: new Date()
    }, { transaction: t });

    const users = await User.findAll({ where: { is_active: true }, transaction: t });
    const notifications = users.map(u => ({
      user_id: u.id_user,
      type: 'dossier',
      message: `Nouveau dossier créé: ${dossier.intitule_dossier}`,
      link: `/dossiers/${dossier.num_dossier}`
    }));
    await Notification.bulkCreate(notifications, { transaction: t });

    await t.commit();
    res.status(201).json({ message: '✅ Dossier créé avec situation initiale et notifications envoyées', dossier, situation });

  } catch (error) {
    await t.rollback();
    console.error('createDossier error:', error);
    res.status(500).json({ message: error.message || '❌ Erreur lors de la création du dossier' });
  }
};

// ================= GET DOSSIERS =================
// ================= GET DOSSIERS (OPTIMIZED) =================
exports.getDossiers = async (req, res) => {
  try {
    console.log('📋 Starting getDossiers request...', {
      user: req.user?.id_user,
      role: req.user?.role,
      query: req.query
    });

    const user = req.user;
    let whereClause = {};

    // Apply role-based filtering
    if (user.role === "Manager") whereClause.id_division = user.id_division;
    else if (user.role === "User") whereClause.id_service = user.id_service;

    // Pagination with validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const search = req.query.search?.trim();
    const status = req.query.status;

    // Search functionality (simplified to avoid complex joins in WHERE clause)
    if (search) {
      whereClause = {
        ...whereClause,
        intitule_dossier: { [Op.iLike]: `%${search}%` }
      };
    }

    console.log('🔍 Query conditions:', { whereClause, page, limit, search, status });

    // Optimized includes - reduced complexity
    const includeArray = [
      { 
        model: Division, 
        as: 'division', 
        attributes: ['lib_division_fr'], 
        required: false 
      },
      { 
        model: Service, 
        as: 'service', 
        attributes: ['lib_service_fr'], 
        required: false 
      },
      { 
        model: User, 
        as: 'user', 
        attributes: ['username'], 
        required: false 
      }
    ];

    // Get basic dossier data first
    let dossiersQuery = {
      where: whereClause,
      include: includeArray,
      order: [['date_dernier_modification', 'DESC']],
      limit,
      offset,
      attributes: [
        'num_dossier', 
        'intitule_dossier', 
        'date_creation', 
        'date_dernier_modification',
        'id_division',
        'id_service',
        'id_user'
      ]
    };

    console.log('⏱️ Executing main query...');
    const startTime = Date.now();
    
    const result = await Dossier.findAndCountAll(dossiersQuery);
    
    const queryTime = Date.now() - startTime;
    console.log(`✅ Main query completed in ${queryTime}ms, found ${result.count} total dossiers`);

    // If we have dossiers, get their latest situations separately
    let dossiersWithSituations = result.rows;
    
    if (result.rows.length > 0) {
      console.log('📊 Fetching latest situations...');
      const dossierIds = result.rows.map(d => d.num_dossier);
      
      // Get latest situation for each dossier
      const latestSituations = await SituationDossier.findAll({
        where: {
          num_dossier: { [Op.in]: dossierIds }
        },
        attributes: ['num_dossier', 'libelle_situation', 'date_situation', 'observation_situation'],
        order: [['date_situation', 'DESC']],
        // Get only the latest situation per dossier
        group: ['num_dossier', 'num_situation', 'libelle_situation', 'date_situation', 'observation_situation'],
        limit: dossierIds.length
      });

      // Create a map for quick lookup
      const situationMap = {};
      latestSituations.forEach(situation => {
        if (!situationMap[situation.num_dossier]) {
          situationMap[situation.num_dossier] = situation;
        }
      });

      // Apply status filtering after getting situations
      if (status && status !== 'all') {
        dossiersWithSituations = result.rows.filter(dossier => {
          const situation = situationMap[dossier.num_dossier];
          if (!situation) return false;
          
          switch (status) {
            case 'new':
              return ['Nouveau', 'Dossier créé'].includes(situation.libelle_situation);
            case 'completed':
              return situation.libelle_situation === 'Terminé';
            case 'progress':
              return !['Nouveau', 'Dossier créé', 'Terminé'].includes(situation.libelle_situation);
            default:
              return true;
          }
        });
      }

      // Attach situations to dossiers
      dossiersWithSituations = dossiersWithSituations.map(dossier => {
        const situation = situationMap[dossier.num_dossier];
        return {
          ...dossier.toJSON(),
          situations: situation ? [situation] : []
        };
      });

      console.log(`📋 Processed ${dossiersWithSituations.length} dossiers with situations`);
    }

    const totalTime = Date.now() - startTime;
    console.log(`🏁 Total request completed in ${totalTime}ms`);

    // Calculate pagination for filtered results
    const filteredTotal = status && status !== 'all' ? dossiersWithSituations.length : result.count;
    
    res.json({
      total: filteredTotal,
      page,
      totalPages: Math.ceil(filteredTotal / limit),
      dossiers: dossiersWithSituations,
      queryTime: totalTime
    });

  } catch (error) {
    console.error("❌ getDossiers error:", {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      sql: error.sql ? error.sql.substring(0, 300) : undefined
    });
    
    res.status(500).json({ 
      total: 0, 
      page: 1, 
      totalPages: 0, 
      dossiers: [], 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ================= GET SUIVI BY DOSSIER =================
exports.getSuiviByDossier = async (req, res) => {
  try {
    const { id } = req.params;

    const dossier = await Dossier.findByPk(id, {
      include: [
        { 
          model: Division, 
          as: 'division', 
          attributes: ['lib_division_fr'] 
        },
        { 
          model: Service, 
          as: 'service', 
          attributes: ['lib_service_fr'] 
        },
        { 
          model: User, 
          as: 'user', 
          attributes: ['username'] 
        },
        { 
          model: SituationDossier, 
          as: 'situations',
          attributes: ['num_situation', 'libelle_situation', 'observation_situation', 'date_situation'],
          include: [
            {
              model: DossierInstruction,
              as: 'dossierInstructions',
              required: false,
              include: [
                {
                  model: Instruction,
                  as: 'instruction',
                  attributes: ['id_instruction', 'libelle_instruction'],
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['username']
                    }
                  ]
                }
              ]
            }
          ],
          order: [['date_situation', 'ASC']]
        }
      ]
    });

    if (!dossier) {
      return res.status(404).json({ message: 'Dossier introuvable' });
    }

    res.json({
      dossier: {
        num_dossier: dossier.num_dossier,
        intitule_dossier: dossier.intitule_dossier,
        date_creation: dossier.date_creation,
        date_dernier_modification: dossier.date_dernier_modification,
        division: dossier.division,
        service: dossier.service,
        user: dossier.user
      },
      suivi: dossier.situations
    });

  } catch (error) {
    console.error('getSuiviByDossier error:', error);
    res.status(500).json({ message: '❌ Erreur lors de la récupération du suivi', error: error.message });
  }
};

// ================= UPDATE DOSSIER =================
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

// ================= DELETE DOSSIER =================
exports.deleteDossier = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const dossier = await Dossier.findByPk(id, { transaction: t });
    if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });

    await dossier.destroy({ transaction: t });
    await t.commit();

    res.json({ message: '✅ Dossier, situations et instructions supprimés' });
  } catch (error) {
    await t.rollback();
    console.error('deleteDossier error:', error);
    res.status(500).json({ message: '❌ Erreur lors de la suppression', error });
  }
};

// ================= ADD INSTRUCTION TO DOSSIER =================
exports.addInstructionToDossier = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { num_dossier, id_instruction } = req.body;
    if (!num_dossier || !id_instruction) throw new Error('Dossier et instruction requis');

    const instruction = await Instruction.findByPk(id_instruction, { transaction: t });
    if (!instruction) throw new Error('Instruction non trouvée');

    const dossier = await Dossier.findByPk(num_dossier, { transaction: t });
    if (!dossier) throw new Error('Dossier non trouvé');

    const newSituation = await SituationDossier.create({
      num_dossier: dossier.num_dossier,
      libelle_situation: 'Instruction ajoutée',
      observation_situation: `Instruction: ${instruction.libelle_instruction}`,
      date_situation: new Date()
    }, { transaction: t });

    await DossierInstruction.create({
      num_dossier: dossier.num_dossier,
      num_instruction: instruction.id_instruction,
      num_situation: newSituation.num_situation
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'Instruction ajoutée et nouvelle situation créée', situation: newSituation });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ================= GET DOSSIER INSTRUCTIONS =================
exports.getDossierInstructions = async (req, res) => {
  try {
    const { num_dossier } = req.params;

    const dossier = await Dossier.findByPk(num_dossier, {
      include: [
        { model: Instruction, as: 'Instructions', attributes: ['libelle_instruction'], through: { attributes: [] } }
      ]
    });

    if (!dossier) return res.status(404).json({ message: "Dossier non trouvé" });

    res.status(200).json(dossier.Instructions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};