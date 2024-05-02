import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CountrySelectForm from '../components/CountrySelectForm';

function AllCheckout({ userId, cartItems, setCartItems, delivery, setDelivery }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const token = localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const [totalQuantity, setTotalQuantity] = useState(null)
  const [totalPrice, setTotalPrice] = useState(null)
  const [editedQuantity, setEditedQuantity] = useState({});
  const [isButtonInvalid, setIsButtonInvalid] = useState(true)

  useEffect(() => {
    setTotalQuantity(cartItems.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [cartItems]);


  const fetchCartItems = () => {

    axios.get(`/mynetmall/my-cart/${userId}`, { headers, withCredential: true })
      .then(res => {
        setCartItems(res.data);
        console.log(res.data)
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  };

  useEffect(() => {
    if (userId) { // Fetch data only if userId is available
      try {
        fetchCartItems();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  }, [userId]); //


  function handleSubmit(e){
    e.preventDefault();
    setIsButtonInvalid(false)
  }
  function onSubmit(e){
    e.preventDefault();

    const orders = cartItems.map(cartItem => ({
      user: userId,
      cart_item: cartItem.id, // Assuming the server expects cart item ID
      quantity: cartItem.quantity,
      price: cartItem.price
      
    }));

    const cartItemIds = cartItems.map(cartItem => cartItem.id);

    const postData = {
      user_id: userId,
      cart_item_ids: cartItemIds,
      first_name: delivery.first_name,
      last_name: delivery.last_name,
      country: delivery.country,
      street_address: delivery.street_address,
      street_address_2: delivery.street_address_2,
      phone: delivery.phone
      
    };
    const requestData = {
      ...postData,
      user_id: userId,
      cart_item_ids: cartItemIds
  };
    axios.post('/mynetmall/pay', requestData, { headers, withCredential: true })
      .then(res => {
        navigate('/');
        setIsButtonInvalid(false)
      })
      .catch(err => {
        console.error('Error creating order:', err);
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching products
  }
  function onChange(e) {
    setDelivery({ ...delivery, [e.target.name]: e.target.value })
  }

  return (
    <div className='container'>
      <h1>Checkout</h1>
      <div className='d-flex'>
        <div className='col-md-8'>
          {
            cartItems
              .map(cartItem => (
                <div key={cartItem.id} className='card '>
                <div className='card-body'>
                <p>Seller: {cartItem.seller}</p>
                <div className='d-flex gap-3 align-items-center'>
                  <div className='col-2 square-container'>
                    {cartItem.image_urls[0] &&
                      <img className='square-image-order' src={cartItem.image_urls[0]} alt={cartItem.title} style={{ width: '100%' }} />
                    }
                  </div>
                  <p className='col-4'>{cartItem.title}</p>
                  <p>Quantity: {cartItem.quantity}</p>
                  <p>Price: {cartItem.price * cartItem.quantity}</p>
                </div>
              </div>
                </div>
              ))
          }

        </div>
        <div className='col-md-4'>
          <div className='card sticky-top'>
            <div className='card-body'>
            <p>Quantity: {totalQuantity}</p>
            <p><strong>Order total: ${totalPrice}</strong></p>
          <button type='submit'className='btn btn-info col-12' onClick={onSubmit} disabled={isButtonInvalid}>Comfirm Payment</button> 
          </div>
          </div>
        </div>
      </div>

      <h3 className='mt-3'>Send to</h3>
      <form className='col-md-8' onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label htmlFor='id_first_name'>First Name: </label>
          <input type='text' className='form-control' id='id_first_name' name='first_name' onChange={onChange} required/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor='id_last_name'>Last Name: </label>
          <input type='text' className='form-control' id='id_last_name' name='last_name' onChange={onChange} required/>
        </div>
        <div className="form-group">
          <label>Country: </label>
         <CountrySelectForm onChange={onChange} required/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor='id_street_address'>Street Address: </label>
          <input type='text' className='form-control' id='id_street_address' name='street_address' onChange={onChange} required/>
        </div>
        <div className="form-group mb-2">
        <label htmlFor='id_street_address_2'>Street Address 2: </label>
          <input type='text' className='form-control' id='id_street_address_2' name='street_address_2' onChange={onChange} placeholder='optional' />
        </div>
        <div className="form-group mb-2">
        <label htmlFor='id_phone'>Phone: </label>
          <input type='text' className='form-control' id='id_phone' name='phone' onChange={onChange}required />
        </div>
        <button type="submit" className='btn btn-secondary' >Confirm information</button>
      </form>

    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user ? state.auth.user.id : null,
  userName: state.auth.user ? state.auth.user.name : null
})


export default connect(mapStateToProps, {})(AllCheckout)