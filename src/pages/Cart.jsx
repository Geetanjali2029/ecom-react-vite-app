import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { useForm } from 'react-hook-form';
import ShowNotificationDialog from '../components/ShowNotificationDialog';

function Cart(props) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  
  let initialValue = {
    firstName:'',
    lastName: '',
    addressLine1:'',
    addressLine2: '',
    city: '',
    zipcode: '',
    contactNo:''
  }
  
  const [shippingData, setShippingData] = useState(initialValue);
  const [quantity, setQuantity] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
 
  let shippingCharges = 10.00;

  useEffect(() => {
    setCartItems(props.cart.cartData);
    calculateAmount(props.cart.cartData);
  }, [cartItems])

  const [notification, setNotification] = useState(null);

  useEffect(() => {
      if (notification) {
      const timeoutId = setTimeout(() => {
          setNotification(null);
      }, 5000);

      return () => clearTimeout(timeoutId);
      }
  }, [notification]);

   const calculateAmount = (productData) =>{
      let tempTotalAmount = 0;
      let tempSubtotal = 0;
      if(productData.length !== 0){
        productData.map((item) => // if the item is already in the cart, increase the quantity of the item
        tempSubtotal = tempSubtotal + (item.price * item.quantity)
        );
        tempTotalAmount = tempSubtotal + shippingCharges;
      }
      setTotalAmount(tempTotalAmount);
      setSubtotal(tempSubtotal);
   }

   const removeItemFromCart = (productItem) => {
    let updatedProducts = cartItems.filter((item) => productItem.id !== item.id);
    setCartItems(updatedProducts);

    props.cartData(updatedProducts);
    props.cartQuantity(updatedProducts.length);

    setNotification("Product removed from cart successfully");
   }

   const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShippingData({ ...shippingData, [name]: value });
  };

   const submitShippingForm = () => {
      
      let productData = [];
      props.cart.cartData.forEach(function(element) {
        productData.push({productId: element.id, quantity: element.quantity})
      });

      let postData = {"userId": "7","products": productData,"paymentStatus": `PAID|${totalAmount}`, 
      "orderStatus": "CONFIRMED","shippingAddress":shippingData};

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      };
      fetch('https://fake-ecommerce-app-api.onrender.com/orders', requestOptions)
          .then(response => {
            setNotification("Order placed successfully");
            props.cartData([]);
            props.cartQuantity(0);
            navigate("/orders");
          });
  };

  const incrementQuantity = (item) => {
    let cartData = cartItems;
    for (var i = 0; i < cartData.length; i++) {
      if (cartData[i].id === item.id) {
        cartData[i].quantity = cartData[i].quantity + 1;
      }
    }
    setCartItems(cartData);
    setQuantity(quantity + 1);
    calculateAmount(cartData);

    props.cartData(cartData);
    props.cartQuantity(cartData.length);
};

