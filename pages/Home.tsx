
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  return (
    <div className="relative">
      {/* Abstract Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-50 rounded-bl-full opacity-50 blur-3xl"></div>
      
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
                v2.0 Coding Base is Live
              </span>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                The Best Base for <span style={{ color: primaryColor }}>Cloud Code.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                Empowering developers with production-ready architecture, clean codebases, and premium client support at <b>clodecode.in</b>.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://devbady.in/#/products" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 rounded-2xl text-lg font-black text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-1 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Explore Products
                </a>
                <Link 
                  to="/register" 
                  className="px-10 py-5 rounded-2xl text-lg font-black bg-white text-slate-900 border-2 border-slate-100 shadow-sm hover:border-blue-100 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Join Today
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
               <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 rotate-2 transform hover:rotate-0 transition-transform duration-500">
                  <div className="flex space-x-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <pre className="text-blue-300 font-mono text-sm leading-relaxed">
                    <code>{`// Initialize ClodeCode Base
const app = new ClodeCode({
  domain: 'clodecode.in',
  security: true,
  theme: 'modern-dark'
});

app.deploy().then(() => {
  console.log('Build Successful!');
});`}</code>
                  </pre>
               </div>
               <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-blue-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                  <div>
                    <p className="font-bold text-slate-900">99.9% Uptime</p>
                    <p className="text-xs text-slate-500">Global Distribution</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Developers', val: '10k+' },
              { label: 'Active Projects', val: '450+' },
              { label: 'Code Snippets', val: '1.2m' },
              { label: 'Client Rating', val: '4.9/5' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-slate-400 font-medium text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Why Choose ClodeCode?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Modern infrastructure for modern development needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Clean Code Standards', 
                desc: 'Every template is peer-reviewed for performance and readability.',
                icon: '✨'
              },
              { 
                title: 'Client-Centric Portal', 
                desc: 'Dedicated login for clients to track project progress in real-time.',
                icon: '💼'
              },
              { 
                title: 'Secure by Design', 
                desc: 'Hardened security protocols out of the box for every project.',
                icon: '🛡️'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
