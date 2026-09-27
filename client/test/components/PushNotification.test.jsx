import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "../../src/services/axios";
import notificationApi from "../../src/services/notificationApi";

vi.mock("../../src/services/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("Push Notification API Service", () => {
  const api = notificationApi();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches VAPID public key from backend", async () => {
    const mockPublicKey = "BI5HaRIaejg7xgLVZewdPD2gDD2PyaGMjlk7C3P1JIg";
    axiosInstance.get.mockResolvedValueOnce({
      data: { publicKey: mockPublicKey },
    });

    const key = await api.getVapidPublicKey();
    expect(axiosInstance.get).toHaveBeenCalledWith("/notifications/push/vapid-public-key");
    expect(key).toBe(mockPublicKey);
  });

  it("subscribes device to push notifications", async () => {
    const mockPayload = {
      subscription: {
        endpoint: "https://fcm.googleapis.com/fcm/send/test",
        keys: { p256dh: "key1", auth: "auth1" },
      },
      userAgent: "TestBrowser/1.0",
    };
    axiosInstance.post.mockResolvedValueOnce({
      data: { success: true, message: "Push notifications enabled successfully" },
    });

    const res = await api.subscribePush(mockPayload);
    expect(axiosInstance.post).toHaveBeenCalledWith("/notifications/push/subscribe", mockPayload);
    expect(res.success).toBe(true);
  });

  it("unsubscribes device from push notifications", async () => {
    const endpoint = "https://fcm.googleapis.com/fcm/send/test";
    axiosInstance.post.mockResolvedValueOnce({
      data: { success: true, message: "Push notifications disabled successfully" },
    });

    const res = await api.unsubscribePush({ endpoint });
    expect(axiosInstance.post).toHaveBeenCalledWith("/notifications/push/unsubscribe", { endpoint });
    expect(res.success).toBe(true);
  });

  it("checks subscription status for endpoint", async () => {
    const endpoint = "https://fcm.googleapis.com/fcm/send/test";
    axiosInstance.get.mockResolvedValueOnce({
      data: { isSubscribed: true },
    });

    const res = await api.checkPushStatus(endpoint);
    expect(axiosInstance.get).toHaveBeenCalledWith("/notifications/push/status", {
      params: { endpoint },
    });
    expect(res.isSubscribed).toBe(true);
  });

  it("triggers test push notification", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: { success: true, message: "Test push notification sent successfully" },
    });

    const res = await api.sendTestPushNotification();
    expect(axiosInstance.post).toHaveBeenCalledWith("/notifications/push/test");
    expect(res.success).toBe(true);
  });
});
