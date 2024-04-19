import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';

function ProductDetail({ userId, fetchProducts, products, setProducts, cartItems, editCartItems}) {
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken=')).split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    let { productId } = useParams();
    const [product, setProduct] = useState(null);

    const [newCartItem, setNewCartItem] = useState({
        productId: productId,
        quantity: 1
    })    

    useEffect(() => {
        fetchProduct();
    }, [productId]);
   
    const fetchProduct = () => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        const token = localStorage.getItem('access');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        axios.get(`/products/${productId}/`, { headers, withCredential: true })
            .then(res => {
                console.log("Received product data:", res.data);
                setProduct(res.data);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    };

    function onChange(e){
        setNewCartItem({...newCartItem, [e.target.name]: e.target.value})
    }
    
    function AddToCart() {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        const token = localStorage.getItem('access');
        const headers = {
            'Authorization': `Bearer ${token}`
        };


        axios.post(`/mynetmall/my-cart/${userId}`, newCartItem, { headers, withCredential: true })
            .then(res => {
                fetchProduct(); // Fetch details again to update the list with the new object
               console.log('succesfully added to cart')
            })
            .catch(err => {
                console.error('Error adding new product:', err);
            });
    }


    return (
        <div className='container'>
            
            <div>Product Detail</div>
            <div className='d-flex row'>
                {product && ( // Check if product is not empty
                    <>
                    
                        <p>Title: {product.title}</p>
                        <p>Category: {product.category}</p>
                        <p>Stock: {product.stock}</p>
                        <p>Price: ${product.price}</p>
                        <p>Condition: {product.condition}</p>
                        <p>Description: {product.description}</p>
                        <p>Seller Id: {product.seller}</p>
                        <p>Seller Name: {product.seller_name}</p>
                        <input className='col-2' onChange={onChange} type='number'name='quantity' min={1} max={100} defaultValue={1}/>
                        <button className='btn btn-primary col-2 mb-2' onClick={AddToCart}>Add to cart</button>
                        
                        <Link to={`/mynetmall/store/${product.seller}`}>
                            <button className='btn btn-info'>Visit the seller's store</button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}




const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.user ? state.auth.user.id : null,
    userName: state.auth.user ? state.auth.user.name : null
  })
  

  
  
  export default connect(mapStateToProps, {})(ProductDetail)