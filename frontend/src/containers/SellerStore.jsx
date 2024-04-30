import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';


function SellerStore({ products, setProducts, userId, userName }) {
    const { sellerId } = useParams();
    let sellerName
    const [loading, setLoading] = useState(true);

    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    const token = localStorage.getItem('access');
    const headers = {
        'Authorization': `Bearer ${token}`
    };


    const fetchProducts = () => {
        axios.get(`/mynetmall/store/${sellerId}`, { headers, withCredential: true })
            .then(res => {
                setProducts(res.data);
                console.log('hi' + res.data)
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    };

    useEffect(() => {
        const fetchProductsAction = async () => {
            try {
                await fetchProducts();
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductsAction();
    }, []);


    if (loading) {
        return <div>Loading...</div>; // Render loading indicator while fetching products
    }

    if (products.length > 0 && products[0].seller_name) {
        sellerName = (products[0].seller_name);
    }

    return (
        <div className='container'>
            <h1>Seller: {sellerName}</h1>
            <div className='d-flex row'>
                {
                    products
                        // Filter products by seller equal to userId
                        .map(product => (
                            <div key={product.id} className='card col-lg-3 col-md-4 col-12 shadow-sm'>
                                <Link to={`/products/${product.id}`} className='text-decoration-none text-dark'>
                                    <div className='card-body'>
                                        <div className='col-12 square-container'>
                                            {product.image_urls[0] &&
                                                <img className='square-image' src={product.image_urls[0]} alt={product.title} style={{ width: '100%' }} />
                                            }
                                        </div>
                                        <h5 className='card-title mt-2'>{product.title}</h5>
                                        <p className='card-text mt-4'>Stock: {`${product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock}`}`}</p>
                                        <p className='card-text'>Price: ${product.price}</p>
                                    </div>
                                </Link>
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


// export default MyStore;


export default connect(mapStateToProps, {})(SellerStore)