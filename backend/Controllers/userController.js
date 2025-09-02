// Controllers/userController.js
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Notification = require('../Models/Notification');
const { sequelize } = require('../Models'); // Add this import

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ where: { email } });
    console.log('User found:', user);

    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    // ✅ Compare password men frontend m3a hash DB
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides' });

    // Generate JWT
    const token = jwt.sign(
      { 
        id_user: user.id_user, 
        id_profile: user.id_profile,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        id_profile: user.id_profile,
        photo: user.photo || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    // ktjib kolchi mn ghir password bi exclude 
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// CREATE user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, id_profile, id_division, id_service } = req.body;
    if (!username || !email || !password || !id_profile)
      return res.status(400).json({ message: 'Champs obligatoires manquants' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });
    // hade bcrypt kdire hasheage dyal password 

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      id_profile,
      id_division: id_division || null,
      id_service: id_service || null
    });

    const userWithoutPassword = { ...newUser.dataValues };
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { username, email, password, id_profile, id_division, id_service, is_active } = req.body;

    const user = await User.findByPk(id_user);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // hade bcrypt kdire hasheage dyal password 
    if (password) user.password = await bcrypt.hash(password, 10);
    if (username) user.username = username;
    if (email) user.email = email;
    if (id_profile) user.id_profile = id_profile;
    if (id_division !== undefined) user.id_division = id_division;
    if (id_service !== undefined) user.id_service = id_service;
    if (is_active !== undefined) user.is_active = is_active;

    //  Save uploaded photo
    if (req.file) {
      user.photo = req.file.filename;
    }

    await user.save();

    const userWithoutPassword = { ...user.dataValues };
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id_user } = req.params;
  const transaction = await sequelize.transaction();

  try {
    // First, delete all notifications for this user
    await Notification.destroy({
      where: { user_id: id_user },
      transaction
    });

    // Then delete the user
    const result = await User.destroy({
      where: { id_user },
      transaction
    });

    await transaction.commit();

    if (result === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
};