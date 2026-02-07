export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum Currency {
  USD = 'USD',
  INR = 'INR'
}

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  coverImage?: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface ThemeConfig {
  primaryColor: string;
  isDarkMode: boolean;
  siteName: string;
  currency: Currency;
}