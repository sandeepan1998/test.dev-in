
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
import { AuthState, UserRole, ThemeConfig, CartItem, Product, Currency } from './types';
import { getStoredTheme, getStoredCart, saveCart, saveTheme } from './store';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    return { user: null, isAuthenticated: false };
  });

  const [theme, setTheme] = useState<ThemeConfig>(getStoredTheme());
  const [cart, setCart] = useState<CartItem[]>(getStoredCart());

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  useEffect(() => {
    document.title = theme.siteName;
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }, [theme]);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    saveCart(newCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const newCart = cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item);
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const toggleCurrency = (newCurrency: Currency) => {
    const updatedTheme = { ...theme, currency: newCurrency };
    setTheme(updatedTheme);
    saveTheme(updatedTheme);
  };

  const appClasses = theme.isDarkMode 
    ? 'bg-slate-950 text-white selection:bg-blue-500/30' 
    : 'bg-white text-slate-900 selection:bg-blue-100';

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${appClasses}`}>
        <Navbar 
          user={auth.user} 
          onLogout={handleLogout} 
          siteName={theme.siteName} 
          primaryColor={theme.primaryColor} 
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          currency={theme.currency}
          onCurrencyChange={toggleCurrency}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home primaryColor={theme.primaryColor} />} />
            <Route path="/products" element={<Products user={auth.user} primaryColor={theme.primaryColor} onAddToCart={addToCart} currency={theme.currency} />} />
            <Route path="/cart" element={<Cart items={cart} onRemove={removeFromCart} onUpdate={updateQuantity} onClear={clearCart} primaryColor={theme.primaryColor} currency={theme.currency} />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register setAuth={setAuth} />} />
            <Route path="/contact" element={<Contact primaryColor={theme.primaryColor} />} />
            <Route path="/privacy" element={<Privacy />} />
            
            <Route 
              path="/dashboard" 
              element={
                auth.isAuthenticated ? (
                  <Dashboard user={auth.user!} primaryColor={theme.primaryColor} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                auth.isAuthenticated && auth.user?.role === UserRole.ADMIN ? (
                  <AdminDashboard 
                    user={auth.user!} 
                    theme={theme} 
                    setTheme={setTheme} 
                    primaryColor={theme.primaryColor} 
                  />
                ) : (
                  <Navigate to="/login" />
                )
              } 
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
