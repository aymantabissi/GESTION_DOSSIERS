const express = require('express');
const router = express.Router();
const profileController = require('../Controllers/profileController');

router.get('/', profileController.getProfiles);
router.post('/', profileController.createProfile);

module.exports = router;