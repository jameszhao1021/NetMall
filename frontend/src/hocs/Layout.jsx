import React, { useEffect } from "react";
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import {connect} from 'react-redux';
import { checkAuthenticated, load_user} from '../actions/auth'

function Layout(props) {

    useEffect(()=>{
       props.checkAuthenticated();
       props.load_user();
    },[])


    return (
        <div className="layout">
            <NavBar />
            <div className="content">{props.children}</div>
            <Footer />
        </div>
    )
}

export default connect(null, {checkAuthenticated, load_user})(Layout)