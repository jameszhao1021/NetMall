import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductDeleteModal from '../components/ProductDeleteModal';


function MyStore({ products, setProducts, fetchProducts, userId, userName }) {
  const [loading, setLoading] = useState(true);

  const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const token = localStorage.getItem('access');
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState(null)

  function toggleDeleteModal(productId) {
    console.log('Deleting product with ID:', productId);
    setDeleteProductId(productId);
    setShowDeleteModal(prev => !prev);
  }



  const fetchMyProducts = () => {
    axios.get(`/mynetmall/my-store/${userId}`, { headers, withCredential: true })
      .then(res => {
        setProducts(res.data);

      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  };


  useEffect(() => {
    if (userId) { // Fetch data only if userId is available
      try {
        fetchMyProducts();
        setLoading(false);
        products.map(p => (console.log(p.image_urls)))
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  }, [userId]); //


  const handleDelete = (id) => {
    console.log('Deleting product with ID:', id);
    axios.delete(`/mynetmall/my-store/${id}/`, { headers, withCredential: true })
      .then(res => {
        fetchMyProducts();
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
      <h1>My Store</h1>

      <Link to={`/mynetmall/my-store/add-product`}>
        <div className='btn btn-info mt-4'>
          Add Product
        </div>
      </Link>

      <div className='d-flex row mt-2'>
        {
          products
            .map(product => (

              <div key={product.id} className='card col-lg-3 col-md-4 col-sm-6'>
                <div className='card-body'>
                <div className='col-12 square-container'>
                {product.image_urls[0] &&
                  <img className='square-image' src={product.image_urls[0]} alt={product.title} style={{ width: '100%'}}  />
                }
                </div>
                <p>{product.title}</p>
                <p>Stock: {`${product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock}`} `}</p>
                <p>Price: ${product.price}</p>
                <div className='row d-flex justify-content-evenly mb-2'>
                  <div className="col-4">
                    <a className='w-100' href={`/mynetmall/my-store/edit-product/${product.id}`}>
                      <button className='btn btn-primary' style={{width:'80px'}}>Edit</button>
                    </a>
                  </div>
                  <div className="col-4">
                    <button className='btn btn-danger' style={{width:'80px'}} onClick={() => toggleDeleteModal(product.id)}>Delete</button>
                  </div>
                  <ProductDeleteModal showDeleteModal={showDeleteModal} toggleDeleteModal={toggleDeleteModal} handleDelete={handleDelete} deleteProductId={deleteProductId} />
                </div>
              </div>
             </div>
            ))
        }

      </div>
    </div>
  )

}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user ? state.auth.user.id : null,
  userName: state.auth.user ? state.auth.user.name : null
})


export default connect(mapStateToProps, {})(MyStore)