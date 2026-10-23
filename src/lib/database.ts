// Simulated PostgreSQL Database Layer
// In a real Next.js app, this would connect to PostgreSQL via an API route

import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  due_date: string | null;
  progress: number;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  created_at: string;
}

// Database simulation using localStorage
const DB_KEYS = {
  projects: 'pg_projects',
  tasks: 'pg_tasks',
  team: 'pg_team',
};

// Simulate PostgreSQL query delay
const simulateQuery = <T>(data: T, delayMs = 150): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
};

// Seed data
const seedProjects: Project[] = [
  {
    id: uuidv4(),
    name: 'E-Commerce Platform',
    description: 'Build a full-featured e-commerce platform with payment integration',
    status: 'active',
    priority: 'high',
    created_at: '2025-12-01T10:00:00Z',
    updated_at: '2026-01-15T14:30:00Z',
    due_date: '2026-03-30',
    progress: 65,
  },
  {
    id: uuidv4(),
    name: 'Mobile App Redesign',
    description: 'Complete UI/UX overhaul of the mobile application',
    status: 'active',
    priority: 'critical',
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
    due_date: '2026-02-28',
    progress: 40,
  },
  {
    id: uuidv4(),
    name: 'API Gateway Migration',
    description: 'Migrate from REST to GraphQL API gateway',
    status: 'active',
    priority: 'medium',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-18T16:00:00Z',
    due_date: '2026-04-15',
    progress: 25,
  },
  {
    id: uuidv4(),
    name: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard with data visualization',
    status: 'completed',
    priority: 'low',
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2026-01-10T09:00:00Z',
    due_date: '2026-01-15',
    progress: 100,
  },
  {
    id: uuidv4(),
    name: 'Security Audit',
    description: 'Comprehensive security audit and penetration testing',
    status: 'archived',
    priority: 'high',
    created_at: '2025-09-01T10:00:00Z',
    updated_at: '2025-12-20T10:00:00Z',
    due_date: '2025-12-31',
    progress: 100,
  },
];

const seedTeam: TeamMember[] = [
  { id: uuidv4(), name: 'Sarah Chen', email: 'sarah@company.com', role: 'Frontend Developer', avatar: 'SC', created_at: '2025-06-01T10:00:00Z' },
  { id: uuidv4(), name: 'Marcus Johnson', email: 'marcus@company.com', role: 'Backend Developer', avatar: 'MJ', created_at: '2025-06-15T10:00:00Z' },
  { id: uuidv4(), name: 'Emily Rodriguez', email: 'emily@company.com', role: 'UI/UX Designer', avatar: 'ER', created_at: '2025-07-01T10:00:00Z' },
  { id: uuidv4(), name: 'David Kim', email: 'david@company.com', role: 'DevOps Engineer', avatar: 'DK', created_at: '2025-07-15T10:00:00Z' },
  { id: uuidv4(), name: 'Lisa Wang', email: 'lisa@company.com', role: 'Project Manager', avatar: 'LW', created_at: '2025-05-01T10:00:00Z' },
  { id: uuidv4(), name: 'James Brown', email: 'james@company.com', role: 'Full Stack Developer', avatar: 'JB', created_at: '2025-08-01T10:00:00Z' },
];

