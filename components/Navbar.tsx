import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-600">
              <Tent className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-slate-900">Poper</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Services</Link>
            <Link to="/planner" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Planner</Link>
            <Link to="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Contact</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/services" className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">Services</Link>
            <Link to="/planner" className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">Planner</Link>
            <Link to="/contact" className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">Contact</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <button onClick={onLogout} className="block w-full text-left px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-indigo-600 font-medium hover:bg-slate-50 rounded-md">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
