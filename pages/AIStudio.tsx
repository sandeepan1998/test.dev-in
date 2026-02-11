import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const GUEST_LIMIT_MS = 10 * 60 * 1000; // 10 minutes

const AIStudio: React.FC<{ user: User | null, primaryColor: string }> = ({ user, primaryColor }) => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    'Generate a basic Node.js Express server',
    'Write a Python function to calculate Fibonacci sequence',
    'Explain the concept of microservices'
  ];

  // Guest Timer Logic
  useEffect(() => {
    if (!user) {
      const startTimeStr = sessionStorage.getItem('devbady_ai_guest_start');
      let startTime = startTimeStr ? parseInt(startTimeStr) : Date.now();
      
      if (!startTimeStr) {
        sessionStorage.setItem('devbady_ai_guest_start', startTime.toString());
      }

      const checkTime = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, GUEST_LIMIT_MS - elapsed);
        setTimeRemaining(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          setShowExpiredModal(true);
        }
      };

      checkTime();
      const interval = setInterval(checkTime, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeRemaining(null);
      setShowExpiredModal(false);
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendMessage = async (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    if (showExpiredModal) return;

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white pt-24 pb-32 selection:bg-[#ed1c24] selection:text-white relative">
      
      {/* EXPIRED MODAL */}
      {showExpiredModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/80 animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-12 shadow-2xl relative text-center">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ed1c24]"></div>
             <div className="w-20 h-20 bg-[#ed1c24]/10 text-[#ed1c24] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#ed1c24]/20 animate-pulse">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </div>
             <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase italic">NEURAL LINK EXPIRED</h2>
             <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed">
               Guest session threshold (10:00) reached. To continue utilizing the <span className="text-white font-bold italic">devbady Intelligence Engine</span>, please authorize your identity node.
             </p>
             <Link 
               to="/login" 
               className="block w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all shadow-xl active:scale-95 italic"
             >
               Access System Terminal
             </Link>
             <Link to="/" className="block mt-6 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-colors">
               Return to Core
             </Link>
          </div>
        </div>
      )}

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
            {user ? (
              <>
                <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Provisioned To</p>
                <p className="text-sm font-bold text-white uppercase tracking-tighter">NODE_{user.name.toUpperCase()}</p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Guest Session Remaining</p>
                <p className={`text-xl font-black tabular-nums tracking-tighter ${timeRemaining !== null && timeRemaining < 60 ? 'text-[#ed1c24] animate-pulse' : 'text-white'}`}>
                  {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
                </p>
              </>
            )}
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
              placeholder={showExpiredModal ? "NEURAL LINK EXPIRED. PLEASE AUTHENTICATE." : "Inject technical prompt or architecture query..."}
              className={`w-full bg-[#0a0a0a] border border-white/10 p-6 pr-40 outline-none focus:border-[#ed1c24] transition-all font-medium text-lg placeholder:text-gray-700 resize-none rounded-sm ${showExpiredModal ? 'opacity-20 cursor-not-allowed' : ''}`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading || showExpiredModal}
            />
            <button 
              type="submit"
              disabled={loading || !prompt.trim() || showExpiredModal}
              className="absolute right-4 bottom-4 px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-[#ed1c24] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black italic"
            >
              {loading ? 'SYNCING...' : 'EXECUTE'}
            </button>
          </form>

          {/* Example Prompts */}
          {!showExpiredModal && (
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
          )}
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