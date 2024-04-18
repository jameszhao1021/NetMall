import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductDeleteModal from '../components/ProductDeleteModal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Cart({ products, setProducts, fetchProducts, userId, userName }) {
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
 const [deleteProductId, setDeleteProductId] = useState(null)

  function toggleDeleteModal(productId) {
    console.log('Deleting product with ID:', productId);
    setDeleteProductId(productId);
    setShowDeleteModal(prev => !prev);
  }


  
  const fetchCartItems = () => {

    axios.get(`/mynetmall/my-cart/${userId}`, { headers, withCredential: true })
      .then(res => {
        // setProducts(res.data);
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
    axios.delete(`/mynetmall/my-store/${id}/`, { headers, withCredential: true })
      .then(res => {
        fetchCartItems();
        toggleDeleteModal(); // Close the modal after deleting the product
      })
      .catch(err => {
        console.error('Error deleting detail:', err);
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching products
  }

  return (
    <div className='container'>
      <h1>Cart</h1>


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