import { User, Product, ThemeConfig, UserRole, CartItem, Currency } from './types';

const KEYS = {
  PRODUCTS: 'clodecode_products_v2',
  THEME: 'clodecode_theme_v2',
  USERS: 'clodecode_users_v2',
  CART: 'clodecode_cart_v2'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'React Enterprise Base',
    description: 'A robust boilerplate for large-scale React applications with pre-configured CI/CD, testing, and modern styling.',
    price: 49.99,
    category: 'Templates',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'Authentication Shield',
    description: 'Complete authentication middleware for Express with JWT, OAuth, and 2FA support. Production ready.',
    price: 29.99,
    category: 'Plugins',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    name: 'API Rapid Prototyper',
    description: 'Instantly scaffold REST APIs with automated documentation and testing suites. Save weeks of work.',
    price: 19.99,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400'
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#2563eb',
  secondaryColor: '#0f172a',
  isDarkMode: false,
  siteName: 'clodecode.in',
  currency: Currency.USD
};

const safeGetItem = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  } catch (e) {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (e) {}
};

export const getStoredUsers = (): User[] => {
  const data = safeGetItem(KEYS.USERS);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getStoredProducts = (): Product[] => {
  const data = safeGetItem(KEYS.PRODUCTS);
  if (!data) {
    safeSetItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
};

export const getStoredTheme = (): ThemeConfig => {
  const data = safeGetItem(KEYS.THEME);
  if (!data) return DEFAULT_THEME;
  try {
    const parsed = JSON.parse(data);
    return parsed ? { ...DEFAULT_THEME, ...parsed } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const getStoredCart = (): CartItem[] => {
  const data = safeGetItem(KEYS.CART);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveUser = (user: User) => {
  const users = getStoredUsers();
  users.push(user);
  safeSetItem(KEYS.USERS, JSON.stringify(users));
};

export const saveProducts = (products: Product[]) => {
  safeSetItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const saveTheme = (theme: ThemeConfig) => {
  safeSetItem(KEYS.THEME, JSON.stringify(theme));
};

export const saveCart = (cart: CartItem[]) => {
  safeSetItem(KEYS.CART, JSON.stringify(cart));
};