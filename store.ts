
import { User, Product, ThemeConfig, UserRole } from './types';

const KEYS = {
  PRODUCTS: 'clodecode_products',
  THEME: 'clodecode_theme',
  USERS: 'clodecode_users'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'React Enterprise Starter',
    description: 'A robust boilerplate for large-scale React applications with pre-configured CI/CD.',
    price: 49.99,
    category: 'Templates',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'NodeJS Auth Shield',
    description: 'Complete authentication middleware for Express with JWT, OAuth, and 2FA support.',
    price: 29.99,
    category: 'Plugins',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#2563eb',
  secondaryColor: '#0f172a',
  isDarkMode: false,
  siteName: 'clodecode.in'
};

export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
};

export const getStoredTheme = (): ThemeConfig => {
  const data = localStorage.getItem(KEYS.THEME);
  return data ? JSON.parse(data) : DEFAULT_THEME;
};

export const saveUser = (user: User) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const saveTheme = (theme: ThemeConfig) => {
  localStorage.setItem(KEYS.THEME, JSON.stringify(theme));
};
