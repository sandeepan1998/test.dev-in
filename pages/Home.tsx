import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-50 rounded-bl-full opacity-30 blur-3xl"></div>
      
      <section className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
                Now Live: DevBady Ecosystem v2.5
              </span>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                Engineering the <span style={{ color: primaryColor }}>Modern Base.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
                The ultimate coding infrastructure for developers who build at scale. Clean, robust, and enterprise-ready templates on <b>devbady.in</b>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="px-10 py-5 rounded-2xl text-lg font-black text-white shadow-2xl hover:brightness-110 transition-all hover:-translate-y-1 active:scale-95 shadow-blue-500/20"
                  style={{ backgroundColor: primaryColor }}
                >
                  Browse Marketplace
                </Link>
                <Link 
                  to="/register" 
                  className="px-10 py-5 rounded-2xl text-lg font-black bg-white text-slate-900 border-2 border-slate-100 shadow-sm hover:border-blue-100 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Join Community
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
               <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 rotate-1 transform hover:rotate-0 transition-transform duration-700">
                  <div className="flex space-x-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <pre className="text-blue-200 font-mono text-base leading-relaxed overflow-x-hidden">
                    <code>{`// Connect to DevBady.in Base
import { Engine } from '@devbady/core';

const portal = new Engine({
  region: 'global',
  security: 'hardened'
});

portal.initialize().then(() => {
  console.log('System Operational!');
});`}</code>
                  </pre>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Engineers', val: '15k+' },
              { label: 'Enterprise Bases', val: '850+' },
              { label: 'Resource Assets', val: '2.4m' },
              { label: 'SLA Score', val: '99.9%' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;