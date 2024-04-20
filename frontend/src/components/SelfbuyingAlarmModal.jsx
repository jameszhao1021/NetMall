import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SelfbuyingAlarmModal = ({ toggleSelfbuyingAlarmModal, showSelfbuyingAlarmModal }) => {


  return (
    <div>
    
      <Modal centered show={showSelfbuyingAlarmModal}>
        <Modal.Header>
          <Modal.Title>This is your product!</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <h5>You can't add your own product to your cart.</h5>
          <h5>View it in your <a href='/mynetmall/my-store'>store</a>.</h5>
        </Modal.Body>
        <Modal.Footer >
          <Button variant="secondary" onClick={toggleSelfbuyingAlarmModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );

}

export default SelfbuyingAlarmModal