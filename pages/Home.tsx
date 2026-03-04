import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/event/1920/1080')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Unforgettable <span className="text-indigo-500">Popups</span>,<br/> Effortlessly Planned.
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              From intimate gatherings to massive corporate events, Poper handles everything. Customize your experience, book a date, and let us bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/planner" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/services" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/10">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Poper?</h2>
            <p className="text-lg text-slate-600">We take the stress out of event planning with our seamless, end-to-end service.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Calendar, title: 'Easy Scheduling', desc: 'Pick a date on our interactive calendar and secure your spot instantly.' },
              { icon: Star, title: 'Premium Quality', desc: 'We source only the best materials and work with top-tier vendors.' },
              { icon: MapPin, title: 'Any Location', desc: 'Whether it\'s a backyard or a ballroom, we bring the popup to you.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Bride', text: 'Poper made our wedding reception absolutely magical. The rustic theme was perfect.' },
              { name: 'Michael Chen', role: 'Corporate Event Manager', text: 'Professional, punctual, and stunning execution. Will definitely use them again.' },
              { name: 'Emily Rodriguez', role: 'Birthday Girl', text: 'The neon nights theme was a huge hit! Everyone loved the setup.' }
            ].map((review, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-slate-700 mb-6 italic">"{review.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{review.name}</p>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
