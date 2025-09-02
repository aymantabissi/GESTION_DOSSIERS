const express = require('express');
const router = express.Router();
const dossierController = require('../Controllers/dossierController');
const authMiddleware = require('../Middleware/authMiddleware'); 
const permissionMiddleware = require('../Middleware/permissionMiddleware'); 



//  Get all dossiers
router.get(
  '/', 
  authMiddleware(), 
  permissionMiddleware(['VIEW_DOSSIERS']), 
  dossierController.getDossiers
);

//  Get dossier suivi/tracking
router.get(
  '/:id/suivi', 
  authMiddleware(), 
  permissionMiddleware(['VIEW_DOSSIER']), 
  dossierController.getSuiviByDossier
);

//  Get dossier instructions  
router.get(
  '/:num_dossier/instructions', 
  authMiddleware(), 
  permissionMiddleware(['VIEW_INSTRUCTION']), 
  dossierController.getDossierInstructions
);

//  Create new dossier
router.post(
  '/', 
  authMiddleware(), 
  permissionMiddleware(['CREATE_DOSSIER']), 
  dossierController.createDossier
);

//  Add instruction to dossier
router.post(
  '/add-instruction', 
  authMiddleware(), 
  permissionMiddleware(['ADD_INSTRUCTION']), 
  dossierController.addInstructionToDossier
);

//  Update dossier
router.put(
  '/:id', 
  authMiddleware(), // 
  permissionMiddleware(['UPDATE_DOSSIER']), 
  dossierController.updateDossier
);

//  Delete dossier
router.delete(
  '/:id', 
  authMiddleware(), 
  permissionMiddleware(['DELETE_DOSSIER']), 
  dossierController.deleteDossier
);

//  Debug route to check permissions (remove in production)
router.get(
  '/debug/permissions',
  authMiddleware(),
  (req, res) => {
    const userPermissions = req.user.permissions || [];
    res.json({
      user: req.user.id_user,
      profile: req.user.Profile?.name,
      permissions: {
        VIEW_DOSSIERS: userPermissions.includes('VIEW_DOSSIERS'),
        VIEW_DOSSIER: userPermissions.includes('VIEW_DOSSIER'),
        CREATE_DOSSIER: userPermissions.includes('CREATE_DOSSIER'),
        UPDATE_DOSSIER: userPermissions.includes('UPDATE_DOSSIER'),
        DELETE_DOSSIER: userPermissions.includes('DELETE_DOSSIER'),
        ADD_INSTRUCTION: userPermissions.includes('ADD_INSTRUCTION'),
        VIEW_INSTRUCTION: userPermissions.includes('VIEW_INSTRUCTION')
      },
      allPermissions: userPermissions
    });
  }
);

module.exports = router;