import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'

function PurchaseHistory({userId}){
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    const token = localStorage.getItem('access');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    const [orders, setOrders] = useState(null)



    useEffect(() => {
        if (!userId) {
            // If userId is null, return early
            return;
        }
        
        fetchOrders();
    }, [userId]);
    
    function fetchOrders(){
        axios.get(`/mynetmall/purchasehistory/${userId}`, { headers, withCredentials: true })
       .then(res=>{
          setOrders(res.data)
       })
       .catch(err=>{
        console.error('Error fetching data:', err);
       })
    }

   

    return(
   <div className='container'>
   
   <div>
   <h1> Purchase History</h1>
   </div>
    
   <div className='d-flex flex-wrap'>

</div>

  {orders && orders.map(order => (
    <div key={order.id} className='card col-lg-3 col-md-4 col-12 shadow-sm'>
      <Link to={`/`} className='text-decoration-none text-dark'>
        <div className='card-body'>
          <h5 className='card-title'>Order Id: {order.order_number}</h5>
        
          <p className='card-text'>Total Price: ${order.total_price}</p>
          {/* <p className='card-text'>Item: {order.oderItem}</p> */}
        </div>
      </Link>
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


