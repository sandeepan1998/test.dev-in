import React from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole, Currency } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  siteName: string;
  primaryColor: string;
  cartCount: number;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, siteName, primaryColor, cartCount, currency, onCurrencyChange }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-black flex items-center tracking-tighter" style={{ color: primaryColor }}>
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            {siteName}
          </Link>

          {!user && (
            <Link to="/register" className="hidden lg:block px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: primaryColor }}>
              Join devbady.in
            </Link>
          )}

          <div className="hidden md:flex gap-1 ml-4">
            <Link to="/" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-bold text-sm">Home</Link>
            <Link to="/products" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-bold text-sm">Products</Link>
            <Link to="/contact" className="px-3 py-2 text-slate-600 hover:text-blue-600 font-bold text-sm">Support</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg text-[10px] font-black">
            <button onClick={() => onCurrencyChange(Currency.USD)} className={`px-2 py-1 rounded ${currency === Currency.USD ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>USD</button>
            <button onClick={() => onCurrencyChange(Currency.INR)} className={`px-2 py-1 rounded ${currency === Currency.INR ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>INR</button>
          </div>

          <Link to="/cart" className="relative p-2 text-slate-500 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="text-sm font-bold text-slate-700">{user.name}</Link>
              <button onClick={onLogout} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;