import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
const Theme=localStorage.getItem("ThemeMode")

const initialState = {

  confirmBox: {
    message: "",
    title:'',
    status: false,
    id:'',
  },
  isConfirm: {
    status: false,
  },
  ToastState: [],
  ThemeMode:Theme,
  isScale: false,
  MenuOpen: false,
  
  openNotification: false,

};



const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setConfirmBox: (state, action) => {
      state.confirmBox = action.payload;
    },
    setIsConfirm: (state, action) => {
      state.isConfirm = action.payload;
    },

    setToast: (state, action) => {
      const existingToast = state.ToastState.find(toast => toast.type === action.payload.type);
      
      if (existingToast) {
        existingToast.count = (existingToast.count || 1) + 1; // Increase count if already present
         existingToast.message=action.payload.message
      } else {
    state.ToastState = [...state.ToastState, { id: uuidv4(), count:1,...action.payload }].slice(-3);
      }
    },

    removeToast: (state, action) => {
      state.ToastState = state.ToastState.filter(el => el.id !== action.payload);
    },
    removeAllToast: (state,action) => {
       state.ToastState=[]
    },
    setThemeMode: (state,action) => {
      state.ThemeMode =action.payload
    },
    setIsScale: (state,action) => {
      state.isScale = !state.isScale
    },
    setManuOpen: (state) => {
      state.MenuOpen = !state.MenuOpen
    },
    setOpenNotification: (state) => {
      state.openNotification = !state.openNotification
    },

    // setFocusedIndex: (state,action) => {
    //   state.focusedIndex= action.payload
    // },

  },
});

export const {
  setConfirmBox,
  setIsConfirm,
  setToast,
  removeToast,
  setThemeMode,
  setIsScale,
  removeAllToast,
  setManuOpen,
  setOpenNotification,
  
} = uiSlice.actions;

export default uiSlice.reducer;
