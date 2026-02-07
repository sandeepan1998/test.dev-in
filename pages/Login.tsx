import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';

const Login: React.FC<{ setAuth: (a: AuthState) => void }> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin Credentials
    if (email === 'info.devbady@gmail.com' && pass === 'Tithi12@') {
      setAuth({ 
        isAuthenticated: true, 
        user: { 
          id: 'admin-001', 
          email, 
          name: 'DevBady Admin', 
          role: UserRole.ADMIN, 
          createdAt: new Date().toISOString() 
        } 
      });
      navigate('/admin');
    } else if (pass.length >= 6) {
      // Basic mock user login
      setAuth({ 
        isAuthenticated: true, 
        user: { 
          id: 'user-' + Math.random().toString(36).substr(2, 4), 
          email, 
          name: email.split('@')[0], 
          role: UserRole.USER, 
          createdAt: new Date().toISOString() 
        } 
      });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Password must be at least 6 characters.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-32 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black mb-2">Access Portal</h2>
        <p className="text-slate-500 mb-8 font-medium">Welcome back to the devbady.in ecosystem.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              required 
              placeholder="e.g. info.devbady@gmail.com" 
              type="email" 
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
            <input 
              required 
              placeholder="••••••••" 
              type="password" 
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98]">Authenticate</button>
        </form>
        <div className="mt-8 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          New here? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;