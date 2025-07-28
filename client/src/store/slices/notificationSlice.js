import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notificationState: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationState: (state, action) => {
      state.notificationState = action.payload;
    },
    setNotificationStatePush: (state, action) => {
      state.notificationState.push(action.payload);
    },
    setNotificationStatePop: (state, action) => {
      state.notificationState.pop();
    },
  },
});

export const {
  setNotificationStatePush,
  setNotificationStatePop,
  setNotificationState,
} = notificationSlice.actions;
export default notificationSlice.reducer;
