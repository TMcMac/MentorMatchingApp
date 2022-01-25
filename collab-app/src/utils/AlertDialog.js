import React from 'react';
//MUI 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SchoolIcon from '@mui/icons-material/School';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="login-mentorship-alert">
          {"Hola! Are you interested in participating as a mentor or mentee in our
            Mentorship Program?"}
        </DialogTitle>
        <DialogContent>
            <FormControl>
              <RadioGroup row>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No thanks" />
              </RadioGroup>
            </FormControl>
          <DialogContentText id="login-mentorship-desc">
            More information of our Mentorship Program and Application is found top-right.
            <SchoolIcon />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Got it</Button>
        </DialogActions>
    </Fragment>      
  );
}