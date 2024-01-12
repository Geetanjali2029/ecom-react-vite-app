import React,{ useState,useEffect } from 'react';
import ShowNotificationDialog from './ShowNotificationDialog';
import { SET_TIME_OUT } from '../Constants';
import { useDispatch, useSelector } from 'react-redux';
import { setCartQuantity, setCartData } from '../reduxSlice/cartSlice';

  const AddToCart = (props) => {
    const dispatch = useDispatch();
    const cartData = useSelector(state => state.cart.cartData);
    let tempCartData = [];
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
          const timeoutId = setTimeout(() => {
              setNotification(null);
          }, SET_TIME_OUT);

          return () => clearTimeout(timeoutId);
        }
    }, [notification]);
    
    const addProductToCart = (item) => {
      let itemIndex = -1;
      if(cartData.length !== 0 ){
        tempCartData = [...cartData];
        itemIndex = tempCartData.findIndex(x => x.id === item.id);
      }
      
      if(cartItems.length === 0 && itemIndex === -1){
        if(item.hasOwnProperty('quantity') === false){
          tempCartData.push({...item, quantity: 1});
        }
        else{
          tempCartData.push({...item, quantity: item.quantity });
        }
      }
      setCartItems(tempCartData);
      dispatch(setCartData(tempCartData));
      dispatch(setCartQuantity(tempCartData.length));
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

export default AddToCart;