const Profile = require('../Models/Profile');
const Permission = require('../Models/Permission');

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      include: Permission
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const profile = await Profile.create({ name, description });

    if (permissions && permissions.length > 0) {
      await profile.setPermissions(permissions);
    }

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
