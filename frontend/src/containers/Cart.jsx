import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ItemDeleteModal from '../components/ItemDeleteModal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function Cart({ userId, userName, cartItems, setCartItems }) {
  const [loading, setLoading] = useState(true);

  const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const token = localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`,
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [totalQuantity, setTotalQuantity] = useState(null)
  const [totalPrice, setTotalPrice] = useState(null)
  const [editedQuantity, setEditedQuantity] = useState({});

  useEffect(() => {
    setTotalQuantity(cartItems.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [cartItems]);


  function toggleDeleteModal(itemId) {
    console.log('Deleting product with ID:', itemId);
    setDeleteItemId(itemId);
    setShowDeleteModal(prev => !prev);
  }


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

  const handleDelete = (id) => {
    console.log('Deleting product with ID:', id);
    axios.delete(`/mynetmall/my-cart/${id}`, { headers, withCredential: true })
      .then(res => {
        fetchCartItems();
        toggleDeleteModal();
      })
      .catch(err => {
        console.error('Error deleting detail:', err);
      });
  };


  const handleQuantityChange = (itemId, quantity) => {
    setEditedQuantity({ ...editedQuantity, [itemId]: quantity });
  };

  const handleQuantityBlur = (cartItem) => {
    const newQuantity = editedQuantity[cartItem.id];
    if (newQuantity !== undefined) {
      axios.put(`/mynetmall/my-cart/${cartItem.id}`, { 
        cartId: cartItem.cartId, 
        productId: cartItem.productId,
        quantity: newQuantity 
      }, { headers, withCredential: true })
        .then(res => {
          fetchCartItems();
        })
        .catch(err => {
          console.error('Error updating quantity:', err);
        });
    }
  };

  const handleMinus = (cartItem) => {
    const currentQuantity = editedQuantity[cartItem.id] !== undefined ? parseInt(editedQuantity[cartItem.id]) : cartItem.quantity;
    const newQuantity = Math.max(currentQuantity - 1, 1); // Ensure quantity doesn't go below 1
    setEditedQuantity({ ...editedQuantity, [cartItem.id]: newQuantity });
  };
  
  const handlePlus = (cartItem) => {
    const currentQuantity = editedQuantity[cartItem.id] !== undefined ? parseInt(editedQuantity[cartItem.id]) : cartItem.quantity;
    const newQuantity = currentQuantity + 1;
    setEditedQuantity({ ...editedQuantity, [cartItem.id]: newQuantity });
  };
  
  useEffect(() => {
    // Handle quantity blur when editedQuantity changes
    Object.keys(editedQuantity).forEach(itemId => {
      const editedItemId = parseInt(itemId);
      const editedItemQuantity = editedQuantity[editedItemId];
      const cartItem = cartItems.find(item => item.id === editedItemId);
  
      if (cartItem && editedItemQuantity !== undefined && editedItemQuantity !== cartItem.quantity) {
        handleQuantityBlur(cartItem);
      }
    });
  }, [editedQuantity, cartItems, handleQuantityBlur]);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching products
  }



  return (
    <div className='container'>
      <h1>Cart</h1>
      <div className='d-flex'>
        <div className='col-md-8'>
          {
            cartItems
              // .filter(product => product.seller === userId) // Filter products by seller equal to userId
              .map(cartItem => (

                <div key={cartItem.id} className='card '>

                  <p>Title: {cartItem.title}</p>
                  <p>Quantity:
                  <button className="btn btn-secondary" onClick={() => handleMinus(cartItem)}>-</button>
                <input
                  type='text'
                  value={editedQuantity[cartItem.id] !== undefined ? editedQuantity[cartItem.id] : cartItem.quantity}
                  onChange={(e) => handleQuantityChange(cartItem.id, e.target.value)}
                  onBlur={() => handleQuantityBlur(cartItem)}
                />
                <button className="btn btn-secondary" onClick={() => handlePlus(cartItem)}>+</button>
              </p>
                  <p>Price: ${cartItem.price * cartItem.quantity}</p>
                  <div className='row d-flex justify-content-evenly mb-2'>
                    {/* <button className='btn btn-danger col-4' onClick={() => { handleDelete(cartItem.id) }}>Delete</button> */}
                    <button className='btn btn-danger col-4' onClick={() => toggleDeleteModal(cartItem.id)}>Delete</button>


                    <ItemDeleteModal showDeleteModal={showDeleteModal} toggleDeleteModal={toggleDeleteModal} handleDelete={handleDelete} deleteItemId={deleteItemId} />

                  </div>
                </div>

              ))
          }

        </div>
        <div className='col-md-4'>
          <div className='card'>
            <p>Quantity: {totalQuantity}</p>
            <p>Total: ${totalPrice}</p>
            <button className='btn btn-info'>Go to checkout</button>
          </div>
        </div>
      </div>

    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user ? state.auth.user.id : null,
  userName: state.auth.user ? state.auth.user.name : null
})


// export default MyStore;


export default connect(mapStateToProps, {})(Cart)