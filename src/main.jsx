import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserContext } from './Context';

const checkCustomer = sessionStorage.getItem('customer_login');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Router>
      <UserContext.Provider value={checkCustomer}>
        <App />
      </UserContext.Provider>
    </Router>
  
);

