const express = require("express");
const router = express.Router();
const divisionController = require("../Controllers/divisionController");
const authMiddleware = require("../Middleware/authMiddleware");
const permissionMiddleware = require('../Middleware/permissionMiddleware ');


// ✅ protéger routes par authMiddleware si ضروري
router.use(authMiddleware());

// ➕ Créer
router.post("/",permissionMiddleware(['ADD_DIVISION']),  divisionController.createDivision);

// 📥 Lire tout
router.get("/",permissionMiddleware(['VIEW_DIVISION']),  divisionController.getDivisions);

// 📥 Lire une division
router.get("/:id",permissionMiddleware(['VIEW_DIVISION']),  divisionController.getDivisionById);

// ✏️ Modifier
router.put("/:id",permissionMiddleware(['EDIT_DIVISION']),  divisionController.updateDivision);
// 🗑️ Supprimer

router.delete("/:id", permissionMiddleware(['DELETE_DIVISION']), divisionController.deleteDivision);

module.exports = router;
