import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { green } from '@mui/material/colors';
import EditingModal from '../components/EditingModal';

function EditProduct({ userId, products, newProduct, setNewProduct, fetchProducts }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showEditingModal, setShowEditingModal] = useState(false);

    function ToggleShowEditingModal() {
        setShowEditingModal(prev => !prev)
    }

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };


    function ToggleShowEditingModal() {
        setShowEditingModal(prev => !prev)
    }


    let { productId } = useParams();
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

    productId = parseInt(productId);
    const [productLoaded, setProductLoaded] = useState(false);
    const [imageId, setImageId] = useState(null)
    const [imageFile, setImageFile] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0 && !productLoaded) {
            const product = products.find(product => product.id === parseInt(productId));
            setImageId(product ? product.image_ids[0] : null);

            if (product) {
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

    async function updateProduct(productData) {
        try {
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
            axios.defaults.xsrfCookieName = "csrftoken";
            const token = localStorage.getItem('access');
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            ToggleShowEditingModal();
            setLoading(true);
            setSuccess(false);
            const productResponse = await axios.put(`/mynetmall/my-store/edit-product/${productId}/`, productData, { headers, withCredential: true })
            if (productResponse.status === 200 && imageFile) {
                const productId = productResponse.data.id;
                const formData = new FormData();
                formData.append('product', productId);
                formData.append('image', imageFile);
                await axios.put(`/mynetmall/product-image/${imageId}`, formData, { headers, withCredentials: true });
                setSuccess(true);
                setLoading(false);
                setTimeout(() => {
                    navigate('/mynetmall/my-store');
                }, 1300);

            };
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
                navigate('/mynetmall/my-store');
            }, 1300);
        } catch (error) {
            console.error('Error editing new product:', error);
        }

    }

    function onChange(e) {
        setNewProduct({
            ...newProduct, [e.target.name]: e.target.value
        });
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        } else {
            // If no file is selected, keep the existing image ID
            setImageFile(null);
        }
    }
    function onSubmit(e) {
        e.preventDefault();
        updateProduct(productData);

    }

    return (

        <>
            <div className='container'>

                <form onSubmit={onSubmit}>

                    <div className="form-group mb-2">

                        <label htmlFor='id_title'>Title: </label>
                        <input type='text' className='form-control' id='id_title' name='title' value={newProduct.title} onChange={onChange} />
                    </div>
                    <div className="form-group mb-2">
                        <label htmlFor='id_image'>Product Image: </label>
                        <input type='file' className='form-control' accept="image/*" id='id_image' name='image' onChange={handleImageChange} />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type='number' className='form-control' step='0.01' name='price' value={newProduct.price} onChange={onChange} />
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
                        <textarea className='form-control' id='id_description' name='description' rows='15' value={newProduct.description} onChange={onChange}></textarea>
                    </div>
                    <input type="submit" className="btn btn-primary me-3" value="Edit Product" />
                    <Link to='/mynetmall/my-store'>
                        <button className='btn btn-secondary'>Return</button>
                    </Link>
                    <EditingModal ToggleShowEditingModal={ToggleShowEditingModal} showEditingModal={showEditingModal} buttonSx={buttonSx} loading={loading} success={success} />

                </form>

            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.user ? state.auth.user.id : null,
})

export default connect(mapStateToProps, {})(EditProduct)
