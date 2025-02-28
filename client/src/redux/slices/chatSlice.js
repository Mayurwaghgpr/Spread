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
      state.messages=action.payload;
    },
    pushMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    popMessage: (state, action) => {
      state.messages.pop()
    }
  },
});

export const { setConversations, setMessages, addMessage ,pushMessage,popMessage} = chatSlice.actions;
export default chatSlice.reducer;
