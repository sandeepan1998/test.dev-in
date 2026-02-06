import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem, Currency } from '../types';

const EXCHANGE_RATE = 83.5;

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, q: number) => void;
  primaryColor: string;
  currency: Currency;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdate, primaryColor, currency }) => {
  const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const formatPrice = (p: number) => {
    if (currency === Currency.INR) return `₹${(p * EXCHANGE_RATE).toLocaleString()}`;
    return `$${p.toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-10">Checkout Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold mb-6">Your cart is currently empty.</p>
          <Link to="/products" className="px-6 py-3 rounded-xl text-white font-black" style={{ backgroundColor: primaryColor }}>Explore Products</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-slate-500 text-xs">{item.category}</p>
                  <p className="font-black mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => onUpdate(item.id, item.quantity - 1)} className="w-8 h-8 bg-slate-100 rounded-lg font-black">-</button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdate(item.id, item.quantity + 1)} className="w-8 h-8 bg-slate-100 rounded-lg font-black">+</button>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-red-400 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 text-white p-8 rounded-3xl h-fit sticky top-24">
            <h3 className="text-xl font-black mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Platform Fee</span>
                <span className="text-white">{formatPrice(0)}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button className="w-full py-5 rounded-2xl text-white font-black shadow-xl" style={{ backgroundColor: primaryColor }}>Confirm Purchase</button>
            <p className="text-[10px] text-center text-slate-500 uppercase font-black mt-6 tracking-widest">Secured by ClodeCode SSL</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
