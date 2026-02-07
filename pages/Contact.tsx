import React from 'react';

const Contact: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-black mb-4">Technical Support</h1>
      <p className="text-slate-500 text-xl mb-12">Expert assistance for your enterprise infrastructure.</p>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <form className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Inquiry Type</label>
              <select className="w-full px-4 py-3 bg-slate-50 rounded-xl">
                <option>Technical Support</option>
                <option>Enterprise Licensing</option>
                <option>Custom Development</option>
              </select>
            </div>
            <input placeholder="Subject" className="w-full px-4 py-3 bg-slate-50 rounded-xl" />
            <textarea placeholder="How can we help?" rows={5} className="w-full px-4 py-3 bg-slate-50 rounded-xl" />
            <button className="w-full py-4 text-white font-black rounded-xl shadow-lg" style={{ backgroundColor: primaryColor }}>Send Ticket</button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-black mb-6">Global Headquarters</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-2">Emails</h3>
              <p className="text-slate-900 font-bold">support@devbady.in</p>
              <p className="text-slate-900 font-bold">enterprise@devbady.in</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-2">Availability</h3>
              <p className="text-slate-900 font-bold">24/7 Monitoring</p>
              <p className="text-slate-900 font-bold">L1/L2 Support: 09:00 - 18:00 IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;