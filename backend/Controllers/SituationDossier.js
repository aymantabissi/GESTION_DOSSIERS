const { SituationDossier, Dossier, User , Notification } = require('../Models');

// Ajouter une situation (changer état du dossier)
exports.addSituation = async (req, res) => {
  try {
    const { num_dossier } = req.params;
    const { etat, observation } = req.body;
    const userId = req.user.id_user;
    const username = req.user.username || req.user.nom || 'Utilisateur';

    console.log(`📝 Adding situation to dossier ${num_dossier} by user ${userId}`);

    const dossier = await Dossier.findByPk(num_dossier);
    if (!dossier) {
      console.log(`❌ Dossier ${num_dossier} not found`);
      return res.status(404).json({ message: '❌ Dossier introuvable' });
    }

    const situation = await SituationDossier.create({
      num_dossier,
      libelle_situation: etat,
      observation_situation: observation || null,
      id_user: userId,
      date_situation: new Date(),
      date_dernier_modification: new Date()
    });

    console.log(`✅ Situation created:`, situation.toJSON());

    //  Créer notification pour le propriétaire du dossier (si ce n'est pas lui qui fait la modification)
    if (dossier.id_user && dossier.id_user !== userId) {
      try {
        await Notification.create({
          user_id: dossier.id_user,
          type: 'situation_update',
          title: 'Mise à jour de dossier',
          message: `Le dossier "${dossier.intitule_dossier}" a une nouvelle situation: ${etat}${observation ? ` - ${observation}` : ''}`,
          link: `/dossiers/${num_dossier}`,
          is_read: false,
          created_at: new Date()
        });
        console.log(`🔔 Notification sent to dossier owner (user ${dossier.id_user})`);
      } catch (notifError) {
        console.error('❌ Error creating notification for dossier owner:', notifError);
        // Don't fail the request if notification fails
      }
    }

    //  Optionnel: Notifier tous les utilisateurs qui ont travaillé sur ce dossier
    try {
      const usersWhoWorkedOnDossier = await SituationDossier.findAll({
        where: { num_dossier },
        attributes: ['id_user'],
        group: ['id_user'],
        raw: true
      });

      const userIds = usersWhoWorkedOnDossier
        .map(s => s.id_user)
        .filter(id => id && id !== userId && id !== dossier.id_user); // Exclude current user and owner

      console.log(`📋 Users who worked on this dossier:`, userIds);

      if (userIds.length > 0) {
        const notifications = userIds.map(targetUserId => ({
          user_id: targetUserId,
          type: 'situation_update',
          title: 'Dossier mis à jour',
          message: `Le dossier "${dossier.intitule_dossier}" a été mis à jour par ${username}: ${etat}`,
          link: `/dossiers/${num_dossier}`,
          is_read: false,
          created_at: new Date()
        }));

        await Notification.bulkCreate(notifications);
        console.log(`🔔 Notifications sent to ${userIds.length} collaborators`);
      }
    } catch (collaboratorNotifError) {
      console.error('❌ Error creating notifications for collaborators:', collaboratorNotifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({ 
      message: '✅ État du dossier mis à jour', 
      situation,
      notifications_sent: true
    });

  } catch (error) {
    console.error('❌ addSituation error:', error);
    res.status(500).json({ 
      message: '❌ Erreur serveur', 
      error: error.message 
    });
  }
};

// Récupérer le dernier état du dossier
exports.getEtatDossier = async (req, res) => {
  try {
    const { num_dossier } = req.params;

    const situation = await SituationDossier.findOne({
      where: { num_dossier },
      include: [{ model: User, as: 'user', attributes: ['username'] }], // <--- inclure User
      order: [['date_situation', 'DESC']]
    });

    if (!situation) {
      return res.status(404).json({ message: '⚠️ Pas de situation pour ce dossier' });
    }

    res.json({ etat: situation.libelle_situation, situation });
  } catch (error) {
    console.error('getEtatDossier error:', error);
    res.status(500).json({ message: '❌ Erreur serveur', error: error.message });
  }
};

// Changer l’état du dossier
exports.changeEtat = async (req, res) => {
  try {
    const { num_dossier } = req.params;
    const { nouveau_etat, observation } = req.body;
    const userId = req.user.id_user;
    const username = req.user.username || req.user.nom || 'Utilisateur';

    console.log(`🔄 Changing state of dossier ${num_dossier} to "${nouveau_etat}" by user ${userId}`);

    if (!nouveau_etat) {
      return res.status(400).json({ message: '❌ Nouvel état requis' });
    }

    const dossier = await Dossier.findByPk(num_dossier);
    if (!dossier) {
      console.log(`❌ Dossier ${num_dossier} not found`);
      return res.status(404).json({ message: '❌ Dossier introuvable' });
    }

    // Get previous state for comparison
    const previousSituation = await SituationDossier.findOne({
      where: { num_dossier },
      order: [['date_situation', 'DESC']]
    });

    const situation = await SituationDossier.create({
      num_dossier,
      libelle_situation: nouveau_etat,
      observation_situation: observation || null,
      id_user: userId,
      date_situation: new Date(),
      date_dernier_modification: new Date()
    });

    console.log(`✅ State changed successfully:`, situation.toJSON());

    // 🔔 Créer notification pour le propriétaire du dossier
    if (dossier.id_user && dossier.id_user !== userId) {
      try {
        const previousState = previousSituation ? previousSituation.libelle_situation : 'Nouveau';
        
        await Notification.create({
          user_id: dossier.id_user,
          type: 'state_change',
          title: 'Changement d\'état de dossier',
          message: `Votre dossier "${dossier.intitule_dossier}" est passé de "${previousState}" à "${nouveau_etat}"${observation ? ` - ${observation}` : ''}`,
          link: `/dossiers/${num_dossier}`,
          is_read: false,
          created_at: new Date()
        });
        
        console.log(`🔔 State change notification sent to owner (user ${dossier.id_user})`);
      } catch (notifError) {
        console.error('❌ Error creating state change notification:', notifError);
      }
    }

    // 🔔 Notification pour les managers/superviseurs (optionnel)
    try {
      // Get users with 'manager' or 'admin' role who should be notified of state changes
      const managers = await User.findAll({
        where: {
          role: ['manager', 'admin', 'superviseur']
        },
        attributes: ['id_user']
      });

      if (managers.length > 0) {
        const managerNotifications = managers
          .filter(manager => manager.id_user !== userId && manager.id_user !== dossier.id_user)
          .map(manager => ({
            user_id: manager.id_user,
            type: 'state_change_admin',
            title: 'Dossier mis à jour',
            message: `Le dossier "${dossier.intitule_dossier}" a changé d'état: ${nouveau_etat} (par ${username})`,
            link: `/dossiers/${num_dossier}`,
            is_read: false,
            created_at: new Date()
          }));

        if (managerNotifications.length > 0) {
          await Notification.bulkCreate(managerNotifications);
          console.log(`🔔 State change notifications sent to ${managerNotifications.length} managers`);
        }
      }
    } catch (managerNotifError) {
      console.error('❌ Error creating manager notifications:', managerNotifError);
    }

    res.status(201).json({ 
      message: '✅ État du dossier mis à jour', 
      situation,
      previous_state: previousSituation?.libelle_situation || null,
      new_state: nouveau_etat,
      notifications_sent: true
    });

  } catch (error) {
    console.error('❌ changeEtat error:', error);
    res.status(500).json({ 
      message: '❌ Erreur serveur', 
      error: error.message 
    });
  }
};

