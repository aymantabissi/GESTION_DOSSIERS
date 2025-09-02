const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const authMiddleware = require('../Middleware/authMiddleware'); 
const permissionMiddleware = require('../Middleware/permissionMiddleware');

router.get(
  '/stats',
  authMiddleware(), 
  permissionMiddleware(['VIEW_REPORTING']), 
  dashboardController.getDashboardStats
);

module.exports = router;

