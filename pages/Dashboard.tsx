import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl text-white font-black">
            {user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
            <p className="text-slate-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Member Since</h3>
            <p className="font-bold text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Account Role</h3>
            <p className="font-bold text-slate-800">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-black mb-6">Your Purchased Assets</h2>
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 py-12 text-center rounded-3xl">
               <p className="text-slate-400 font-bold mb-4">No active subscriptions found.</p>
               <Link to="/products" className="text-blue-600 font-black text-sm uppercase hover:underline">Visit Marketplace</Link>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-black mb-6">Developer Utilities</h2>
            <Link to="/file-share" className="group block bg-blue-600 p-8 rounded-3xl text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
              <h3 className="text-lg font-black mb-1">Secure File Share</h3>
              <p className="text-blue-100 text-xs font-medium">Upload project files directly to devbady cloud.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;