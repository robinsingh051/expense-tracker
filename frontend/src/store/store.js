import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import expensesReducer from "./expenses";
import darkModeReducer from "./darkMode";

const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    auth: authReducer,
    darkMode: darkModeReducer,
  },
});

export default store;
