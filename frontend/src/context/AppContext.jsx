import React from 'react';

// Minimal AppContext with safe defaults so pages using it won't crash
export const AppContext = React.createContext({
  // Prefer VITE_BACKEND_URL (or legacy VITE_API_BASE_URL) in all environments.
  backendURL:
    (import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api')),
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  getUserData: () => {},
});

export default AppContext;
