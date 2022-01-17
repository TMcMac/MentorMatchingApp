import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { themeFile } from './utils/theme';
import jwtDecode from 'jwt-decode';

//Components
import Navbar from './components/navbar';
import AuthRoute from './utils/AuthRoute';

//Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

const theme = createTheme(themeFile);

let authenticated = false;
const token = localStorage.FBIdToken;
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
        <div className="App">
        <BrowserRouter>
          <Navbar/>
          <div className='container'> 
            <Routes>
              <Route path="/" element={ <Home/> }/>
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                }
                authenticated={authenticated}
              />
              <Route
                path="/signup"
                element={
                  <AuthRoute>
                    <Signup />
                  </AuthRoute>
                }
                authenticated={authenticated}
              />
            </Routes>
          </div>
        </BrowserRouter>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
