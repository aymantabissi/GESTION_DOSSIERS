// Routes/userRoutes.js
const express = require('express');
const {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
} = require('../Controllers/userController');

const authMiddleware = require('../Middleware/authMiddleware');
const { roleMiddleware } = require('../Middleware/roleMiddleware');
const upload = require('../Middleware/uploadMiddleware');

const router = express.Router();

// LOGIN (pas besoin d'auth)
router.post('/login', loginUser);

// GET all users - Admin seulement
router.get('/', authMiddleware(), roleMiddleware(['Admin']), getAllUsers);

// CREATE user - Admin ou Chef
router.post('/', authMiddleware(), roleMiddleware(['Admin', 'Chef']), createUser);

// UPDATE user - Admin ou l’utilisateur lui-même
router.put('/:id_user', authMiddleware(), roleMiddleware(['Admin'], true),upload.single('photo'), updateUser);

// DELETE user - Admin uniquement
router.delete('/:id_user', authMiddleware(), roleMiddleware(['Admin']), deleteUser);

module.exports = router;
