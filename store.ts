
import { User, Product, ThemeConfig, UserRole } from './types';

const STORAGE_KEYS = {
  USERS: 'devbady_users',
  PRODUCTS: 'devbady_products',
  THEME: 'devbady_theme',
  AUTH: 'devbady_auth'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Full Stack React Starter',
    description: 'A complete boilerplate for modern web applications using React and Tailwind.',
    price: 49.99,
    category: 'Templates',
    image: 'https://picsum.photos/seed/code1/400/300'
  },
  {
    id: '2',
    name: 'Gemini AI Integration Kit',
    description: 'Plug-and-play components for adding AI capabilities to your coding projects.',
    price: 99.00,
    category: 'Plugins',
    image: 'https://picsum.photos/seed/code2/400/300'
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#1e293b', // slate-800
  isDarkMode: false,
  siteName: 'devbady.in'
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
