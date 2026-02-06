
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
import { AuthState, UserRole, ThemeConfig } from './types';
import { getStoredTheme } from './store';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const [theme, setTheme] = useState<ThemeConfig>(getStoredTheme());

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  // Sync theme changes to CSS variables if needed, or just pass as props
  useEffect(() => {
    document.title = theme.siteName;
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${theme.isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        <Navbar 
          user={auth.user} 
          onLogout={handleLogout} 
          siteName={theme.siteName} 
          primaryColor={theme.primaryColor} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home primaryColor={theme.primaryColor} />} />
            <Route path="/products" element={<Products user={auth.user} primaryColor={theme.primaryColor} />} />
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
          </Routes>
        </main>

        <Footer siteName={theme.siteName} />
      </div>
    </Router>
  );
};

export default App;
