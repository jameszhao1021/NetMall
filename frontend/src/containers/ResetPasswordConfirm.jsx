import React, { useState } from "react";
import { useParams, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { reset_password_confirm } from '../actions/auth'

function ResetPasswordConfirm({ match, reset_password_confirm }) {
    const [requestSent, setRequestSent] = useState(false)
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    })

    const { uid, token } = useParams()
    const { new_password, re_new_password } = formData;

    function onChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }


    const onSubmit = e => {
        e.preventDefault();

        reset_password_confirm(uid, token, new_password, re_new_password);
        setRequestSent(true);
    };

    if (requestSent) {
        return <Navigate to='/' />
    }

    return (
        <div className="container mt-5">
            <h1>Request Password Rest</h1>
            <form onSubmit={onSubmit} >
                <div className="form-group">
                  <input className="form-control"
                        type='password'
                        placeholder='New Password'
                        name='new_password'
                        value={new_password}
                        onChange={onChange}
                        minLength='6'
                        required>
                    </input>
                </div>
                <div className="form-group">
                  <input className="form-control"
                        type='password'
                        placeholder='Confirm New Password'
                        name='re_new_password'
                        value={re_new_password}
                        onChange={onChange}
                        minLength='6'
                        required>
                    </input>
                </div>
                    <button className="btn btn-primary mt-3" type='submit'>Reset Password</button>
                
            </form>
        </div>
    )
};


export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);