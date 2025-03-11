import { createSlice } from "@reduxjs/toolkit";
const converstaioMeta=JSON.parse(localStorage.getItem("conversationMeta"));
const initialState = {
    openNewConverstionBox: false,
    selectedConversation:converstaioMeta
}

const messangerSlice=createSlice({
    name: 'messanger',
    initialState,
    reducers: {
    setOpenNewConverstionBox: (state) => {
      state.openNewConverstionBox= !state.openNewConverstionBox
        },
        selectConversation: (state, action) => {
            state.selectedConversation = action.payload;
      }  
        
    }
})

export const { setOpenNewConverstionBox,selectConversation } = messangerSlice.actions;

export default messangerSlice.reducer;