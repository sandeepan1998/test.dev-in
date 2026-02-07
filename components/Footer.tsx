import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC<{ siteName: string }> = ({ siteName }) => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-black mb-4">{siteName}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Providing high-quality coding bases and architectural patterns for modern developers. Scale faster with devbady.in ecosystem.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-slate-200 mb-2 uppercase text-xs tracking-widest">Platform</h4>
          <Link to="/products" className="text-slate-400 hover:text-white text-sm">Marketplace</Link>
          <Link to="/contact" className="text-slate-400 hover:text-white text-sm">Technical Support</Link>
          <Link to="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy Policy</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-slate-200 mb-2 uppercase text-xs tracking-widest">Company</h4>
          <span className="text-slate-400 text-sm">© {new Date().getFullYear()} devbady.in.</span>
          <span className="text-slate-400 text-sm italic">Engineered for coding excellence.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;