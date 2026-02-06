import { User, Product, ThemeConfig, UserRole, CartItem, Currency } from './types';

const KEYS = {
  PRODUCTS: 'clodecode_products_v3',
  THEME: 'clodecode_theme_v3',
  USERS: 'clodecode_users_v3',
  CART: 'clodecode_cart_v3'
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'React Enterprise Scaffold',
    description: 'Highly scalable React architecture with TypeScript, Vitest, and Tailwind pre-configured.',
    price: 59.00,
    category: 'Templates',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'NodeJS API Shield',
    description: 'Production-ready Express boilerplate with JWT auth, rate limiting, and Docker support.',
    price: 35.00,
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#2563eb',
  isDarkMode: false,
  siteName: 'clodecode.in',
  currency: Currency.USD
};

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredTheme = (): ThemeConfig => {
  const data = localStorage.getItem(KEYS.THEME);
  return data ? JSON.parse(data) : DEFAULT_THEME;
};

export const saveTheme = (theme: ThemeConfig) => {
  localStorage.setItem(KEYS.THEME, JSON.stringify(theme));
};

export const getStoredCart = (): CartItem[] => {
  const data = localStorage.getItem(KEYS.CART);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
};
