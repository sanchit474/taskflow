import React from 'react';

// Minimal AppContext with safe defaults so pages using it won't crash
export const AppContext = React.createContext({
  // Use VITE_BACKEND_URL to override in development if needed.
  // Production defaults to same-origin `/api` so Railway can serve one app.
  backendURL: (import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api')),
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  getUserData: () => {},
});

export default AppContext;
