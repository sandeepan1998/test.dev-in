
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-10">Privacy Policy</h1>
      <div className="prose prose-blue max-w-none space-y-8 text-gray-600">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Data Collection</h2>
          <p>
            At DevBady, we collect minimal personal data required to provide our services. This includes your name, email address, and any project-specific information you choose to share.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Usage of Information</h2>
          <p>
            Your information is used solely to provide technical support, process transactions, and improve our coding tools. We never sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your account and data. All communication is encrypted via SSL/TLS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies</h2>
          <p>
            We use essential cookies to maintain your session and preferences. You can manage cookie settings in your browser at any time.
          </p>
        </section>

        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 italic">
          Last updated: May 20, 2024. For any questions regarding your privacy, please contact privacy@devbady.in.
        </div>
      </div>
    </div>
  );
};

export default Privacy;
