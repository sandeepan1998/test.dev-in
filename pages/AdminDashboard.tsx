import React, { useState } from 'react';
import { User, Product, ThemeConfig } from '../types';
import { saveProducts, getStoredProducts, saveTheme } from '../store';

const AdminDashboard: React.FC<{ user: User, theme: ThemeConfig, setTheme: (t: ThemeConfig) => void, primaryColor: string }> = ({ theme, setTheme, primaryColor }) => {
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState<Partial<Product>>({ name: '', price: 0, category: 'Templates', description: '', image: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newP = { ...form, id: Date.now().toString() } as Product;
    const updated = [...products, newP];
    setProducts(updated);
    saveProducts(updated);
    setMsg('Resource published successfully!');
    setForm({ name: '', price: 0, category: 'Templates', description: '', image: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-10">Control Center</h1>
      
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-black mb-6">Publish New Coding Base</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input required placeholder="Asset Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <div className="flex gap-4">
              <input required type="number" placeholder="Price (USD)" className="flex-1 px-4 py-3 bg-slate-50 rounded-xl" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} />
              <select className="flex-1 px-4 py-3 bg-slate-50 rounded-xl" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option>Templates</option><option>Backend</option><option>Tools</option>
              </select>
            </div>
            <textarea placeholder="Description" className="w-full px-4 py-3 bg-slate-50 rounded-xl" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <input placeholder="Image URL" className="w-full px-4 py-3 bg-slate-50 rounded-xl" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            <button type="submit" className="w-full py-4 text-white font-black rounded-xl" style={{ backgroundColor: primaryColor }}>Deploy Asset</button>
          </form>
          {msg && <div className="mt-4 text-green-600 font-bold text-center">✓ {msg}</div>}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-xl font-black mb-6">Platform Branding</h2>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">Primary Color</label>
              <input type="color" className="w-full h-12 rounded-lg cursor-pointer" value={theme.primaryColor} onChange={e => {
                const nt = {...theme, primaryColor: e.target.value};
                setTheme(nt);
                saveTheme(nt);
              }} />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">Site Name</label>
              <input className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700" value={theme.siteName} onChange={e => {
                const nt = {...theme, siteName: e.target.value};
                setTheme(nt);
                saveTheme(nt);
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
