import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';

const Login: React.FC<{ setAuth: (a: AuthState) => void }> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'info.clodecode@gmail.com' && pass === 'Tithi12@#') {
      setAuth({ isAuthenticated: true, user: { id: 'admin', email, name: 'Admin Master', role: UserRole.ADMIN, createdAt: new Date().toISOString() } });
      navigate('/admin');
    } else {
      setAuth({ isAuthenticated: true, user: { id: 'user', email, name: 'ClodeCode Dev', role: UserRole.USER, createdAt: new Date().toISOString() } });
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-32 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black mb-2">Access Portal</h2>
        <p className="text-slate-500 mb-8 font-medium">Welcome back to the ecosystem.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input required placeholder="Email Address" type="email" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none" value={email} onChange={e => setEmail(e.target.value)} />
          <input required placeholder="Secure Password" type="password" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none" value={pass} onChange={e => setPass(e.target.value)} />
          <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">Authenticate</button>
        </form>
        <div className="mt-8 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          New here? <Link to="/register" className="text-blue-600">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
