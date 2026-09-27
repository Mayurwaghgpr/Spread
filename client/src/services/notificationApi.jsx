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

  const markAllRead = async () => {
    try {
      const response = await axiosInstance.patch("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  };

  const getVapidPublicKey = async () => {
    try {
      const response = await axiosInstance.get("/notifications/push/vapid-public-key");
      return response.data?.publicKey;
    } catch (error) {
      console.error("Error fetching VAPID public key:", error);
      throw error;
    }
  };

  const subscribePush = async ({ subscription, userAgent }) => {
    try {
      const response = await axiosInstance.post("/notifications/push/subscribe", {
        subscription,
        userAgent,
      });
      return response.data;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      throw error;
    }
  };

  const unsubscribePush = async ({ endpoint }) => {
    try {
      const response = await axiosInstance.post("/notifications/push/unsubscribe", {
        endpoint,
      });
      return response.data;
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      throw error;
    }
  };

  const checkPushStatus = async (endpoint) => {
    try {
      const response = await axiosInstance.get("/notifications/push/status", {
        params: endpoint ? { endpoint } : {},
      });
      return response.data;
    } catch (error) {
      console.error("Error checking push status:", error);
      throw error;
    }
  };

  const sendTestPushNotification = async (payload) => {
    try {
      const response =
        payload !== undefined
          ? await axiosInstance.post("/notifications/push/test", payload)
          : await axiosInstance.post("/notifications/push/test");
      return response.data;
    } catch (error) {
      console.error("Error triggering test push:", error);
      throw error;
    }
  };

  return {
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
    getVapidPublicKey,
    subscribePush,
    unsubscribePush,
    checkPushStatus,
    sendTestPushNotification,
  };
};

export default notificationApi;
