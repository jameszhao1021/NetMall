import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SignupModel = ({ toggleSignupModal, showSignupModal }) => {


  return (
    <div>
    
      <Modal centered show={showSignupModal}>
        <Modal.Header>
          <Modal.Title>Email Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <h5>A confirmation email has been sent to your email address</h5>
        </Modal.Body>
        <Modal.Footer >
          <Button variant="secondary" onClick={toggleSignupModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );

}

export default SignupModel