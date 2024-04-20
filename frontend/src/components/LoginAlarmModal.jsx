import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const LoginAlarmModal = ({ toggleLoginAlarmModal, showLoginAlarmModal }) => {


  return (
    <div>
    
      <Modal centered show={showLoginAlarmModal}>
        <Modal.Header>
          <Modal.Title>To continue your shopping...</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <h5><a href='/login'>Signin</a> to add this item into your cart.</h5>
          <h5>Do not have an account? <a href='/singup'>Sign up</a> today.</h5>
        </Modal.Body>
        <Modal.Footer >
          <Button variant="secondary" onClick={toggleLoginAlarmModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );

}

export default LoginAlarmModal