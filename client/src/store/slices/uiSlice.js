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
      const existingToast = state.ToastState.find(
        (toast) => toast.type === action.payload.type,
      );

      if (existingToast) {
        existingToast.count = (existingToast.count || 1) + 1;
        existingToast.message = action.payload.message;
      } else {
        state.ToastState = [
          ...state.ToastState,
          { id: nanoid(), count: 1, ...action.payload },
        ].slice(-3);
      }
    },
    removeToast: (state, action) => {
      state.ToastState = state.ToastState.filter(
        (el) => el.id !== action.payload,
      );
    },
    removeAllToast: () => {
      return { ...initialState, ThemeMode: getSavedTheme(), ToastState: [] };
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
