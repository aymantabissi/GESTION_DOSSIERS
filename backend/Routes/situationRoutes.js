const express = require('express');
const router = express.Router();
const situationController = require('../Controllers/SituationDossier');
const authMiddleware = require('../Middleware/authMiddleware'); 
const permissionMiddleware = require('../Middleware/permissionMiddleware');


router.use(authMiddleware());
router.post('/:num_dossier',  permissionMiddleware(['EDIT_ETAT']),  situationController.addSituation);
router.get('/:num_dossier/etat',  permissionMiddleware(['EDIT_ETAT']),  situationController.getEtatDossier);
router.post('/:num_dossier/change-etat',  permissionMiddleware(['EDIT_ETAT']),  situationController.changeEtat);

module.exports = router;
