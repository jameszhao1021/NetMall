// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import React from 'react';
// import { connect } from 'react-redux';
// import {useNavigate, useParams } from 'react-router-dom';
// import CountrySelectForm from '../components/CountrySelectForm';

// function SingleCheckout({ userId,  delivery, setDelivery }) {
//   let { itemId } = useParams();
//   const navigate = useNavigate();
//   const [cartItem, setCartItem] = useState(null)
//   const [loading, setLoading] = useState(true);

//   const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
//   axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
//   axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
//   axios.defaults.xsrfCookieName = "csrftoken";
//   const token = localStorage.getItem('access');
//   const headers = {
//     'Authorization': `Bearer ${token}`,
//   };

//   const [totalQuantity, setTotalQuantity] = useState(null)
//   const [totalPrice, setTotalPrice] = useState(null)
//   const [editedQuantity, setEditedQuantity] = useState({});


//   useEffect(() => {
//     setTotalQuantity(cartItem.quantity);
//     setTotalPrice(cartItem.price);
//   }, [cartItem]);


//   const fetchCartItems = () => {
// console.log(itemId)
//     axios.get(`/mynetmall/single-checkout/${userId}?cart_item_id=${itemId}`, { headers, withCredential: true })
//       .then(res => {
//         setCartItem(res.data);
//         console.log(res.data)
//       })
//       .catch(err => {
//         console.error('Error fetching data:', err);
//       });
//   };

//   useEffect(() => {
//     if (userId) { // Fetch data only if userId is available
//       try {
//         fetchCartItems();
//         setLoading(false);
//         console.log(cartItem)
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     }
//   }, [userId]); //


//   function onSubmit(e){
//     e.preventDefault();


//     // const cartItemIds = cartItems.map(cartItem => cartItem.id);

//     const postData = {
//       user_id: userId,

//       first_name: delivery.first_name,
//       last_name: delivery.last_name,
//       country: delivery.country,
//       street_address: delivery.street_address,
//       street_address_2: delivery.street_address_2,
//       phone: delivery.phone

//     };
//     const requestData = {
//       ...postData,
//       user_id: userId,
//   };
//     axios.post('/mynetmall/pay', requestData, { headers, withCredential: true })
//       .then(res => {
//         console.log('Order created:', res.data);
//         navigate('/');
//       })
//       .catch(err => {
//         console.error('Error creating order:', err);
//       });
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Render loading indicator while fetching products
//   }
//   function onChange(e) {
//     setDelivery({ ...delivery, [e.target.name]: e.target.value })
//   }

//   return (
//     <div className='container'>
//       <h1>Checkout All</h1>
//       <div className='d-flex'>
//         <div className='col-md-8'>


//                 <div key={cartItem.id} className='card '>
//                   <p>Seller: {cartItem.seller}</p>
//                   <p>Title: {cartItem.title}</p>
//                   <p>Quantity: {cartItem.quantity}</p>

//                   {editedQuantity[cartItem.id] && editedQuantity[cartItem.id] > cartItem.stock && <span style={{ color: 'red' }}>Only {cartItem.stock} left</span>}
//                   {(editedQuantity[cartItem.id] === 0) && <span style={{ color: 'red' }}>Invalid quantity</span>}
//                   <p>Price: ${cartItem.price * cartItem.quantity}</p>

//                 </div>


//         </div>
//         <div className='col-md-4'>
//           <div className='card'>
//             <p>Quantity: {totalQuantity}</p>
//             <p>Total: ${totalPrice}</p>
//             <button className='btn btn-info' onClick={onSubmit}>Comfirm Payment</button>
//           </div>
//         </div>
//       </div>

//  <hr></hr>
//       <h3>Send to</h3>
//       <form className='col-md-8' onSubmit={onSubmit}>
//         <div className="form-group mb-2">
//           <label htmlFor='id_first_name'>First Name: </label>
//           <input type='text' className='form-control' id='id_first_name' name='first_name' onChange={onChange} required/>
//         </div>
//         <div className="form-group mb-2">
//           <label htmlFor='id_last_name'>Last Name: </label>
//           <input type='text' className='form-control' id='id_last_name' name='last_name' onChange={onChange} required/>
//         </div>
//         <div className="form-group">
//           <label>Country: </label>
//          <CountrySelectForm onChange={onChange} required/>
//         </div>
//         <div className="form-group mb-2">
//           <label htmlFor='id_street_address'>Street Address: </label>
//           <input type='text' className='form-control' id='id_street_address' name='street_address' onChange={onChange} required/>
//         </div>
//         <div className="form-group mb-2">
//         <label htmlFor='id_street_address_2'>Street Address 2: </label>
//           <input type='text' className='form-control' id='id_street_address_2' name='street_address_2' onChange={onChange} placeholder='optional' />
//         </div>
//         <div className="form-group mb-2">
//         <label htmlFor='id_phone'>Phone: </label>
//           <input type='text' className='form-control' id='id_phone' name='phone' onChange={onChange}required />
//         </div>
//         <button type="submit" className='btn btn-info' >Comfirm Payment</button>

