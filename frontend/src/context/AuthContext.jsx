import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage_safe_get());
  const [loading, setLoading] = useState(true);

  function sessionStorage_safe_get() {
    try {
      return window.sessionStorage.getItem('portfolio_admin_token');
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setToken(data.token);
    try {
      window.sessionStorage.setItem('portfolio_admin_token', data.token);
    } catch {
      /* storage unavailable, session-only auth still works via state */
    }
    return data;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    try {
      window.sessionStorage.removeItem('portfolio_admin_token');
    } catch {
      /* noop */
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
