const express = require('express');
const router = express.Router();
const permissionController = require('../Controllers/permissionController');

router.get('/', permissionController.getPermissions);
router.post('/', permissionController.createPermission);

module.exports = router;
