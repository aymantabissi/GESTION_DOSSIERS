const { Service, Division, User, Dossier } = require('../Models');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv'); 

// 🔹 Get all services avec division join
exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{
        model: Division,
        as: 'division',
        attributes: ['id_division', 'lib_division_fr']
      }]
    });
    res.json(services);
  } catch (error) {
    console.error('❌ getServices error:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des services' });
  }
};

// 🔹 Create service
exports.createService = async (req, res) => {
  try {
    const { lib_service_fr, lib_service_ar, id_division } = req.body;
    if (!lib_service_fr || !id_division) {
      return res.status(400).json({ message: 'Nom service et division obligatoires' });
    }
    const service = await Service.create({ lib_service_fr, lib_service_ar, id_division });
    res.status(201).json(service);
  } catch (error) {
    console.error('❌ createService error:', error);
    res.status(500).json({ message: 'Erreur création service' });
  }
};

// 🔹 Update service
exports.updateService = async (req, res) => {
  try {
    const { lib_service_fr, lib_service_ar, id_division } = req.body;
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable' });

    await service.update({ lib_service_fr, lib_service_ar, id_division });
    res.json(service);
  } catch (error) {
    console.error('❌ updateService error:', error);
    res.status(500).json({ message: 'Erreur mise à jour service' });
  }
};

// 🔹 Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable' });

    await service.destroy(); // Sequelize CASCADE si défini côté relation
    res.json({ message: 'Service supprimé' });
  } catch (error) {
    console.error('❌ deleteService error:', error);
    res.status(500).json({ message: 'Erreur suppression service' });
  }
};

//  Export services to PDF
exports.exportServicesPDF = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        { model: Division, as: 'division', attributes: ['id_division', 'lib_division_fr'] },
        { model: User, as: 'users', attributes: ['id_user', 'username', 'email'] },
        { model: Dossier, as: 'dossiers', attributes: ['num_dossier', 'intitule_dossier'] },
      ],
    });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="services_${Date.now()}.pdf"`);

    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text('Liste des Services', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica')
       .text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);

    // Table headers
    const tableTop = doc.y;
    const itemX = 50;
    const columnWidths = [50, 150, 100, 80, 60]; // adjust widths
    const rowHeight = 20;

    // Draw header
    const headers = ['ID', 'Service (FR)', 'Division', 'Nb Users', 'Nb Dossiers'];
    let x = itemX;
    headers.forEach((header, i) => {
      doc.rect(x, tableTop, columnWidths[i], rowHeight).stroke();
      doc.font('Helvetica-Bold').fontSize(10).text(header, x + 2, tableTop + 5, { width: columnWidths[i] - 4, align: 'center' });
      x += columnWidths[i];
    });

    // Draw rows
    let y = tableTop + rowHeight;
    services.forEach((service) => {
      x = itemX;
      const row = [
        service.id_service,
        service.lib_service_fr,
        service.division?.lib_division_fr || 'N/A',
        service.users?.length || 0,
        service.dossiers?.length || 0,
      ];

      row.forEach((cell, i) => {
        doc.rect(x, y, columnWidths[i], rowHeight).stroke();
        doc.font('Helvetica').fontSize(10).text(cell.toString(), x + 2, y + 5, { width: columnWidths[i] - 4, align: 'center' });
        x += columnWidths[i];
      });
      y += rowHeight;

      // Page break if needed
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50; // reset top margin
      }
    });

    doc.end();

  } catch (error) {
    console.error("❌ exportServicesPDF error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Erreur lors de l'export PDF", error: error.message });
    }
  }
};


exports.exportServicesCSV = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        { model: Division, as: 'division', attributes: ['id_division', 'lib_division_fr'] },
        { model: User, as: 'users', attributes: ['id_user', 'username', 'email'] },
        { model: Dossier, as: 'dossiers', attributes: ['num_dossier', 'intitule_dossier'] },
      ],
    });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée à exporter' });
    }

    const csvData = services.map(s => ({
      'ID Service': s.id_service,
      'Nom (Français)': s.lib_service_fr,
      'Nom (Arabe)': s.lib_service_ar || '',
      'Division': s.division?.lib_division_fr || '',
      'ID Division': s.division?.id_division || '',
      'Nombre d\'Utilisateurs': s.users?.length || 0,
      'Nombre de Dossiers': s.dossiers?.length || 0,
      'Utilisateurs': s.users?.map(u => `${u.username} (${u.email})`).join('; ') || '',
      'Dossiers': s.dossiers?.map(d => d.intitule_dossier).slice(0, 3).join('; ') || '',
      'Date de Création': s.createdAt ? new Date(s.createdAt).toLocaleDateString('fr-FR') : '',
      'Dernière Modification': s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('fr-FR') : '',
    }));

    const fields = [
      'ID Service','Nom (Français)','Nom (Arabe)','Division','ID Division',
      'Nombre d\'Utilisateurs','Nombre de Dossiers','Utilisateurs','Dossiers',
      'Date de Création','Dernière Modification'
    ];

    const parser = new Parser({ fields, delimiter: ';' });
    const csv = parser.parse(csvData);

    // Headers
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="services_${Date.now()}.csv"`);

    // Add BOM for Excel
    res.write('\ufeff');

    // Send CSV
    return res.end(csv); // ✅ end instead of send, مع return

  } catch (error) {
    console.error('❌ exportServicesCSV error:', error);

    if (!res.headersSent) {
      return res.status(500).json({ message: "Erreur lors de l'export CSV", error: error.message });
    }
  }
};