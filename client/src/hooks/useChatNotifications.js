import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useSocket from "./useSocket";
import { toast } from "./useToast";
import { playNotificationChime } from "../utils/notificationSound";
import { setConversationLogData } from "../store/slices/messangerSlice";
import { setNotificationStatePush } from "../store/slices/notificationSlice";
import { dispatchNativeNotification } from "../utils/localNotification";

/**
 * Universal Real-time Notification Engine for Spread
 * Follows industry standards (Telegram, Slack, WhatsApp Web):
 * 1. Active Chat Suppression: Suppresses banners if the user is actively viewing that conversation.
 * 2. Background Tab Alert: Updates document title if the app tab is hidden.
 * 3. Native OS Alerts: Triggers native desktop/mobile alerts across all browsers (including Brave).
 * 4. In-App Toast: Floating interactive notification with 1-click navigation.
 * 5. Audio Chime: Plays two-tone harmonic notification if sound is enabled in preferences.
 * 6. Cross-Platform Safe: Seamlessly works across Chrome, Brave, Safari, Firefox, Edge, Android, iOS.
 */
export function useChatNotifications() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const { conversationLogData } = useSelector((state) => state.messanger);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const originalTitleRef = useRef(typeof document !== "undefined" ? document.title : "Spread");
  const unreadCountRef = useRef(0);

  // Keep original title up-to-date when not in unread alert state
  useEffect(() => {
    if (typeof document !== "undefined" && !document.title.startsWith("(")) {
      originalTitleRef.current = document.title;
    }
  });

  // Reset tab title on window focus
  useEffect(() => {
    const handleFocus = () => {
      unreadCountRef.current = 0;
      if (typeof document !== "undefined") {
        document.title = originalTitleRef.current || "Spread";
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) handleFocus();
    });

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!isLogin || !user?.id || !socket) return;

    // Chat Message Notification Handler
    const handleChatNotification = (payload) => {
      if (!payload || payload.senderId === user.id) return;

      // 1. Check user preferences from local storage
      let prefs = { messages: true, sound: true };
      try {
        const saved = localStorage.getItem("spread_notification_prefs");
        if (saved) prefs = JSON.parse(saved);
      } catch {}

      if (prefs.messages === false) {
        return;
      }

      // 2. Active Chat Suppression Check
      const currentSearchParams = new URLSearchParams(window.location.search);
      const activeConversationId = currentSearchParams.get("Id");
      const isViewingCurrentChat =
        window.location.pathname.startsWith("/messages/c") &&
        activeConversationId === payload.conversationId;
      const isTabFocused = typeof document !== "undefined" && !document.hidden && document.hasFocus();

      // If the user is actively reading this conversation right now, suppress notification banner
      if (isViewingCurrentChat && isTabFocused) {
        return;
      }

      // 3. Audio Chime (if sound is not muted in user preferences)
      if (prefs.sound !== false) {
        playNotificationChime();
      }

      // 4. Update Tab Title for Background Tabs
      if (typeof document !== "undefined" && document.hidden) {
        unreadCountRef.current += 1;
        document.title = `(${unreadCountRef.current}) New message • Spread`;
      }

      // 5. In-App Interactive Toast
      const title = payload.isGroup
        ? payload.groupName || "Group Chat"
        : payload.senderName || "New Message";
      const message = payload.isGroup
        ? `${payload.senderName}: Sent a message`
        : "Sent you an encrypted message";

      toast.custom({
        id: `chat-${payload.conversationId}`, // Coalesce subsequent messages from the same conversation
        title,
        message,
        type: "info",
        duration: 5500,
        action: {
          label: "Open Chat",
          onClick: () => {
            navigate(`/messages/c?Id=${payload.conversationId}`);
          },
        },
      });

      // 6. Native OS Notification when tab is unfocused or backgrounded
      if (!isTabFocused) {
        dispatchNativeNotification({
          title,
          body: message,
          icon: payload.senderImage || "/spread_logo_03_robopus-min.png",
          tag: `chat-${payload.conversationId}`,
          data: { url: `/messages/c?Id=${payload.conversationId}` },
          onClick: () => {
            navigate(`/messages/c?Id=${payload.conversationId}`);
          },
        });
      }

      // 7. Invalidate conversation list queries and update Redux
      queryClient.invalidateQueries({ queryKey: ["convesationsLog"] });

      if (Array.isArray(conversationLogData)) {
        const existing = conversationLogData.find((c) => c.id === payload.conversationId);
        const filtered = conversationLogData.filter((c) => c.id !== payload.conversationId);
        if (existing) {
          dispatch(
            setConversationLogData([
              {
                ...existing,
                lastMessage: "Encrypted message",
                updatedAt: payload.createdAt || new Date().toISOString(),
              },
              ...filtered,
            ])
          );
        }
      }
    };

    // Social Notification Handler (Claps, Comments, Follows, Mentions)
    const handleGeneralNotification = (payload) => {
      if (!payload) return;

      // 1. Update Redux & tanstack queries
      dispatch(setNotificationStatePush(payload));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] });

      // 2. Preferences Check
      let prefs = { sound: true };
      try {
        const saved = localStorage.getItem("spread_notification_prefs");
        if (saved) prefs = JSON.parse(saved);
      } catch {}

      if (prefs.sound !== false) {
        playNotificationChime();
      }

      const title = "Spread Notification";
      const body = payload.message || "You have a new notification";
      const actorImg = payload.actor?.userImage || "/spread_logo_03_robopus-min.png";

      let targetUrl = "/";
      if (payload.type === "follow" && payload.actor?.username && payload.actorId) {
        targetUrl = `/profile/@${payload.actor.username}/${payload.actorId}`;
      } else if ((payload.type === "like" || payload.type === "comment") && payload.entityId) {
        targetUrl = `/view/@${payload.actor?.username || "story"}/${payload.entityId}`;
      }

      // 3. Tab Title & In-App Toast
      if (typeof document !== "undefined" && document.hidden) {
        unreadCountRef.current += 1;
        document.title = `(${unreadCountRef.current}) New alert • Spread`;
      }

      toast.custom({
        id: `social-${payload.id || Date.now()}`,
        title,
        message: body,
        type: "info",
        duration: 5000,
        action: {
          label: "View",
          onClick: () => navigate(targetUrl),
        },
      });

      // 4. Native OS Notification when unfocused
      const isTabFocused = typeof document !== "undefined" && !document.hidden && document.hasFocus();
      if (!isTabFocused) {
        dispatchNativeNotification({
          title,
          body,
          icon: actorImg,
          tag: `social-${payload.id || Date.now()}`,
          data: { url: targetUrl },
          onClick: () => navigate(targetUrl),
        });
      }
    };

    socket.on("chatMessageNotification", handleChatNotification);
    socket.on("notification", handleGeneralNotification);

    return () => {
      socket.off("chatMessageNotification", handleChatNotification);
      socket.off("notification", handleGeneralNotification);
    };
  }, [isLogin, user?.id, socket, navigate, location, queryClient, dispatch, conversationLogData]);
}
