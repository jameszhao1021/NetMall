import React, { useState } from "react";
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { reset_password } from '../actions/auth'

function ResetPassword({ reset_password }) {
    const [requestSent, setRequestSent] = useState(false)
    const [formData, setFormData] = useState({
        email: ''

    })
    const { email } = formData;

    function onChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }

    function onSubmit(e) {
        e.preventDefault();
        reset_password(email);
        setRequestSent(true);
    }

    if (requestSent) {
        return <Navigate to='/' />
    }

    return (
        <div className="container mt-5">
            <h1>Request Password Rest</h1>
            <form onSubmit={onSubmit} >
                <div className="form-group">
                    <input className="form-control"
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={onChange}
                        required>
                    </input>
                </div>

                    <button className="btn btn-primary mt-3" type='submit'>Reset Password</button>
                
            </form>
        </div>
    )
};


export default connect(null, {reset_password})(ResetPassword);