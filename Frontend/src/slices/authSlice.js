import { createSlice } from '@reduxjs/toolkit';
const storedUser = localStorage.getItem("userData");
const userData = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null

const initialState = {
  user:userData,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token") && storedUser,
  loader: false,
  registeredUser:null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.user= action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userData",JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      if(state.registeredUser){
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
    registerUser: (state, action) => {
      state.registeredUser = action.payload;
    },

    setLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

// Export actions
export const { login, logout, setUser, registerUser, setLoader } = authSlice.actions;

export default authSlice.reducer;
