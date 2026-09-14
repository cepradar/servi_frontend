// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './main.css';

// Establece título y favicon desde variables de entorno Vite si están definidas.
// Variables opcionales:
// - VITE_COMPANY_NAME: nombre que aparece en la pestaña del navegador
// - VITE_COMPANY_LOGO: ruta pública al logo (relativa a la raíz, p.ej. /my-logo.png)
try {
  const companyName = import.meta.env.VITE_COMPANY_NAME;
  if (companyName) {
    document.title = companyName;
  }

  const logoPath = import.meta.env.VITE_COMPANY_LOGO || '/sp-logo.png';
  const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
  link.rel = 'icon';
  link.type = logoPath.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  link.href = logoPath;
  if (!document.querySelector("link[rel~='icon']")) document.getElementsByTagName('head')[0].appendChild(link);
} catch (e) {
  // ambiente donde import.meta.env no está disponible (tests), ignorar silenciosamente
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);