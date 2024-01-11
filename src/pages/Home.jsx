import React,{useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddToCart from '../components/AddToCart';
import { useForm } from 'react-hook-form';
import { callAPI } from '../services/apiService';

function Home() {
  const navigate = useNavigate();

  // State to manage the checkbox values
  let initialCheckbox = {
    "smartphones":false,
    "skincare": false,
    "groceries":false,
    "home-decoration":false
  };
  const [checkboxes, setCheckboxes] = useState(initialCheckbox);
  const [productList, setProductList] = useState([]);
  const [perPage, setPerPage] = useState(6);
  const [totalCount, setTotalCount] = useState(1);
  const [count, setCount] = useState(1);
  const [selectedCategories, setSelctedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({minPrice: 0, maxPrice: 5000});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Function to handle checkbox changes
  const handleCheckboxChange = (event, checkboxName) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [checkboxName]: !prevCheckboxes[checkboxName],
    }));

    if(event.target.checked && !selectedCategories.includes(checkboxName)){
      setSelctedCategories(selectedCategories => [...selectedCategories, checkboxName]);
    }else{
      setSelctedCategories(selectedCategories.filter((item) => item !== checkboxName));
    }
  };

  useEffect(() => {
    fetchData(perPage, selectedCategories, priceRange.minPrice, priceRange.maxPrice);
  }, [selectedCategories]);

   const fetchData = async (limit, category='', minPrice, maxPrice) => {
    
    if(selectedCategories.length > 0){
      limit = perPage; //if filter applies then reset the limit parameter in API
      category = selectedCategories.toString();
    }
    
    try {
      const data = await callAPI(`products?limit=${limit}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
      setProductList(data.products);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.log(error);
    }
  }

  const loadMoreItems = (limit) => {
    let tmpCount = count + 1;
    setCount(tmpCount);
    let nextRecordsLimit = limit * tmpCount;
    fetchData(nextRecordsLimit, selectedCategories, priceRange.minPrice, priceRange.maxPrice);
  };

  const goToProductDetail = (id) => {
    navigate("/product-details/" + id);
  };

  const clearFilter = () => {
    setCheckboxes(initialCheckbox);
    setSelctedCategories([]);
    setPriceRange({minPrice:0, maxPrice: 10000});
    reset();
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPriceRange({ ...priceRange, [name]: value });
  };

  const filterPriceRange = () =>{
    fetchData(perPage, selectedCategories, priceRange.minPrice, priceRange.maxPrice);
  }

  return (
    <div className="flex-1 bg-gray-100 p-2">
        <h1 className="text-2 font-bold text-left p-2">Today's Deals</h1>

        {/* Container for the layout */}
        <div className="grid grid-cols-3 gap-4 p-4">

            {/* Sidebar on the left */}
            <div className="text-left col-span-1 p-4">
                {/* Sidebar content goes here */}
                <div className="font-bold col-span-1 text-left">
                  <p>Filters:</p>
                </div>
                <div className="col-span-1 text-right">
                <Link className="text-gray-600 text-left" onClick={clearFilter}>Clear</Link>
                </div>
                <div className="col-span-1 text-left pt-4">
                    <span className="font-bold col-span-1 text-left">Categories</span>
                
                    <div className="pt-2 flex items-center">
                        {/* Styled Checkbox */}
                        <input
                        type="checkbox"
                        id="smartphones"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={checkboxes.smartphones}
                        onChange={(e) => handleCheckboxChange(e,'smartphones')}  
                        />
                        <label htmlFor="smartphones" className="ml-2 text-gray-700">
                        Smartphones
                        </label>
                        </div>
                        <div className="pt-2 flex items-center">

                        <input
                        type="checkbox"
                        id="skincare"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={checkboxes.skincare}
                        onChange={(e) => handleCheckboxChange(e,'skincare')}
                        />
                        <label htmlFor="skincare" className="ml-2 text-gray-700">
                        Skincare
                        </label>
                        </div>
                        
                        <div className="pt-2 flex items-center">
                        <input
                        type="checkbox"
                        id="groceries"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={checkboxes.groceries}
                        onChange={(e) => handleCheckboxChange(e,'groceries')}
                        />
                        <label htmlFor="groceries" className="ml-2 text-gray-700">
                        Groceries
                        </label>
                        </div>

                        <div className="pt-2 flex items-center">
                        <input
                        type="checkbox"
                        id="home-decoration"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={checkboxes['home-decoration']}
                        onChange={(e) => handleCheckboxChange(e,'home-decoration')}
                        />
                        <label htmlFor="home-decoration" className="ml-2 text-gray-700">
                        Home Decoration
                        </label>
                        </div>

                        
                </div>

                <div className="col-span-1 text-left pt-4">
                  <span className="font-bold col-span-1 text-left">Price Range</span>
                  <form className="p-4 rounded-md" onSubmit={handleSubmit(filterPriceRange)}>
                  <div className="grid grid-cols-2 gap-5">
                  <div>
                  <input type="text" id="minPrice" className='mt-1 p-2 w-full border rounded-md' placeholder="Min price"
                  {...register('minPrice', {required: true, onChange: (e) => handleInputChange(e) })}/>
                  {errors.minPrice && <p>Minimum price is required.</p>} 
                  </div>
                  <div>
                  <input type="text" id="maxPrice" className='mt-1 p-2 w-full border rounded-md' placeholder="Max price" 
                  {...register('maxPrice', { required: true, onChange: (e) => handleInputChange(e) })} />
                  {errors.maxPrice && <p>Maximum price is required.</p>} 
                  </div>
                  </div>
                    <div className="pt-4">
                      <button type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                      >Filter</button>          
                    </div>
                  </form>
                </div>
                
            </div>

            <div className="col-span-2 bg-white p-4">
            {productList.length !== 0 && (<span className='text-right'>Showing {productList.length} records</span>)}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                {productList.length !== 0 && productList.map((item,index) => (
                
                <div className="flex flex-col items-center" key={`${item.id}_${index}_product`}>
                  <div className="p-2"><img src={item.image} alt={`Product ${index}`} className="w-full h-48 object-cover"
                    onClick={()=>goToProductDetail(item.id)}/></div>
                  <div className="p-2">{item.title}</div>
                  <div className="p-2">₹{item.price}.00</div>
                  <div className="p-2"><AddToCart productData={item}/></div>
                </div>
                ))}
            </div>
            {productList.length !== 0 && totalCount !== productList.length && (
        <button
          className="mt-6 bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          onClick={()=>loadMoreItems(perPage)}
        >Load More</button>
      )}
      {productList.length === 0 && (
        <span>No data found</span>
      )}    
            </div>
        </div>
    </div>
  );
}

export default Home