import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, type AuthSession, type AuthError } from '@/lib/auth';

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthSession | AuthError>;
  register: (name: string, email: string, password: string) => Promise<AuthSession | AuthError>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<AuthSession | AuthError>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean } | AuthError>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentSession = await auth.getSession();
      setSession(currentSession);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await auth.login(email, password);
    if ('token' in result) {
      setSession(result);
    }
    return result;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await auth.register(name, email, password);
    if ('token' in result) {
      setSession(result);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await auth.logout();
    setSession(null);
  }, []);

  const updateProfile = useCallback(async (updates: { name?: string; email?: string }) => {
    const result = await auth.updateProfile(updates);
    if ('token' in result) {
      setSession(result);
    }
    return result;
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    return await auth.changePassword(currentPassword, newPassword);
  }, []);

  const value: AuthContextType = {
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
