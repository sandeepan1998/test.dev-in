import React from 'react';
import { Tent, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-4">
              <Tent className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight">Poper</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Elevating experiences with premium popup events. We handle the details so you can enjoy the moment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Classic Popups</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Corporate Events</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Weddings</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Custom Themes</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>hello@poper.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Event Street<br/>San Francisco, CA 94103</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Poper Planning Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
