const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const authMiddleware = require('../Middleware/authMiddleware'); 


router.get('/user/:userId', authMiddleware(), notificationController.getUserNotifications);

router.get('/user/:userId/unread', authMiddleware(), notificationController.getUnreadNotifications);

router.get('/user/:userId/unread-count', authMiddleware(), notificationController.getUnreadCount);

router.put('/:id/read', authMiddleware(), notificationController.markAsRead);

router.put('/user/:userId/read-all', authMiddleware(), notificationController.markAllAsRead);

router.post('/', authMiddleware(), notificationController.createNotification);

router.delete('/:id', authMiddleware(), notificationController.deleteNotification);

router.delete('/user/:userId/read', authMiddleware(), notificationController.deleteReadNotifications);

module.exports = router;