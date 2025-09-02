const permissionMiddleware = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      //kycheke wch user kyn kyji mn auth  middlware
      if (!req.user) {
        return res.status(401).json({ 
          message: 'User not authenticated',
          debug: 'authMiddleware should run before permissionMiddleware'
        });
      }

      const userPermissions = req.user.permissions || [];
      
      console.log(`🔍 Checking permissions for user ${req.user.id_user}:`);
      console.log(`   Required: [${requiredPermissions.join(', ')}]`);
      console.log(`   User has: [${userPermissions.join(', ')}]`);

      // kycheke wch user endo permission required
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = requiredPermissions.filter(permission => 
          !userPermissions.includes(permission)
        );
        
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          required: requiredPermissions,
          missing: missingPermissions,
          userPermissions: userPermissions
        });
      }

      console.log(`✅ Permission granted for user ${req.user.id_user}`);
      next();
    } catch (error) {
      console.error('PermissionMiddleware error:', error);
      res.status(500).json({ message: 'Server error in permission check' });
    }
  };
};

module.exports = permissionMiddleware;