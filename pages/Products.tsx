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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-1