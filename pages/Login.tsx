
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
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 mt-2">Welcome back to devbady.in</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {(['USER', 'CLIENT'] as const).map(r => (
              <label key={r} className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  className="hidden peer" 
                  checked={role === r}
                  onChange={() => setRole(r as UserRole)}
                />
                <div className="py-2 text-center rounded-lg border text-sm font-semibold text-gray-400 peer-checked:bg-blue-50 peer-checked:text-blue-600 peer-checked:border-blue-200 transition-all">
                  As {r}
                </div>
              </label>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register first</Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
           <p className="text-[10px] text-gray-400">Admin credentials required for management access.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
