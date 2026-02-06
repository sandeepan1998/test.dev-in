import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'theme' | 'users' | 'system'>('products');
  const [isExporting, setIsExporting] = useState(false);
  const [tempTheme, setTempTheme] = useState<ThemeConfig>(theme);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProductId) {
      // Update existing product
      const updated = products.map(p => 
        p.id === editingProductId ? { ...p, ...newProduct } as Product : p
      );
      setProducts(updated);
      saveProducts(updated);
      triggerStatus("Product updated successfully!");
      resetForm();
    } else {
      // Add new product
      const product: Product = {
        ...newProduct as Product,
        id: Date.now().toString()
      };
      const updated = [...products, product];
      setProducts(updated);
      saveProducts(updated);
      resetForm();
      triggerStatus("Product published to marketplace!");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image
    });
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingProductId(null);
    setNewProduct({ 
      name: '', 
      description: '', 
      price: 0, 
      category: 'Templates', 
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400' 
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Are you sure? This will remove the product from the public marketplace.")) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    if (editingProductId === id) resetForm();
    triggerStatus("Product deleted.");
  };

  const handleSaveTheme = () => {
    setTheme(tempTheme);
    saveTheme(tempTheme);
    triggerStatus("Branding updated globally!");
  };

  const triggerStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExportToZip = async () => {
    if (!window.JSZip || !window.saveAs) {
      alert("Export utility is loading. Please try again in a moment.");
      return;
    }

    setIsExporting(true);
    try {
      const zip = new window.JSZip();
      zip.file("marketplace_data.json", JSON.stringify(getStoredProducts(), null, 2));
      zip.file("theme_config.json", JSON.stringify(theme, null, 2));
      zip.file("user_base.json", JSON.stringify(getStoredUsers(), null, 2));
      
      const content = await zip.generateAsync({ type: "blob" });
      window.saveAs(content, `devbady_system_backup_${new Date().toISOString().split('T')[0]}.zip`);
      triggerStatus("Backup downloaded!");
    } catch (error) {
      alert("Failed to generate backup.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {saveStatus && (
        <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] animate-bounce font-bold border border-white/20">
          <span className="mr-2">⚡</span> {saveStatus}
        </div>
      )}

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <span className="text-blue-600 font-black tracking-widest text-[10px] uppercase bg-blue-50 px-3 py-1 rounded-full">Admin System</span>
             <button onClick={() => navigate('/products')} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
               View Marketplace <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
          </div>
          <h1 className="text-4xl font-black text-slate-900">Control Center</h1>
        </div>
        <div className="flex p-1.5 bg-slate-100 rounded-2xl flex-wrap">
          {(['products', 'theme', 'users', 'system'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className={`bg-white p-8 rounded-[2rem] shadow-xl border-2 transition-all sticky top-24 ${editingProductId ? 'border-blue-500' : 'border-slate-50'}`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black">
                  {editingProductId ? 'Edit Coding Asset' : 'New Coding Asset'}
                </h2>
                {editingProductId && <span className="text-[10px] font-black px-2 py-1 bg-blue-100 text-blue-600 rounded-lg animate-pulse">EDIT MODE</span>}
              </div>
              
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React Admin Pro"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    >
                      <option>Templates</option>
                      <option>Plugins</option>
                      <option>Cloud Scripts</option>
                      <option>Tools</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Short Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 py-4 rounded-2xl text-white font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95 hover:brightness-110"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {editingProductId ? 'Update Resource' : 'Publish Resource'}
                  </button>
                  {editingProductId && (
                    <button 
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Coding Asset</th>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Cost</th>
                    <th className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right">Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className={`group transition-colors ${editingProductId === p.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/30'}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <img src={p.image} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="font-black text-slate-900 text-base">{p.name}</div>
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg text-sm">${p.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleEditClick(p)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Edit Resource"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete Resource"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div className="py-24 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">Marketplace is empty.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="max-w-3xl bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
          <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
            Branding & Aesthetics
          </h2>
          <div className="space-y-12">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Platform Name</label>
              <input 
                type="text" 
                value={tempTheme.siteName}
                onChange={e => setTempTheme({ ...tempTheme, siteName: e.target.value })}
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none font-black text-xl text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Primary Brand Color</label>
                <div className="flex gap-6 items-center">
                  <input 
                    type="color" 
                    value={tempTheme.primaryColor}
                    onChange={e => setTempTheme({ ...tempTheme, primaryColor: e.target.value })}
                    className="w-24 h-24 p-2 bg-white rounded-3xl cursor-pointer shadow-xl border-4 border-slate-50"
                  />
                  <div>
                    <span className="font-mono font-black text-slate-900 text-lg uppercase block">{tempTheme.primaryColor}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hex Code</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Night Mode Override</label>
                <div className="flex items-center gap-4 pt-4">
                   <button 
                    onClick={() => setTempTheme({ ...tempTheme, isDarkMode: !tempTheme.isDarkMode })}
                    className={`w-20 h-12 rounded-full transition-all relative p-1.5 ${tempTheme.isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}
                  >
                    <div className={`w-9 h-9 rounded-full bg-white shadow-xl transform transition-transform duration-300 flex items-center justify-center ${tempTheme.isDarkMode ? 'translate-x-8' : ''}`}>
                       {tempTheme.isDarkMode ? '🌙' : '☀️'}
                    </div>
                  </button>
                  <span className="text-sm font-black text-slate-500">{tempTheme.isDarkMode ? 'Active' : 'Disabled'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveTheme}
              className="w-full py-6 rounded-3xl text-white font-black text-lg shadow-2xl transition-all active:scale-95 hover:brightness-110 flex items-center justify-center gap-4"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              Deploy Visual Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-12">
          <h2 className="text-3xl font-black mb-10">Base Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {getStoredUsers().map(u => (
               <div key={u.id} className="flex justify-between items-center p-8 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-blue-100 transition-all group">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-blue-600 shadow-sm">{u.name.charAt(0)}</div>
                   <div>
                     <p className="font-black text-slate-900">{u.name}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.email}</p>
                   </div>
                 </div>
                 <span className="px-4 py-1.5 bg-white text-[10px] font-black rounded-full border border-slate-100 shadow-sm uppercase tracking-widest">{u.role}</span>
               </div>
             ))}
             {getStoredUsers().length === 0 && (
               <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">No members found in database.</div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v5m-3-3l3 3 3-3m-6-4h6m-3-3v3m9 4h.01M20 21H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2z"/></svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-8">System Reliability</h2>
            <p className="text-slate-500 mb-12 max-w-2xl text-lg font-medium leading-relaxed">
              Maintain the integrity of the <b>devbady.in</b> ecosystem. Use the tool below to generate an encrypted ZIP archive containing all marketplace resources, community data, and configuration blueprints.
            </p>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 inline-block">
               <button 
                onClick={handleExportToZip}
                disabled={isExporting}
                className={`flex items-center justify-center gap-6 px-12 py-6 rounded-2xl text-white font-black text-xl shadow-2xl transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2 active:scale-95 shadow-blue-500/30'}`}
                style={{ backgroundColor: primaryColor }}
              >
                {isExporting ? "Compiling Data..." : "Generate Cloud Backup"}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;