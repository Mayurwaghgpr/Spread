import { createSlice,nanoid } from "@reduxjs/toolkit";
const initialState = {
    selectedPostId:'',
    topiclist:[],
    submit: false,
    beforsubmit: false,
    elements:[
    {type: "text", data: "", id: nanoid(), index: 0 },
    ],
    commentCred: { postId: null, topCommentId: null, content: '', replyTo: null },
    selectedPost: {},
}


const PostSlice = createSlice({
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
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        }
    }
})

export const { setSelectedPostId, setTopiclist, setSubmit ,setBeforeSubmit ,FilterData,setElements,pushNewData,setCommentCred,setSelectedPost} = PostSlice.actions

export default PostSlice.reducer