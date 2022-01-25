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
//REDUX Stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => ({
  ...theme.spreadThis
});

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.UI.errors !== prevProps.UI.errors) {
      this.setState({ errors: this.props.UI.errors })
    } 
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.UI.errors !== nextProps.UI.errors) {
      return { errors: nextProps.UI.errors};
    }
    else return null;
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  render() {
    const { classes, ui: { loading } } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm/>
        <Grid item sm>
          <img src={LXAIlogo} alt="Logo" className={classes.logoImg}/>
          <Typography variant='h4' className={classes.pageTitle}>
            Login
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
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress}/>
              )}
            </Button>
            <br />
            <small>don't have an account? sign up <Link to='/signup'>here</Link></small>
          </form>    
        </Grid>
        <Grid item sm/>
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui
});

const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
