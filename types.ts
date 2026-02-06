
// Enum representing the available user roles in the application
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CLIENT = 'CLIENT'
}

// Interface for user objects
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

// Interface for marketplace products
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Interface for shopping cart items
export interface CartItem extends Product {
  quantity: number;
}

// Interface for global authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Configuration for site-wide theme and branding
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  isDarkMode: boolean;
  siteName: string;
}
