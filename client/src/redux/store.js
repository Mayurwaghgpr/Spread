import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice';
import messangerSlice from './slices/messangerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    posts: postReducer,
    profile: profileReducer,
    messanger: messangerSlice,
  },
});

export default store;
