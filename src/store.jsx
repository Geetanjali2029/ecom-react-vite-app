import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reduxSlice/cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add other slices as needed
  },
});

export default store;