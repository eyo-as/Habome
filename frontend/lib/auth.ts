import { User } from './types'

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'owner@example.com': {
    password: 'password123',
    user: {
      id: '1',
      name: 'Property Owner',
      email: 'owner@example.com',
      role: 'owner',
    },
  },
  'user@example.com': {
    password: 'password123',
    user: {
      id: '2',
      name: 'John Buyer',
      email: 'user@example.com',
      role: 'user',
    },
  },
  'admin@example.com': {
    password: 'password123',
    user: {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
  },
}

// Session management (client-side for demo)
export const SESSION_STORAGE_KEY = 'ph_session'

export function saveSession(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
  }
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem(SESSION_STORAGE_KEY)
  return session ? JSON.parse(session) : null
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

// Mock authentication
export async function mockLogin(email: string, password: string): Promise<{ user: User } | { error: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const userData = DEMO_USERS[email]

  if (!userData) {
    return { error: 'Invalid credentials' }
  }

  if (userData.password !== password) {
    return { error: 'Invalid credentials' }
  }

  return { user: userData.user }
}

export async function mockRegister(name: string, email: string, password: string, role: 'owner' | 'user'): Promise<{ user: User } | { error: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Check if email already exists
  if (DEMO_USERS[email]) {
    return { error: 'Email already registered' }
  }

  // Create new user (in real app, would save to DB)
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    role,
  }

  return { user: newUser }
}

export function getDashboardRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'owner':
      return '/owner'
    case 'user':
      return '/user'
    default:
      return '/'
  }
}
