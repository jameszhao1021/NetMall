import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import {Link} from 'react-router-dom';

function Home({fetchProducts, products}){
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

    useEffect(() => {
        fetchProducts();
        console.log(products)
      }, []);
    
    

   

    return(
   <div className='container'>
   
   <div>
    Home
   </div>
    
   <div className='d-flex flex-wrap'>
  {products.map(product => (
    <div key={product.id} className='card col-lg-3 col-md-4 col-12 shadow-sm'>
      <Link to={`/products/${product.id}`} className='text-decoration-none text-dark'>
        <div className='card-body'>
          <h5 className='card-title'>{product.title}</h5>
          <p className='card-text'>ID: {product.id}</p>
          <p className='card-text'>Stock: {`${product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock}`}`}</p>
          <p className='card-text'>Price: ${product.price}</p>
        </div>
      </Link>
    </div>
  ))}
</div>


  </div>
)
}

export default Home