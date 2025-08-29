const { Instruction, User } = require('../Models');

// Créer une instruction
exports.createInstruction = async (req, res) => {
  try {
    const { libelle_instruction, description } = req.body; // 🔥 Added description field
    const userId = req.user?.id_user;
    
    console.log("Create instruction request:");
    console.log("- User ID from req.user:", userId);
    console.log("- Request body:", req.body);
    console.log("- Full req.user:", req.user);

    if (!libelle_instruction) {
      console.log("❌ Missing libelle_instruction");
      return res.status(400).json({ message: 'Libellé requis' });
    }
    
    if (!userId) {
      console.log("❌ User ID not found in request");
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    const instructionData = {
      libelle_instruction,
      id_user: userId
    };

    // Add description if provided
    if (description && description.trim()) {
      instructionData.description = description.trim();
    }

    console.log("Creating instruction with data:", instructionData);

    const instruction = await Instruction.create(instructionData);

    console.log("✅ Instruction created successfully:", instruction.toJSON());
    res.status(201).json(instruction);
    
  } catch (err) {
    console.error('❌ Create instruction error:', err);
    res.status(500).json({ 
      message: 'Erreur création instruction', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Lister toutes les instructions
exports.getInstructions = async (req, res) => {
  try {
    console.log("Getting instructions for user:", req.user?.id_user);
    
    const instructions = await Instruction.findAll({
      include: [{ 
        model: User, 
        as: 'user', 
        attributes: ['username', 'id_user'] 
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log('✅ Instructions found:', instructions.length);
    console.log('First instruction:', instructions[0] ? {
      id: instructions[0].id,
      libelle_instruction: instructions[0].libelle_instruction,
      user: instructions[0].user?.username
    } : 'No instructions');
    
    res.json(instructions);
  } catch (err) {
    console.error('❌ Get instructions error:', err);
    res.status(500).json({ 
      message: 'Erreur récupération instructions', 
      error: err.message 
    });
  }
};

// Mettre à jour une instruction
exports.updateInstruction = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { libelle_instruction, description } = req.body;
    
    console.log('Updating instruction with ID:', id);
    console.log('Update data:', { libelle_instruction, description });
    console.log('User:', req.user?.id_user);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // Try to find by primary key first
    let instruction = await Instruction.findByPk(id);
    
    // If not found by primary key, try by num_instruction field
    if (!instruction) {
      instruction = await Instruction.findOne({ where: { num_instruction: id } });
    }
    
    if (!instruction) {
      console.log('❌ Instruction not found with ID:', id);
      return res.status(404).json({ message: 'Instruction introuvable' });
    }

    // Update fields
    if (libelle_instruction !== undefined) {
      instruction.libelle_instruction = libelle_instruction;
    }
    if (description !== undefined) {
      instruction.description = description;
    }
    
    await instruction.save();

    console.log('✅ Instruction updated successfully');
    res.json(instruction);
  } catch (err) {
    console.error('❌ Update instruction error:', err);
    res.status(500).json({ 
      message: 'Erreur mise à jour instruction', 
      error: err.message 
    });
  }
};

// Supprimer une instruction
exports.deleteInstruction = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    console.log('Attempting to delete instruction with ID:', id);
    console.log('User:', req.user?.id_user);
    
    if (isNaN(id)) {
      console.log('❌ Invalid ID provided:', req.params.id);
      return res.status(400).json({ message: "ID invalide" });
    }

    // Try to find by primary key first
    let instruction = await Instruction.findByPk(id);
    
    // If not found by primary key, try by num_instruction field
    if (!instruction) {
      console.log('Not found by primary key, trying num_instruction field');
      instruction = await Instruction.findOne({ where: { num_instruction: id } });
    }
    
    if (!instruction) {
      console.log('❌ Instruction not found with ID:', id);
      return res.status(404).json({ message: 'Instruction introuvable' });
    }

    console.log('Found instruction to delete:', instruction.libelle_instruction);
    await instruction.destroy();
    
    console.log('✅ Instruction deleted successfully');
    res.json({ message: 'Instruction supprimée' });
  } catch (err) {
    console.error('❌ Delete instruction error:', err);
    res.status(500).json({ 
      message: 'Erreur suppression instruction', 
      error: err.message 
    });
  }
};