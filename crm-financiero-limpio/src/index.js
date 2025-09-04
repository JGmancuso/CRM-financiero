// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext';
import { GoogleClientProvider } from './context/GoogleClientContext'; // <-- AÑADE ESTA LÍNEA
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataProvider>
      <GoogleClientProvider>
        <App />
      </GoogleClientProvider>
    </DataProvider>
  </React.StrictMode>
);