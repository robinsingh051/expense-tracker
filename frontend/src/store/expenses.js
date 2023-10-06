import { createSlice } from "@reduxjs/toolkit";

const expensesInitialState = {
  items: [],
  totalAmount: 0,
  isPremiumAvailable: false,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState: expensesInitialState,
  reducers: {
    add(state, action) {
      state.items.push(action.payload.item);
      if (
        state.totalAmount + parseFloat(action.payload.item.amount) > 10000 &&
        !state.isPremiumAvailable
      )
        state.isPremiumAvailable = true;
      state.totalAmount += parseFloat(action.payload.item.amount);
    },
    remove(state, action) {
      const itemId = action.payload.id;
      const item = state.items.find((item) => item.id === itemId);
      if (state.totalAmount - parseFloat(item.amount) < 10000)
        state.isPremiumAvailable = false;
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      state.totalAmount -= parseFloat(item.amount);
    },
    setExpenses(state, action) {
      let totalAmount = 0;
      for (let i = 0; i < action.payload.items.length; i++) {
        totalAmount = totalAmount + parseFloat(action.payload.items[i].amount);
      }
      state.items = action.payload.items;
      if (totalAmount > 10000) state.isPremiumAvailable = true;
      state.totalAmount = totalAmount;
    },
  },
});

export const expensesActions = expensesSlice.actions;
export default expensesSlice.reducer;
