// Authorization & Role-Based Access Control (RBAC)
// Defines what each role can do across the application

export type Role = 'admin' | 'manager' | 'member';

export type Permission =
  // Dashboard
  | 'dashboard:view'
  // Projects
  | 'projects:view'
  | 'projects:create'
  | 'projects:edit'
  | 'projects:delete'
  // Tasks
  | 'tasks:view'
  | 'tasks:create'
  | 'tasks:edit'
  | 'tasks:delete'
  // Team
  | 'team:view'
  | 'team:manage'
  // Database
  | 'database:view'
  | 'database:reset'
  // User Management
  | 'users:view'
  | 'users:manage'
  | 'users:delete'
  // Settings
  | 'settings:view'
  | 'settings:manage';

// Role hierarchy: higher roles inherit permissions from lower roles
const ROLE_HIERARCHY: Record<Role, number> = {
  member: 1,
  manager: 2,
  admin: 3,
};

// Permission definitions per role
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  member: [
    'dashboard:view',
    'projects:view',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'team:view',
  ],
  manager: [
    'dashboard:view',
    'projects:view',
    'projects:create',
    'projects:edit',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'tasks:delete',
    'team:view',
    'team:manage',
    'settings:view',
  ],
  admin: [
    'dashboard:view',
    'projects:view',
    'projects:create',
    'projects:edit',
    'projects:delete',
    'tasks:view',
    'tasks:create',
    'tasks:edit',
    'tasks:delete',
    'team:view',
    'team:manage',
    'database:view',
    'database:reset',
    'users:view',
    'users:manage',
    'users:delete',
    'settings:view',
    'settings:manage',
  ],
};

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

// Check if role A is higher or equal to role B
export function isRoleAtLeast(role: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimumRole];
}

// Get all permissions for a role
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

// Get role display info
export function getRoleInfo(role: Role) {
  const info: Record<Role, { label: string; description: string; color: string; icon: string }> = {
    admin: {
      label: 'Administrator',
      description: 'Full access to all features including database management and user administration.',
      color: 'bg-red-500/10 text-red-600 border-red-200',
      icon: '🛡️',
    },
    manager: {
      label: 'Manager',
      description: 'Can manage projects and tasks, and view team data.',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      icon: '📋',
    },
    member: {
      label: 'Member',
      description: 'Can view projects and manage assigned tasks.',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      icon: '👤',
    },
  };
  return info[role];
}

// Navigation items with required permissions
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  requiredPermission: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', requiredPermission: 'dashboard:view' },
  { id: 'projects', label: 'Projects', icon: 'FolderKanban', requiredPermission: 'projects:view' },
  { id: 'tasks', label: 'Tasks', icon: 'ListTodo', requiredPermission: 'tasks:view' },
  { id: 'team', label: 'Team', icon: 'Users', requiredPermission: 'team:view' },
  { id: 'database', label: 'Database', icon: 'Database', requiredPermission: 'database:view' },
  { id: 'authorization', label: 'Auth Rules', icon: 'Shield', requiredPermission: 'users:view' },
];

// Action definitions with required permissions
export interface ActionPermission {
  action: string;
  permission: Permission;
  description: string;
}

export const PROJECT_ACTIONS: ActionPermission[] = [
  { action: 'create', permission: 'projects:create', description: 'Create new projects' },
  { action: 'edit', permission: 'projects:edit', description: 'Edit existing projects' },
  { action: 'delete', permission: 'projects:delete', description: 'Delete projects' },
];

export const TASK_ACTIONS: ActionPermission[] = [
  { action: 'create', permission: 'tasks:create', description: 'Create new tasks' },
  { action: 'edit', permission: 'tasks:edit', description: 'Edit tasks' },
  { action: 'delete', permission: 'tasks:delete', description: 'Delete tasks' },
];
