import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice'; // fixed typo in import
import chatSlice from './slices/chatSlice';
import messangerSlice from './slices/messangerSlice';
// import { postsApi } from './slices/postsApi'; // Import the API slice
// import { profileApi } from './slices/porfileApi';
// import { authApi } from './slices/authApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    posts: postReducer,
    profile: profileReducer,
    chat: chatSlice,
    messanger: messangerSlice,
    // [postsApi.reducerPath]: postsApi.reducer, // Add the API reducer
    // [profileApi.reducerPath]: profileApi.reducer,
    // [authApi.reducerPath]:authApi.reducer
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(postsApi.middleware,profileApi.middleware,authApi.middleware), // Add the API middleware
});

export default store;
