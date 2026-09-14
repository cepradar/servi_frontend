// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './main.css';

// Preferir obtener la razón social y logo desde el backend (/api/company/info).
// Si falla, caerá a variables de entorno Vite o al favicon por defecto.
(async function applyCompanyInfo() {
  const setFaviconFromUrl = (url) => {
    try {
      const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = url;
      // intentar inferir tipo por la extensión
      link.type = url.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
      if (!document.querySelector("link[rel~='icon']")) document.getElementsByTagName('head')[0].appendChild(link);
    } catch (e) {
      console.error('Error setting favicon', e);
    }
  };

  try {
    const resp = await fetch('/api/company/info', { credentials: 'same-origin' });
    if (resp.ok) {
      const company = await resp.json();
      if (company?.razonSocial) document.title = company.razonSocial;
      if (company?.id) {
        // intenta cargar el logo público del backend
        const logoResp = await fetch(`/api/company/${company.id}/logo`);
        if (logoResp.ok) {
          const blob = await logoResp.blob();
          const url = URL.createObjectURL(blob);
          setFaviconFromUrl(url);
          return;
        }
      }
    }
  } catch (e) {
    // fallo al obtener desde backend, continuamos con env/default
    console.debug('No se pudo obtener info de la empresa desde backend:', e?.message || e);
  }

  // Fallback a variables Vite o al logo por defecto
  try {
    const companyName = import.meta.env.VITE_COMPANY_NAME;
    if (companyName) document.title = companyName;
    const logoPath = import.meta.env.VITE_COMPANY_LOGO || '/sp-logo.png';
    setFaviconFromUrl(logoPath);
  } catch (e) {
    // ambiente donde import.meta.env no está disponible
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);