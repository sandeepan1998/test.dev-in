
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';

interface LoginProps {
  setAuth: (auth: AuthState) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check Hardcoded Admin Credentials
    if (email === 'info.devbady@gmail.com' && password === 'Tithi12@#') {
      const adminUser = {
        id: 'admin-0',
        email,
        name: 'Super Admin',
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString()
      };
      setAuth({ user: adminUser, isAuthenticated: true });
      navigate('/admin');
      return;
    }

    // Generic Mock Login for other roles
    if (password.length >= 6) {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: role,
        createdAt: new Date().toISOString()
      };
      setAuth({ user, isAuthenticated: true });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials or password too short.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.708 0 3.29.426 4.672 1.178m0 0a9.96 9.96 0 013.253 7.932m-8.925-4.446c.43.315.823.684 1.173 1.103m-2.115-2.53l.102.083a2.96 2.96 0 01.357.342m1.653 7.615c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a10.003 10.003 0 012.353-3.61m8.925 4.446a10.007 10.007 0 01-2.753 3.571"/></svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">Log in to your <b>clodecode.in</b> account</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-semibold"
              placeholder="alex@clodecode.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-semibold"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Login Identity</p>
            <div className="flex gap-4">
              {(['USER', 'CLIENT'] as const).map(r => (
                <label key={r} className="flex-1 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="role" 
                    className="hidden peer" 
                    checked={role === r}
                    onChange={() => setRole(r as UserRole)}
                  />
                  <div className="py-3 text-center rounded-2xl border-2 border-slate-50 text-sm font-black text-slate-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-200 transition-all group-hover:border-slate-200">
                    {r}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all mt-4"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-bold text-slate-500">
          New here? <Link to="/register" className="text-blue-600 hover:underline">Register first</Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
           <p className="text-[10px] text-slate-300 font-black uppercase tracking-tighter">Enterprise Encryption Active</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
