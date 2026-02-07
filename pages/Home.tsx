import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Post, PostStatus } from '../types';
import { getStoredPosts } from '../store';
import { supabase } from '../supabase';

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [trends, setTrends] = useState<string>("");
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', PostStatus.PUBLISHED)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPosts(data.map(p => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            content: p.content,
            status: p.status,
            coverImage: p.cover_image,
            createdAt: p.created_at
          })));
        } else {
          setPosts(getStoredPosts().filter(p => p.status === PostStatus.PUBLISHED).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts(getStoredPosts().filter(p => p.status === PostStatus.PUBLISHED).slice(0, 3));
      } finally {
        setLoadingPosts(false);
      }
    };

    const fetchTrends = async () => {
      setLoadingTrends(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "List 3 top trending technologies in web development for 2025 in a short sentence each.",
          config: { tools: [{ googleSearch: {} }] }
        });
        setTrends(res.text || "");
      } catch (e) {
        setTrends("Leading the next generation of enterprise performance coding.");
      } finally {
        setLoadingTrends(false);
      }
    };

    fetchPosts();
    fetchTrends();
  }, []);

  return (
    <div className="bg-[#000000] text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-48 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 uppercase italic">
            SPEED IS <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">EVERYTHING.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium tracking-tight">
            Build with devbady.in—the ultimate enterprise resource engine for elite performance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Explore Tech</Link>
            <Link to="/contact" className="px-10 py-4 border border-white/20 text-white font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Contact Expert</Link>
          </div>
        </div>
      </div>

      {/* AI Trends Sidebar Style */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-[#1a1a1a] border border-white/10 p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ed1c24] animate-pulse"></span> Intelligence Hub
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase">AI INSIGHTS</h3>
          </div>
          <div className="flex-grow border-l border-white/10 pl-8">
            {loadingTrends ? (
              <div className="flex gap-2">
                <div className="w-1 h-1 bg-white animate-bounce"></div>
                <div className="w-1 h-1 bg-white animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-white animate-bounce delay-200"></div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-medium leading-relaxed italic">{trends}</p>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-[#ed1c24] mb-2">Technical Dispatch</div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">THE FUTURE OF COMPUTE</h2>
          </div>
          <Link to="/products" className="text-xs font-black uppercase tracking-widest text-white border-b border-white/20 hover:border-white transition-all pb-1">All Resources</Link>
        </div>
        
        {loadingPosts ? (
          <div className="grid md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
            {[1,2,3].map(n => (
              <div key={n} className="bg-black p-10 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
            {posts.map(post => (
              <div key={post.id} className="bg-[#000000] p-10 group cursor-pointer hover:bg-[#111111] transition-all">
                <div className="h-40 overflow-hidden mb-8 grayscale hover:grayscale-0 transition-all duration-700 relative">
                  <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Resource</span>
                  <span className="text-[10px] font-bold text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-black tracking-tight mb-4 group-hover:text-[#ed1c24] transition-colors uppercase">{post.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24]">Read Article &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Feature Blocks */}
      <div className="bg-[#0f0f0f] border-t border-white/5 py-32">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { title: 'GEN 5 STORAGE', icon: '💾', desc: 'Accelerated I/O paths for mission-critical data processing.' },
            { title: 'HYPER-THREADED OPS', icon: '⚙️', desc: 'Parallel task execution models for high-concurrency apps.' },
            { title: 'QUANTUM SECURITY', icon: '🛡️', desc: 'Encrypted shard architecture for zero-trust environments.' }
          ].map((feat, i) => (
            <div key={i} className="group">
              <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-2xl mb-6 group-hover:bg-[#ed1c24] group-hover:text-white transition-all">{feat.icon}</div>
              <h4 className="text-lg font-black tracking-widest mb-3 uppercase">{feat.title}</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;