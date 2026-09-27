import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationApi from "../services/notificationApi";
import { useDispatch } from "react-redux";
import { setToast } from "../store/slices/uiSlice";
import { dispatchNativeNotification } from "../utils/localNotification";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotification() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    getVapidPublicKey,
    subscribePush,
    unsubscribePush,
    checkPushStatus,
    sendTestPushNotification,
  } = notificationApi();

  const isSupported =
    typeof window !== "undefined" &&
    ("Notification" in window || "serviceWorker" in navigator);

  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );

  const [isBrave, setIsBrave] = useState(false);
  const [pushServiceBlocked, setPushServiceBlocked] = useState(false);

  // iOS / iPadOS & PWA Standalone Detection
  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  const isStandalone =
    typeof window !== "undefined" &&
    (Boolean(window.navigator?.standalone) ||
      Boolean(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches));

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
    if (typeof window !== "undefined") {
      if (navigator.brave && typeof navigator.brave.isBrave === "function") {
        navigator.brave.isBrave().then((res) => {
          if (res) setIsBrave(true);
        });
      } else if (navigator.userAgent?.includes("Brave")) {
        setIsBrave(true);
      }
    }
  }, []);

  // Helper to get active service worker registration safely
  const getActiveRegistration = async () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) return reg;
      return await navigator.serviceWorker.ready;
    } catch {
      return null;
    }
  };

  // Query device subscription status & mode
  const {
    data: subscriptionInfo = { isSubscribed: false, mode: null },
    isLoading: isCheckingStatus,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["pushSubscriptionStatus"],
    queryFn: async () => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        return { isSubscribed: false, mode: null };
      }

      if (Notification.permission !== "granted") {
        try {
          localStorage.removeItem("spread_notification_active");
          localStorage.removeItem("spread_notification_mode");
        } catch {}
        return { isSubscribed: false, mode: null };
      }

      // Check if user has active preference stored locally
      const localActive = localStorage.getItem("spread_notification_active") === "true";
      const localMode = localStorage.getItem("spread_notification_mode") || "browser";

      const reg = await getActiveRegistration();
      if (reg && "pushManager" in reg) {
        try {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            try {
              const statusRes = await checkPushStatus(sub.endpoint);
              if (statusRes?.isSubscribed) {
                return { isSubscribed: true, mode: "push" };
              }
            } catch {
              return { isSubscribed: true, mode: "push" };
            }
          }
        } catch (e) {
          console.warn("Error reading pushManager subscription:", e);
        }
      }

      // If user enabled notifications in-browser, remain active in browser mode
      if (localActive) {
        return { isSubscribed: true, mode: localMode };
      }

      return { isSubscribed: false, mode: null };
    },
    staleTime: 60 * 1000,
  });

  const isSubscribed = Boolean(subscriptionInfo?.isSubscribed);
  const subscriptionMode = subscriptionInfo?.mode || null;

  // Enable Notifications Mutation
  const { mutate: enablePush, isPending: isSubscribing } = useMutation({
    mutationFn: async () => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        throw new Error("Notifications are not supported in this browser environment.");
      }

      // 1. Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm === "denied") {
        throw new Error("Notifications were blocked. Please enable them in your browser site settings.");
      }
      if (perm !== "granted") {
        throw new Error("Notification permission was not granted.");
      }

      let activeMode = "browser";

      // 2. Attempt remote Web Push subscription via ServiceWorker & VAPID
      if ("serviceWorker" in navigator) {
        try {
          await navigator.serviceWorker.register("/sw.js", { scope: "/" });
          const reg = await navigator.serviceWorker.ready;

          if (reg && "pushManager" in reg) {
            const publicKey = await getVapidPublicKey();
            if (publicKey) {
              const applicationServerKey = urlBase64ToUint8Array(publicKey);
              let sub = await reg.pushManager.getSubscription();

              if (!sub) {
                try {
                  sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey,
                  });
                  setPushServiceBlocked(false);
                } catch (subErr) {
                  const msg = subErr?.message?.toLowerCase() || "";
                  if (
                    msg.includes("push service error") ||
                    msg.includes("registration failed") ||
                    subErr.name === "AbortError"
                  ) {
                    setPushServiceBlocked(true);
                    console.info(
                      "Push service restricted by browser privacy (e.g. Brave). Activating high-performance In-Browser & OS Notifications mode."
                    );
                  } else {
                    console.warn("Push subscription attempt:", subErr);
                  }
                }
              }

              if (sub) {
                await subscribePush({
                  subscription: sub.toJSON(),
                  userAgent: navigator.userAgent,
                });
                activeMode = "push";
              }
            }
          }
        } catch (swErr) {
          console.warn("ServiceWorker registration notice:", swErr);
        }
      }

      // Persist local activation state
      try {
        localStorage.setItem("spread_notification_active", "true");
        localStorage.setItem("spread_notification_mode", activeMode);
      } catch {}

      return activeMode;
    },
    onSuccess: (mode) => {
      queryClient.setQueryData(["pushSubscriptionStatus"], {
        isSubscribed: true,
        mode,
      });

      if (mode === "push") {
        dispatch(
          setToast({
            message: "Push notifications active across all devices ✨",
            type: "success",
          })
        );
      } else {
        dispatch(
          setToast({
            message: isBrave
              ? "Browser notifications active! (To enable alerts when Brave is closed, turn on Google services in brave://settings/privacy)"
              : "Notifications enabled for this browser ✨",
            type: "success",
          })
        );
      }
    },
    onError: (error) => {
      dispatch(
        setToast({
          message: error?.message || "Failed to enable notifications",
          type: "error",
        })
      );
    },
  });

  // Disable Notifications Mutation
  const { mutate: disablePush, isPending: isUnsubscribing } = useMutation({
    mutationFn: async () => {
      try {
        localStorage.removeItem("spread_notification_active");
        localStorage.removeItem("spread_notification_mode");
      } catch {}

      const reg = await getActiveRegistration();
      if (reg && "pushManager" in reg) {
        try {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            try {
              await unsubscribePush({ endpoint: sub.endpoint });
            } catch (e) {
              console.warn("Server unsubscribe warning:", e);
            }
            await sub.unsubscribe();
          }
        } catch (e) {
          console.warn("Local unsubscribe warning:", e);
        }
      }
      return false;
    },
    onSuccess: () => {
      queryClient.setQueryData(["pushSubscriptionStatus"], {
        isSubscribed: false,
        mode: null,
      });
      dispatch(
        setToast({
          message: "Notifications disabled",
          type: "neutral",
        })
      );
    },
    onError: (error) => {
      dispatch(
        setToast({
          message: error?.message || "Failed to disable notifications",
          type: "error",
        })
      );
    },
  });

  // Universal Test Notification Dispatcher
  const { mutate: triggerTestPush, isPending: isTestingPush } = useMutation({
    mutationFn: async ({ delay = 0 } = {}) => {
      // If full push subscription exists on backend, invoke server test push
      if (subscriptionMode === "push") {
        try {
          const res = await sendTestPushNotification({ delay });
          return { ...res, via: "server" };
        } catch (err) {
          console.warn("Server push delivery fallback to native local dispatcher:", err);
        }
      }

      // Direct native OS notification fallback
      if (delay > 0) {
        setTimeout(async () => {
          await dispatchNativeNotification({
            title: "Spread Background Alert",
            body: `🎉 Background notification received! Sent after a ${delay}s delay.`,
            tag: `test-${Date.now()}`,
            data: { url: "/setting/notifications" },
          });
        }, delay * 1000);

        return {
          via: "local-delayed",
          message: `Alert scheduled in ${delay} seconds! Minimize or switch tabs to see your native alert.`,
        };
      }

      const dispatched = await dispatchNativeNotification({
        title: "Spread Notification",
        body: "🎉 Notifications are working perfectly on this device and browser!",
        tag: `test-${Date.now()}`,
        data: { url: "/setting/notifications" },
      });

      if (!dispatched && Notification.permission !== "granted") {
        throw new Error("Notification permission is not granted in your browser.");
      }

      return {
        via: "local-immediate",
        message: "Test notification sent! Check your notification center.",
      };
    },
    onSuccess: (data) => {
      dispatch(
        setToast({
          message: data?.message || "Test notification sent successfully!",
          type: "success",
        })
      );
    },
    onError: (error) => {
      dispatch(
        setToast({
          message: error?.message || "Failed to send test notification",
          type: "error",
        })
      );
    },
  });

  const togglePush = useCallback(() => {
    if (isSubscribed) {
      disablePush();
    } else {
      enablePush();
    }
  }, [isSubscribed, enablePush, disablePush]);

  return {
    isSupported,
    permission,
    isSubscribed,
    subscriptionMode,
    isBrave,
    isIOS,
    isStandalone,
    pushServiceBlocked,
    isLoading: isCheckingStatus || isSubscribing || isUnsubscribing,
    isSubscribing,
    isUnsubscribing,
    isTestingPush,
    togglePush,
    enablePush,
    disablePush,
    triggerTestPush,
    refetchStatus,
  };
}
