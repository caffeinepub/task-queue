export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  verificationCode: string;
  verified: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'pending' | 'not-started';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface CategoryEntry {
  name: string;
  icon: string;
}

const USERS_KEY = 'taskqueue_users';
const SESSION_KEY = 'taskqueue_session';
const TASKS_KEY = 'taskqueue_tasks';
const CATEGORIES_KEY = 'taskqueue_categories';

export const DEFAULT_CATEGORIES: CategoryEntry[] = [
  { name: 'Work', icon: '💼' },
  { name: 'Personal', icon: '👤' },
  { name: 'Education', icon: '📚' },
  { name: 'Household', icon: '🏠' },
  { name: 'Shopping', icon: '🛒' },
  { name: 'Health', icon: '❤️' },
  { name: 'Other', icon: '📌' },
];

export const DEFAULT_CATEGORY_NAMES = DEFAULT_CATEGORIES.map(c => c.name);

// Users
export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];
    const users = JSON.parse(data);
    // Backward compatibility: ensure all users have verification fields
    return users.map((u: User) => ({
      ...u,
      verificationCode: u.verificationCode ?? '',
      verified: u.verified ?? true,
    }));
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByPhone(phone: string): User | undefined {
  return getUsers().find(u => u.phone === phone);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
}

// Session
export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | undefined {
  const userId = getSession();
  if (!userId) return undefined;
  return getUsers().find(u => u.id === userId);
}

// Tasks
export function getTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getTasksByUser(userId: string): Task[] {
  return getTasks().filter(t => t.userId === userId);
}

export function addTask(task: Task): void {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function updateTask(updatedTask: Task): void {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasks(tasks);
  }
}

export function deleteTask(taskId: string): void {
  const tasks = getTasks().filter(t => t.id !== taskId);
  saveTasks(tasks);
}

// Categories — stored as CategoryEntry[] for custom categories
function getCustomCategories(userId: string): CategoryEntry[] {
  try {
    const data = localStorage.getItem(`${CATEGORIES_KEY}_${userId}`);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Backward compatibility: handle old string[] format
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      return (parsed as string[]).map(name => ({ name, icon: '📁' }));
    }
    return parsed as CategoryEntry[];
  } catch {
    return [];
  }
}

function saveCustomCategories(userId: string, categories: CategoryEntry[]): void {
  localStorage.setItem(`${CATEGORIES_KEY}_${userId}`, JSON.stringify(categories));
}

export function getCategories(userId: string): string[] {
  const custom = getCustomCategories(userId);
  return [...DEFAULT_CATEGORY_NAMES, ...custom.map(c => c.name)];
}

export function getCategoryEntries(userId: string): CategoryEntry[] {
  const custom = getCustomCategories(userId);
  return [...DEFAULT_CATEGORIES, ...custom];
}

export function addCategory(userId: string, category: string, icon?: string): void {
  try {
    const custom = getCustomCategories(userId);
    if (!custom.find(c => c.name === category)) {
      custom.push({ name: category, icon: icon || '📁' });
      saveCustomCategories(userId, custom);
    }
  } catch {
    // ignore
  }
}

export function deleteCategory(userId: string, categoryName: string): void {
  // Never allow deleting default categories
  if (DEFAULT_CATEGORY_NAMES.includes(categoryName)) return;
  try {
    const custom = getCustomCategories(userId);
    const updated = custom.filter(c => c.name !== categoryName);
    saveCustomCategories(userId, updated);
  } catch {
    // ignore
  }
}
