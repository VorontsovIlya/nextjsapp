import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { LoginPage } from '@/components/LoginPage';
import { RegisterPage } from '@/components/RegisterPage';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { ProjectsPage } from '@/components/ProjectsPage';
import { TasksPage } from '@/components/TasksPage';
import { TeamPage } from '@/components/TeamPage';
import { DatabasePage } from '@/components/DatabasePage';
import { db, type Project, type Task, type TeamMember } from '@/lib/database';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function AuthScreen() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  if (screen === 'register') {
    return <RegisterPage onSwitchToLogin={() => setScreen('login')} />;
  }

  return <LoginPage onSwitchToRegister={() => setScreen('register')} />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { session, loading: authLoading, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    const [projectsData, tasksData, teamData] = await Promise.all([
      db.projects.findAll(),
      db.tasks.findAll(),
      db.team.findAll(),
    ]);
    setProjects(projectsData);
    setTasks(tasksData);
    setTeam(teamData);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Project CRUD handlers
  const handleAddProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    await db.projects.create(project);
    await loadData();
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    await db.projects.update(id, updates);
    await loadData();
  };

  const handleDeleteProject = async (id: string) => {
    await db.projects.delete(id);
    await loadData();
  };

  // Task CRUD handlers
  const handleAddTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    await db.tasks.create(task);
    await loadData();
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await db.tasks.update(id, updates);
    await loadData();
  };

  const handleDeleteTask = async (id: string) => {
    await db.tasks.delete(id);
    await loadData();
  };

  // Database reset
  const handleResetDatabase = async () => {
    await db.reset();
    await loadData();
  };

  // Auth loading
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - show login/register
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Authenticated - show app
  const renderPage = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading data from PostgreSQL...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard projects={projects} tasks={tasks} team={team} />;
      case 'projects':
        return (
          <ProjectsPage
            projects={projects}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            tasks={tasks}
            projects={projects}
            onAdd={handleAddTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        );
      case 'team':
        return <TeamPage team={team} tasks={tasks} />;
      case 'database':
        return (
          <DatabasePage
            projects={projects}
            tasks={tasks}
            team={team}
            onReset={handleResetDatabase}
          />
        );
      default:
        return <Dashboard projects={projects} tasks={tasks} team={team} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