// Initialize database with seed data if empty
function initializeDB() {
  if (!localStorage.getItem(DB_KEYS.projects)) {
    localStorage.setItem(DB_KEYS.projects, JSON.stringify(seedProjects));
  }
  if (!localStorage.getItem(DB_KEYS.team)) {
    localStorage.setItem(DB_KEYS.team, JSON.stringify(seedTeam));
  }
  if (!localStorage.getItem(DB_KEYS.tasks)) {
    const projects = seedProjects;
    const tasks: Task[] = [
      { id: uuidv4(), project_id: projects[0].id, title: 'Setup payment gateway', description: 'Integrate Stripe payment processing', status: 'done', priority: 'high', assignee: 'Marcus Johnson', created_at: '2025-12-05T10:00:00Z', updated_at: '2026-01-10T10:00:00Z', due_date: '2026-01-15' },
      { id: uuidv4(), project_id: projects[0].id, title: 'Product catalog UI', description: 'Design and implement product listing pages', status: 'in_progress', priority: 'high', assignee: 'Sarah Chen', created_at: '2025-12-10T10:00:00Z', updated_at: '2026-01-15T10:00:00Z', due_date: '2026-02-01' },
      { id: uuidv4(), project_id: projects[0].id, title: 'Shopping cart optimization', description: 'Optimize cart performance and UX', status: 'todo', priority: 'medium', assignee: 'James Brown', created_at: '2026-01-01T10:00:00Z', updated_at: '2026-01-01T10:00:00Z', due_date: '2026-02-15' },
      { id: uuidv4(), project_id: projects[1].id, title: 'Design system update', description: 'Update design tokens and component library', status: 'in_progress', priority: 'critical', assignee: 'Emily Rodriguez', created_at: '2026-01-06T10:00:00Z', updated_at: '2026-01-20T10:00:00Z', due_date: '2026-02-10' },
      { id: uuidv4(), project_id: projects[1].id, title: 'Navigation redesign', description: 'Redesign app navigation flow', status: 'review', priority: 'high', assignee: 'Emily Rodriguez', created_at: '2026-01-08T10:00:00Z', updated_at: '2026-01-18T10:00:00Z', due_date: '2026-02-05' },
      { id: uuidv4(), project_id: projects[2].id, title: 'Schema design', description: 'Design GraphQL schema and resolvers', status: 'in_progress', priority: 'medium', assignee: 'Marcus Johnson', created_at: '2026-01-12T10:00:00Z', updated_at: '2026-01-18T10:00:00Z', due_date: '2026-02-28' },
      { id: uuidv4(), project_id: projects[2].id, title: 'Migration testing', description: 'Write integration tests for migration', status: 'todo', priority: 'medium', assignee: 'David Kim', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z', due_date: '2026-03-15' },
      { id: uuidv4(), project_id: projects[0].id, title: 'User authentication', description: 'Implement OAuth2 and JWT authentication', status: 'review', priority: 'critical', assignee: 'David Kim', created_at: '2025-12-08T10:00:00Z', updated_at: '2026-01-12T10:00:00Z', due_date: '2026-01-20' },
      { id: uuidv4(), project_id: projects[1].id, title: 'Performance optimization', description: 'Optimize bundle size and load times', status: 'todo', priority: 'high', assignee: 'Sarah Chen', created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z', due_date: '2026-02-20' },
      { id: uuidv4(), project_id: projects[0].id, title: 'Admin dashboard', description: 'Build admin panel for order management', status: 'todo', priority: 'medium', assignee: 'Lisa Wang', created_at: '2026-01-12T10:00:00Z', updated_at: '2026-01-12T10:00:00Z', due_date: '2026-03-01' },
    ];
    localStorage.setItem(DB_KEYS.tasks, JSON.stringify(tasks));
  }
}

// Initialize on module load
initializeDB();

// Database API - simulates PostgreSQL queries
export const db = {
  // Projects
  projects: {
    findAll: async (): Promise<Project[]> => {
      const data = JSON.parse(localStorage.getItem(DB_KEYS.projects) || '[]');
      return simulateQuery(data);
    },
    findById: async (id: string): Promise<Project | null> => {
      const data: Project[] = JSON.parse(localStorage.getItem(DB_KEYS.projects) || '[]');
      return simulateQuery(data.find(p => p.id === id) || null);
    },
    create: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
      const data: Project[] = JSON.parse(localStorage.getItem(DB_KEYS.projects) || '[]');
      const newProject: Project = {
        ...project,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      data.push(newProject);
      localStorage.setItem(DB_KEYS.projects, JSON.stringify(data));
      return simulateQuery(newProject);
    },
    update: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
      const data: Project[] = JSON.parse(localStorage.getItem(DB_KEYS.projects) || '[]');
      const index = data.findIndex(p => p.id === id);
      if (index === -1) return simulateQuery(null);
      data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(DB_KEYS.projects, JSON.stringify(data));
      return simulateQuery(data[index]);
    },
    delete: async (id: string): Promise<boolean> => {
      const data: Project[] = JSON.parse(localStorage.getItem(DB_KEYS.projects) || '[]');
      const filtered = data.filter(p => p.id !== id);
      localStorage.setItem(DB_KEYS.projects, JSON.stringify(filtered));
      // Also delete associated tasks
      const tasks: Task[] = JSON.parse(localStorage.getItem(DB_KEYS.tasks) || '[]');
      localStorage.setItem(DB_KEYS.tasks, JSON.stringify(tasks.filter(t => t.project_id !== id)));
      return simulateQuery(true);
    },
  },

  // Tasks
  tasks: {
    findAll: async (projectId?: string): Promise<Task[]> => {
      const data: Task[] = JSON.parse(localStorage.getItem(DB_KEYS.tasks) || '[]');
      if (projectId) {
        return simulateQuery(data.filter(t => t.project_id === projectId));
      }
      return simulateQuery(data);
    },
    findById: async (id: string): Promise<Task | null> => {
      const data: Task[] = JSON.parse(localStorage.getItem(DB_KEYS.tasks) || '[]');
      return simulateQuery(data.find(t => t.id === id) || null);
    },
    create: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
      const data: Task[] = JSON.parse(localStorage.getItem(DB_KEYS.tasks) || '[]');
      const newTask: Task = {
        ...task,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      data.push(newTask);
      localStorage.setItem(DB_KEYS.tasks, JSON.stringify(data));
      return simulateQuery(newTask);
    },
    update: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
      const data: Task[] = JSON.parse(localStorage.getItem(DB_KEYS.tasks) || '[]');
      const index = data.findIndex(t => t.id === id);
      if (index === -1) return simulateQuery(null);
      data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(DB_KEYS.tasks, JSON.stringify(data));
      return simulateQuery(data[index]);
    },
    delete: async (id: string): Promise<boolean> => {
      const data: Task[] = JSON.parse(localStorage.getItem(DB_KEYS.tasks) || '[]');
      const filtered = data.filter(t => t.id !== id);
      localStorage.setItem(DB_KEYS.tasks, JSON.stringify(filtered));
      return simulateQuery(true);
    },
  },

  // Team Members
  team: {
    findAll: async (): Promise<TeamMember[]> => {
      const data = JSON.parse(localStorage.getItem(DB_KEYS.team) || '[]');
      return simulateQuery(data);
    },
  },

  // Reset database
  reset: async (): Promise<void> => {
    localStorage.removeItem(DB_KEYS.projects);
    localStorage.removeItem(DB_KEYS.tasks);
    localStorage.removeItem(DB_KEYS.team);
    initializeDB();
  },
};
