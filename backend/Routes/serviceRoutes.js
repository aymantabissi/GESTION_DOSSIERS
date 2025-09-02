const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
  exportServicesPDF,
  exportServicesCSV
} = require('../Controllers/serviceController');
const authMiddleware = require("../Middleware/authMiddleware");
const permissionMiddleware = require('../Middleware/permissionMiddleware');

// ✅ Apply authentication middleware to all routes
router.use(authMiddleware());

// 📄 Export routes - place before other routes to avoid conflicts
router.get('/export/pdf', permissionMiddleware(['VIEW_SERVICE']), exportServicesPDF);
router.get('/export/csv', permissionMiddleware(['VIEW_SERVICE']), exportServicesCSV);

// 📥 Basic CRUD routes with permissions
router.get('/', permissionMiddleware(['VIEW_SERVICE']), getServices);
router.post('/', permissionMiddleware(['ADD_SERVICE']), createService);
router.put('/:id', permissionMiddleware(['EDIT_SERVICE']), updateService);
router.delete('/:id', permissionMiddleware(['DELETE_SERVICE']), deleteService);

module.exports = router;