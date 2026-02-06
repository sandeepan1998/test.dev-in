
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  siteName: string;
  primaryColor: string;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, siteName, primaryColor, cartCount }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black flex items-center tracking-tighter" style={{ color: primaryColor }}>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {siteName}
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </Link>
              <Link to="/products" className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold">Products</Link>
              <Link to="/contact" className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold">Support</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link 
                  to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} 
                  className="text-slate-700 hover:text-blue-600 font-black text-sm px-4 py-2 bg-slate-50 rounded-xl transition-colors"
                >
                  {user.role === UserRole.ADMIN ? "Admin Console" : "My Dashboard"}
                </Link>
                <button 
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors text-sm font-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-bold px-4 py-2">Login</Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 rounded-2xl text-white font-black transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Join DevBady
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
