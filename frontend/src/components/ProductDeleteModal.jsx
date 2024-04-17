import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProductDeleteModal = ({ toggleDeleteModal, showDeleteModal, handleDelete, deleteProductId }) => {


  return (
    <div>
    
      <Modal centered show={showDeleteModal}>
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <h5>Are you sure to delete this product?</h5>
        </Modal.Body>
        <Modal.Footer >
          <Button variant="danger" onClick={() => handleDelete(deleteProductId)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={toggleDeleteModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );

}

export default ProductDeleteModal