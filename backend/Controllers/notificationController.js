const { Notification } = require('../Models');

// 🔹 جلب جميع الإشعارات لمستخدم (غير مقروءة + مقروءة)
exports.getUserNotifications = async (req, res) => {
  const userId = req.params.userId;
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 جلب الإشعارات غير المقروءة فقط
exports.getUnreadNotifications = async (req, res) => {
  const userId = req.params.userId;
  try {
    const notifications = await Notification.findAll({
      where: { 
        user_id: userId, 
        is_read: false 
      },
      order: [['created_at', 'DESC']],
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 جلب عدد الإشعارات غير المقروءة
exports.getUnreadCount = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await Notification.count({
      where: { 
        user_id: userId, 
        is_read: false 
      }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 تعليم الإشعار كمقروء
exports.markAsRead = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const result = await Notification.update(
      { is_read: true, read_at: new Date() }, 
      { where: { id: notificationId } }
    );
    
    if (result[0] === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 تعليم جميع الإشعارات كمقروءة لمستخدم معين
exports.markAllAsRead = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await Notification.update(
      { 
        is_read: true, 
        read_at: new Date() 
      },
      { 
        where: { 
          user_id: userId, 
          is_read: false  // Only update unread notifications
        } 
      }
    );

    const updatedCount = result[0];
    res.json({ 
      message: `${updatedCount} notifications marked as read`,
      updatedCount 
    });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 إنشاء إشعار جديد
exports.createNotification = async (req, res) => {
  const { user_id, type, message, link, title } = req.body;
  try {
    const notification = await Notification.create({ 
      user_id, 
      type, 
      message, 
      link,
      title,
      is_read: false,
      created_at: new Date()
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('createNotification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 حذف إشعار
exports.deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const result = await Notification.destroy({
      where: { id: notificationId }
    });
    
    if (result === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('deleteNotification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 حذف جميع الإشعارات المقروءة لمستخدم
exports.deleteReadNotifications = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await Notification.destroy({
      where: { 
        user_id: userId, 
        is_read: true 
      }
    });
    
    res.json({ 
      message: `${result} read notifications deleted`,
      deletedCount: result 
    });
  } catch (error) {
    console.error('deleteReadNotifications error:', error);
    res.status(500).json({ error: error.message });
  }
};