import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 prose prose-slate">
      <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
      <p className="font-bold text-slate-500 mb-12">Effective Date: January 1, 2025</p>
      
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">1. Data Sovereignty</h2>
        <p>At ClodeCode, we prioritize your data security. Any personal information collected during account creation is encrypted and never sold to third-party entities.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">2. Intellectual Property</h2>
        <p>Purchased coding bases are provided under a commercial license. Users retain full ownership of the applications built using ClodeCode infrastructure.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black mb-4">3. Monitoring</h2>
        <p>We monitor platform usage to detect anomalies and ensure system uptime. No source code built on top of our templates is ever indexed or accessed by ClodeCode staff without explicit consent.</p>
      </section>

      <div className="p-8 bg-slate-50 rounded-2xl italic text-sm text-slate-500">
        For inquiries regarding GDPR or Data Access Requests, please contact privacy@clodecode.in.
      </div>
    </div>
  );
};

export default Privacy;
