const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const authMiddleware = require('../Middleware/authMiddleware'); 

// 🔹 جلب جميع الإشعارات لمستخدم (غير مقروءة + مقروءة)
router.get('/user/:userId', authMiddleware(), notificationController.getUserNotifications);

// 🔹 جلب الإشعارات غير المقروءة فقط
router.get('/user/:userId/unread', authMiddleware(), notificationController.getUnreadNotifications);

// 🔹 جلب عدد الإشعارات غير المقروءة
router.get('/user/:userId/unread-count', authMiddleware(), notificationController.getUnreadCount);

// 🔹 تعليم الإشعار كمقروء
router.put('/:id/read', authMiddleware(), notificationController.markAsRead);

// 🔹 تعليم جميع الإشعارات كمقروءة لمستخدم معين
router.put('/user/:userId/read-all', authMiddleware(), notificationController.markAllAsRead);

// 🔹 إنشاء إشعار جديد
router.post('/', authMiddleware(), notificationController.createNotification);

// 🔹 حذف إشعار معين
router.delete('/:id', authMiddleware(), notificationController.deleteNotification);

// 🔹 حذف جميع الإشعارات المقروءة لمستخدم
router.delete('/user/:userId/read', authMiddleware(), notificationController.deleteReadNotifications);

module.exports = router;