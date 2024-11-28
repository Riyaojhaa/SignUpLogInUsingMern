import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the correct import for createRoot
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Create the root element and render the App component within the Router
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);