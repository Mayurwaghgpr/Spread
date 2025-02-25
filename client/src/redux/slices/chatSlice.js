import { createSlice } from '@reduxjs/toolkit';
const initialState =
{
    conversations: [],
    messages: []
}
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setConversations, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
