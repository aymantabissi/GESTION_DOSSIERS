const { Dossier, SituationDossier, DossierInstruction, Instruction, User, Division, Service } = require('../Models');
const { Op } = require('sequelize');

// Créer une nouvelle situation pour un dossier
exports.createSituation = async (req, res) => {
  try {
    const { num_dossier } = req.params;
    const { libelle_situation, observation_situation } = req.body;
    const userId = req.user.id_user;

    // Vérifier si le dossier existe
    const dossier = await Dossier.findByPk(num_dossier);
    if (!dossier) {
      return res.status(404).json({ message: '❌ Dossier introuvable' });
    }

    // Créer la nouvelle situation
    const situation = await SituationDossier.create({
      num_dossier,
      libelle_situation,
      observation_situation,
      date_situation: new Date(),
      date_dernier_modification: new Date()
    });

    // Mettre à jour la date de dernière modification du dossier
    await dossier.update({ date_dernier_modification: new Date() });

    res.status(201).json({ 
      message: '✅ Nouvelle situation créée', 
      situation 
    });

  } catch (error) {
    console.error('createSituation error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de la création de la situation', 
      error: error.message 
    });
  }
};

// Obtenir toutes les situations d'un dossier
exports.getDossierSituations = async (req, res) => {
  try {
    const { num_dossier } = req.params;

    const situations = await SituationDossier.findAll({
      where: { num_dossier },
      include: [
        {
          model: DossierInstruction,
          as: 'dossierInstructions',
          required: false,
          include: [
            {
              model: Instruction,
              as: 'instruction',
              required: false,
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['username', 'email'],
                  required: false
                }
              ]
            }
          ]
        }
      ],
      order: [['date_situation', 'DESC']]
    });

    res.json({ situations });

  } catch (error) {
    console.error('getDossierSituations error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de la récupération des situations', 
      error: error.message 
    });
  }
};

// Obtenir un tableau de bord des situations
exports.getSituationsDashboard = async (req, res) => {
  try {
    const userId = req.user.id_user;

    // Récupérer tous les dossiers de l'utilisateur avec leur dernière situation
    const dossiers = await Dossier.findAll({
      where: { id_user: userId },
      include: [
        { model: Division, as: 'division', required: false },
        { model: Service, as: 'service', required: false },
        { model: User, as: 'user', attributes: ['username'], required: false },
        { 
          model: SituationDossier, 
          as: 'situations', 
          required: false,
          limit: 1,
          order: [['date_situation', 'DESC']]
        }
      ],
      order: [['date_dernier_modification', 'DESC']]
    });

    // Statistiques par statut
    const stats = await SituationDossier.findAll({
      include: [
        {
          model: Dossier,
          as: 'dossier',
          where: { id_user: userId },
          attributes: []
        }
      ],
      attributes: [
        'libelle_situation',
        [require('sequelize').fn('COUNT', require('sequelize').col('SituationDossier.num_situation')), 'count']
      ],
      group: ['libelle_situation'],
      raw: true
    });

    // Dossiers récemment modifiés (dernières 7 jours)
    const recentlyModified = await Dossier.findAll({
      where: { 
        id_user: userId,
        date_dernier_modification: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 jours
        }
      },
      include: [
        { model: Division, as: 'division', required: false },
        { model: Service, as: 'service', required: false },
        { 
          model: SituationDossier, 
          as: 'situations', 
          required: false,
          limit: 1,
          order: [['date_situation', 'DESC']]
        }
      ],
      order: [['date_dernier_modification', 'DESC']],
      limit: 10
    });

    res.json({
      dossiers,
      statistics: stats,
      recentlyModified
    });

  } catch (error) {
    console.error('getSituationsDashboard error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de la récupération du tableau de bord', 
      error: error.message 
    });
  }
};

// Mettre à jour une situation
exports.updateSituation = async (req, res) => {
  try {
    const { num_situation } = req.params;
    const { libelle_situation, observation_situation } = req.body;

    const situation = await SituationDossier.findByPk(num_situation);
    if (!situation) {
      return res.status(404).json({ message: '❌ Situation introuvable' });
    }

    await situation.update({
      libelle_situation: libelle_situation || situation.libelle_situation,
      observation_situation: observation_situation || situation.observation_situation,
      date_dernier_modification: new Date()
    });

    // Mettre à jour aussi le dossier
    const dossier = await Dossier.findByPk(situation.num_dossier);
    if (dossier) {
      await dossier.update({ date_dernier_modification: new Date() });
    }

    res.json({ 
      message: '✅ Situation mise à jour', 
      situation 
    });

  } catch (error) {
    console.error('updateSituation error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de la mise à jour de la situation', 
      error: error.message 
    });
  }
};

