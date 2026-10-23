import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';
import { getRoleInfo, type Role, type Permission } from '@/lib/authz';
import { hasPermission } from '@/lib/authz';

const ALL_PERMISSIONS: { category: string; permissions: Permission[] }[] = [
  {
    category: 'Dashboard',
    permissions: ['dashboard:view'],
  },
  {
    category: 'Projects',
    permissions: ['projects:view', 'projects:create', 'projects:edit', 'projects:delete'],
  },
  {
    category: 'Tasks',
    permissions: ['tasks:view', 'tasks:create', 'tasks:edit', 'tasks:delete'],
  },
  {
    category: 'Team',
    permissions: ['team:view', 'team:manage'],
  },
  {
    category: 'Database',
    permissions: ['database:view', 'database:reset'],
  },
  {
    category: 'Users',
    permissions: ['users:view', 'users:manage', 'users:delete'],
  },
  {
    category: 'Settings',
    permissions: ['settings:view', 'settings:manage'],
  },
];

const ROLES: Role[] = ['member', 'manager', 'admin'];

export function AuthorizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Authorization</h2>
        <p className="text-muted-foreground">
          Role-based access control (RBAC) permission matrix.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {ROLES.map((role) => {
          const info = getRoleInfo(role);
          return (
            <Card key={role}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{info.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{info.label}</CardTitle>
                    <Badge className={info.color}>{role}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Permission Matrix
          </CardTitle>
          <CardDescription>
            Detailed breakdown of permissions granted to each role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Permission</th>
                  {ROLES.map((role) => (
                    <th key={role} className="text-center py-3 px-4 font-medium">
                      <Badge className={getRoleInfo(role).color}>
                        {getRoleInfo(role).icon} {getRoleInfo(role).label}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMISSIONS.map((group) => (
                  <React.Fragment key={group.category}>
                    <tr className="bg-secondary/30">
                      <td colSpan={4} className="py-2 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        {group.category}
                      </td>
                    </tr>
                    {group.permissions.map((perm) => (
                      <tr key={perm} className="border-b hover:bg-secondary/20">
                        <td className="py-2.5 px-4 font-mono text-xs">{perm}</td>
                        {ROLES.map((role) => (
                          <td key={role} className="text-center py-2.5 px-4">
                            {hasPermission(role, perm) ? (
                              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/10">
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-500/10">
                                <X className="h-3.5 w-3.5 text-slate-400" />
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Role Hierarchy
          </CardTitle>
          <CardDescription>
            Higher roles automatically inherit all permissions from lower roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 py-4">
            {ROLES.map((role, index) => {
              const info = getRoleInfo(role);
              return (
                <React.Fragment key={role}>
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${info.color} border text-2xl mb-2`}>
                      {info.icon}
                    </div>
                    <p className="font-semibold text-sm">{info.label}</p>
                    <p className="text-xs text-muted-foreground">Level {index + 1}</p>
                  </div>
                  {index < ROLES.length - 1 && (
                    <div className="text-muted-foreground">→</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Members</strong> can view dashboards, projects, and tasks, and create/edit their own tasks.</p>
            <p>• <strong>Managers</strong> inherit member permissions plus can create/edit projects, delete tasks, and manage the team.</p>
            <p>• <strong>Admins</strong> have full access including database management, user administration, and system settings.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
