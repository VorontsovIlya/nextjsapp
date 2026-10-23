import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Users,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import type { Project, Task, TeamMember } from '@/lib/database';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
}

export function Dashboard({ projects, tasks, team }: DashboardProps) {
  const { session } = useAuth();
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
  ).length;

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      change: '+2 this month',
    },
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      change: `${completedTasks} completed`,
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      change: 'Active now',
    },
    {
      title: 'Team Members',
      value: team.length,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      change: 'All active',
    },
  ];

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const statusColors: Record<string, string> = {
    todo: 'bg-slate-500/10 text-slate-600',
    in_progress: 'bg-blue-500/10 text-blue-600',
    review: 'bg-amber-500/10 text-amber-600',
    done: 'bg-emerald-500/10 text-emerald-600',
  };

  const statusLabels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'In Review',
    done: 'Done',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-slate-500/10 text-slate-600',
    medium: 'bg-blue-500/10 text-blue-600',
    high: 'bg-amber-500/10 text-amber-600',
    critical: 'bg-red-500/10 text-red-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {session?.user.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {session?.user.name.split(' ')[0]} 👋
              </h2>
              <p className="text-muted-foreground">
                Overview of your projects, tasks, and team activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.assignee}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects
                .filter((p) => p.status === 'active')
                .map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{project.name}</p>
                        <Badge className={`text-xs ${priorityColors[project.priority]}`}>
                          {project.priority}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {overdueTasks > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Some tasks have passed their due date. Review and update as needed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold">{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold">{team.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold text-emerald-600">Online</p>
              <p className="text-xs text-muted-foreground">Connection</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
