
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
    <div className="bg-[#000000] min-h-screen text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 border-b border-white/10 pb-12">
          <div className="flex-grow max-w-2xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#ed1c24] mb-3">Enterprise Inventory</div>
            <h1 className="text-6xl font-black tracking-tighter mb-8">CODING BASES</h1>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Find resources: React, Node, SQL..."
                className="w-full bg-white/5 border border-white/10 px-6 py-5 outline-none focus:border-white transition-all text-lg font-medium tracking-tight"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {['All', 'Templates', 'Backend', 'Tools'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)} 
                className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/10 border border-white/10">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#000000] p-10 group hover:bg-[#0a0a0a] transition-all">
              <div className="aspect-video overflow-hidden mb-10 grayscale group-hover:grayscale-0 transition-all duration-700 relative">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-white/10">{p.category}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight">{p.name}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed h-12 line-clamp-2">{p.description}</p>
                
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                  <span className="text-2xl font-black">{formatPrice(p.price)}</span>
                  <button 
                    onClick={() => onAddToCart(p)} 
                    className="px-6 py-3 bg-[#ed1c24] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-125 active:scale-95 transition-all shadow-lg shadow-red-600/20"
                  >
                    Add to System
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-40 text-center text-gray-600 font-black uppercase tracking-widest text-sm italic bg-[#000000]">
              No matching tech components found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
