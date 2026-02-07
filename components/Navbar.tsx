import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#000000]/90 backdrop-blur-xl text-white border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black flex items-center tracking-tighter hover:opacity-80 transition-opacity">
            <span className="bg-white text-black px-1.5 mr-1 text-xl">DEV</span>
            <span style={{ color: primaryColor }}>BADY</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${location.pathname === '/' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-[11px] font-black uppercase tracking-widest transition-all ${location.pathname === '/products' ? 'text-white border-b-2 border-white pb-1' : 'text-gray-500 hover:text-white'}`}
            >
              Resources
            </Link>
            <Link 
              to="/contact" 
              className={`text-[11px] font-black uppercase tracking-widest transition-all ${location.pathname === '/contact' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Expert Support
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex bg-white/5 p-1 rounded-sm text-[9px] font-black border border-white/10">
            <button onClick={() => onCurrencyChange(Currency.USD)} className={`px-2 py-0.5 rounded-sm transition-all ${currency === Currency.USD ? 'bg-white text-black' : 'text-gray-400'}`}>USD</button>
            <button onClick={() => onCurrencyChange(Currency.INR)} className={`px-2 py-0.5 rounded-sm transition-all ${currency === Currency.INR ? 'bg-white text-black' : 'text-gray-400'}`}>INR</button>
          </div>

          <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-[#ed1c24] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-black">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="flex items-center gap-5 border-l border-white/10 pl-6">
              <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="group flex items-center gap-3">
                <div className="w-8 h-8 bg-[#111] border border-white/20 rounded-sm flex items-center justify-center text-[10px] font-black group-hover:border-[#ed1c24] transition-all">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">{user.name}</span>
              </Link>
              <button 
                onClick={onLogout} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ed1c24] hover:brightness-125 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all shadow-lg active:scale-95"
            >
              Access System
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;