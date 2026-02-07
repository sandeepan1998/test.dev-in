import React, { useState, useEffect } from 'react';
import { User, Product, ThemeConfig, Post, PostStatus } from '../types';
import { saveProducts, getStoredProducts, saveTheme, getStoredPosts, savePosts } from '../store';

const AdminDashboard: React.FC<{ user: User, theme: ThemeConfig, setTheme: (t: ThemeConfig) => void, primaryColor: string }> = ({ theme, setTheme, primaryColor }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'posts' | 'branding'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [msg, setMsg] = useState('');

  // Selection states for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());

  // Forms
  const [productForm, setProductForm] = useState<Partial<Product>>({ name: '', price: 0, category: 'Templates', description: '', image: '' });
  const [postForm, setPostForm] = useState<Partial<Post>>({ title: '', content: '', excerpt: '', status: PostStatus.DRAFT, coverImage: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getStoredProducts());
    setPosts(getStoredPosts());
  }, []);

  const triggerMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  // Reset helpers
  const resetForms = () => {
    setEditingId(null);
    setProductForm({ name: '', price: 0, category: 'Templates', description: '', image: '' });
    setPostForm({ title: '', content: '', excerpt: '', status: PostStatus.DRAFT, coverImage: '' });
    setSelectedProductIds(new Set());
    setSelectedPostIds(new Set());
  };

  // Product Actions
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, ...productForm } as Product : p);
      setProducts(updated);
      saveProducts(updated);
      triggerMsg('Product updated successfully!');
    } else {
      const newP = { ...productForm, id: Date.now().toString() } as Product;
      const updated = [...products, newP];
      setProducts(updated);
      saveProducts(updated);
      triggerMsg('Resource published successfully!');
    }
    resetForms();
  };

  // Post Actions
  const handlePostSubmit = (e: React.FormEvent, forceStatus?: PostStatus) => {
    e.preventDefault();
    const status = forceStatus || postForm.status || PostStatus.DRAFT;
    
    if (editingId) {
      const updated = posts.map(p => p.id === editingId ? { ...p, ...postForm, status } as Post : p);
      setPosts(updated);
      savePosts(updated);
      triggerMsg(`Post ${status === PostStatus.PUBLISHED ? 'published' : 'saved as draft'}!`);
    } else {
      const newPost: Post = {
        ...postForm as Post,
        id: Date.now().toString(),
        status,
        createdAt: new Date().toISOString()
      };
      const updated = [...posts, newPost];
      setPosts(updated);
      savePosts(updated);
      triggerMsg(`Post ${status === PostStatus.PUBLISHED ? 'published' : 'saved as draft'}!`);
    }
    resetForms();
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    triggerMsg('Product deleted.');
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    savePosts(updated);
    triggerMsg('Post deleted.');
    setSelectedPostIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Bulk Handlers
  const handleBulkDeleteProducts = () => {
    if (!window.confirm(`Delete ${selectedProductIds.size} products?`)) return;
    const updated = products.filter(p => !selectedProductIds.has(p.id));
    setProducts(updated);
    saveProducts(updated);
    setSelectedProductIds(new Set());
    triggerMsg('Bulk delete successful.');
  };

  const handleBulkDeletePosts = () => {
    if (!window.confirm(`Delete ${selectedPostIds.size} posts?`)) return;
    const updated = posts.filter(p => !selectedPostIds.has(p.id));
    setPosts(updated);
    savePosts(updated);
    setSelectedPostIds(new Set());
    triggerMsg('Bulk delete successful.');
  };

  const handleBulkPostStatus = (status: PostStatus) => {
    const updated = posts.map(p => selectedPostIds.has(p.id) ? { ...p, status } : p);
    setPosts(updated);
    savePosts(updated);
    setSelectedPostIds(new Set());
    triggerMsg(`Bulk ${status.toLowerCase()} successful.`);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePostSelection = (id: string) => {
    setSelectedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllProducts = () => {
    if (selectedProductIds.size === products.length) setSelectedProductIds(new Set());
    else setSelectedProductIds(new Set(products.map(p => p.id)));
  };

  const selectAllPosts = () => {
    if (selectedPostIds.size === posts.length) setSelectedPostIds(new Set());
    else setSelectedPostIds(new Set(posts.map(p => p.id)));
  };

  const editProduct = (p: Product) => {
    setActiveTab('products');
    setEditingId(p.id);
    setProductForm(p);
  };

  const editPost = (p: Post) => {
    setActiveTab('posts');
    setEditingId(p.id);
    setPostForm(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black">Control Center</h1>
        {msg && <div className="px-6 py-3 bg-green-50 text-green-600 rounded-2xl font-bold border border-green-100 animate-fade-in">✓ {msg}</div>}
      </div>

      <div className="flex gap-4 mb-10 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {(['products', 'posts', 'branding'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); resetForms(); }}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'products' && (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit sticky top-24">
            <h2 className="text-xl font-black mb-6">{editingId ? 'Edit Product' : 'Publish New Coding Base'}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <input required placeholder="Asset Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              <div className="flex gap-4">
                <input required type="number" placeholder="Price (USD)" className="flex-1 px-4 py-3 bg-slate-50 rounded-xl outline-none" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} />
                <select className="flex-1 px-4 py-3 bg-slate-50 rounded-xl" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                  <option>Templates</option><option>Backend</option><option>Tools</option>
                </select>
              </div>
              <textarea placeholder="Description" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" rows={4} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              <input placeholder="Image URL" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="flex-grow py-4 text-white font-black rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: primaryColor }}>{editingId ? 'Update Asset' : 'Deploy Asset'}</button>
                {editingId && <button type="button" onClick={resetForms} className="px-6 py-4 bg-slate-100 rounded-xl font-bold">Cancel</button>}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                    checked={products.length > 0 && selectedProductIds.size === products.length}
                    onChange={selectAllProducts}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select All Assets</span>
                </div>
                {selectedProductIds.size > 0 && (
                  <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                    <button 
                      onClick={handleBulkDeleteProducts}
                      className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                    >
                      Delete ({selectedProductIds.size})
                    </button>
                  </div>
                )}
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${selectedProductIds.has(p.id) ? 'bg-blue-50/20' : ''}`}>
                      <td className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                          checked={selectedProductIds.has(p.id)}
                          onChange={() => toggleProductSelection(p.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{p.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black">${p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => editProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">Inventory is empty.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit sticky top-24">
            <h2 className="text-xl font-black mb-6">{editingId ? 'Edit Post' : 'Write New Insight'}</h2>
            <form className="space-y-4">
              <input required placeholder="Article Title" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none font-bold text-lg" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} />
              <textarea required placeholder="Short Excerpt (shows in list)" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none text-sm" rows={2} value={postForm.excerpt} onChange={e => setPostForm({...postForm, excerpt: e.target.value})} />
              <textarea required placeholder="Full Article Content" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none min-h-[250px]" value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} />
              <input placeholder="Cover Image URL" className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" value={postForm.coverImage} onChange={e => setPostForm({...postForm, coverImage: e.target.value})} />
              
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={(e) => handlePostSubmit(e, PostStatus.PUBLISHED)} className="flex-1 py-4 text-white font-black rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: primaryColor }}>
                  {editingId ? 'Update & Publish' : 'Publish Article'}
                </button>
                <button type="button" onClick={(e) => handlePostSubmit(e, PostStatus.DRAFT)} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Save as Draft
                </button>
                {editingId && <button type="button" onClick={resetForms} className="px-6 py-4 bg-slate-100 rounded-xl font-bold">Cancel</button>}
              </div>
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                  checked={posts.length > 0 && selectedPostIds.size === posts.length}
                  onChange={selectAllPosts}
                />
                <h2 className="text-xl font-black">Recent Content</h2>
              </div>
              {selectedPostIds.size > 0 && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                   <button 
                    onClick={() => handleBulkPostStatus(PostStatus.PUBLISHED)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    Publish
                  </button>
                  <button 
                    onClick={() => handleBulkPostStatus(PostStatus.DRAFT)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                  >
                    Draft
                  </button>
                  <button 
                    onClick={handleBulkDeletePosts}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                  >
                    Delete ({selectedPostIds.size})
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {posts.map(p => (
                <div key={p.id} className={`bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4 group transition-all ${editingId === p.id ? 'border-blue-500 bg-blue-50/10 shadow-blue-100' : 'border-slate-100'} ${selectedPostIds.has(p.id) ? 'border-blue-300 ring-2 ring-blue-50' : ''}`}>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" 
                    checked={selectedPostIds.has(p.id)}
                    onChange={() => togglePostSelection(p.id)}
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === PostStatus.PUBLISHED ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {p.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => editPost(p)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deletePost(p.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase text-xs tracking-widest">No articles yet.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-10">Platform Aesthetics</h2>
          <div className="space-y-8">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-3 tracking-widest">Brand Focal Color</label>
              <div className="flex gap-6 items-center">
                <input type="color" className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-slate-800 p-1 bg-transparent" value={theme.primaryColor} onChange={e => {
                  const nt = {...theme, primaryColor: e.target.value};
                  setTheme(nt);
                  saveTheme(nt);
                }} />
                <div className="space-y-1">
                  <span className="font-mono text-2xl font-black uppercase block">{theme.primaryColor}</span>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Hex Code</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-3 tracking-widest">Global Site Identifier</label>
              <input className="w-full px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 text-xl font-black" value={theme.siteName} onChange={e => {
                const nt = {...theme, siteName: e.target.value};
                setTheme(nt);
                saveTheme(nt);
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;