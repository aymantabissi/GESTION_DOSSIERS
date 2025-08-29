const Permission = require('../Models/Permission');

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPermission = async (req, res) => {
  try {
    const { name, description, code_name } = req.body;
    const permission = await Permission.create({ name, description, code_name });
    res.status(201).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
