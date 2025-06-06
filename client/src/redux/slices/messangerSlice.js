import { createSlice } from "@reduxjs/toolkit";
const converstaioMeta = JSON.parse(sessionStorage.getItem("conversationMeta"));

const initialState = {
  conversations: [],
  messages: [],
  selectedConversation: converstaioMeta,
  messageLogData: [],
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
    setMessageLogData: (state, action) => {
      state.messageLogData = action.payload;
    }
  },
});

export const {
  setConversations,
  selectConversation,
  setMessageLogData,
  pushMessage,
  addMessage,
  popMessage,
} = messangerSlice.actions;

export default messangerSlice.reducer;
