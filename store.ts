
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
    name: 'Ryzen Scaffold Engine',
    description: 'Ultra-fast React architecture optimized for multi-threaded processing and enterprise scalability.',
    price: 89.00,
    category: 'Templates',
    image: 'https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'Radeon Backend Shield',
    description: 'Visual-first API shield with high-throughput data pipelines and real-time monitoring.',
    price: 45.00,
    category: 'Backend',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'
  }
];

const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Epoch of High-Performance Computing',
    excerpt: 'How devbady architecture is redefining the boundaries of enterprise software delivery.',
    content: 'At the intersection of performance and reliability, we find the new standard for enterprise coding...',
    status: PostStatus.PUBLISHED,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#ed1c24', // AMD-inspired Red
  isDarkMode: true,
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
