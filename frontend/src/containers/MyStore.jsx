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
        console.log(res.data)
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  };



  // useEffect(() => {

  //   try {
  //     fetchMyProducts();
  //     setLoading(false);
  //     console.log(userId)
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // }, []);

  useEffect(() => {
    if (userId) { // Fetch data only if userId is available
      try {
        fetchMyProducts();
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
        <div className='btn btn-info'>
          Add Product
        </div>

      </Link>

      <h1>current user id: {userId}</h1>
      <h1>current user name: {userName}</h1>
      <div className='d-flex row'>
        {
          products
            .map(product => (

              <div key={product.id} className='card col-md-3'>
                <p>ID: {product.id}</p>
                <p>Title: {product.title}</p>
                <p>Stock: {`${product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock}`} `}</p>
                <p>Price: ${product.price}</p>
                <div className='row d-flex justify-content-evenly mb-2'>
                  {/* <button className='btn btn-danger col-4' onClick={() => { handleDelete(product.id) }}>Delete</button> */}
                  <button className='btn btn-danger col-4' onClick={()=>toggleDeleteModal(product.id)}>Delete</button>
                  <a className='col-4' href={`/mynetmall/my-store/edit-product/${product.id}`}>
                    <button className='btn btn-primary'>Edit</button>
                  </a>

                  <ProductDeleteModal showDeleteModal={showDeleteModal} toggleDeleteModal={toggleDeleteModal} handleDelete={handleDelete} deleteProductId={deleteProductId} />
  
                </div>
              </div>

            ))
        }

      </div>
    </div>
  )
  // return (
  //   <div className='container'>
  //     <h1>My Store</h1>
  //     <Link to='/mynetmall/my-store/add-product'>
  //       <div className='btn btn-info'>Add Product</div>
  //     </Link>
  //     <h1>Current User ID: {userId}</h1>
  //     <h1>Current User Name: {userName}</h1>
  //     <div className='d-flex row'>
  //       {Array.isArray(products) &&
  //         products
  //           .filter((product) => product.seller === userId)
  //           .map((product) => (
  //             <div key={product.id} className='card col-md-3'>
  //               <p>ID: {product.id}</p>
  //               <p>Title: {product.title}</p>
  //               <p>Stock: {`${product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock}`} `}</p>
  //               <p>Price: ${product.price}</p>
  //               <div className='row d-flex justify-content-evenly mb-2'>
  //                 <button className='btn btn-danger col-4' onClick={() => handleDelete(product.id)}>Delete</button>
  //                 <a className='col-4' href={`/mynetmall/my-store/edit-product/${product.id}`}>
  //                   <button className='btn btn-primary'>Edit</button>
  //                 </a>
  //               </div>
  //             </div>
  //           ))}
  //     </div>
  //   </div>
  // );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user ? state.auth.user.id : null,
  userName: state.auth.user ? state.auth.user.name : null
})


export default connect(mapStateToProps, {})(MyStore)