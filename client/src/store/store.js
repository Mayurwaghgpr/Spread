import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice';
import messangerSlice from './slices/messangerSlice';
import NotificationSlice from './slices/NotificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication reducer
    ui: uiReducer, // UI reducer
    posts: postReducer, // Posts reducer
    profile: profileReducer, // Profile reducer
    messanger: messangerSlice, // Messenger reducer
    notification: NotificationSlice, // Notification reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* your custom middleware */),
});

export default store;
