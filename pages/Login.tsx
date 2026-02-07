import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';
import { supabase } from '../supabase';

const Login: React.FC<{ setAuth: (a: AuthState) => void }> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (authError) throw authError;

      if (data.user) {
        const metadata = data.user.user_metadata;
        const userRole = metadata.role || (email === 'info.devbady@gmail.com' ? UserRole.ADMIN : UserRole.USER);
        
        setAuth({ 
          isAuthenticated: true, 
          user: { 
            id: data.user.id, 
            email: data.user.email!, 
            name: metadata.full_name || email.split('@')[0], 
            role: userRole, 
            createdAt: data.user.created_at
          } 
        });

        // Redirect based on privilege level
        if (userRole === UserRole.ADMIN) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid system credentials. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-20 bg-[#ed1c24]"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
        </div>

        <h2 className="text-4xl font-black tracking-tighter mb-2 text-white italic">SYSTEM ACCESS</h2>
        <p className="text-gray-500 text-[10px] font-black mb-10 uppercase tracking-[0.3em]">Authorized Entry Only</p>
        
        {error && (
          <div className="mb-8 p-4 bg-red-600/10 text-[#ed1c24] border border-red-600/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
            PROTOCOL ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">User Identity</label>
            <input 
              required 
              type="email" 
              placeholder="identity@enterprise.com"
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700 disabled:opacity-50" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encrypted Key</label>
            <input 
              required 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700 disabled:opacity-50" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed italic"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Authenticate Identity'}
          </button>
        </form>
        
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">New to the devbady ecosystem?</p>
          <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24] hover:underline decoration-2">
            Provision New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;