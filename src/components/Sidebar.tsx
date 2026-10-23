import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/AuthContext';
import { ProfileDialog } from '@/components/ProfileDialog';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'database', label: 'Database', icon: Database },
];

export function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { session, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    manager: 'Manager',
    member: 'Member',
  };

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
          <div className={cn('flex items-center gap-2', collapsed && 'justify-center w-full')}>
            <Database className="h-6 w-6 text-primary flex-shrink-0" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold">PostgreSQL</h1>
                <p className="text-xs text-muted-foreground">Project Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'secondary' : 'ghost'}
                className={cn(
                  'justify-start gap-3',
                  collapsed && 'justify-center px-2',
                  currentPage === item.id && 'bg-primary/10 text-primary'
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t p-3 space-y-2 flex-shrink-0">
          {!collapsed && session && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/50 cursor-pointer" onClick={() => setProfileOpen(true)}>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {session.user.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{roleLabels[session.user.role]}</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          )}

          {collapsed && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="w-full"
                onClick={() => setProfileOpen(true)}
              >
                <UserCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}

          <Separator />

          <Button
            variant="ghost"
            size="icon"
            className={cn('w-full', collapsed ? '' : 'justify-start gap-3')}
            onClick={onToggle}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </Button>
        </div>
      </aside>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