//       </form>


//     </div>
//   )
// }

// const mapStateToProps = state => ({
//   isAuthenticated: state.auth.isAuthenticated,
//   userId: state.auth.user ? state.auth.user.id : null,
//   userName: state.auth.user ? state.auth.user.name : null
// })


// // export default MyStore;


// export default connect(mapStateToProps, {})(SingleCheckout)

import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CountrySelectForm from '../components/CountrySelectForm';

function SingleCheckout({ userId, delivery, setDelivery }) {
  let { itemId } = useParams();
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set CSRF token for Axios requests
  const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const token = localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  // Fetch cart item details
  const fetchCartItems = () => {
    axios.get(`/mynetmall/single-checkout/${userId}?cart_item_id=${itemId}`, { headers, withCredential: true })
      .then(res => {
        setCartItem(res.data);
        setLoading(false);
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

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const postData = {
      user_id: userId,
      cart_item_id: itemId,
      first_name: delivery.first_name,
      last_name: delivery.last_name,
      country: delivery.country,
      street_address: delivery.street_address,
      street_address_2: delivery.street_address_2,
      phone: delivery.phone
    };
    axios.post('/mynetmall/single-pay', postData, { headers, withCredential: true })
      .then(res => {
        console.log('Order created:', res.data);
        navigate('/');
      })
      .catch(err => {
        console.error('Error creating order:', err);
      });
  };

  // Render loading indicator while fetching cart item
  if (loading) {
    return <div>Loading...</div>;
  }
  function onChange(e) {
    setDelivery({ ...delivery, [e.target.name]: e.target.value })
  }

  return (
    <div className='container'>
      <h1>Checkout All</h1>
      {/* Render cart item details */}
      {cartItem && (
        <div className='d-flex'>
          <div className='col-md-8'>
            <div key={cartItem.id} className='card '>
              <p>Seller: {cartItem.seller}</p>
              <p>Title: {cartItem.title}</p>
              <p>Quantity: {cartItem.quantity}</p>
              <p>Price: {cartItem.price * cartItem.quantity}</p>
              {/* Render other cart item details */}
            </div>
          </div>
          {/* Render other elements */}

          <div className='col-md-4'>
            <div className='card'>
              <p>Quantity: {cartItem.quantity}</p>
              <p>Total: ${cartItem.price * cartItem.quantity}</p>
              <button className='btn btn-info' onClick={onSubmit}>Comfirm Payment</button>
            </div>
          </div>

        </div>
      )}

      {/* Render form */}
      {cartItem && (
        <div>
          <hr></hr>
          <h3>Send to</h3>
          <form className='col-md-8' onSubmit={onSubmit}>
            <div className="form-group mb-2">
              <label htmlFor='id_first_name'>First Name: </label>
              <input type='text' className='form-control' id='id_first_name' name='first_name' onChange={onChange} required />
            </div>
            <div className="form-group mb-2">
              <label htmlFor='id_last_name'>Last Name: </label>
              <input type='text' className='form-control' id='id_last_name' name='last_name' onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Country: </label>
              <CountrySelectForm onChange={onChange} required />
            </div>
            <div className="form-group mb-2">
              <label htmlFor='id_street_address'>Street Address: </label>
              <input type='text' className='form-control' id='id_street_address' name='street_address' onChange={onChange} required />
            </div>
            <div className="form-group mb-2">
              <label htmlFor='id_street_address_2'>Street Address 2: </label>
              <input type='text' className='form-control' id='id_street_address_2' name='street_address_2' onChange={onChange} placeholder='optional' />
            </div>
            <div className="form-group mb-2">
              <label htmlFor='id_phone'>Phone: </label>
              <input type='text' className='form-control' id='id_phone' name='phone' onChange={onChange} required />
            </div>
            <button type="submit" className='btn btn-info' >Comfirm Payment</button>
          </form>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user ? state.auth.user.id : null,
  userName: state.auth.user ? state.auth.user.name : null
})

export default connect(mapStateToProps, {})(SingleCheckout);
