import React, { Component, Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { themeFile } from './utils/theme';
import jwtDecode from 'jwt-decode';

//redux
import { Provider } from 'react-redux';
import store from './redux/store';

//Components
import Navbar from './components/navbar';
import AuthRoute from './utils/AuthRoute';

//Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

const theme = createTheme(themeFile);

let authenticated = false;
const token = localStorage.FireBaseIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login'
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Fragment>
            <Navbar/>
            <div className='container'> 
              <Routes>
                <Route path="/" element={ <Home/> }/>
                <Route
                  path="/login"
                  element={<AuthRoute/>}>
                      <Route
                        path="/login"
                        element={<Login />}
                      />
                  authenticated={authenticated}
                </Route>
                <Route
                  path="/signup"
                  element={<AuthRoute/>}>
                      <Route
                        path="/signup"
                        element={<Signup />}
                      />
                  authenticated={authenticated}
                </Route>
              </Routes>
            </div>
          </Fragment>
        </BrowserRouter>
      </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
