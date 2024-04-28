import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux'
import '../index.css'

function PurchaseHistory({ userId }) {
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    const token = localStorage.getItem('access');
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const [orders, setOrders] = useState(null)
    const [orderItems, setOrderItems] = useState(null)

    useEffect(() => {
        if (!userId) {
            // If userId is null, return early
            return;
        }

        fetchOrders();
        fetchOrderItems();
    }, [userId]);

    function fetchOrders() {
        axios.get(`/mynetmall/purchasehistory/${userId}`, { headers, withCredentials: true })
            .then(res => {
                setOrders(res.data)
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            })
    }

    function fetchOrderItems() {
        axios.get(`/mynetmall/orderitems/${userId}`, { headers, withCredentials: true })
            .then(res => {
                setOrderItems(res.data)

            })
            .catch(err => {
                console.error('Error fetching data:', err);
            })
    }


    return (
        <div className='container'>

            <div>
                <h1> Purchase History</h1>
            </div>

            <div className='d-flex flex-wrap'>

            </div>

            {orders && orders.map(order => (
                <div key={order.id} className='card  col-12 shadow-sm mb-3'>
                    <div className='card-body'>
                        <h5 className='card-title'>Order ID: {order.order_number}</h5>
                        <p className='card-text'>Seller: {order.seller}</p>
                        {/* <p className='card-text'>Total Price: ${order.total_price}</p> */}

                        {
                            orderItems && orderItems.filter(orderItem => (
                                orderItem.order === order.id
                            )).map(item => (

                                <div key={item.id}>
                                    <hr></hr>
                                    <div className='d-flex align-items-center gap-3'>
                                    <div className='col-2 square-container'>
                                        {item.image_urls[0] &&
                                            <img className='square-image-order' src={item.image_urls[0]} alt={item.title}  style={{width:'100%'}}/>
                                        }
                                    </div>
                                    <div className='col-10'>
                                        <p>{item.title}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}


        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.user ? state.auth.user.id : null,
    userName: state.auth.user ? state.auth.user.name : null
})


export default connect(mapStateToProps, {})(PurchaseHistory)


