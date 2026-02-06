import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [insights, setInsights] = useState<string>("");
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are the top 3 most trending development technologies or frameworks to watch in early 2025? Provide a very concise summary for each.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      setInsights(response.text || "");
      setGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (error) {
      console.error("AI Insight Fetch Failed:", error);
      setInsights("Unable to load live insights. Please check back later for the latest tech trends.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-50 rounded-bl-full opacity-30 blur-3xl"></div>
      
      <section className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
                Now Live: ClodeCode Ecosystem v2.5
              </span>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                Engineering the <span style={{ color: primaryColor }}>Modern Base.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
                The ultimate coding infrastructure for developers who build at scale. Clean, robust, and enterprise-ready templates on <b>clodecode.in</b>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="px-10 py-5 rounded-2xl text-lg font-black text-white shadow-2xl hover:brightness-110 transition-all hover:-translate-y-1 active:scale-95 shadow-blue-500/20"
                  style={{ backgroundColor: primaryColor }}
                >
                  Browse Marketplace
                </Link>
                <Link 
                  to="/register" 
                  className="px-10 py-5 rounded-2xl text-lg font-black bg-white text-slate-900 border-2 border-slate-100 shadow-sm hover:border-blue-100 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Join Community
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
               <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 rotate-1 transform hover:rotate-0 transition-transform duration-700">
                  <div className="flex space-x-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <pre className="text-blue-200 font-mono text-base leading-relaxed overflow-x-hidden">
                    <code>{`// Connect to ClodeCode.in Base
import { Engine } from '@clodecode/core';

const portal = new Engine({
  region: 'global',
  security: 'hardened'
});

portal.initialize().then(() => {
  console.log('System Operational!');
});`}</code>
                  </pre>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Market Insights Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                Market Intelligence
              </h2>
              <p className="text-slate-500 font-medium mt-2">Live insights powered by ClodeCode AI & Google Search</p>
            </div>
            <button 
              onClick={fetchInsights}
              disabled={isLoading}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh Trends
            </button>
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Querying Global Databases...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="prose prose-slate prose-lg max-w-none text-slate-700 font-medium leading-relaxed">
                    {insights.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6">Source Verification</h4>
                    <div className="space-y-4">
                      {groundingChunks.length > 0 ? groundingChunks.map((chunk, i) => (
                        chunk.web && (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                          >
                            <div className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-blue-600">{chunk.web.title}</div>
                            <div className="text-[10px] text-slate-400 font-medium truncate mt-1">{chunk.web.uri}</div>
                          </a>
                        )
                      )) : (
                        <p className="text-[10px] text-slate-400 font-bold uppercase italic">No direct links available for this summary.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Engineers', val: '15k+' },
              { label: 'Enterprise Bases', val: '850+' },
              { label: 'Resource Assets', val: '2.4m' },
              { label: 'SLA Score', val: '99.9%' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;