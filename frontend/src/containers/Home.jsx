import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'

function Home({ fetchProducts, products }) {
  const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

  useEffect(() => {
    fetchProducts();
    console.log(products)
  }, []);





  return (
    <div className='container'>

      <div className='d-flex flex-wrap mt-4'>
        {products.map(product => (
          <div key={product.id} className='card col-lg-3 col-md-4 col-sm-6 shadow-sm'>
            <Link to={`/products/${product.id}`} className='text-decoration-none text-dark'>
              <div className='card-body'>
                <div className='col-12 square-container'>
                  {product.image_urls[0] &&
                    <img className='square-image' src={product.image_urls[0]} alt={product.title} style={{ width: '100%'}} />
                  }
                </div>
                <h5 className='card-title'>{product.title}</h5>
                <p className='card-text mt-4'>Stock: {`${product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock}`}`}</p>
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