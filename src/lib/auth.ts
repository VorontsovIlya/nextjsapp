// Simulated Authentication Layer
// In a real Next.js app, this would use JWT tokens with PostgreSQL for user storage

import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member';
  created_at: string;
  last_login: string | null;
}

export interface AuthSession {
  user: Omit<User, 'password_hash'>;
  token: string;
  expires_at: string;
}

const AUTH_KEY = 'pg_auth_session';
const USERS_KEY = 'pg_users';

// Simulate bcrypt-like password hashing (NOT real security - demo only)
function hashPassword(password: string): string {
  let hash = 0;
  const salt = 'pg_project_manager_salt_2026';
  const salted = salt + password + salt;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'hashed_' + Math.abs(hash).toString(36) + '_' + btoa(password.split('').reverse().join(''));
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function generateToken(): string {
  return 'token_' + uuidv4().replace(/-/g, '') + '_' + Date.now().toString(36);
}

// Seed default users
const seedUsers: User[] = [
  {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@company.com',
    password_hash: hashPassword('admin123'),
    avatar: 'AU',
    role: 'admin',
    created_at: '2025-06-01T10:00:00Z',
    last_login: null,
  },
  {
    id: uuidv4(),
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    password_hash: hashPassword('sarah123'),
    avatar: 'SC',
    role: 'manager',
    created_at: '2025-06-15T10:00:00Z',
    last_login: null,
  },
  {
    id: uuidv4(),
    name: 'Marcus Johnson',
    email: 'marcus@company.com',
    password_hash: hashPassword('marcus123'),
    avatar: 'MJ',
    role: 'member',
    created_at: '2025-07-01T10:00:00Z',
    last_login: null,
  },
];

function initializeAuthDB() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  }
}

initializeAuthDB();

// Simulate async auth operations
const simulateAuth = <T>(data: T, delayMs = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
};

export interface AuthError {
  code: string;
  message: string;
}

export const auth = {
  // Login with email and password
  login: async (email: string, password: string): Promise<AuthSession | AuthError> => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return simulateAuth({
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email address.',
      });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return simulateAuth({
        code: 'INVALID_PASSWORD',
        message: 'Incorrect password. Please try again.',
      });
    }

    // Update last login
    const index = users.findIndex((u) => u.id === user.id);
    users[index].last_login = new Date().toISOString();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session: AuthSession = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        created_at: user.created_at,
        last_login: user.last_login,
      },
      token: generateToken(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return simulateAuth(session);
  },

  // Register a new user
  register: async (name: string, email: string, password: string): Promise<AuthSession | AuthError> => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    // Check if email already exists
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return simulateAuth({
        code: 'EMAIL_EXISTS',
        message: 'An account with this email already exists.',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return simulateAuth({
        code: 'WEAK_PASSWORD',
        message: 'Password must be at least 6 characters long.',
      });
    }

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newUser: User = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password_hash: hashPassword(password),
      avatar: initials || 'U',
      role: 'member',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session: AuthSession = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        created_at: newUser.created_at,
        last_login: newUser.last_login,
      },
      token: generateToken(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return simulateAuth(session);
  },

  // Get current session
  getSession: async (): Promise<AuthSession | null> => {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) return simulateAuth(null, 100);

    const session: AuthSession = JSON.parse(sessionStr);

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      localStorage.removeItem(AUTH_KEY);
      return simulateAuth(null, 100);
    }

    return simulateAuth(session, 100);
  },

  // Logout
  logout: async (): Promise<void> => {
    localStorage.removeItem(AUTH_KEY);
    return simulateAuth(undefined, 100);
  },

  // Update user profile
  updateProfile: async (updates: { name?: string; email?: string }): Promise<AuthSession | AuthError> => {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
      return simulateAuth({ code: 'NOT_AUTHENTICATED', message: 'Please log in again.' });
    }

    const session: AuthSession = JSON.parse(sessionStr);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u) => u.id === session.user.id);

    if (index === -1) {
      return simulateAuth({ code: 'USER_NOT_FOUND', message: 'User not found.' });
    }

    if (updates.name) {
      users[index].name = updates.name;
      const initials = updates.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      users[index].avatar = initials || users[index].avatar;
    }

    if (updates.email) {
      if (users.find((u) => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== session.user.id)) {
        return simulateAuth({ code: 'EMAIL_EXISTS', message: 'This email is already in use.' });
      }
      users[index].email = updates.email.toLowerCase();
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const updatedSession: AuthSession = {
      ...session,
      user: {
        ...session.user,
        name: users[index].name,
        email: users[index].email,
        avatar: users[index].avatar,
      },
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedSession));
    return simulateAuth(updatedSession);
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean } | AuthError> => {
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) {
      return simulateAuth({ code: 'NOT_AUTHENTICATED', message: 'Please log in again.' });
    }

    const session: AuthSession = JSON.parse(sessionStr);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u) => u.id === session.user.id);

    if (!verifyPassword(currentPassword, users[index].password_hash)) {
      return simulateAuth({ code: 'INVALID_PASSWORD', message: 'Current password is incorrect.' });
    }

    if (newPassword.length < 6) {
      return simulateAuth({ code: 'WEAK_PASSWORD', message: 'New password must be at least 6 characters.' });
    }

    users[index].password_hash = hashPassword(newPassword);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return simulateAuth({ success: true });
  },

  // Reset database
  resetAuth: async (): Promise<void> => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USERS_KEY);
    initializeAuthDB();
  },
};
