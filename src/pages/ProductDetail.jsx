import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddToCart from '../components/AddToCart';
import { connect } from "react-redux";
import { callAPI } from '../services/apiService';

function ProductDetail(props) {
    const { id } = useParams();
    const [productData, setProductData] = useState({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchData(id);
    }, []);

    const fetchData = async(id) => {
        try {
            const data = await callAPI(`products/${id}`);
            if(props.cart.cartData.length !== 0){
                let getQuantity = props.cart.cartData.find(x => x.id === data.id);
                if(getQuantity)
                    data.quantity = getQuantity.quantity;
                else
                    data.quantity = 1;
            }else
                data.quantity = 1;

            setProductData(data);
          } catch (error) {
            console.log(error);
          }
    }
    
    const updateQuantity = (newQuantity) => {
        productData.quantity = newQuantity;
        setQuantity(newQuantity);
        setProductData(productData);
    }
   
    return (
        <div className="flex-1 bg-gray-100 p-4">
            <h1 className="text-3xl ">Product details</h1>

            <div className="container mx-auto p-4">
                <div className="flex">
                    <div className="w-1/2">
                    <img
                        src={productData.image}
                        alt={productData.title}
                        className="rounded-lg shadow-lg"
                    />
                    </div>
                    <div className="w-1/2 ml-4">
                    <h1 className="text-3xl font-semibold mb-2">{productData.title}</h1>
                    <p className="text-gray-600 mb-4">{productData.description}</p>
                    <div className="text-2xl  mb-4">₹{productData.price}.00</div>
                    <div className="text-gray-600 items-center mb-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-l"
                      onClick={()=>updateQuantity((productData.quantity > 1) ? productData.quantity - 1 : 1)}
                    >
                      -
                    </button>
                    <span className='px-2'>{productData.quantity}</span>
                  
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-r"
                      onClick={()=>updateQuantity(productData.quantity + 1)}
                    >
                      +
                    </button>
                </div>

                    <AddToCart productData={productData}/>
                    </div>
                </div>
                </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    cart: state.cart,
  });
  
export default connect(mapStateToProps,null)(ProductDetail);
