import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { UnauthorizedPage } from '@/components/UnauthorizedPage';
import type { Permission } from '@/lib/authz';

interface ProtectedPageProps {
  permission: Permission;
  resource?: string;
  children: React.ReactNode;
}

/**
 * Wraps a page with authorization check.
 * Shows UnauthorizedPage if user lacks the required permission.
 */
export function ProtectedPage({ permission, resource, children }: ProtectedPageProps) {
  const { can } = useAuth();

  if (!can(permission)) {
    return <UnauthorizedPage resource={resource} />;
  }

  return <>{children}</>;
}