// Ajouter une instruction à une situation
exports.addInstructionToSituation = async (req, res) => {
  try {
    const { num_situation } = req.params;
    const { libelle_instruction } = req.body;
    const userId = req.user.id_user;

    // Vérifier si la situation existe
    const situation = await SituationDossier.findByPk(num_situation);
    if (!situation) {
      return res.status(404).json({ message: '❌ Situation introuvable' });
    }

    // Créer l'instruction
    const instruction = await Instruction.create({
      libelle_instruction,
      id_user: userId
    });

    // Créer la liaison dossier-instruction
    const dossierInstruction = await DossierInstruction.create({
      num_dossier: situation.num_dossier,
      num_situation: num_situation,
      num_instruction: instruction.num_instruction
    });

    res.status(201).json({ 
      message: '✅ Instruction ajoutée à la situation', 
      instruction,
      dossierInstruction
    });

  } catch (error) {
    console.error('addInstructionToSituation error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de l\'ajout de l\'instruction', 
      error: error.message 
    });
  }
};

// Obtenir l'historique complet d'un dossier
exports.getDossierHistory = async (req, res) => {
  try {
    const { num_dossier } = req.params;

    const dossier = await Dossier.findByPk(num_dossier, {
      include: [
        { model: Division, as: 'division', required: false },
        { model: Service, as: 'service', required: false },
        { model: User, as: 'user', attributes: ['username', 'email'], required: false },
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
                {
                  model: Instruction,
                  as: 'instruction',
                  required: false,
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['username', 'email'],
                      required: false
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
      return res.status(404).json({ message: '❌ Dossier introuvable' });
    }

    res.json({ 
      dossier,
      totalSituations: dossier.situations?.length || 0,
      currentStatus: dossier.situations?.length > 0 ? 
        dossier.situations[dossier.situations.length - 1].libelle_situation : 
        'Aucune situation'
    });

  } catch (error) {
    console.error('getDossierHistory error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de la récupération de l\'historique', 
      error: error.message 
    });
  }
};

// Recherche avancée dans les situations
exports.searchSituations = async (req, res) => {
  try {
    const { 
      search, 
      status, 
      dateFrom, 
      dateTo, 
      division, 
      service,
      page = 1, 
      limit = 10 
    } = req.query;
    const userId = req.user.id_user;

    let whereConditions = {};
    let dossierWhereConditions = { id_user: userId };

    // Filtres sur les situations
    if (search) {
      whereConditions[Op.or] = [
        { libelle_situation: { [Op.iLike]: `%${search}%` } },
        { observation_situation: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereConditions.libelle_situation = status;
    }

    if (dateFrom) {
      whereConditions.date_situation = { [Op.gte]: new Date(dateFrom) };
    }

    if (dateTo) {
      if (whereConditions.date_situation) {
        whereConditions.date_situation[Op.lte] = new Date(dateTo);
      } else {
        whereConditions.date_situation = { [Op.lte]: new Date(dateTo) };
      }
    }

    // Filtres sur les dossiers
    if (division) {
      dossierWhereConditions.id_division = division;
    }

    if (service) {
      dossierWhereConditions.id_service = service;
    }

    const offset = (page - 1) * limit;

    const { count, rows: situations } = await SituationDossier.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Dossier,
          as: 'dossier',
          where: dossierWhereConditions,
          include: [
            { model: Division, as: 'division', required: false },
            { model: Service, as: 'service', required: false },
            { model: User, as: 'user', attributes: ['username'], required: false }
          ]
        },
        {
          model: DossierInstruction,
          as: 'dossierInstructions',
          required: false,
          include: [
            {
              model: Instruction,
              as: 'instruction',
              required: false,
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['username'],
                  required: false
                }
              ]
            }
          ]
        }
      ],
      order: [['date_situation', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      situations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('searchSituations error:', error);
    res.status(500).json({ 
      message: '❌ Erreur lors de la recherche', 
      error: error.message 
    });
  }
};