import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
// const post = JSON.parse(localStorage.getItem("selectedPost"));
const initialState = {
    selectedPostId:'',
    topiclist:[],
    submit: false,
    beforsubmit: false,
    elements:[
    {type: "text", data: "", id: uuidv4(), index: 0 },
    ],
    commentCred:{postId:null,topCommentId:null,content:'',replyTo:null},
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
        setCommentCred: (state, action) => {
            state.commentCred = action.payload;
        }
    }
})


export const { setSelectedPostId, setTopiclist, setSubmit ,setBeforeSubmit ,FilterData,setElements,pushNewData,setCommentCred} = PostSclic.actions

export default PostSclic.reducer