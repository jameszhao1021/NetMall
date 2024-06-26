import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { Link } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap';
import '../styles/NavBar.css';


function NavBar({ isAuthenticated, logout, userName }) {

   function guestLinks() {
      return (
         <Fragment>
            <li className="nav-item">
               <Link to='/login' className="nav-link" >Login</Link>
            </li>
            <li className="nav-item">
               <Link to='/signup' className="nav-link" >Sign Up</Link>
            </li>
         </Fragment>
      )
   }
   function authLinks() {
      return (
         <div className="d-flex align-items-center">
            <li className="nav-item dropdown">
               <Dropdown>
                  <Dropdown.Toggle className="nav-link dropdown-toggle-no-caret text-dark" id="dropdown-basic" >
                     My NetMall
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                     <Dropdown.Item href='/mynetmall/purchase-history'>Purchase History</Dropdown.Item>
                     <Dropdown.Item href='/mynetmall/my-store'>My Store</Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
            </li>
            <li className="nav-item">
               <Link to={'/mynetmall/my-cart'} className="nav-link">Cart</Link>
            </li>
            <li className="nav-item">
               <Link to='/' className="nav-link" onClick={logout}>Log Out</Link>
            </li>
            
         </div>
      )
   }

   return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <div className="container">
            <div className="d-flex align-items-center">
            <a className="navbar-brand" href="/">NetMall</a>
            {userName && <li className="nav-item" style={{listStyle:'none'}}>
               <p className="m-0">G'day, {userName}</p>
            </li>}
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
               aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
               <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
               <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                     <Link to='/' className="nav-link" >Home</Link>
                  </li>
                 
                  {isAuthenticated ? authLinks() : guestLinks()}

               </ul>
            </div>
         </div>
      </nav>
   )
}
const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated,
   userId: state.auth.user ? state.auth.user.id : null,
   userName: state.auth.user ? state.auth.user.name : null

})
export default connect(mapStateToProps, { logout })(NavBar)