
import React, { useState, useEffect } from 'react';
import { User, Product, ThemeConfig } from '../types';
import { getStoredProducts, saveProducts, saveTheme } from '../store';

interface AdminDashboardProps {
  user: User;
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  primaryColor: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, theme, setTheme, primaryColor }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'theme' | 'users'>('products');
  
  // Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Templates',
    image: 'https://picsum.photos/seed/new/400/300'
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
    setNewProduct({ name: '', description: '', price: 0, category: 'Templates', image: 'https://picsum.photos/seed/new/400/300' });
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-500">System configuration and resource management.</p>
        </div>
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {(['products', 'theme', 'users'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all capitalize ${
                activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Templates</option>
                    <option>Plugins</option>
                    <option>Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Create Product
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-bold text-sm">Product</th>
                    <th className="px-6 py-4 font-bold text-sm">Category</th>
                    <th className="px-6 py-4 font-bold text-sm">Price</th>
                    <th className="px-6 py-4 font-bold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-semibold">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                      <td className="px-6 py-4 font-medium">${p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-8">Site Customization</h2>
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Brand Name</h3>
                <p className="text-sm text-gray-500">This changes the logo and site text.</p>
              </div>
              <input 
                type="text" 
                value={theme.siteName}
                onChange={e => updateTheme({ siteName: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Primary Color</h3>
                <p className="text-sm text-gray-500">The main theme color for buttons and links.</p>
              </div>
              <div className="flex gap-4 items-center">
                <div 
                  className="w-10 h-10 rounded-full border border-gray-200" 
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <input 
                  type="color" 
                  value={theme.primaryColor}
                  onChange={e => updateTheme({ primaryColor: e.target.value })}
                  className="w-12 h-12 p-1 bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Dark Mode</h3>
                <p className="text-sm text-gray-500">Enable or disable global dark theme.</p>
              </div>
              <button 
                onClick={() => updateTheme({ isDarkMode: !theme.isDarkMode })}
                className={`w-14 h-8 rounded-full transition-colors relative ${theme.isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${theme.isDarkMode ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-gray-500">User management module currently in read-only mode for this preview.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
