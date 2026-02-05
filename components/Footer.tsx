
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC<{ siteName: string }> = ({ siteName }) => {
  return (
    <footer className="bg-slate-950 text-white mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black mb-4 flex items-center">
              <span className="bg-blue-600 w-2 h-8 mr-3 rounded-full"></span>
              {siteName}
            </h3>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Premium coding base for developers and enterprise clients. Build, scale, and innovate with clodecode resources.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><a href="https://devbady.in/#/products" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Products</a></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Support</Link></li>
              {/* Privacy Policy redirects to devbady.in as per request */}
              <li><a href="https://devbady.in/#/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-slate-100 uppercase tracking-widest text-xs">Auth</h4>
            <div className="flex flex-col space-y-3 text-slate-400">
              <Link to="/login" className="hover:text-white transition-colors">Client Login</Link>
              <Link to="/login" className="hover:text-white transition-colors">User Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register Now</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-12 pt-8 text-center text-slate-500 text-sm">
          <div className="flex justify-center space-x-6 mb-4">
             <span className="hover:text-slate-300 cursor-pointer">Twitter</span>
             <span className="hover:text-slate-300 cursor-pointer">GitHub</span>
             <span className="hover:text-slate-300 cursor-pointer">LinkedIn</span>
          </div>
          © {new Date().getFullYear()} {siteName}. All rights reserved. Managed by DevBady.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
