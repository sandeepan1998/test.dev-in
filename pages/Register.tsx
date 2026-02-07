import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';
import { supabase } from '../supabase';

const Register: React.FC<{ setAuth: (a: AuthState) => void }> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Trigger Supabase Sign Up
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: UserRole.USER
          }
        }
      });

      if (authError) throw authError;

      // 2. Handle based on confirmation settings
      if (data.user && data.session) {
        // Immediate login (Confirmation disabled)
        setAuth({ 
          isAuthenticated: true, 
          user: { 
            id: data.user.id, 
            email: data.user.email!, 
            name: name, 
            role: UserRole.USER, 
            createdAt: data.user.created_at 
          } 
        });
        navigate('/dashboard');
      } else if (data.user) {
        // Confirmation required
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Provisioning sequence failed. Check network link.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative text-center">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-4 text-white uppercase italic">IDENTITY PENDING</h2>
          <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed">
            A verification link has been dispatched to <span className="text-white font-bold">{email}</span>. Please authorize your entry into the <span className="text-[#ed1c24] font-bold">devbady</span> network.
          </p>
          <Link to="/login" className="block w-full py-4 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
            Return to Terminal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-20 bg-[#ed1c24]"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
        </div>
        
        <h2 className="text-4xl font-black tracking-tighter mb-2 text-white italic">PROVISION ID</h2>
        <p className="text-gray-500 text-[10px] font-black mb-10 uppercase tracking-[0.3em]">Initialize Enterprise Node</p>

        {error && (
          <div className="mb-8 p-4 bg-red-600/10 text-[#ed1c24] border border-red-600/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
            SECURITY ALERT: {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Name (Unique Identity)</label>
            <input 
              required 
              placeholder="Deployer Name" 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email Endpoint</label>
            <input 
              required 
              placeholder="identity@enterprise.com" 
              type="email" 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Key</label>
            <input 
              required 
              placeholder="••••••••" 
              type="password" 
              className="w-full bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-[#ed1c24] text-white transition-all font-medium placeholder:text-gray-700" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed italic"
            disabled={loading}
          >
            {loading ? 'Initializing...' : 'Deploy Identity Node'}
          </button>
        </form>
        
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Existing credentials detected?</p>
          <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24] hover:underline decoration-2">
            Access System Terminal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;