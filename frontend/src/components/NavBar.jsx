import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { Link } from 'react-router-dom'

function NavBar({ isAuthenticated, logout }) {

   function guestLinks() {
      return(
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
      return(
      <li className="nav-item"> {/* Use parentheses for JavaScript expressions */}
         <Link to='#!' className="nav-link" onClick={logout}>Log Out</Link>
      </li>
      )
   }

  
   return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <div className="container">
            <a className="navbar-brand" href="#">NetMall</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
               aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
               <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
               <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                     <Link to='/' className="nav-link" >Home</Link>
                  </li>
                   {isAuthenticated? authLinks():guestLinks()}

               </ul>
            </div>
         </div>
      </nav>
   )
}
const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, { logout })(NavBar)