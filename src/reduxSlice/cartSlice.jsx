import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartData: [],  
        totalQuantity: 0,
        totalAmount: 0,
        subtotal: 0,
        notification: null
    },
    reducers: {
        setCartQuantity: (state, action) => {//CART_QUANTITY
            state.totalQuantity = action.payload
        },
        setCartData: (state,action) => {//CART_DATA
            state.cartData = [...action.payload];
        },
        setTotalAmount: (state, action) => {
            state.totalAmount = action.payload
        },
        setSubtotal: (state, action) => {
            state.subtotal = action.payload
        },
        setNotification: (state, action) => {
            state.notification = action.payload
        },
    },
  });
  
  export const { setCartQuantity, setCartData, setTotalAmount, setSubtotal, setNotification } = cartSlice.actions;
  export default cartSlice.reducer;