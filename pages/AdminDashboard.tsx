import React, { useState, useEffect } from 'react';
import { User, Product, ThemeConfig } from '../types';
import { getStoredProducts, saveProducts, saveTheme, getStoredUsers } from '../store';

declare global {
  interface Window {
    JSZip: any;
    saveAs: any;
  }
}

interface AdminDashboardProps {
  user: User;
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  primaryColor: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, theme, setTheme, primaryColor }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'theme' | 'users' | 'system'>('products');
  const [isExporting, setIsExporting] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Templates',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400'
  });

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct as Product,
      id: Date.now().toString()
    };
    const updated = [...products, product];
    setProducts(updated);
    saveProducts(updated);
    setNewProduct({ name: '', description: '', price: 0, category: 'Templates', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400' });
    alert("Product added successfully!");
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Remove this product?")) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleExportToZip = async () => {
    if (!window.JSZip || !window.saveAs) {
      alert("System libraries (JSZip) are not ready. Please try in 5 seconds.");
      return;
    }

    setIsExporting(true);
    try {
      const zip = new window.JSZip();
      zip.file("database/products.json", JSON.stringify(getStoredProducts(), null, 2));
      zip.file("config/theme_settings.json", JSON.stringify(theme, null, 2));
      zip.file("database/users.json", JSON.stringify(getStoredUsers(), null, 2));
      zip.file("system_info.json", JSON.stringify({
        site: theme.siteName,
        exportedBy: user.email,
        timestamp: new Date().toISOString()
      }, null, 2));
      
      const content = await zip.generateAsync({ type: "blob" });
      window.saveAs(content, `devbady_backup_${Date.now()}.zip`);
    } catch (error) {
      alert("Export failed. Check console.");
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">System Administration</span>
          <h1 className="text-4xl font-black text-slate-900">Backend Control Center</h1>
        </div>
        <div className="flex p-1.5 bg-slate-100 rounded-2xl flex-wrap">
          {(['products', 'theme', 'users', 'system'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all capitalize ${
                activeTab === tab ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'system' ? 'System & Data' : tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-24">
              <h2 className="text-xl font-black mb-8">Add New Marketplace Item</h2>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-5 py-3 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-5 py-3 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Type</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-5 py-3 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none"
                    >
                      <option>Templates</option>
                      <option>Plugins</option>
                      <option>Cloud Scripts</option>
                      <option>Tools</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-5 py-3 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-5 py-3 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white font-black shadow-xl transition-all active:scale-95 hover:brightness-110"
                  style={{ backgroundColor: primaryColor }}
                >
                  Publish to Base
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">Product</th>
                    <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">Price</th>
                    <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-900">{p.name}</p>
                            <span className="text-[10px] font-black uppercase text-blue-500">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900">${p.price}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-400 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-all hover:scale-105"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-20 text-center text-slate-400 italic font-medium">Database Empty.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="max-w-3xl bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Web App Interface Customization
          </h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-black text-slate-900">Site Branding Name</h3>
                <p className="text-sm text-slate-500">Updates globally in header and footer.</p>
              </div>
              <input 
                type="text" 
                value={theme.siteName}
                onChange={e => updateTheme({ siteName: e.target.value })}
                className="px-6 py-3 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none w-full md:w-80 font-bold"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-black text-slate-900">Brand Primary Color</h3>
                <p className="text-sm text-slate-500">Accent color for buttons, icons and links.</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-sm font-mono font-bold text-slate-400 uppercase">{theme.primaryColor}</span>
                <input 
                  type="color" 
                  value={theme.primaryColor}
                  onChange={e => updateTheme({ primaryColor: e.target.value })}
                  className="w-16 h-16 p-1.5 bg-slate-50 rounded-2xl cursor-pointer border-none"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-black text-slate-900">Dark Interface</h3>
                <p className="text-sm text-slate-500">Toggle dark mode across the entire app.</p>
              </div>
              <button 
                onClick={() => updateTheme({ isDarkMode: !theme.isDarkMode })}
                className={`w-16 h-10 rounded-full transition-all relative p-1 ${theme.isDarkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-8 h-8 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${theme.isDarkMode ? 'translate-x-6' : ''}`}>
                   {theme.isDarkMode ? '🌙' : '☀️'}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10">
          <h2 className="text-2xl font-black mb-8">Registered Users</h2>
          <div className="space-y-4">
             {getStoredUsers().map(u => (
               <div key={u.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <div>
                   <p className="font-bold">{u.name}</p>
                   <p className="text-xs text-slate-400">{u.email}</p>
                 </div>
                 <span className="px-3 py-1 bg-white border border-slate-100 text-[10px] font-black rounded-full">{u.role}</span>
               </div>
             ))}
             {getStoredUsers().length === 0 && <p className="text-slate-400 italic">No users found.</p>}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6">System Management</h2>
            <p className="text-slate-500 mb-10 max-w-2xl">
              From here you can manage global system exports. This allows you to backup all <strong>devbady.in</strong> data including themes and marketplace items.
            </p>
            
            <button 
              onClick={handleExportToZip}
              disabled={isExporting}
              className={`flex items-center justify-center gap-4 px-10 py-5 rounded-[1.5rem] text-white font-black shadow-2xl transition-all active:scale-95 ${isExporting ? 'opacity-50' : 'hover:-translate-y-1 shadow-blue-500/20'}`}
              style={{ backgroundColor: primaryColor }}
            >
              {isExporting ? "Processing..." : "Export Full Backup (.ZIP)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;