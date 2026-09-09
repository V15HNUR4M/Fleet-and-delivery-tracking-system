import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const role = localStorage.getItem('role');
    const expiresIn = localStorage.getItem('expiresIn');

    if (accessToken && role) {
      setUser({
        accessToken,
        refreshToken: refreshToken || '',
        role,
        expiresIn: expiresIn ? parseInt(expiresIn) : 3600000,
      });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data) => {
    const response = await authApi.login(data);
    const authUser = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      role: response.role,
      expiresIn: response.expiresIn,
    };
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('role', response.role);
    localStorage.setItem('expiresIn', String(response.expiresIn));
    setUser(authUser);
  }, []);

  const register = useCallback(async (data) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('expiresIn');
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, register, logout, hasRole }),
    [user, isLoading, login, register, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
