import { createSlice } from "@reduxjs/toolkit";
const converstaioMeta = JSON.parse(sessionStorage.getItem("conversationMeta"));

const initialState = {
  conversations: [],
  messages: [],
  selectedConversation: converstaioMeta,
  conversationLogData: [],
};

const messangerSlice = createSlice({
  name: "messanger",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = action.payload;
    },
    pushMessage: (state, action) => {
      if (!state.messages.some((message) => message?.id === action.payload?.id)) {
        state.messages.unshift(action.payload);
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((message) => message?.id !== action.payload);
    },
    popMessage: (state, action) => {
      state.messages.shift();
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConversationLogData: (state, action) => {
      state.conversationLogData = action.payload;
    },
  },
});

export const {
  setConversations,
  selectConversation,
  setConversationLogData,
  pushMessage,
  removeMessage,
  addMessage,
  popMessage,
} = messangerSlice.actions;

export default messangerSlice.reducer;
