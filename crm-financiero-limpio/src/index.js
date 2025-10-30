// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext';
import { GoogleClientProvider } from './context/GoogleClientContext'; 
import MarketView from './views/MarketView';// <-- AÑADE ESTA LÍNEA
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataProvider>
      <MarketView />
      <GoogleClientProvider>
        <App />
      </GoogleClientProvider>
    </DataProvider>
  </React.StrictMode>
);