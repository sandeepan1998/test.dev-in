
export enum UserRole {
  USER = 'USER',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
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

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  isDarkMode: boolean;
  siteName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
