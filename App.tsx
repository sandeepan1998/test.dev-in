import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Cart from './pages/Cart';
import FileShare from './pages/FileShare';
import { AuthState, UserRole, ThemeConfig, CartItem, Product, Currency, User } from './types';
import { getStoredTheme, getStoredCart, saveCart, saveTheme } from './store';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [theme, setTheme] = useState<ThemeConfig>(getStoredTheme());
  const [cart, setCart] = useState<CartItem[]>(getStoredCart());

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuth({
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || session.user.email!.split('@')[0],
            role: session.user.user_metadata.role || UserRole.USER,
            createdAt: session.user.created_at
          }
        });
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth({
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.full_name || session.user.email!.split('@')[0],
            role: session.user.user_metadata.role || UserRole.USER,
            createdAt: session.user.created_at
          }
        });
      } else {
        setAuth({ user: null, isAuthenticated: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    const newCart = existing 
      ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }];
    setCart(newCart);
    saveCart(newCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const newCart = cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item);
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    saveCart(newCart);
  };

  const toggleCurrency = (currency: Currency) => {
    const newTheme = { ...theme, currency };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme.isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        <Navbar 
          user={auth.user} 
          onLogout={handleLogout} 
          siteName={theme.siteName} 
          primaryColor={theme.primaryColor} 
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
          currency={theme.currency}
          onCurrencyChange={toggleCurrency}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home primaryColor={theme.primaryColor} />} />
            <Route path="/products" element={<Products primaryColor={theme.primaryColor} onAddToCart={addToCart} currency={theme.currency} />} />
            <Route path="/cart" element={<Cart items={cart} onRemove={removeFromCart} onUpdate={updateQuantity} primaryColor={theme.primaryColor} currency={theme.currency} />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register setAuth={setAuth} />} />
            <Route path="/contact" element={<Contact primaryColor={theme.primaryColor} />} />
            <Route path="/privacy" element={<Privacy />} />
            
            <Route 
              path="/dashboard" 
              element={auth.isAuthenticated ? <Dashboard user={auth.user!} /> : <Navigate to="/login" />} 
            />

            <Route 
              path="/file-share" 
              element={auth.isAuthenticated ? <FileShare user={auth.user!} primaryColor={theme.primaryColor} /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/admin" 
              element={auth.isAuthenticated && auth.user?.role === UserRole.ADMIN ? (
                <AdminDashboard user={auth.user!} theme={theme} setTheme={setTheme} primaryColor={theme.primaryColor} />
              ) : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer siteName={theme.siteName} />
      </div>
    </Router>
  );
};

export default App;