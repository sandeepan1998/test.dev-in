
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';

interface RegisterProps {
  setAuth: (auth: AuthState) => void;
}

const Register: React.FC<RegisterProps> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    setAuth({ user: newUser, isAuthenticated: true });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Get Started</h2>
          <p className="text-slate-500 mt-2 font-medium">Join the <b>clodecode.in</b> coding community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-semibold"
              placeholder="Developer Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-semibold"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 outline-none focus:border-indigo-500 font-semibold"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-4 pt-2">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</p>
             <div className="flex gap-4">
              {(['USER', 'CLIENT'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as UserRole)}
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all font-black text-sm ${
                    role === r ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-50 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
             </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-slate-800 transition-all shadow-xl mt-4"
          >
            Create Base Account
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-bold text-slate-500">
          Already a member? <Link to="/login" className="text-indigo-600 hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
