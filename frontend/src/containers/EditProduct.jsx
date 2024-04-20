import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function EditProduct({ userId, products, newProduct, setNewProduct, fetchProducts }) {
    let { productId } = useParams();
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken=')).split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;


    console.log('product id:' + productId)
    productId = parseInt(productId);
    const [productLoaded, setProductLoaded] = useState(false);

    const product = products.find(product => product.id === productId);

    const navigate = useNavigate();

    useEffect(() => {
        const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken=')).split('=')[1];
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0 && !productLoaded) {
            const product = products.find(product => product.id === parseInt(productId));
            if (product) {
                console.log('this product: ', product);
                setNewProduct({
                    title: product.title,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                    condition: product.condition,
                    description: product.description,
                });
                setProductLoaded(true);
            }
        }
    }, [products, productId, productLoaded]);
    const productData = { ...newProduct, seller: userId };

    const updateProduct = (productData) => {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        const token = localStorage.getItem('access'); 
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        axios.put(`/mynetmall/my-store/edit-product/${productId}/`, productData, {headers, withCredential: true})
         .then(res => {
            // fetchProducts();
            navigate(`/mynetmall/my-store/${userId}`);
         })
         
         .catch(err => {
           console.error('Error updating Product:', err);
         });
     };
   
    function onChange(e) {
        setNewProduct({
            ...newProduct, [e.target.name]: e.target.value
        });
    }

    function onSubmit(e) {
        e.preventDefault();
        updateProduct(productData);

    }

    return (

        <>
            <div className='container'>
                {products
                    .filter(product => product.id == productId) // Filter products by seller equal to userId
                    .map(product => (

                        <form onSubmit={onSubmit}>

                            <div className="form-group mb-2">
                                <label htmlFor='id_title'>Title: </label>
                                <input type='text' className='form-control' id='id_title' name='title' value={newProduct.title} onChange={onChange} />
                            </div>
                            <div className="form-group">
                                <label>Price: </label>
                                <input type='number' className='form-control' name='price' value={newProduct.price} onChange={onChange} />
                            </div>
                            <div className="form-group mb-2">
                                <label>Stock: </label>
                                <input type='number' className='form-control' name='stock' min='1' max='200' value={newProduct.stock} onChange={onChange} />
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor='id_category'>Category: </label>
                                <select className="form-control" id='id_category' name="category" value={newProduct.category} onChange={onChange}>
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
                                <select className="form-control" id='id_condition' name="condition" value={newProduct.condition} onChange={onChange}>
                                    <option value="">Select Condition</option>
                                    <option value="New">New</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                </select>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor='id_description'>Description: </label>
                                <textarea className='form-control' id='id_description' name='description' value={newProduct.description} onChange={onChange}></textarea>
                            </div>
                            <input type="submit" className="btn btn-primary" value="Edit Product" />
                            <Link to={`/mynetmall/my-store/${userId}`}>
                            <button className='btn btn-secondary'>Return</button>
                            </Link>
                        </form>

                    ))}
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.user ? state.auth.user.id : null,

})

// export default EditProduct;


export default connect(mapStateToProps, {})(EditProduct)
