// routes/suiviSituationRoutes.js
const express = require("express");
const router = express.Router();
const SuiviDossierController = require("../Controllers/SuiviDossierController");
const authMiddleware = require('../Middleware/authMiddleware'); // Fixed typo here too
const permissionMiddleware = require('../Middleware/permissionMiddleware ');


// ➕ Créer une situation pour un dossier
router.post(
  "/:num_dossier/situations",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.createSituation
);

// 📄 Récupérer toutes les situations d’un dossier
router.get(
  "/:num_dossier/situations",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.getDossierSituations
);

// 📊 Dashboard des situations (par utilisateur connecté)
router.get(
  "/dashboard",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.getSituationsDashboard
);

// ✏️ Mettre à jour une situation
router.put(
  "/situations/:num_situation",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.updateSituation
);

// ➕ Ajouter une instruction à une situation
router.post(
  "/situations/:num_situation/instructions",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.addInstructionToSituation
);

// 📜 Obtenir l’historique complet d’un dossier
router.get(
  "/:num_dossier/history",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.getDossierHistory
);

// 🔍 Recherche avancée dans les situations
router.get(
  "/search",
  authMiddleware(), permissionMiddleware(['EDIT_ETAT']),
  SuiviDossierController.searchSituations
);

module.exports = router;
