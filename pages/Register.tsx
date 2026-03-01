import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, AuthState } from '../types';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Register: React.FC<{ setAuth: (a: AuthState) => void }> = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      try {
        await updateProfile(user, { displayName: name });
      } catch (e) {
        console.error("Error updating profile", e);
      }

      await sendEmailVerification(user);
      setVerificationSent(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('User already exists. Please sign in');
      } else {
        setError(err.message || 'Provisioning sequence failed. Check network link.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      const userRole = user.email === 'info.devbady@gmail.com' ? UserRole.ADMIN : UserRole.USER;
      
      setAuth({ 
        isAuthenticated: true, 
        user: { 
          id: user.uid, 
          email: user.email!, 
          name: user.displayName || user.email!.split('@')[0], 
          role: userRole, 
          createdAt: user.metadata.creationTime || new Date().toISOString()
        } 
      });

      if (userRole === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative text-center">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-4 text-white uppercase italic">IDENTITY PENDING</h2>
          <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed">
            We have sent you a verification email to <span className="text-white font-bold">{email}</span>. Please verify it and log in.
          </p>
          <Link to="/login" className="block w-full py-4 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
            Login
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
        
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 bg-[#0a0a0a] border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

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