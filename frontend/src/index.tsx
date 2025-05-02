import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Main entry point for the React application
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/**
 * Render the main App component into the root element
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
