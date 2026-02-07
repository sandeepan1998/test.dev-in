
import React, { useState, useEffect } from 'react';
import { Product, Currency } from '../types';
import { getStoredProducts } from '../store';

const EXCHANGE_RATE = 83.5;

const Products: React.FC<{ primaryColor: string, onAddToCart: (p: Product) => void, currency: Currency }> = ({ primaryColor, onAddToCart, currency }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setProducts(getStoredProducts()); }, []);

  const formatPrice = (p: number) => {
    if (currency === Currency.INR) return `₹${(p * EXCHANGE_RATE).toLocaleString()}`;
    return `$${p.toFixed(2)}`;
  };

  const filtered = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="flex-grow max-w-xl">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Coding Bases</h1>
          <p className="text-slate-500 mb-6">Premium resources for rapid development.</p>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Search coding bases (e.g. React, NodeJS, API)..."
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-medium shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Templates', 'Backend', 'Tools'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-48 overflow-hidden relative">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600/90 backdrop-blur px-3 py-1 rounded-full">{p.category}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-slate-900">{p.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">{p.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-2xl font-black text-slate-900">{formatPrice(p.price)}</span>
                <button 
                  onClick={() => onAddToCart(p)} 
                  className="p-3.5 rounded-xl text-white shadow-lg transform active:scale-90 transition-all hover:brightness-110" 
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fixed: Added missing default export
export default Products;
