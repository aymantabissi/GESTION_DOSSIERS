const express = require("express");
const router = express.Router();
const divisionController = require("../Controllers/divisionController");
const authMiddleware = require("../Middleware/authMiddleware");
const permissionMiddleware = require('../Middleware/permissionMiddleware');

//  protéger routes par authMiddleware si ضروري
router.use(authMiddleware());

//  Créer
router.post("/", permissionMiddleware(['ADD_DIVISION']), divisionController.createDivision);

//  Lire tout
router.get("/", permissionMiddleware(['VIEW_DIVISION']), divisionController.getDivisions);

//  Export routes - place before /:id to avoid conflicts
router.get("/export/pdf", permissionMiddleware(['VIEW_DIVISION']), divisionController.exportDivisionsPDF);
router.get("/export/csv", permissionMiddleware(['VIEW_DIVISION']), divisionController.exportDivisionsCSV);

//  Lire une division
router.get("/:id", permissionMiddleware(['VIEW_DIVISION']), divisionController.getDivisionById);

//  Modifier
router.put("/:id", permissionMiddleware(['EDIT_DIVISION']), divisionController.updateDivision);

//  Supprimer
router.delete("/:id", permissionMiddleware(['DELETE_DIVISION']), divisionController.deleteDivision);

module.exports = router;