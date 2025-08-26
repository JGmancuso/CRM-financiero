// src/index.js

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext'; // <-- 1. Importa el proveedor
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataProvider> {/* <-- 2. Envuelve tu App con el DataProvider */}
      <App />
    </DataProvider>
  </React.StrictMode>
);