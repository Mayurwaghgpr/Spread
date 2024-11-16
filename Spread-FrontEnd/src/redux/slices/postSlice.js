import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
// const post = JSON.parse(localStorage.getItem("selectedPost"));
const initialState = {
    selectedPostId:'',
    topiclist:[],
    submit: false,
    beforsubmit: false,
    elements:[
    {className:'text-5xl text-gray-300', type: "text", data: "", id: uuidv4(), index: 0 },
    ],
    
}


const PostSclic = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSelectedPostId: (state,action) => {
            state.selectedPostId = action.payload
        },
        setTopiclist: (state, action) => {
            state.topiclist=action.payload
        },
        setElements: (state, action) => {
            state.elements = action.payload
        },
        setSubmit: (state,action) => {
            state.submit = action.payload
        },
        setBeforeSubmit: (state, action) => {
            state.beforsubmit = action.payload
        },
    }
})


export const { setSelectedPostId, setTopiclist, setSubmit ,setBeforeSubmit ,FilterData,setElements,pushNewData} = PostSclic.actions

export default PostSclic.reducer