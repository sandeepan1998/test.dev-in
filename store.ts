
import { User, Product, ThemeConfig, UserRole } from './types';

const STORAGE_KEYS = {
  USERS: 'clodecode_users',
  PRODUCTS: 'clodecode_products',
  THEME: 'clodecode_theme',
  AUTH: 'clodecode_auth'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cloud Infrastructure Kit',
    description: 'A complete set of scripts for deploying scalable coding environments.',
    price: 149.99,
    category: 'Templates',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'Logic Pro Snippets',
    description: 'Advanced algorithms and logic patterns for high-performance apps.',
    price: 29.00,
    category: 'Plugins',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#2563eb', // blue-600
  secondaryColor: '#0f172a', // slate-900
  isDarkMode: false,
  siteName: 'clodecode.in'
};

export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredTheme = (): ThemeConfig => {
  const data = localStorage.getItem(STORAGE_KEYS.THEME);
  return data ? JSON.parse(data) : DEFAULT_THEME;
};

export const saveTheme = (theme: ThemeConfig) => {
  localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
};
