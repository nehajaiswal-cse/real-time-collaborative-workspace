
import axiosInstance from "./axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get(
    "/notifications/unread-count"
  );
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.patch(
    `/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch(
    "/notifications/read-all"
  );
  return response.data;
};