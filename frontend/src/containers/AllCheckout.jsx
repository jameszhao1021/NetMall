import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ItemDeleteModal from '../components/ItemDeleteModal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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


  const onSubmit = () => {
    // Iterate through cart items and create order objects
    const orders = cartItems.map(cartItem => ({
      user: userId,
      cart_item: cartItem,
      quantity: cartItem.quantity,
      price: cartItem.price,
      deliveryDetails: delivery // Assuming delivery contains required details
    }));

    const deliveryDetails = {
      first_name: delivery.get('first_name'),
      last_name: delivery.get('last_name'),
      country: delivery.get('country'),
      street_address: delivery.get('street_address'),
      street_address_2: delivery.get('street_address_2'),
      phone: delivery.get('phone'),
    };

    axios.post('/mynetmall/pay', {orders, deliveryDetails}, { headers, withCredential: true })
    .then(res => {
        
       console.log('created order')
       console.log(res.data)
        navigate('/');
    })
    .catch(err => {
        console.error('Error adding new product:', err);
    });

  }


  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching products
  }
  function onChange(e) {
    setDelivery({ ...delivery, [e.target.name]: e.target.value })
  }

  return (
    <div className='container'>
      <h1>Checkout All</h1>
      <div className='d-flex'>
        <div className='col-md-8'>
          {
            cartItems
              // .filter(product => product.seller === userId) // Filter products by seller equal to userId
              .map(cartItem => (

                <div key={cartItem.id} className='card '>
                  <p>Seller: {cartItem.seller}</p>
                  <p>Title: {cartItem.title}</p>
                  <p>Quantity: {cartItem.quantity}</p>

                  {editedQuantity[cartItem.id] && editedQuantity[cartItem.id] > cartItem.stock && <span style={{ color: 'red' }}>Only {cartItem.stock} left</span>}
                  {(editedQuantity[cartItem.id] === 0) && <span style={{ color: 'red' }}>Invalid quantity</span>}
                  <p>Price: ${cartItem.price * cartItem.quantity}</p>

                </div>

              ))
          }

        </div>
        <div className='col-md-4'>
          <div className='card'>
            <p>Quantity: {totalQuantity}</p>
            <p>Total: ${totalPrice}</p>
            <button className='btn btn-info'>Comfirm Payment</button>
          </div>
        </div>
      </div>

 <hr></hr>
      <h3>Send to</h3>
      <form className='col-md-8'>
        <div className="form-group mb-2">
          <label htmlFor='id_first_name'>First Name: </label>
          <input type='text' className='form-control' id='id_first_name' name='first_name' onChange={onChange} />
        </div>
        <div className="form-group mb-2">
          <label htmlFor='id_last_name'>Last Name: </label>
          <input type='text' className='form-control' id='id_last_name' name='last_name' onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Country: </label>
         <CountrySelectForm onChange={onChange}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor='id_street_address'>Street Address: </label>
          <input type='text' className='form-control' id='id_street_address' name='street_address' onChange={onChange} />
        </div>
        <div className="form-group mb-2">
        <label htmlFor='id_street_address_2'>Street Address 2: </label>
          <input type='text' className='form-control' id='id_street_address_2' name='street_address_2' onChange={onChange} placeholder='optional' />
        </div>
        <div className="form-group mb-2">
        <label htmlFor='id_phone'>Phone: </label>
          <input type='text' className='form-control' id='id_phone' name='phone' onChange={onChange} />
        </div>

       
      </form>


    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user ? state.auth.user.id : null,
  userName: state.auth.user ? state.auth.user.name : null
})


// export default MyStore;


export default connect(mapStateToProps, {})(AllCheckout)