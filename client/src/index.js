// Import necessary modules and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import "react-toastify/dist/ReactToastify.min.css";  // Import Toastify CSS for notifications
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import Font Awesome CSS for icons

// Create a root element to render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);