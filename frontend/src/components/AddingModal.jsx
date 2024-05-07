import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import UpdateIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

const AddingModal = ({ showAddingModal,loading, success, buttonSx}) => {


  return (
    <div>
    
      <Modal centered show={showAddingModal}>
     
        <Modal.Body >
          
        <Box sx={{ m: 1, position: 'relative', display: loading || success?'flex':'none' }}>
        <Fab
          aria-label="save"
          color="primary"
          sx={buttonSx}
        >
          {success ? <CheckIcon />: <UpdateIcon />}
          
        </Fab>
        {loading && (
            <div className=' '>
             <CircularProgress
            size={68}
            sx={{
              color: green[500],
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
           
         <h5 style={{position:'absolute', top:'50%', left:'40%', translate:'-50% -50%', whiteSpace: 'nowrap'}}>Item creating</h5>
          </div>
        )}
        {success ? <h5 style={{position:'absolute', top:'50%', left:'50%', translate:'-50% -50%', whiteSpace: 'nowrap',}}>Item created successfully</h5>: ""}
      </Box>
        </Modal.Body>

      </Modal>
    
    </div>
  );

}

export default AddingModal