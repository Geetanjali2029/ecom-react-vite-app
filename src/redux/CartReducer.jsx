const initialState = {
  cartData: [],  
  totalQuantity: 0,

  };
  
  const CartReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        return {
          ...state,
          totalQuantity: action.data,
        };
      case "CART_DATA":
      return {
        // ...state,
        // cartData: state.cartData.concat(action.data)
        
        cartData: action.data,
      };
      default:
        return state;
    }
  };
  export default CartReducer;
  