import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext.jsx';

const AppProvider = ({ children }) => {
  const backendURL =
    (import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const apiBase = backendURL.endsWith('/api') ? backendURL : `${backendURL.replace(/\/$/, '')}/api`;
  const syncAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const getUserData = async () => {
    try {
      syncAuthHeader();
      const res = await axios.get(`${apiBase}/profile`, { withCredentials: true });
      setUser(res.data);
      setIsLoggedIn(true);
      return res.data;
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      return null;
    }
  };

  const logout = async () => {
    try {
      syncAuthHeader();
      await axios.post(`${apiBase}/logout`, {}, { withCredentials: true });
    } catch (err) {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('jwt');
      syncAuthHeader();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // On app load, try to discover existing session
    syncAuthHeader();
    getUserData();
  }, []);

  return (
    <AppContext.Provider value={{ backendURL, isLoggedIn, setIsLoggedIn, getUserData, user, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
