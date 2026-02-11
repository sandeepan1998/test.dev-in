import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-48">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-20 border-b border-white/10 pb-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-white text-black flex items-center justify-center text-4xl font-black">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-[#ed1c24] mb-3">Provisioned Identity</div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">{user.name}</h1>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-[#111111] border border-white/10 p-4 text-right">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-500 uppercase">Authenticated</p>
             </div>
             <div className="bg-[#111111] border border-white/10 p-4 text-right">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Joined</p>
                <p className="text-xs font-bold text-white uppercase">{new Date(user.createdAt).toLocaleDateString()}</p>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-1px bg-white/10 border border-white/10">
          <div className="lg:col-span-2 bg-black p-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-10">Deployed Coding Bases</h2>
            <div className="border border-dashed border-white/10 py-32 text-center">
               <p className="text-gray-700 font-black uppercase text-xs tracking-[0.3em] mb-8 italic">No active deployments detected in local cache.</p>
               <Link to="/products" className="px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all">Explore Marketplace</Link>
            </div>
          </div>
          
          <div className="bg-[#080808] p-12 space-y-12">
            <div>
              <h3 className="text-xl font-black tracking-tighter uppercase mb-8">System Utilities</h3>
              <div className="grid gap-4">
                <Link to="/ai-studio" className="group block bg-[#111111] border border-white/10 p-10 hover:border-[#ed1c24] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[#ed1c24]/20 group-hover:text-[#ed1c24] transition-colors">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-lg font-black tracking-tighter uppercase mb-2">AI STUDIO</h4>
                  <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">Neural resource generation agent.</p>
                  <div className="mt-8 text-[9px] font-black text-[#ed1c24] uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                     Access Studio &rarr;
                  </div>
                </Link>

                <Link to="/file-share" className="group block bg-[#111111] border border-white/10 p-10 hover:border-[#ed1c24] transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[#ed1c24]/20 group-hover:text-[#ed1c24] transition-colors">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h4 className="text-lg font-black tracking-tighter uppercase mb-2">FILE SHARING</h4>
                  <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">High-throughput asset distribution node.</p>
                  <div className="mt-8 text-[9px] font-black text-[#ed1c24] uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                     Access Utility &rarr;
                  </div>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tighter uppercase mb-8">Account Meta</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Role</span>
                    <span className="text-xs font-bold text-white uppercase">{user.role}</span>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sync Quota</span>
                    <span className="text-xs font-bold text-white uppercase">Unlimited</span>
                 </div>
                 <div className="flex justify-between items-center py-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Node ID</span>
                    <span className="text-[10px] font-mono text-gray-600 uppercase">{user.id}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;