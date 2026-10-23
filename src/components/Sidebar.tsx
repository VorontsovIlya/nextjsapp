import React from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
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

      <nav className="flex flex-col gap-1 p-3">
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

      <div className="absolute bottom-4 left-0 right-0 px-3">
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
  );
}
