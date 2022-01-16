import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LXAIlogo from '../images/LXAI-logo-black.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

//MUI Stuff
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const styles = (theme) => ({
  ...theme.spreadThis
});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
      loading: false,
      errors: {}
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    }
    axios.post('/signup', newUserData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          loading: false
        })
      })
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm/>
        <Grid item sm>
          <img src={LXAIlogo} alt="Logo" className={classes.logoImg}/>
          <Typography variant='h4' className={classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              variant="standard"
              id='email'
              name='email'
              type='email'
              label='Email'
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              variant="standard"
              id='password'
              name='password'
              type='password'
              label='Password'
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              variant="standard"
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              label='Confirm Password'
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              variant="standard"
              id='handle'
              name='handle'
              type='text'
              label='Handle'
              className={classes.textField}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              value={this.state.handle}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type='submit'
              variant='contained'
              color='primary'
              label="Submit"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress size={30} className={classes.progress}/>
              )}
            </Button>
            <br />
            <small>already have an account? Login <Link to='/login'>here</Link></small>
          </form>    
        </Grid>
        <Grid item sm/>
      </Grid>
    )
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(signup);
