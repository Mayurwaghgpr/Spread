import { createSlice, nanoid } from "@reduxjs/toolkit";

const getSavedTheme = () => {
  try {
    return localStorage.getItem("ThemeMode") || "system";
  } catch (e) {
    return "system";
  }
};

const defaultConfirmBox = {
  message: "",
  title: "",
  status: false,
  isConfirm: false,
  content: "",
  type: "",
  event: "",
  contentId: "",
};

const initialState = {
  confirmBox: defaultConfirmBox,
  isConfirm: {
    status: false,
  },
  ToastState: [],
  ThemeMode: getSavedTheme(),
  isScale: false,
  menuOpen: true,
  openBigFrame: null,
  openNotification: false,
  shareTomedia: {
    status: false,
    link: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setConfirmBox: (state, action) => {
      state.confirmBox = action.payload;
    },
    resetConfirmBox: (state) => {
      state.confirmBox = defaultConfirmBox;
    },
    setIsConfirm: (state, action) => {
      state.isConfirm = action.payload;
    },

    setToast: (state, action) => {
      const payload = action.payload || {};
      const targetId = payload.id;

      // 1. Direct ID lookup (for state morphing like loading -> success/error)
      if (targetId) {
        const existingById = state.ToastState.find((t) => t.id === targetId);
        if (existingById) {
          Object.assign(existingById, {
            ...payload,
            updatedAt: Date.now(),
          });
          return;
        }
      }

      // 2. Intelligent duplicate detection: only match exact same message and type
      const incomingType = payload.type || "default";
      const incomingMsg = payload.message || "";
      const duplicateToast = state.ToastState.find(
        (t) => t.type === incomingType && t.message === incomingMsg
      );

      if (duplicateToast) {
        duplicateToast.count = (duplicateToast.count || 1) + 1;
        duplicateToast.updatedAt = Date.now();
        if (payload.action) duplicateToast.action = payload.action;
        if (payload.duration !== undefined) duplicateToast.duration = payload.duration;
      } else {
        const newToast = {
          id: targetId || nanoid(),
          type: incomingType,
          message: incomingMsg,
          title: payload.title || "",
          description: payload.description || "",
          duration:
            payload.duration !== undefined
              ? payload.duration
              : incomingType === "loading"
              ? Infinity
              : 4500,
          action: payload.action || null,
          details: payload.details || null,
          count: 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...payload,
        };
        // Keep up to 4 most recent toasts visible to prevent viewport clogging
        state.ToastState = [...state.ToastState, newToast].slice(-4);
      }
    },
    updateToast: (state, action) => {
      const { id, ...updates } = action.payload || {};
      const target = state.ToastState.find((t) => t.id === id);
      if (target) {
        Object.assign(target, updates, { updatedAt: Date.now() });
      }
    },
    removeToast: (state, action) => {
      state.ToastState = state.ToastState.filter(
        (el) => el.id !== action.payload,
      );
    },
    removeAllToast: (state) => {
      state.ToastState = [];
    },
    setThemeMode: (state, action) => {
      state.ThemeMode = action.payload;
      try {
        localStorage.setItem("ThemeMode", action.payload);
      } catch (e) {
        console.error("Failed to save ThemeMode to localStorage:", e);
      }
    },
    setIsScale: (state) => {
      state.isScale = !state.isScale;
    },
    setMenuOpen: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    setOpenNotification: (state) => {
      state.openNotification = !state.openNotification;
    },
    setOpenBigFrame: (state, action) => {
      state.openBigFrame = action.payload;
    },
    setShareToMedia: (state, action) => {
      state.shareTomedia = action.payload;
    },
  },
});

export const {
  setConfirmBox,
  resetConfirmBox,
  setIsConfirm,
  setToast,
  updateToast,
  removeToast,
  setThemeMode,
  setIsScale,
  removeAllToast,
  setMenuOpen,
  setOpenNotification,
  setOpenBigFrame,
  setShareToMedia,
} = uiSlice.actions;

export default uiSlice.reducer;
