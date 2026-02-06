import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [trends, setTrends] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
        setTrends("Stay ahead with ClodeCode enterprise patterns and scalable architecture.");
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
            Architect Your <br/> <span style={{ color: primaryColor }}>Digital Core.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            High-performance, production-ready coding bases for elite engineering teams.
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="px-8 py-4 rounded-xl text-white font-black shadow-lg" style={{ backgroundColor: primaryColor }}>Get Started</Link>
            <Link to="/contact" className="px-8 py-4 rounded-xl border border-slate-200 font-bold">Contact Expert</Link>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl rotate-1 transform hover:rotate-0 transition-all">
          <h3 className="text-blue-400 font-mono text-sm mb-4">// System Insights</h3>
          {loading ? (
            <div className="h-20 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          ) : (
            <p className="text-blue-100 font-mono text-sm leading-relaxed">{trends}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: 'Hardened Security', icon: '🛡️' },
          { title: 'Global Scale', icon: '🌍' },
          { title: 'Clean Architecture', icon: '🏛️' }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-50 p-8 rounded-2xl">
            <div className="text-3xl mb-4">{feat.icon}</div>
            <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
            <p className="text-slate-500 text-sm">Enterprise-grade patterns vetted by senior architects.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
