import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import MyStore from './containers/MyStore';
import AddProduct from './containers/AddProduct';
import EditProduct from './containers/EditProduct';
import ProductDetail from './containers/ProductDetail';
import SellerStore from './containers/SellerStore';
import Cart from './containers/Cart';
import { Provider } from 'react-redux';
import store from './store';
import AllCheckout from './containers/AllCheckout';
import SingleCheckout from './containers/SingleCheckout';
import PurchaseHistory from './containers/PurchaseHistory';
import Category from './containers/Category';
import Layout from './hocs/Layout'

function App() {
  const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const token = localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`
  };


  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    stock: '',
    category: '',
    condition: '',
    description: '',
  });

  const [delivery, setDelivery] = useState({
    first_name:'',
    last_name:'',
    country:'',
    street_address:'',
    street_address_2:'',
    phone:'',
  })

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const fetchProducts = () => {
    axios.get('/mynetmall/my-store', { headers, withCredential: true })
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  };

  const fetchProductsByCategory = (productCategory) => {
    axios.get(`/mynetmall/${productCategory['selectedCategory']}`, { headers, withCredential: true })
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  };
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Home fetchProducts={fetchProducts} products={products} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} setSearchResults={setSearchResults} handleSearchQueryChange={handleSearchQueryChange}/>} />
            <Route path='/:selectedCategory' element={<Category fetchProductsByCategory={fetchProductsByCategory} products={products} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} setSearchResults={setSearchResults} handleSearchQueryChange={handleSearchQueryChange}/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
            <Route path='/activate/:uid/:token' element={<Activate />} />
            <Route path='/mynetmall/my-store' element={<MyStore products={products} setProducts={setProducts} fetchProducts={fetchProducts} />} />
            <Route path='/mynetmall/store/:sellerId' element={<SellerStore products={products} setProducts={setProducts} />} />
            <Route path='/mynetmall/my-store/add-product' element={<AddProduct newProduct={newProduct} setNewProduct={setNewProduct} products={products} setProducts={setProducts} fetchProducts={fetchProducts} />} />
            <Route path='/mynetmall/my-store/edit-product/:productId' element={<EditProduct newProduct={newProduct} setNewProduct={setNewProduct} products={products} editProduct={editProduct} setEditProduct={setEditProduct} fetchProducts={fetchProducts}  />} />
            <Route path='/products/:productId' element={<ProductDetail fetchProducts={fetchProducts} products={products} setProducts={setProducts} cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path='/mynetmall/my-cart' element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path='/mynetmall/pay' element={<AllCheckout cartItems={cartItems} setCartItems={setCartItems} delivery={delivery} setDelivery={setDelivery} />} />
            <Route path='/mynetmall/pay/:itemId' element={<SingleCheckout cartItems={cartItems} setCartItems={setCartItems} delivery={delivery} setDelivery={setDelivery} />} />
            <Route path='/mynetmall/purchase-history' element={<PurchaseHistory />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App;
