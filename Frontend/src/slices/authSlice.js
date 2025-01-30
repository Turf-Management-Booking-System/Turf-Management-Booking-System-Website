import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading:false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    registerUser: (state, action) => {
        state.user = action.payload; 
      },
    setLoading: (state, action) => {
        state.loading = action.payload; 
      },
  },
});

export const { login, logout, setUser,registerUser,setLoading,loading } = authSlice.actions;

export default authSlice.reducer;
