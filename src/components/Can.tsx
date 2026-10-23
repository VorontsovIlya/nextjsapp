import React from 'react';
import { useAuth } from '@/components/AuthContext';
import type { Permission } from '@/lib/authz';

interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user has the specified permission.
 * Optionally renders a fallback if the permission is not granted.
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = useAuth();
  if (!can(permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

interface CanAnyProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children if the user has ANY of the specified permissions.
 */
export function CanAny({ permissions, children, fallback = null }: CanAnyProps) {
  const { can } = useAuth();
  const hasAny = permissions.some((p) => can(p));
  if (!hasAny) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

interface CanAllProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the user has ALL of the specified permissions.
 */
export function CanAll({ permissions, children, fallback = null }: CanAllProps) {
  const { can } = useAuth();
  const hasAll = permissions.every((p) => can(p));
  if (!hasAll) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
