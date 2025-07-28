import React from "react";
import axiosInstance from "./axios";

const notificationApi = () => {
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };
  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  };

  const markRead = async (notificationId) => {
    try {
      const response = await axiosInstance.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  return {
    fetchNotifications,
    fetchUnreadCount,
  };
};

export default notificationApi;
