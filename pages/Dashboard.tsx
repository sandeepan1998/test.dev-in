import React from 'react';
import { User } from '../types';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl text-white font-black">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
            <p className="text-slate-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Member Since</h3>
            <p className="font-bold text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Account Role</h3>
            <p className="font-bold text-slate-800">{user.role}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-black mb-6">Your Purchased Assets</h2>
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 py-12 text-center rounded-3xl">
             <p className="text-slate-400 font-bold">No active subscriptions or assets found.</p>
             <button className="mt-4 text-blue-600 font-black text-sm uppercase">Visit Marketplace</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
