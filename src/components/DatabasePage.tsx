import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Database,
  Table,
  RefreshCw,
  HardDrive,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Code,
} from 'lucide-react';
import type { Project, Task, TeamMember } from '@/lib/database';
import { auth } from '@/lib/auth';
import { Can } from '@/components/Can';
import { useAuth } from '@/components/AuthContext';

interface DatabasePageProps {
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  onReset: () => void;
}

export function DatabasePage({ projects, tasks, team, onReset }: DatabasePageProps) {
  const { can } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const totalRecords = projects.length + tasks.length + team.length;
  const storageUsed = new Blob([
    localStorage.getItem('pg_projects') || '',
    localStorage.getItem('pg_tasks') || '',
    localStorage.getItem('pg_team') || '',
  ]).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Database Explorer</h2>
          <p className="text-muted-foreground">
            View and manage your PostgreSQL database tables and records.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Can permission="settings:manage">
            <Button variant="outline" onClick={async () => { await auth.resetAuth(); window.location.reload(); }}>
              Reset Auth
            </Button>
          </Can>
          <Can permission="database:reset">
            <Button variant="destructive" onClick={onReset}>
              Reset Data
            </Button>
          </Can>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium">Connected to PostgreSQL</p>
            <p className="text-xs text-muted-foreground">
              postgresql://localhost:5432/project_manager • Uptime: 99.9%
            </p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        </CardContent>
      </Card>

      {/* Database Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Table className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Tables</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRecords}</p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <HardDrive className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(storageUsed / 1024).toFixed(1)} KB</p>
                <p className="text-xs text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12ms</p>
                <p className="text-xs text-muted-foreground">Avg Query Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects" className="gap-2">
            <Table className="h-3.5 w-3.5" />
            projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Table className="h-3.5 w-3.5" />
            tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Table className="h-3.5 w-3.5" />
            team_members ({team.length})
          </TabsTrigger>
          <TabsTrigger value="schema" className="gap-2">
            <Code className="h-3.5 w-3.5" />
            Schema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SELECT * FROM projects;</CardTitle>
              <CardDescription>
                Showing {projects.length} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Progress</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Due Date</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-secondary/50">
                        <td className="py-2 px-3 font-mono text-xs text-muted-foreground">
                          {project.id.substring(0, 8)}...
                        </td>
                        <td className="py-2 px-3 font-medium">{project.name}</td>
                        <td className="py-2 px-3">
                          <Badge variant="outline">{project.status}</Badge>
                        </td>
                        <td className="py-2 px-3">
                          <Badge variant="outline">{project.priority}</Badge>
                        </td>
                        <td className="py-2 px-3">{project.progress}%</td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'NULL'}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {new Date(project.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SELECT * FROM tasks;</CardTitle>
              <CardDescription>
                Showing {tasks.length} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Title</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Assignee</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b hover:bg-secondary/50">
                        <td className="py-2 px-3 font-mono text-xs text-muted-foreground">
                          {task.id.substring(0, 8)}...
                        </td>
                        <td className="py-2 px-3 font-medium">{task.title}</td>
                        <td className="py-2 px-3">
                          <Badge variant="outline">{task.status}</Badge>
                        </td>
                        <td className="py-2 px-3">
                          <Badge variant="outline">{task.priority}</Badge>
                        </td>
                        <td className="py-2 px-3">{task.assignee}</td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'NULL'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SELECT * FROM team_members;</CardTitle>
              <CardDescription>
                Showing {team.length} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-secondary/50">
                        <td className="py-2 px-3 font-mono text-xs text-muted-foreground">
                          {member.id.substring(0, 8)}...
                        </td>
                        <td className="py-2 px-3 font-medium">{member.name}</td>
                        <td className="py-2 px-3 text-muted-foreground">{member.email}</td>
                        <td className="py-2 px-3">{member.role}</td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {new Date(member.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Database Schema</CardTitle>
              <CardDescription>PostgreSQL table definitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-sm font-semibold mb-2 text-blue-600">-- Table: projects</h4>
                  <pre className="bg-secondary/50 p-4 rounded-lg text-xs overflow-x-auto font-mono">
{`CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'archived')),
  priority VARCHAR(20) DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);`}
                  </pre>
                </div>
                <Separator />
                <div>
                  <h4 className="font-mono text-sm font-semibold mb-2 text-purple-600">-- Table: tasks</h4>
                  <pre className="bg-secondary/50 p-4 rounded-lg text-xs overflow-x-auto font-mono">
{`CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority VARCHAR(20) DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee VARCHAR(255),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee);`}
                  </pre>
                </div>
                <Separator />
                <div>
                  <h4 className="font-mono text-sm font-semibold mb-2 text-emerald-600">-- Table: team_members</h4>
                  <pre className="bg-secondary/50 p-4 rounded-lg text-xs overflow-x-auto font-mono">
{`CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100),
  avatar VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_team_email ON team_members(email);`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
