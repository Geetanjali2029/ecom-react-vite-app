import React,{ useState,useEffect } from 'react';
import { connect } from "react-redux";
import ShowNotificationDialog from './ShowNotificationDialog';
import { SET_TIME_OUT } from '../Constants';

  const AddToCart = (props) => {
    
    const [cartItems, setCartItems] = useState([]);
    let tempCartData = []; 

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
          const timeoutId = setTimeout(() => {
              setNotification(null);
          }, {SET_TIME_OUT});

          return () => clearTimeout(timeoutId);
        }
    }, [notification]);
    
    const addProductToCart = (item) => {
      let itemIndex = -1;
      if(props.cart.cartData.length !== 0 ){
        tempCartData = props.cart.cartData;
        itemIndex = tempCartData.findIndex(x => x.id === item.id);
      }
      
      if(cartItems.length === 0 && itemIndex === -1){
        if(item.hasOwnProperty('quantity') === false){
          tempCartData.push({...item, quantity: 1 });
        }else{
          tempCartData.push({...item, quantity: item.quantity });
        }
      }else{
        // tempCartData = tempCartData.map((cartItem) => // if the item is already in the cart, increase the quantity of the item
        //   cartItem.id === item.id
        //       ? { ...cartItem, quantity: parseInt(cartItem.quantity) + 1 }
        //       : cartItem // otherwise, return the cart item
        //   );
      }

      setCartItems(tempCartData);
      props.cartData(tempCartData);
      props.cartQuantity(tempCartData.length);

      setNotification("Product added to cart successfully");
    };
        
    return (
      <div>
        {notification && (<ShowNotificationDialog message={notification} />)}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          onClick={()=>addProductToCart(props.productData)}
        >
          Add To Cart
        </button>
      </div>
    );
  }

  const mapStateToProps = (state) => ({
    cart: state.cart,
  });
  
  function mapDispatchToProps(dispatch) {
    return {
      cartQuantity: (cartQuantity) =>
        dispatch({ type: "ADD_TO_CART", data: cartQuantity }),
      cartData: (cartData) =>
        dispatch({ type: "CART_DATA", data: cartData }),
    };
  }
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddToCart);
