
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
    <nav className="sticky top-0 z-50 bg-[#000000] text-white border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black flex items-center tracking-tighter hover:opacity-80 transition-opacity">
            <span className="bg-white text-black px-1 mr-1">dev</span>
            <span style={{ color: primaryColor }}>bady</span>
          </Link>

          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Home</Link>
            <Link to="/products" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Products</Link>
            <Link to="/contact" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">Support</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-white/5 p-1 rounded-sm text-[9px] font-black border border-white/10">
            <button onClick={() => onCurrencyChange(Currency.USD)} className={`px-2 py-0.5 rounded-sm transition-all ${currency === Currency.USD ? 'bg-white text-black' : 'text-gray-400'}`}>USD</button>
            <button onClick={() => onCurrencyChange(Currency.INR)} className={`px-2 py-0.5 rounded-sm transition-all ${currency === Currency.INR ? 'bg-white text-black' : 'text-gray-400'}`}>INR</button>
          </div>

          <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#ed1c24] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="text-[11px] font-black uppercase tracking-widest text-gray-300 hover:text-white transition-colors">{user.name}</Link>
              <button onClick={onLogout} className="text-[11px] font-black uppercase tracking-widest text-[#ed1c24] hover:underline">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-[11px] font-black uppercase tracking-widest hover:text-gray-300 transition-colors">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
