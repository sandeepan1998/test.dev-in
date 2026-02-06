import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';

const Register: React.FC<{ setAuth: (a: AuthState) => void }> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth({ isAuthenticated: true, user: { id: 'new', email, name, role: UserRole.USER, createdAt: new Date().toISOString() } });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-32 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black mb-2">Join ClodeCode</h2>
        <p className="text-slate-500 mb-8 font-medium">Start building with enterprise bases.</p>
        <form onSubmit={handleRegister} className="space-y-5">
          <input required placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none" value={name} onChange={e => setName(e.target.value)} />
          <input required placeholder="Email Address" type="email" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none" value={email} onChange={e => setEmail(e.target.value)} />
          <input required placeholder="Create Password" type="password" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none" />
          <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Create Account</button>
        </form>
        <div className="mt-8 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          Already a member? <Link to="/login" className="text-blue-600">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
