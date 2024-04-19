import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

const AddToCartModal = ({ toggleAddToCartModal, showAddToCartModal, product, newCartItem }) => {


  return (
    <div>
    
      <Modal centered show={showAddToCartModal}>
        <Modal.Header>
          <Modal.Title>{newCartItem.quantity} {newCartItem.quantity>1?'items':'item'} added</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <h5>{product.title}</h5>
          
          <h5>Price: ${product.price}</h5>
          {
            newCartItem.quantity > 1 && 
            <>
            <h5>Quantity: {newCartItem.quantity}</h5>
            <h5>Estimated total: ${newCartItem.quantity * product.price}</h5>
            </>
          }
        </Modal.Body>
        <Modal.Footer >
         <Link to='/mynetmall/my-cart'>
          <Button variant="info">
            Go to cart
          </Button>
          </Link>
          <Button variant="secondary" onClick={toggleAddToCartModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );

}

export default AddToCartModal