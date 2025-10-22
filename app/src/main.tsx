import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/styles/global.css'; // Import your global styles

import { store } from './store/store.ts'; // Import Redux store
import { Provider } from 'react-redux';     // Import Redux Provider
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

// Find the root element (make sure it exists in index.html)
const rootElement = document.getElementById('root');

// Ensure rootElement is not null before creating the root
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error('Root element #root not found in the DOM.');
}