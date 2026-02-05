
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  siteName: string;
  primaryColor: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, siteName, primaryColor }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold flex items-center" style={{ color: primaryColor }}>
              <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {siteName}
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">Products</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Support</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <button 
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
