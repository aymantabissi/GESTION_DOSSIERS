// Routes/instructionRoutes.js
const express = require('express');
const router = express.Router();
const instructionController = require('../Controllers/instructionController');
const authMiddleware = require('../Middleware/authMiddleware');
const permissionMiddleware = require('../Middleware/permissionMiddleware');



router.get('/', 
  authMiddleware(), 
  permissionMiddleware(['VIEW_INSTRUCTION']), 
  instructionController.getInstructions
);

router.post('/', 
  authMiddleware(), 
  permissionMiddleware(['ADD_INSTRUCTION']), 
  instructionController.createInstruction
);

router.put('/:id', 
  authMiddleware(), 
  permissionMiddleware(['EDIT_INSTRUCTION']),
  instructionController.updateInstruction
);

router.delete('/:id', 
  authMiddleware(), 
  permissionMiddleware(['DELETE_INSTRUCTION']),
  instructionController.deleteInstruction
);

module.exports = router;