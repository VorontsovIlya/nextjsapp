import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth, type AuthSession, type AuthError } from '@/lib/auth';
import { hasPermission, isRoleAtLeast, getPermissions, type Permission, type Role } from '@/lib/authz';

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthSession | AuthError>;
  register: (name: string, email: string, password: string) => Promise<AuthSession | AuthError>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<AuthSession | AuthError>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean } | AuthError>;
  isAuthenticated: boolean;
  // Authorization helpers
  can: (permission: Permission) => boolean;
  isAtLeast: (role: Role) => boolean;
  permissions: Permission[];
  userRole: Role | null;
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

  // Authorization helpers memoized
  const userRole = session?.user.role || null;

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!userRole) return false;
      return hasPermission(userRole, permission);
    },
    [userRole]
  );

  const isAtLeast = useCallback(
    (role: Role): boolean => {
      if (!userRole) return false;
      return isRoleAtLeast(userRole, role);
    },
    [userRole]
  );

  const permissions = useMemo(() => {
    if (!userRole) return [];
    return getPermissions(userRole);
  }, [userRole]);

  const value: AuthContextType = {
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!session,
    can,
    isAtLeast,
    permissions,
    userRole,
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
