import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillbridge_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('skillbridge_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser({ ...res.data.user, profile: res.data.profile });
            localStorage.setItem(
              'skillbridge_user',
              JSON.stringify({ ...res.data.user, profile: res.data.profile })
            );
          }
        } catch (err) {
          console.warn('[Session Expired]:', err.message);
          localStorage.removeItem('skillbridge_token');
          localStorage.removeItem('skillbridge_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('skillbridge_token', newToken);
      localStorage.setItem('skillbridge_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.data.message || 'Login failed.');
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('skillbridge_token', newToken);
      localStorage.setItem('skillbridge_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed.');
  };

  const logout = useCallback(() => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data.success) {
        const updated = { ...res.data.user, profile: res.data.profile };
        setUser(updated);
        localStorage.setItem('skillbridge_user', JSON.stringify(updated));
        return updated;
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
