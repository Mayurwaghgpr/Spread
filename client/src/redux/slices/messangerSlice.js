import { createSlice } from "@reduxjs/toolkit";
const converstaioMeta=JSON.parse(localStorage.getItem("conversationMeta"));
const initialState = {
      conversations: [],
    messages: [],
    openNewConverstionBox: false,
    selectedConversation:converstaioMeta
}

const messangerSlice=createSlice({
    name: 'messanger',
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
    },
    setOpenNewConverstionBox: (state) => {
      state.openNewConverstionBox= !state.openNewConverstionBox
        },
        selectConversation: (state, action) => {
            state.selectedConversation = action.payload;
      }  
        
    }
})

export const { setConversations, setMessages, addMessage ,pushMessage,popMessage,setOpenNewConverstionBox,selectConversation } = messangerSlice.actions;

export default messangerSlice.reducer;