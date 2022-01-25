import React, { Component } from 'react'
import { Link } from 'react-router-dom';

//MUI stuff
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

class Navbar extends Component {
  render() {
    return (
      <AppBar>
        <Toolbar className='nav-container'>
          <Button color='inherit'component={Link} to='/login'>
            Login
          </Button>
          <Button color='inherit'component={Link} to='/'>
            Home
          </Button>
          <Button color='inherit'component={Link} to='/signup'>
            Signup
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Navbar
