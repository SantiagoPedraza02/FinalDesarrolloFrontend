import { useState, createContext, useContext, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh') || null);

  useEffect(() => {
    if (token) {
      setUser({ token });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    setToken(data.access);
    setRefreshToken(data.refresh || null);
    setUser({ token: data.access });
    localStorage.setItem('token', data.access);
    if (data.refresh) localStorage.setItem('refresh', data.refresh);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };

  // Basic refresh helper (not auto-refreshing by time)
  const tryRefresh = async () => {
    if (!refreshToken) return null;
    const res = await api.refresh(refreshToken);
    if (res?.access) {
      setToken(res.access);
      localStorage.setItem('token', res.access);
      return res.access;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, tryRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
