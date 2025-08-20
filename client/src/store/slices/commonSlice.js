import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    userSuggestions: [],
    topics: [],
    isLoadingHome: false,
    error: null,
    isError: false,
    isMessagesPath: false,
    isWritePath: false,
    isSearchPath: false,
    showSidebar: false,
  },
  reducers: {
    setLoadingHome: (state, action) => {
      state.isLoadingHome = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isError = !!action.payload;
    },
    setMessagesPath: (state, action) => {
      state.isMessagesPath = action.payload;
    },
    setWritePath: (state, action) => {
      state.isWritePath = action.payload;
    },
    setSearchPath: (state, action) => {
      state.isSearchPath = action.payload;
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setUserSuggestions: (state, action) => {
      state.userSuggestions = action.payload;
    },
    setTopiclist: (state, action) => {
      state.topics = action.payload;
    },
  },
});
export const {
  setLoadingHome,
  setError,
  setMessagesPath,
  setWritePath,
  setSearchPath,
  setShowSidebar,
  setUserSuggestions,
  setTopiclist,
} = commonSlice.actions;
export default commonSlice.reducer;
