import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Header from './components/header'
import Footer from './components/footer'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Header />
        
      <Routes>        
        <Route path="/"  element={<Home/>}/>
        <Route path="/cart"  element={<Cart/>}/>
        <Route path="/orders"  element={<Orders/>}/>
        <Route path="/product-details/:id"  element={<ProductDetail/>}/>
      </Routes>
      
      <Footer />
      </div>
  )
}

export default App
