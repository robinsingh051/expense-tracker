import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
  token: "",
  email: "",
  isLoggedIn: false,
  isPremium: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: authInitialState,
  reducers: {
    login(state, action) {
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("email", action.payload.email);
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      state.isLoggedIn = false;
      state.token = "";
      state.email = "";
    },
    setPremium(state, action) {
      state.isPremium = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
