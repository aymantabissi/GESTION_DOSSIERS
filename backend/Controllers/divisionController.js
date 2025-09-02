const Division = require('../Models/Division');


const { Parser } = require('json2csv');

const PDFDocument = require('pdfkit');

//  Créer une division
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

// Lire toutes les divisions
exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.findAll();
    res.json(divisions);
  } catch (error) {
    console.error("❌ getDivisions error:", error);
    res.status(500).json({ message: "Erreur lors du chargement des divisions" });
  }
};

//  Lire une seule division par ID
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

//  Modifier une division
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

//  Supprimer une division et ses services/dossiers associés
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


exports.exportDivisionsPDF = async (req, res) => {
  try {
    const divisions = await Division.findAll({
      include: ['services', 'dossiers']
    });

    // Create PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // Pipe to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="divisions_${Date.now()}.pdf"`);
    doc.pipe(res);

    // Fonts & title
    doc.font('Helvetica-Bold').fontSize(20).text('Liste des Divisions', { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica').fontSize(12).text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);

    // Table setup
    const tableTop = doc.y;
    const rowHeight = 20;
    const colWidths = {
      id: 40,
      nameFr: 150,
      nameAr: 150,
      services: 120,
      dossiers: 60
    };
    const tableLeft = 50;
    const pageWidth = 595.28 - 50*2; // A4 width minus margins

    // Draw header
    doc.fontSize(12).font('Helvetica-Bold');
    const headers = ['ID', 'Nom FR', 'Nom AR', 'Services', 'Dossiers'];
    let x = tableLeft;
    headers.forEach((h, i) => {
      const w = Object.values(colWidths)[i];
      doc.text(h, x + 2, tableTop + 5, { width: w - 4, align: 'left' });
      x += w;
    });

    // Draw header border
    doc.rect(tableLeft, tableTop, pageWidth, rowHeight).stroke();

    // Draw vertical lines for header
    x = tableLeft;
    Object.values(colWidths).forEach(w => {
      doc.moveTo(x, tableTop).lineTo(x, tableTop + rowHeight).stroke();
      x += w;
    });
    doc.moveTo(x, tableTop).lineTo(x, tableTop + rowHeight).stroke();

    // Draw rows
    let y = tableTop + rowHeight;
    doc.font('Helvetica').fontSize(10);

    divisions.forEach((division, index) => {
      // Check page break
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
      }

      x = tableLeft;
      const servicesStr = division.services?.map(s => s.lib_service_fr).join(', ') || '';
      const dossiersCount = division.dossiers?.length || 0;

      const rowValues = [
        index + 1,
        division.lib_division_fr,
        division.lib_division_ar || '',
        servicesStr,
        dossiersCount
      ];

      rowValues.forEach((val, i) => {
        const w = Object.values(colWidths)[i];
        doc.text(val.toString(), x + 2, y + 5, { width: w - 4, align: 'left' });
        x += w;
      });

      // Draw row border
      doc.rect(tableLeft, y, pageWidth, rowHeight).stroke();

      // Draw vertical lines for row
      x = tableLeft;
      Object.values(colWidths).forEach(w => {
        doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke();
        x += w;
      });
      doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke();

      y += rowHeight;
    });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("❌ exportDivisionsPDF error:", error);
    res.status(500).json({ message: "Erreur lors de l'export PDF", error: error.message });
  }
};


exports.exportDivisionsCSV = async (req, res) => {
  try {
    const divisions = await Division.findAll({
      include: ['services', 'dossiers']
    });

    const csvData = divisions.map(division => ({
      'ID Division': division.id_division,
      'Nom (Français)': division.lib_division_fr,
      'Nom (Arabe)': division.lib_division_ar || '',
      'Nombre de Services': division.services?.length || 0,
      'Nombre de Dossiers': division.dossiers?.length || 0,
      'Services': division.services?.map(s => s.lib_service_fr).join('; ') || '',
      'Date de Création': division.createdAt ? new Date(division.createdAt).toLocaleDateString('fr-FR') : '',
      'Dernière Modification': division.updatedAt ? new Date(division.updatedAt).toLocaleDateString('fr-FR') : ''
    }));

    const fields = [
      'ID Division',
      'Nom (Français)',
      'Nom (Arabe)',
      'Nombre de Services',
      'Nombre de Dossiers',
      'Services',
      'Date de Création',
      'Dernière Modification'
    ];

    const parser = new Parser({ fields, delimiter: ';' });
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="divisions_${Date.now()}.csv"`);

    res.send('\ufeff' + csv); 

  } catch (error) {
    console.error("❌ exportDivisionsCSV error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Erreur lors de l'export CSV", error: error.message });
    }
  }
};
