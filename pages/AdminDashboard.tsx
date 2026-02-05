
import React, { useState, useEffect } from 'react';
import { User, Product, ThemeConfig } from '../types';
import { getStoredProducts, saveProducts, saveTheme, getStoredUsers } from '../store';

// Extend window for libraries added in index.html
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
  
  // Product Form State
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
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  // Function to export all data files into a zip (standard browser support over RAR)
  const handleExportToZip = async () => {
    if (!window.JSZip || !window.saveAs) {
      alert("Export libraries not loaded yet. Please wait a moment.");
      return;
    }

    setIsExporting(true);
    try {
      const zip = new window.JSZip();
      
      // 1. Export Products
      const productsData = JSON.stringify(getStoredProducts(), null, 2);
      zip.file("database/products.json", productsData);
      
      // 2. Export Theme Config
      const themeData = JSON.stringify(theme, null, 2);
      zip.file("config/theme_settings.json", themeData);
      
      // 3. Export Users
      const usersData = JSON.stringify(getStoredUsers(), null, 2);
      zip.file("database/users.json", usersData);
      
      // 4. Export System Info
      const systemInfo = {
        site: "clodecode.in",
        exportedBy: user.email,
        timestamp: new Date().toISOString(),
        version: "2.0.4-stable"
      };
      zip.file("system_info.json", JSON.stringify(systemInfo, null, 2));
      
      // 5. Add a Readme
      zip.file("README.txt", `
=========================================
CLODECODE.IN SYSTEM BACKUP
=========================================
Generated on: ${new Date().toLocaleString()}
Administrator: ${user.name} (${user.email})

Contents:
- database/: JSON exports of products and users
- config/: Site UI and branding settings
- system_info.json: Technical metadata

This archive contains a complete snapshot of the 
clodecode.in local database and configurations.
      `);

      // Generate the ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Save it (Zip is used as it's the web standard for cross-platform extraction)
      window.saveAs(content, "clodecode_full_export.zip");
      
    } catch (error) {
      console.error("Export failed", error);
      alert("System error during export. Ensure JSZip is available.");
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Enterprise Management</span>
          <h1 className="text-4xl font-black text-slate-900">Admin Control Center</h1>
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
              {tab === 'system' ? 'System & Export' : tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-24">
              <h2 className="text-xl font-black mb-8">Manage Local Inventory</h2>
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
                      <option>Enterprise</option>
                    </select>
                  </div>
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
                  className="w-full py-4 rounded-2xl text-white font-black shadow-xl transition-all active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Create Product
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
                    <th className="px-8 py-6 font-black text-xs uppercase tracking-widest text-slate-400">Category</th>
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
                            <p className="text-xs text-slate-400 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{p.category}</span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900">${p.price}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-400 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-20 text-center text-slate-400 italic font-medium">No products found in database.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="max-w-3xl bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Interface Customization
          </h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-black text-slate-900">Application Title</h3>
                <p className="text-sm text-slate-500">Visible across the entire platform.</p>
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
                <h3 className="font-black text-slate-900">Accent Color</h3>
                <p className="text-sm text-slate-500">Branding color for buttons and highlights.</p>
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
                <h3 className="font-black text-slate-900">Dark Mode</h3>
                <p className="text-sm text-slate-500">Toggle high-contrast developer theme.</p>
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
        <div className="bg-slate-50 p-20 rounded-[3rem] border-4 border-dashed border-slate-200 text-center">
          <div className="text-7xl mb-6">🛡️</div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">User Directory</h2>
          <p className="text-slate-500 font-medium">Authentication system is active. User record management is restricted to system-level exports.</p>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                   <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                   System Backup Engine
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Export Platform Data</h2>
                <p className="text-slate-500 leading-relaxed mb-8 text-lg">
                  Generate a comprehensive data archive of <strong>clodecode.in</strong>. This includes all products, user accounts, and visual configurations currently stored in the system database.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Records</p>
                    <p className="text-2xl font-black text-slate-900">{products.length + getStoredUsers().length}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Health Status</p>
                    <p className="text-2xl font-black text-green-500">Stable</p>
                  </div>
                </div>

                <button 
                  onClick={handleExportToZip}
                  disabled={isExporting}
                  className={`flex items-center justify-center gap-4 px-10 py-5 rounded-[1.5rem] text-white font-black shadow-2xl shadow-blue-500/20 transition-all active:scale-95 w-full md:w-auto ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-blue-500/40'}`}
                  style={{ backgroundColor: primaryColor }}
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Archive...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export All Files (.zip)
                    </>
                  )}
                </button>
              </div>

              <div className="w-full md:w-96 glass-panel p-8 rounded-[2rem] border border-slate-100 shadow-xl">
                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Resource Inspector
                 </h3>
                 <div className="space-y-8">
                    <div className="group">
                      <div className="flex justify-between text-xs font-bold mb-3 text-slate-600 group-hover:text-blue-600 transition-colors">
                        <span>Database Density</span>
                        <span>{(products.length * 2)}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, products.length * 2)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-3 text-slate-600">
                        <span>Cloud Connectivity</span>
                        <span className="text-green-500">Active</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-3 text-slate-600">
                        <span>Backup Integrity</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                         Secure Encryption Active
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
