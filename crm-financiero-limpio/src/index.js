import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Se ha eliminado <React.StrictMode> para asegurar la compatibilidad
// con la librería de arrastrar y soltar (react-beautiful-dnd).
root.render(
  <App />
);
