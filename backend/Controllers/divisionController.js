// controllers/divisionController.js
const Division = require('../Models/Division');

// ➕ Créer une division
exports.createDivision = async (req, res) => {
  try {
    const { lib_division_fr, lib_division_ar } = req.body;

    if (!lib_division_fr || !lib_division_ar) {
      return res.status(400).json({ message: "Les deux noms (FR et AR) sont obligatoires" });
    }

    const division = await Division.create({
      lib_division_fr,
      lib_division_ar
    });

    res.status(201).json({ message: "✅ Division créée avec succès", division });
  } catch (error) {
    console.error("❌ createDivision error:", error);
    res.status(500).json({ message: "Erreur serveur lors de la création", error });
  }
};

// 📥 Lire toutes les divisions
exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.findAll();
    res.json(divisions);
  } catch (error) {
    console.error("❌ getDivisions error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des divisions" });
  }
};

// 📥 Lire une seule division par ID
exports.getDivisionById = async (req, res) => {
  try {
    const { id } = req.params;
    const division = await Division.findByPk(id);

    if (!division) {
      return res.status(404).json({ message: "❌ Division introuvable" });
    }

    res.json(division);
  } catch (error) {
    console.error("❌ getDivisionById error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✏️ Modifier une division
exports.updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const { lib_division_fr, lib_division_ar } = req.body;

    const division = await Division.findByPk(id);
    if (!division) {
      return res.status(404).json({ message: "❌ Division introuvable" });
    }

    division.lib_division_fr = lib_division_fr || division.lib_division_fr;
    division.lib_division_ar = lib_division_ar || division.lib_division_ar;

    await division.save();

    res.json({ message: "✅ Division mise à jour", division });
  } catch (error) {
    console.error("❌ updateDivision error:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// 🗑️ Supprimer une division et ses services/dossiers associés
exports.deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const division = await Division.findByPk(id, {
      include: ['services', 'dossiers']
    });

    if (!division) {
      return res.status(404).json({ message: "❌ Division introuvable" });
    }

    // Supprimer d'abord les services et dossiers liés
    if (division.services && division.services.length > 0) {
      await Promise.all(division.services.map(s => s.destroy()));
    }
    if (division.dossiers && division.dossiers.length > 0) {
      await Promise.all(division.dossiers.map(d => d.destroy()));
    }

    // Puis supprimer la division
    await division.destroy();

    res.json({ message: "✅ Division et tous les services/dossiers associés supprimés" });
  } catch (error) {
    console.error("❌ deleteDivision error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
