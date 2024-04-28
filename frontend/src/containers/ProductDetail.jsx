import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AddToCartModal from '../components/AddToCartModal';
import LoginAlarmModal from '../components/LoginAlarmModal';
import SelfbuyingAlarmModal from '../components/SelfbuyingAlarmModal';

function ProductDetail({ userId }) {
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    let { productId } = useParams();
    const [product, setProduct] = useState(null);

    const [newCartItem, setNewCartItem] = useState({
        productId: productId,
        quantity: 1
    });

    const [addToCartProductId, setAddToCartProductId] = useState(null);

    const [showAddToCartModal, setShowAddToCartModal] = useState(false);

    function toggleAddToCartModal(productId) {
        setShowAddToCartModal(prev => !prev);
    }

    const [showLoginAlarmModal, setshowLoginAlarmModal] = useState(false);

    function toggleLoginAlarmModal() {
        setshowLoginAlarmModal(prev => !prev);
    }

    const [showSelfbuyingAlarmModal, setshowSelfbuyingAlarmModal] = useState(false);

    function toggleSelfbuyingAlarmModal() {
        setshowSelfbuyingAlarmModal(prev => !prev);
    }

    useEffect(() => {
        fetchProduct();
        setAddToCartProductId(productId)
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
                setProduct(res.data);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    };

    function onChange(e) {
        setNewCartItem({ ...newCartItem, [e.target.name]: e.target.value })
    }

    function AddToCart() {
        if (!userId) {
            toggleLoginAlarmModal()
        } else if (product.seller_id === String(userId)) {
            toggleSelfbuyingAlarmModal()
        }

        else if (newCartItem.quantity > product.stock) {
            return
        }

        else {

            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
            axios.defaults.xsrfCookieName = "csrftoken";
            const token = localStorage.getItem('access');
            const headers = {
                'Authorization': `Bearer ${token}`
            };


            axios.post(`/mynetmall/my-cart/${userId}`, newCartItem, { headers, withCredential: true })
                .then(res => {
                    fetchProduct(); // Fetch details again to update the list with the new object
                    toggleAddToCartModal(addToCartProductId)
                })
                .catch(err => {
                    console.error('Error adding new product:', err);
                });
        }
    }


    return (
        <div className='container'>

            <div className='d-flex row'>
                {product && ( // Check if product is not empty
                    <>
                        <div className='d-flex align-items-center gap-3'>
                            <div className='col-5'>
                        {product.image_urls[0] &&
                            <img src={product.image_urls[0]} alt={product.title} style={{ width:'100%', maxHeight: '500px', margin: '5px' }} />
                        }
                        </div>
                        <div className='col-7'>
                        <h3>{product.title}</h3>
                        <p>Category: {product.category}</p>
                        <p>Stock: {product.stock}</p>
                        <p>Price: ${product.price}</p>
                        <p>Condition: {product.condition}</p>
                        <label className='me-2' htmlFor='id_quantity'>Quantity:</label>
                        <input className='me-3 mb-2' onChange={onChange} type='number' name='quantity' id='id_quantity' min={1} max={100} defaultValue={1} style={{width:'50px'}}/>
                        <button className='btn btn-primary' onClick={AddToCart}>Add to cart</button>
                        <LoginAlarmModal showLoginAlarmModal={showLoginAlarmModal} toggleLoginAlarmModal={toggleLoginAlarmModal} />
                        <SelfbuyingAlarmModal showSelfbuyingAlarmModal={showSelfbuyingAlarmModal} toggleSelfbuyingAlarmModal={toggleSelfbuyingAlarmModal} />
                        <AddToCartModal showAddToCartModal={showAddToCartModal} toggleAddToCartModal={toggleAddToCartModal} addToCartProductId={addToCartProductId} product={product} newCartItem={newCartItem} fetchProduct={fetchProduct} />
                        {newCartItem.quantity > product.stock && <p style={{ color: 'red' }}>Please enter a lower number</p>}
                        </div>
                        </div>
                        <p>Description: <br></br>{product.description && product.description.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)}</p>
                     
                        <p className='mt-4'><strong>Seller: {product.seller_name}</strong></p>

                        <Link to={`/mynetmall/store/${product.seller}`}>
                            <button className='btn btn-info mt-3'>Visit the seller's store</button>
                        </Link>
                        <Link to={'/'}>
                            <button className='btn btn-secondary mt-3'>Return</button>
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