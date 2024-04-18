import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail({ fetchProducts, products, setProducts }) {
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken=')).split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    let { productId } = useParams();
    const [product, setProduct] = useState(null);


    useEffect(() => {
        fetchProduct();
    }, [productId]);
    useEffect(() => {
        fetchProduct();
        console.log(products)
    }, [products.length]);

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
                        <button className='btn btn-primary col-2 mb-2'>Add to cart</button>
                        <Link to={`/mynetmall/store/${product.seller}`}>

                            <button className='btn btn-info'>Visit the seller's store</button>
                        </Link>
                    </>
                )}
            </div>



        </div>
    );
}

export default ProductDetail;


