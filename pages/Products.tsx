
import React, { useState, useEffect } from 'react';
import { Product, User, UserRole } from '../types';
import { getStoredProducts } from '../store';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-500">Premium coding resources at your fingertips.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === cat 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                ${product.price}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                {product.category}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                {product.description}
              </p>
              <button 
                className="w-full py-3 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                Get Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
