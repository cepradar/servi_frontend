/**
 * src/config/env.js
 *
 * Punto único de acceso a todas las variables de entorno de Vite.
 * Importar siempre desde aquí — nunca referenciar import.meta.env
 * directamente en servicios, hooks o componentes.
 *
 * Beneficios:
 *  - Un solo lugar para saber qué variables existen.
 *  - Fácil de testear/mockear.
 *  - Evita typos dispersos en el código.
 */

/** Normaliza la URL base para evitar slashes finales y permitir mismo origen. */
const normalizeApiBaseUrl = (value) => {
  const normalized = (value || '').trim();

  if (!normalized || normalized === '/') {
    return '';
  }

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
};

/** Fallback por defecto: mismo origen.
 *  En desarrollo, Vite proxy redirige /api y /auth al backend.
 *  En servidor, Nginx hace el mismo proxy hacia Spring Boot. */
const _fallbackApiUrl = '';

export const env = {
  /** URL base del backend API (sin slash al final) */
  API_BASE_URL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL) || _fallbackApiUrl,

  /** Modo de ejecución actual: 'development' | 'production' */
  MODE: import.meta.env.MODE,

  /** true cuando se ejecuta con `vite` (desarrollo) */
  DEV: import.meta.env.DEV,

  /** true cuando se ejecuta el build de producción */
  PROD: import.meta.env.PROD,
};
