import React, { useState, useEffect } from 'react';
import { Product, User, UserRole } from '../types';
import { getStoredProducts, saveProducts } from '../store';

interface ProductsProps {
  user: User | null;
  primaryColor: string;
}

const Products: React.FC<ProductsProps> = ({ user, primaryColor }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  const handleDelete = (id: string) => {
    if (user?.role !== UserRole.ADMIN) return;
    if (!window.confirm("Are you sure you want to remove this product from the coding base? This action is permanent.")) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-3 text-slate-900">Coding Base Marketplace</h1>
          <p className="text-slate-500 font-medium">Enterprise-grade resources for modern developers.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === cat 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative">
            {user?.role === UserRole.ADMIN && (
              <button 
                onClick={() => handleDelete(product.id)}
                className="absolute top-4 left-4 z-20 bg-red-500 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-600 active:scale-90"
                title="Admin: Delete Product"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            
            <div className="h-56 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-2xl text-sm font-black shadow-xl text-slate-900 border border-white/20">
                ${product.price}
              </div>
            </div>
            <div className="p-8">
              <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
                {product.category}
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-900 leading-tight">{product.name}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2 min-h-[3rem]">
                {product.description}
              </p>
              <button 
                className="w-full py-4 rounded-2xl text-white font-black shadow-xl shadow-blue-500/20 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
                onClick={() => alert(`Redirecting to checkout for ${product.name}...`)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                License Resource
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="text-6xl mb-6 opacity-30">📦</div>
          <p className="text-slate-400 font-bold text-xl">Our coding base is currently expanding.</p>
          <p className="text-slate-300">Check back soon for new enterprise templates.</p>
        </div>
      )}
    </div>
  );
};

export default Products;