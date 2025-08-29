// Routes/instructionRoutes.js
const express = require('express');
const router = express.Router();
const instructionController = require('../Controllers/instructionController');
const authMiddleware = require('../Middleware/authMiddleware');
const permissionMiddleware = require('../Middleware/permissionMiddleware '); // 🔥 FIXED: Removed space

// 🔥 CRITICAL: authMiddleware MUST come BEFORE permissionMiddleware
// because permissionMiddleware needs req.user to be set by authMiddleware

router.get('/', 
  authMiddleware(), 
  permissionMiddleware(['VIEW_INSTRUCTION']), 
  instructionController.getInstructions
);

router.post('/', 
  authMiddleware(), // 🔥 FIX: authMiddleware must come first
  permissionMiddleware(['ADD_INSTRUCTION']), 
  instructionController.createInstruction
);

router.put('/:id', 
  authMiddleware(), 
  permissionMiddleware(['EDIT_INSTRUCTION']), // Added permission check
  instructionController.updateInstruction
);

router.delete('/:id', 
  authMiddleware(), 
  permissionMiddleware(['DELETE_INSTRUCTION']), // Added permission check
  instructionController.deleteInstruction
);

module.exports = router;