import React, { useState, useEffect } from 'react';
import { Product, Currency } from '../types';
import { getStoredProducts } from '../store';

const EXCHANGE_RATE = 83.5;

const Products: React.FC<{ primaryColor: string, onAddToCart: (p: Product) => void, currency: Currency }> = ({ primaryColor, onAddToCart, currency }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => { setProducts(getStoredProducts()); }, []);

  const formatPrice = (p: number) => {
    if (currency === Currency.INR) return `₹${(p * EXCHANGE_RATE).toLocaleString()}`;
    return `$${p.toFixed(2)}`;
  };

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Coding Bases</h1>
          <p className="text-slate-500">Premium resources for rapid development.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Templates', 'Backend', 'Tools'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${filter === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 overflow-hidden">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
            </div>
            <div className="p-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">{p.category}</span>
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{p.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-slate-900">{formatPrice(p.price)}</span>
                <button onClick={() => onAddToCart(p)} className="p-3 rounded-xl text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
