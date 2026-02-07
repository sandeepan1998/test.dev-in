
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
      setError('Invalid system credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-20 bg-[#ed1c24]"></div>
        <h2 className="text-4xl font-black tracking-tighter mb-2 text-white">SYSTEM ACCESS</h2>
        <p className="text-gray-500 text-sm font-medium mb-10 uppercase tracking-widest">devbady.in Secure Node</p>
        
        {error && (
          <div className="mb-8 p-4 bg-red-600/10 text-[#ed1c24] border border-red-600/20 text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">User Identity</label>
            <input 
              required 
              type="email" 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encrypted Key</label>
            <input 
              required 
              type="password" 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl">Authenticate</button>
        </form>
        <div className="mt-10 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
          No ID? <Link to="/register" className="text-[#ed1c24] hover:underline">Provision New Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
