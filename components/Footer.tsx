
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC<{ siteName: string }> = ({ siteName }) => {
  return (
    <footer className="bg-slate-950 text-white mt-24 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black mb-6 flex items-center">
              <span className="bg-blue-600 w-2.5 h-10 mr-4 rounded-full shadow-lg shadow-blue-500/50"></span>
              {siteName}
            </h3>
            <p className="text-slate-400 max-w-sm leading-relaxed font-medium">
              The premier coding base for developers who value performance, scalability, and clean architecture. Managed by <b>DevBady</b>.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-6 text-slate-100 uppercase tracking-widest text-xs opacity-50">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home Base</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors">Marketplace</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Technical Support</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy & Legal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-slate-100 uppercase tracking-widest text-xs opacity-50">Community</h4>
            <div className="flex flex-col space-y-4 text-slate-400 font-bold">
              <Link to="/login" className="hover:text-blue-400 transition-colors">Member Login</Link>
              <Link to="/register" className="hover:text-blue-400 transition-colors">Sign Up</Link>
              <a href="https://github.com/devbady" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">Open Source</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-16 pt-10 text-center text-slate-500 text-sm font-medium">
          <div className="flex justify-center space-x-8 mb-6">
             <span className="hover:text-blue-400 transition-all cursor-pointer">Twitter / X</span>
             <span className="hover:text-blue-400 transition-all cursor-pointer">GitHub Repository</span>
             <span className="hover:text-blue-400 transition-all cursor-pointer">Discord Community</span>
          </div>
          <p>© {new Date().getFullYear()} {siteName}. Engineered for excellence by DevBady.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
