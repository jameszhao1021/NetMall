import axios from 'axios'
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'
import { green } from '@mui/material/colors';
import AddingModal from '../components/AddingModal';


function AddProduct({ userId }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showAddingModal, setShowAddingModal] = useState(false);

    function ToggleShowAddingModal() {
        setShowAddingModal(prev => !prev)
    }

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    const navigate = useNavigate();
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        stock: '',
        category: '',
        condition: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);

    // Set CSRF token for Axios
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    const csrfToken = document.cookie.split('; ').find(cookie => cookie.startsWith('csrftoken='))?.split('=')[1];
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

    function handleImageChange(e) {
        console.log(e.target.files[0]);
        setImageFile(e.target.files[0]);
    }

    function onChange(e) {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    }


    async function CreateProduct() {
        try {
            const token = localStorage.getItem('access');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            };

            // Create product first
            ToggleShowAddingModal();
            setLoading(true);
            setSuccess(false);
            const productResponse = await axios.post('/mynetmall/my-store/add-product', { ...newProduct, seller: userId }, { headers, withCredentials: true });

            // If product creation is successful, then upload the image
            if (productResponse.status === 200) {
                const productId = productResponse.data.id;
                const formData = new FormData();
                formData.append('product', productId);
                formData.append('image', imageFile);
                const imageResponse = await axios.post('/mynetmall/product-image', formData, { headers, withCredentials: true });

                // If both requests are successful, navigate
                if (imageResponse.status === 201) {
                    setNewProduct({
                        title: '',
                        price: '',
                        stock: '',
                        category: '',
                        condition: '',
                        description: '',
                    });
                    setSuccess(true);
                    setLoading(false);
                    setTimeout(() => {
                        navigate('/mynetmall/my-store');
                    }, 1300);
                }
            }
        } catch (error) {
            console.error('Error adding new product:', error);
        }
    }

    function onSubmit(e) {
        e.preventDefault();
        CreateProduct();

    }


    return (
        <div className='container'>
            <h1>Add Product</h1>
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="form-group mb-2">
                    <label htmlFor='id_title'>Title: </label>
                    <input type='text' className='form-control' id='id_title' name='title' onChange={onChange} required />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor='id_image'>Product Image: </label>
                    <input type='file' className='form-control' accept="image/*" id='id_image' name='image' onChange={handleImageChange} required />
                </div>
                <div className="form-group">
                    <label>Price: </label>
                    <input type='number' step='0.01' className='form-control' name='price' onChange={onChange} required />
                </div>
                <div className="form-group mb-2">
                    <label>Stock: </label>
                    <input type='number' className='form-control' name='stock' min='1' max='200' onChange={onChange} required />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor='id_category'>Category: </label>
                    <select className="form-control" id='id_category' name="category" onChange={onChange} required>
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
                    <select className="form-control" id='id_condition' name="condition" onChange={onChange} required>
                        <option value="">Select Condition</option>
                        <option value="New">New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                    </select>
                </div>
                <div className="form-group mb-2">
                    <label htmlFor='id_description'>Description: </label>
                    <textarea className='form-control' id='id_description' name='description' rows='15' onChange={onChange} required></textarea>
                </div>
                <input type="submit" className="btn btn-primary me-3 mt-2" value="Add Product"></input>

             

                <Link to='/mynetmall/my-store'>
                    <button className='btn btn-secondary mt-2'>Return</button>

                </Link>
                <AddingModal ToggleShowAddingModal={ToggleShowAddingModal} showAddingModal={showAddingModal} buttonSx={buttonSx} loading={loading} success={success} />
            </form>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.user ? state.auth.user.id : null
})


export default connect(mapStateToProps, {})(AddProduct)