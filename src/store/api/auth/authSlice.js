
import { createSlice } from "@reduxjs/toolkit";

// Get stored data from localStorage
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const storedToken = localStorage.getItem("token");
const storedRole = localStorage.getItem("userRole");

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
    isAuth: !!storedUser && !!storedToken,
    userRole: storedRole || storedUser?.type || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuth = true;
      state.userRole = action.payload.type;
      
      // Also ensure localStorage is updated
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("userRole", action.payload.type);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      state.userRole = null;
      
      // Clear all localStorage items
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("user-name");
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

