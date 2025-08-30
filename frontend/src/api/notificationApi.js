import axiosInstance from '../utils/axiosInstance';

const NOTIF_URL = '/notifications';  // Add /api here

export const getNotifications = (userId) => {
  console.log('Full URL will be:', axiosInstance.defaults.baseURL + `/api/notifications/user/${userId}`);
  return axiosInstance.get(`${NOTIF_URL}/user/${userId}`).then(res => res.data);
};

export const getUnreadNotifications = (userId) => {
  return axiosInstance.get(`${NOTIF_URL}/user/${userId}/unread`).then(res => res.data);
};

export const markNotificationRead = (id) => {
  return axiosInstance.put(`${NOTIF_URL}/${id}/read`).then(res => res.data);
};

export const markAllNotificationsRead = (userId) => {
  return axiosInstance.put(`${NOTIF_URL}/user/${userId}/read-all`).then(res => res.data);
};

export const createNotification = (data) => {
  return axiosInstance.post(NOTIF_URL, data).then(res => res.data);
};

export const deleteNotification = (id) => {
  return axiosInstance.delete(`${NOTIF_URL}/${id}`).then(res => res.data);
};

export const getUnreadNotificationsCount = (userId) => {
  return axiosInstance.get(`${NOTIF_URL}/user/${userId}/unread-count`).then(res => res.data);
};