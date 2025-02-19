import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem("userData");
const userData = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
const storedToken = localStorage.getItem("token");

const initialState = {
  user: userData,
  token: storedToken ? storedToken: null, 
  isAuthenticated: !!storedToken && userData,
  loader: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user.image = action.payload;
        localStorage.setItem("userData", JSON.stringify(state.user));
      }
    },
    deleteAccountUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    }
  },
});

// Export actions
export const { login, logout, setUser, setLoader, updateProfileImage, deleteAccountUser } = authSlice.actions;

export default authSlice.reducer;
