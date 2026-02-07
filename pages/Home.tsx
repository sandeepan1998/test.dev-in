import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Post, PostStatus } from '../types';
import { getStoredPosts } from '../store';

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [trends, setTrends] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getStoredPosts().filter(p => p.status === PostStatus.PUBLISHED).slice(0, 3));
    
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "List 3 top trending technologies in web development for 2025 in a short sentence each.",
          config: { tools: [{ googleSearch: {} }] }
        });
        setTrends(res.text || "");
      } catch (e) {
        setTrends("Stay ahead with devbady.in enterprise patterns and scalable architecture.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
        <div>
          <h1 className="text-6xl font-black text-slate-900 leading-tight mb-6">
            Architect Your <br/> <span style={{ color: primaryColor }}>Coding Base.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            High-performance, production-ready coding foundations on <b>devbady.in</b> for elite engineering teams.
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="px-8 py-4 rounded-xl text-white font-black shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: primaryColor }}>Browse Marketplace</Link>
            <Link to="/contact" className="px-8 py-4 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all">Talk to Expert</Link>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl rotate-1 transform hover:rotate-0 transition-all">
          <h3 className="text-blue-400 font-mono text-sm mb-4">// devbady.in AI Trends</h3>
          {loading ? (
            <div className="h-20 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          ) : (
            <p className="text-blue-100 font-mono text-sm leading-relaxed whitespace-pre-line">{trends}</p>
          )}
        </div>
      </div>

      <section className="mb-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Engineering Insights</h2>
            <p className="text-slate-500">Latest thought leadership from the devbady core team.</p>
          </div>
          <Link to="/contact" className="text-sm font-black uppercase tracking-widest text-blue-600 hover:underline">View All Posts</Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="group cursor-pointer">
              <div className="h-48 rounded-3xl overflow-hidden mb-6 bg-slate-100">
                <img src={post.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">Dev Insight</span>
                <span className="text-[10px] font-bold text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
            </div>
          ))}
          {posts.length === 0 && <p className="col-span-full text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs italic">Awaiting first dispatch...</p>}
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: 'Hardened Security', icon: '🛡️' },
          { title: 'Global Scale', icon: '🌍' },
          { title: 'Clean Architecture', icon: '🏛️' }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
            <div className="text-3xl mb-4">{feat.icon}</div>
            <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
            <p className="text-slate-500 text-sm">Enterprise-grade patterns vetted by senior devbady architects.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;