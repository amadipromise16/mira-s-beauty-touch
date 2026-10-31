import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('mbt_token'));
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auth modal state for easy trigger anywhere
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [authRedirectAction, setAuthRedirectAction] = useState(null);

  // Fetch logged in user profile
  const fetchMe = async () => {
    const savedToken = localStorage.getItem('mbt_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.auth.me();
      setUser(res.user);
      setUnreadCount(res.unread_notifications || 0);
    } catch (err) {
      console.warn('Session expired or invalid, logging out.');
      localStorage.removeItem('mbt_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    localStorage.setItem('mbt_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    if (authRedirectAction) {
      authRedirectAction();
      setAuthRedirectAction(null);
    }
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    localStorage.setItem('mbt_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    if (authRedirectAction) {
      authRedirectAction();
      setAuthRedirectAction(null);
    }
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('mbt_token');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
  };

  const openAuth = (tab = 'login', callback = null) => {
    setAuthModalTab(tab);
    setAuthRedirectAction(() => callback);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
    setAuthRedirectAction(null);
  };

  const refreshUser = () => {
    return fetchMe();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      unreadCount,
      setUnreadCount,
      login,
      register,
      logout,
      refreshUser,
      authModalOpen,
      authModalTab,
      setAuthModalTab,
      openAuth,
      closeAuth,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

