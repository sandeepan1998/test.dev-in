import React, { useState } from 'react';
import { supabase } from '../supabase';

const Contact: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const [inquiryType, setInquiryType] = useState('Technical Support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('inquiries')
        .insert([
          {
            inquiry_type: inquiryType,
            subject: subject,
            message: message,
          },
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Transmission failed. System bypass required.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 border-b border-white/10 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-none uppercase italic">Technical <br/> Support</h1>
            <p className="text-gray-500 text-xl font-medium tracking-tight">Expert assistance for your enterprise infrastructure. <br/> Direct uplink to devbady engineering.</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-[#ed1c24] uppercase tracking-[0.4em]">
            <span className="w-2.5 h-2.5 bg-[#ed1c24] animate-pulse"></span> Terminal v4.2 Live
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-20">
          {/* CONTACT FORM */}
          <div className="bg-[#0a0a0a] border border-white/10 p-10 md:p-16 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-24 bg-[#ed1c24] transition-all duration-700 group-hover:h-full"></div>
            
            {submitted ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">TRANSMISSION RECEIVED</h2>
                <p className="text-gray-500 text-sm font-medium mb-12">Your inquiry has been logged in the secure ledger. An expert will authorize a response shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-12 py-5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
                >
                  New Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] block">Inquiry Classification</label>
                  <select 
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 text-white outline-none focus:border-[#ed1c24] transition-all font-bold uppercase text-xs tracking-wider cursor-pointer"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    disabled={loading}
                  >
                    <option className="bg-[#0a0a0a]">Technical Support</option>
                    <option className="bg-[#0a0a0a]">Enterprise Licensing</option>
                    <option className="bg-[#0a0a0a]">Custom Development</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] block">Subject Protocol</label>
                  <input 
                    required
                    placeholder="Brief description of the request" 
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 text-white outline-none focus:border-[#ed1c24] transition-all font-medium placeholder:text-gray-800" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] block">Core Message</label>
                  <textarea 
                    required
                    placeholder="Specify technical details or issue logs..." 
                    rows={6} 
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 text-white outline-none focus:border-[#ed1c24] transition-all font-medium placeholder:text-gray-800 resize-none" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-5 bg-red-600/10 text-[#ed1c24] border border-red-600/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    ENCRYPTION ERROR: {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl hover:bg-[#ed1c24] hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 italic"
                >
                  {loading ? 'Transmitting Data...' : 'Dispatch Inquiry Ticket'}
                </button>
              </form>
            )}
          </div>

          {/* SIDE INFO */}
          <div className="space-y-20">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#ed1c24] mb-4">Global Operations</div>
              <h2 className="text-4xl font-black tracking-tighter mb-8 uppercase italic">Direct Endpoints</h2>
              <div className="grid gap-10">
                <div className="group">
                  <h3 className="font-black text-gray-600 uppercase text-[10px] tracking-[0.4em] mb-3 group-hover:text-white transition-colors">Technical Ops</h3>
                  <p className="text-2xl font-black tracking-tight text-white">support@devbady.in</p>
                </div>
                <div className="group">
                  <h3 className="font-black text-gray-600 uppercase text-[10px] tracking-[0.4em] mb-3 group-hover:text-white transition-colors">Enterprise Inquiries</h3>
                  <p className="text-2xl font-black tracking-tight text-white">enterprise@devbady.in</p>
                </div>
                <div className="group">
                  <h3 className="font-black text-gray-600 uppercase text-[10px] tracking-[0.4em] mb-3 group-hover:text-white transition-colors">System Uptime</h3>
                  <p className="text-2xl font-black tracking-tight text-emerald-500">99.9% SLO Guaranteed</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] p-10 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rotate-45"></div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Support Protocol</h4>
               <p className="text-xs text-gray-500 font-medium leading-relaxed">
                 Mission-critical response times (SLA Tier 1) are active for all enterprise-licensed accounts. 24/7 monitoring is currently <span className="text-emerald-500 font-bold uppercase">Operational</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;