const decrementQuantity = (item) => {
  let cartData = cartItems;
  for (var i = 0; i < cartData.length; i++) {
    if (cartData[i].id === item.id && item.quantity > 1) {
      cartData[i].quantity = cartData[i].quantity - 1;
    }
  }
  setCartItems(cartData);
  setQuantity(quantity - 1);
  calculateAmount(cartData);

  props.cartData(cartData);
  props.cartQuantity(cartData.length);
};

  const goToProductDetail = (id) => {
    navigate("/product-details/" + id);
  };

  return (
    <div className="flex-1 bg-gray-100 p-4">
      <div className="container mx-auto my-8">
        <h1 className="text-3xl  mb-4">My Cart</h1>
        {cartItems.length === 0 ? (
          <span>Your cart is empty</span>
        ):(<>
          {/* Product items in the cart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartItems.length !== 0 && cartItems.map((item,index) => (
              <div className="bg-white p-4 rounded-md shadow-md" key={index}>
                <img src={item.image} alt="Product 1" className="w-full h-32 object-cover mb-4 rounded-md" 
                onClick={()=>goToProductDetail(item.id)}/>
                <h2 className="text-lg">{item.title}</h2>
                <div className="text-gray-600 items-center mb-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-l"
                      onClick={()=>decrementQuantity(item)}
                    >
                      -
                    </button>
                    <span className='px-2'>{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-r"
                      onClick={()=>incrementQuantity(item)}
                    >
                      +
                    </button>
                </div>
                <p className="text-gray-600 mb-2">₹{item.price}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={()=>removeItemFromCart(item)}>Remove</button>
              </div>
            ))}
          </div>
          {/* Cart summary */}
          <div className="grid grid-cols-2 gap-2">
          <div className="mt-8 p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl  mb-4">Cart Summary</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="">₹{subtotal}.00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="">₹{shippingCharges}.00</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total:</span>
              <span className="">₹{totalAmount}.00</span>
            </div>
            
          </div>

          <div className="mt-8 p-4 bg-white rounded-md shadow-md">
            {/* Shipping Address Section */}
            <section>
              <h2 className="text-2xl mb-4">Shipping Address</h2>
              <form className="bg-white p-4 shadow-md rounded-md" onSubmit={handleSubmit(submitShippingForm)}>
                {/* Name Input */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">First Name</label>
                    <input type="text" className="mt-1 p-2 w-full border rounded-md" 
                    {...register('firstName', { required: true, onChange: (e) => handleInputChange(e) })} />
                    {errors.firstName && <p>First name is required.</p>} 
                  </div>
                  <div>
                    <label htmlFor="LastName" className="block text-sm font-medium text-gray-600">Last Name</label>
                    <input type="text" className="mt-1 p-2 w-full border rounded-md" 
                    {...register('lastName', { required: true, onChange: (e) => handleInputChange(e) })}/>
                    {errors.lastName && <p>Last name is required.</p>}    
                  </div>
                </div>

                {/* Address Input */}
                <div className="mb-4">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-600">Address Line1</label>
                  <input type="text" id="addressLine1" className="mt-1 p-2 w-full border rounded-md" 
                  {...register('addressLine1', { required: true, onChange: (e) => handleInputChange(e) })}/>
                  {errors.addressLine1 && <p>Address Line1 is required.</p>}    
                </div>
                <div className="mb-4">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-600">Address Line2</label>
                  <input type="text" id="addressLine2" className="mt-1 p-2 w-full border rounded-md" 
                  {...register('addressLine2', { onChange: (e) => handleInputChange(e) })}/>
                </div>

                {/* City and ZIP Code Inputs (adjust as needed) */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-600">City</label>
                    <input type="text" id="city" className="mt-1 p-2 w-full border rounded-md" 
                    {...register('city', { required: true, onChange: (e) => handleInputChange(e) })}/>
                    {errors.city && <p>City is required.</p>}    
                  </div>
                  <div>
                    <label htmlFor="zipcode" className="block text-sm font-medium text-gray-600">ZIP Code</label>
                    <input type="text" id="zipcode" className="mt-1 p-2 w-full border rounded-md" 
                    {...register('zipcode', { required: true, onChange: (e) => handleInputChange(e) })}/>
                    {errors.zipcode && <p>Zipcode is required.</p>}    
                  </div>
                  <div>
                    <label htmlFor="contactNo" className="block text-sm font-medium text-gray-600">Contact Number</label>
                    <input type="text" id="contactNo" className="mt-1 p-2 w-full border rounded-md" 
                    {...register('contactNo', { required: true, onChange: (e) => handleInputChange(e) })}/>
                    {errors.contactNo && <p>Contact number is required.</p>}    
                  </div>
                </div>

                <div className="mt-6">
                  <button type="submit" className="bg-green-500 text-white px-8 py-2 rounded-md hover:bg-green-600"
                >Checkout</button>
                </div>
              </form>
            </section>
          </div>
          </div>
          </>
        )}
      </div>
      {notification && (<ShowNotificationDialog message={notification} />)}
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

export default connect(mapStateToProps,mapDispatchToProps)(Cart);
