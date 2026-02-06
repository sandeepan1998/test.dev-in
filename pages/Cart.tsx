
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, quantity: number) => void;
  onClear: () => void;
  primaryColor: string;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdate, onClear, primaryColor }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    alert("Order simulation complete! Access to your coding bases will be available in your dashboard shortly.");
    onClear();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Your Shopping Cart</h1>
          <p className="text-slate-500 font-medium">Ready to deploy your next coding base?</p>
        </div>
        <button 
          onClick={onClear}
          className="text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
        >
          Clear All Items
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="text-6xl mb-6 opacity-30">🛒</div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Cart is empty</h3>
          <p className="text-slate-400 mb-10">You haven't added any coding resources yet.</p>
          <Link 
            to="/products" 
            className="px-10 py-5 rounded-2xl text-white font-black shadow-xl transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Go to Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex-grow">
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: primaryColor }}>{item.category}</div>
                  <h4 className="text-xl font-black text-slate-900">{item.name}</h4>
                  <div className="text-lg font-black text-slate-900 mt-1">${item.price}</div>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
                  <button 
                    onClick={() => onUpdate(item.id, item.quantity - 1)}
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-xl hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black text-slate-900">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdate(item.id, item.quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-xl hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-3 text-red-300 hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-24">
              <h3 className="text-2xl font-black mb-10">Order Summary</h3>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Platform Fee</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="h-px bg-white/10 my-6"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Grand Total</span>
                    <span className="text-4xl font-black">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full py-5 rounded-2xl text-lg font-black shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                style={{ backgroundColor: primaryColor }}
              >
                Checkout Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              <p className="mt-8 text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Encrypted checkout powered by <br/> DevBady Secure Layer
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
