import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AIStudio: React.FC<{ user: User, primaryColor: string }> = ({ user, primaryColor }) => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    'Generate a basic Node.js Express server',
    'Write a Python function to calculate Fibonacci sequence',
    'Explain the concept of microservices'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendMessage = async (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: activePrompt };
    setChatHistory(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...chatHistory, userMsg].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are the devbady Intelligence Engine. You specialize in high-performance coding, enterprise architecture, and technical documentation. Keep responses concise, precise, and professional. Use markdown for code blocks."
        }
      });

      const modelMsg: Message = { role: 'model', content: response.text || "System Timeout. No data received." };
      setChatHistory(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error("Gemini Error:", err);
      setChatHistory(prev => [...prev, { role: 'model', content: "ERROR: NEURAL LINK FAILED. CHECK API PROTOCOLS." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white pt-24 pb-32 selection:bg-[#ed1c24] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-180px)] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ed1c24] mb-3 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#ed1c24] animate-pulse"></span> SYSTEM: NEURAL CORE v3.1
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">AI STUDIO</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Provisioned To</p>
            <p className="text-sm font-bold text-white uppercase tracking-tighter">NODE_{user.name.toUpperCase()}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto mb-8 space-y-8 pr-4 custom-scrollbar"
        >
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <div className="w-24 h-24 border border-white/10 flex items-center justify-center text-gray-600 mb-8 rotate-45">
                 <svg className="w-10 h-10 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-widest">Awaiting Command</h2>
              <p className="text-xs font-bold uppercase tracking-[0.3em] mt-2">Initialize neural link via command input</p>
            </div>
          )}
          
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 border ${msg.role === 'user' ? 'bg-white/5 border-white/10 rounded-sm' : 'bg-[#0a0a0a] border-[#ed1c24]/20 rounded-sm'}`}>
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">
                  {msg.role === 'user' ? 'IDENTITY COMMAND' : 'NEURAL RESPONSE'}
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-medium leading-relaxed prose-code:text-[#ed1c24] prose-code:bg-black prose-pre:bg-black prose-pre:border prose-pre:border-white/10">
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
               <div className="bg-[#0a0a0a] border border-[#ed1c24]/20 p-6 rounded-sm min-w-[200px]">
                 <div className="text-[9px] font-black uppercase tracking-widest text-[#ed1c24] mb-4 border-b border-[#ed1c24]/10 pb-2 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#ed1c24] animate-ping"></div>
                   Processing Stream...
                 </div>
                 <div className="flex gap-2">
                   <div className="w-2 h-2 bg-white/20 animate-bounce"></div>
                   <div className="w-2 h-2 bg-white/20 animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-white/20 animate-bounce delay-200"></div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-auto">
          <form onSubmit={handleSendMessage} className="relative group">
            <textarea 
              rows={3}
              placeholder="Inject technical prompt or architecture query..."
              className="w-full bg-[#0a0a0a] border border-white/10 p-6 pr-40 outline-none focus:border-[#ed1c24] transition-all font-medium text-lg placeholder:text-gray-700 resize-none rounded-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-4 bottom-4 px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black italic"
            >
              {loading ? 'SYNCING...' : 'EXECUTE'}
            </button>
          </form>

          {/* Example Prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
             <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mr-2 self-center">Quick Shards:</span>
             {examplePrompts.map((ex, i) => (
               <button 
                key={i}
                onClick={() => handleSendMessage(undefined, ex)}
                className="px-4 py-2 border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-[#ed1c24] hover:bg-[#ed1c24]/5 transition-all"
                disabled={loading}
               >
                 {ex}
               </button>
             ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ed1c24; }
      `}</style>
    </div>
  );
};

export default AIStudio;