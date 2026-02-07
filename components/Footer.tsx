
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC<{ siteName: string }> = ({ siteName }) => {
  return (
    <footer className="bg-[#000000] text-white py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="md:col-span-2">
          <h3 className="text-3xl font-black tracking-tighter mb-6 flex items-center">
            <span className="bg-white text-black px-1 mr-1">dev</span>
            <span>bady</span>
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm mb-8">
            Powering the next decade of enterprise scalability. devbady.in is the definitive engine for high-throughput software architecture.
          </p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer">𝕏</div>
             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer">in</div>
             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all cursor-pointer">gh</div>
          </div>
        </div>
        <div>
          <h4 className="font-black text-[11px] uppercase tracking-widest text-gray-400 mb-8">Platform</h4>
          <div className="flex flex-col gap-4">
            <Link to="/products" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Resource Store</Link>
            <Link to="/contact" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Technical Ops</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Trust Center</Link>
          </div>
        </div>
        <div>
          <h4 className="font-black text-[11px] uppercase tracking-widest text-gray-400 mb-8">Legal</h4>
          <div className="flex flex-col gap-4 text-gray-500 text-xs font-bold">
            <span>© {new Date().getFullYear()} devbady.in</span>
            <span>All Rights Reserved.</span>
            <span className="text-[#ed1c24] italic">Precision Engineered.</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5">
        <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">all right received 2026.</p>
      </div>
    </footer>
  );
};

export default Footer;
