import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
const Theme=localStorage.getItem("ThemeMode")

const initialState = {

  confirmBox: {
    message: "",
    status: false,
  },
  isConfirm: {
    status: false,
  },
 
  ToastState: [],
  ThemeMode:Theme ,
  
  isScale: false,
  // focusedIndex: 0,
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
      state.ToastState.push({ id: uuidv4(), ...action.payload});
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
    // setFocusedIndex: (state,action) => {
    //   state.focusedIndex= action.payload
    // },

  },
});

export const { setConfirmBox, setIsConfirm, setToast, removeToast,setThemeMode ,setIsScale,removeAllToast} = uiSlice.actions;

export default uiSlice.reducer;
