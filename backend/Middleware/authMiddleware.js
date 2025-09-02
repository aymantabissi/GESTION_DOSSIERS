const jwt = require('jsonwebtoken');
const { User, Profile, Permission, ProfilePermission } = require('../Models');

const authMiddleware = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token missing' });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      //ujibbb user bi findbypk m3a profile o permissions
      const user = await User.findByPk(decoded.id_user, {
        include: [
          { 
            model: Profile, 
            as: 'Profile',
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: { model: ProfilePermission, attributes: [] }
              }
            ]
          }
        ]
      });

      if (!user) return res.status(401).json({ message: 'User not found' });
      if (!user.is_active) return res.status(403).json({ message: 'User inactive' });

      const userPermissions = user.Profile?.permissions?.map(p => p.code_name) || [];

      req.user = {
        id_user: user.id_user,
        id_profile: user.id_profile,
        id_division: user.id_division || null,
        id_service: user.id_service || null,
        Profile: user.Profile ? { 
          name: user.Profile.name,
          permissions: userPermissions
        } : null,
        permissions: userPermissions
      };

      console.log(`✅ Authenticated user:`, req.user);
      next();

    } catch (error) {
      console.error('AuthMiddleware error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};

module.exports = authMiddleware;
