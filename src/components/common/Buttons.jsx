import React from 'react';

export const BtnPrimary = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const BtnSecondary = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center h-9 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const BtnDanger = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center h-9 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

export default BtnPrimary;
