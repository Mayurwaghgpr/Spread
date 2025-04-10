import { createSlice} from "@reduxjs/toolkit";

const token = localStorage.getItem("AccessToken");

// Initial state
const initialState = {
  isLogin: token,
  user: {},
  loginPop:false  
};

// Create a slice of the Redux store
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setloginPop:(state, action) => {
      state.loginPop = action.payload;
    }
  },
 
});

// Export actions and reducer
export const { setIsLogin, setUser, setLoading,setloginPop } = authSlice.actions;
export default authSlice.reducer;
