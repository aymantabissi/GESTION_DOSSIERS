// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const authMiddleware = require('../Middleware/authMiddleware'); 
const permissionMiddleware = require('../Middleware/permissionMiddleware ');

// 📊 Route لإحصائيات Dashboard
router.get(
  '/stats',
  authMiddleware(), 
  permissionMiddleware(['VIEW_REPORTING']), 
  dashboardController.getDashboardStats
);

module.exports = router;

// ========================================
// فـ server.js أو app.js دير:
// ========================================
// const dashboardRoutes = require('./routes/dashboardRoutes');
// app.use('/api/dashboard', dashboardRoutes);
