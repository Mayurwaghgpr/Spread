import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: {},
    FollowInfo:{Info:'',count:null},
}

const ProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers:{
    setuserProfile: (state, action) => {
            state.userProfile = action.payload
        },
    setFollowInfo: (state, action) => {
        state.FollowInfo =action.payload
    }

    }
})

export const {setuserProfile,setFollowInfo } = ProfileSlice.actions;
export default ProfileSlice.reducer