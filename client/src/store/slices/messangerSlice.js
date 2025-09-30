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
      state.messages.push(action.payload);
    },
    popMessage: (state, action) => {
      state.messages.pop();
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
  addMessage,
  popMessage,
} = messangerSlice.actions;

export default messangerSlice.reducer;
