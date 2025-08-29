import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 🔹 دالة باش تجيب token من localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // تأكد باللي خزنته فـ login  
  console.log("📌 Token from localStorage:", token);
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔹 جلب الإشعارات غير المقروءة فقط
export const getUnreadNotifications = (userId) => {
  return axios.get(`${API_URL}/notifications/user/${userId}/unread`, getAuthHeaders());
};

// 🔹 جلب جميع الإشعارات لمستخدم (غير مقروءة + مقروءة)
export const getAllNotifications = (userId) => {
  return axios.get(`${API_URL}/notifications/user/${userId}`, getAuthHeaders());
};

// 🔹 جلب الإشعارات (default: get ALL notifications)
export const getNotifications = (userId) => {
  return getAllNotifications(userId); // Now returns ALL notifications (read + unread)
};

// 🔹 تعليم الإشعار كمقروء
export const markNotificationRead = (id) => {
  return axios.put(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders());
};

// 🔹 تعليم جميع الإشعارات كمقروءة لمستخدم معين
export const markAllNotificationsRead = (userId) => {
  return axios.put(`${API_URL}/notifications/user/${userId}/read-all`, {}, getAuthHeaders());
};

// 🔹 إنشاء إشعار جديد
export const createNotification = (data) => {
  return axios.post(`${API_URL}/notifications`, data, getAuthHeaders());
};

// 🔹 حذف إشعار
export const deleteNotification = (id) => {
  return axios.delete(`${API_URL}/notifications/${id}`, getAuthHeaders());
};

// 🔹 جلب عدد الإشعارات غير المقروءة
export const getUnreadNotificationsCount = (userId) => {
  return axios.get(`${API_URL}/notifications/user/${userId}/unread-count`, getAuthHeaders());
};