import axios from 'axios'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'

function AddProduct({ userId, products, setProducts, fetchProducts, newProduct, setNewProduct }) {
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    function CreateProduct() {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        const token = localStorage.getItem('access');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        // const productData = { ...newProduct, seller: userId };
        const formData = new FormData();
        formData.append('image', imageFile);
        for (const key in newProduct) {
            formData.append(key, newProduct[key]);
        }
        formData.append('seller', userId);

        axios.post('/mynetmall/my-store/add-product', formData, { headers, withCredential: true })
            .then(res => {
                fetchProducts(); // Fetch details again to update the list with the new object
                setProducts([...products, newProduct])
                setNewProduct({
                    title: '',
                    price: '',
                    stock: '',
                    category: '',
                    condition: '',
                    description: '',
                }); // Reset form inputs
                navigate('/mynetmall/my-store');
            })
            .catch(err => {
                console.error('Error adding new product:', err);
            });
    }

    function onChange(e) {
        setNewProduct({
            ...newProduct, [e.target.name]: e.target.value
        });
    }

    function handleImageChange(e) {
        // Set the selected image file
        setImageFile(e.target.files[0]);
    }

    function onSubmit(e) {
        e.preventDefault();
        CreateProduct();
    }


    return (
            <div className='container'>
                <h1>Add Product</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-2">
                        <label htmlFor='id_title'>Title: </label>
                        <input type='text' className='form-control' id='id_title' name='title' onChange={onChange} />
                    </div>
                    <div className="form-group mb-2">
                    <label htmlFor='id_image'>Product Image: </label>
                    <input type='file' className='form-control' id='id_image' name='image' onChange={handleImageChange} accept="image/*" />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type='number' className='form-control' name='price' onChange={onChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Stock: </label>
                        <input type='number' className='form-control' name='stock' min='1' max='200' onChange={onChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor='id_category'>Category: </label>
                        <select className="form-control" id='id_category' name="category" onChange={onChange}>
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Toys">Toys</option>
                            <option value="Home">Home</option>
                            <option value="Sports">Sports</option>
                            <option value="Cosmetics">Cosmetics</option>
                        </select>
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor='id_condition'>Condition: </label>
                        <select className="form-control" id='id_condition' name="condition" onChange={onChange}>
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                        </select>
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor='id_description'>Description: </label>
                        <textarea className='form-control' id='id_description' name='description' onChange={onChange}></textarea>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Add Product"></input>
                    <Link to='/mynetmall/my-store'>
                        <button className='btn btn-secondary'>Return</button>
                    </Link>
                </form>
            </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.user ? state.auth.user.id : null
})


export default connect(mapStateToProps, {})(AddProduct)