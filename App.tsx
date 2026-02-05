
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { User, UserRole, ThemeConfig, AuthState } from './types';
import { getStoredTheme, getStoredProducts } from './store';

// Fixed: Moved ProtectedRoute outside of the App component to ensure TypeScript correctly identifies the 'children' prop 
// and to avoid unnecessary re-mounts on every App render.
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  isAuthenticated: boolean; 
  userRole?: UserRole; 
  role?: UserRole; 
}> = ({ children, isAuthenticated, userRole, role }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('devbady_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [theme, setTheme] = useState<ThemeConfig>(getStoredTheme());

  useEffect(() => {
    localStorage.setItem('devbady_auth', JSON.stringify(auth));
  }, [auth]);

  // Apply theme styles dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    if (theme.isDarkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f8fafc';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
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
            
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated} userRole={auth.user?.role}>
                <Dashboard user={auth.user!} primaryColor={theme.primaryColor} />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute 
                role={UserRole.ADMIN} 
                isAuthenticated={auth.isAuthenticated} 
                userRole={auth.user?.role}
              >
                <AdminDashboard 
                  user={auth.user!} 
                  theme={theme} 
                  setTheme={setTheme} 
                  primaryColor={theme.primaryColor} 
                />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer siteName={theme.siteName} />
      </div>
    </HashRouter>
  );
};

export default App;
