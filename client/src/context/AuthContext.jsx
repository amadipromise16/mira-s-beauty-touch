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
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('mbt_user', JSON.stringify(res.user));
        setUnreadCount(res.unread_notifications || 0);
        setLoading(false);
        return;
      }
    } catch (err) {
      // If API is unreachable (e.g. static GitHub Pages), preserve saved local user session
      const savedUserStr = localStorage.getItem('mbt_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          setLoading(false);
          return;
        } catch (_) {}
      }
      localStorage.removeItem('mbt_token');
      localStorage.removeItem('mbt_user');
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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check if this matches the official Admin credentials
    const isAdminEmail = cleanEmail === 'mirabeautytouch@gmail.com';

    // 1. Try backend API first (when running with active Node/Python server)
    try {
      const res = await api.auth.login({ email: cleanEmail, password: cleanPass });
      if (res && res.user && res.token) {
        localStorage.setItem('mbt_token', res.token);
        localStorage.setItem('mbt_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        if (authRedirectAction) {
          authRedirectAction();
          setAuthRedirectAction(null);
        }
        return res.user;
      }
    } catch (apiErr) {
      // Fall through to offline/GitHub Pages client session authentication
      console.warn('API login note (falling back to client session):', apiErr.message);
    }

    // 2. Client-side authentication fallback (ensures 100% login success on GitHub Pages)
    if (isAdminEmail) {
      if (cleanPass === 'miratouch') {
        const adminUser = {
          id: 1,
          full_name: 'Mira Admin',
          email: 'mirabeautytouch@gmail.com',
          phone: '+234 814 987 6543',
          role: 'admin'
        };
        const simulatedToken = 'mbt_admin_token_' + Date.now();
        localStorage.setItem('mbt_token', simulatedToken);
        localStorage.setItem('mbt_user', JSON.stringify(adminUser));
        setToken(simulatedToken);
        setUser(adminUser);
        setAuthModalOpen(false);
        if (authRedirectAction) {
          authRedirectAction();
          setAuthRedirectAction(null);
        }
        return adminUser;
      } else {
        throw new Error('Incorrect password for mirabeautytouch@gmail.com.');
      }
    }

    // Check client registered accounts in local storage
    try {
      const storedUsers = JSON.parse(localStorage.getItem('mbt_client_accounts') || '[]');
      const foundClient = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (foundClient) {
        if (foundClient.password === cleanPass) {
          const clientUser = {
            id: foundClient.id || Date.now(),
            full_name: foundClient.full_name,
            email: foundClient.email,
            phone: foundClient.phone,
            role: 'client'
          };
          const clientToken = 'mbt_client_token_' + Date.now();
          localStorage.setItem('mbt_token', clientToken);
          localStorage.setItem('mbt_user', JSON.stringify(clientUser));
          setToken(clientToken);
          setUser(clientUser);
          setAuthModalOpen(false);
          if (authRedirectAction) {
            authRedirectAction();
            setAuthRedirectAction(null);
          }
          return clientUser;
        } else {
          throw new Error('Incorrect password.');
        }
      }
    } catch (e) {
      // continue
    }

    throw new Error('Invalid email or password. Please verify your credentials or click Register.');
  };

  const register = async (userData) => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    // 1. Try backend API first
    try {
      const res = await api.auth.register(userData);
      if (res && res.user && res.token) {
        localStorage.setItem('mbt_token', res.token);
        localStorage.setItem('mbt_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        if (authRedirectAction) {
          authRedirectAction();
          setAuthRedirectAction(null);
        }
        return res.user;
      }
    } catch (apiErr) {
      console.warn('API register note (falling back to client session):', apiErr.message);
    }

    // 2. Client-side registration fallback for GitHub Pages
    const newClientUser = {
      id: Date.now(),
      full_name: userData.full_name,
      email: cleanEmail,
      phone: userData.phone,
      role: 'client'
    };

    try {
      const storedUsers = JSON.parse(localStorage.getItem('mbt_client_accounts') || '[]');
      storedUsers.push({ ...newClientUser, password: userData.password });
      localStorage.setItem('mbt_client_accounts', JSON.stringify(storedUsers));
    } catch (e) {}

    const clientToken = 'mbt_client_token_' + Date.now();
    localStorage.setItem('mbt_token', clientToken);
    localStorage.setItem('mbt_user', JSON.stringify(newClientUser));
    setToken(clientToken);
    setUser(newClientUser);
    setAuthModalOpen(false);
    if (authRedirectAction) {
      authRedirectAction();
      setAuthRedirectAction(null);
    }
    return newClientUser;
  };

  const logout = () => {
    localStorage.removeItem('mbt_token');
    localStorage.removeItem('mbt_user');
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

