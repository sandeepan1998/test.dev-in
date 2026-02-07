import { User, Product, ThemeConfig, UserRole, CartItem, Currency, Post, PostStatus } from './types';

const KEYS = {
  PRODUCTS: 'devbady_products_v3',
  THEME: 'devbady_theme_v3',
  USERS: 'devbady_users_v3',
  CART: 'devbady_cart_v3',
  POSTS: 'devbady_posts_v3'
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

const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of Enterprise Coding in 2025',
    excerpt: 'Discover why modular architecture is the backbone of modern software engineering.',
    content: 'Enterprise coding is evolving. In 2025, the focus has shifted entirely towards resilient, modular systems...',
    status: PostStatus.PUBLISHED,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#2563eb',
  isDarkMode: false,
  siteName: 'devbady.in',
  currency: Currency.USD
};

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredPosts = (): Post[] => {
  const data = localStorage.getItem(KEYS.POSTS);
  return data ? JSON.parse(data) : DEFAULT_POSTS;
};

export const savePosts = (posts: Post[]) => {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
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