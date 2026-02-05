
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Level Up Your <span style={{ color: primaryColor }}>Coding Base</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Access professional-grade tools, templates, and support to build faster and smarter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/products" 
              className="px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl transition-transform hover:-translate-y-1"
              style={{ backgroundColor: primaryColor }}
            >
              Browse Products
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-xl text-lg font-bold bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 transition-transform hover:-translate-y-1"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'For Developers', 
                desc: 'Optimized scripts and code components to accelerate your workflow.',
                icon: '💻'
              },
              { 
                title: 'For Clients', 
                desc: 'Turnkey solutions and dedicated support for your business needs.',
                icon: '🚀'
              },
              { 
                title: 'Admin Control', 
                desc: 'Powerful dashboard for managing users and site resources.',
                icon: '🛠️'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8">Trusted by developers globally</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
            <div className="text-2xl font-bold">Google</div>
            <div className="text-2xl font-bold">Microsoft</div>
            <div className="text-2xl font-bold">Amazon</div>
            <div className="text-2xl font-bold">Meta</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
