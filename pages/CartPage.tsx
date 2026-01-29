
import React from 'react';
import { useAuth } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 25.00 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Purchase Manifest</h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Session Active</span>
      </div>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No items in manifest</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your secure hardware cart is empty. Return to the marketplace to add encrypted tools.</p>
          <Link to="/" className="inline-flex bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Explore Hardware
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-6 hover:border-indigo-200 transition-all shadow-sm group">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.name} />
                </div>
                <div className="flex-grow flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1">{item.name}</h4>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{item.category}</p>
                    <div className="flex items-center space-x-6">
                       <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">Qty: {item.quantity}</span>
                       <button 
                         onClick={() => removeFromCart(item.id)}
                         className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-red-700 transition"
                       >
                         Purge Item
                       </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Unit Price</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl sticky top-24 text-white">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-8">Summary Manifest</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Logistics Fee</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-2xl pt-6 border-t border-slate-800 text-white mt-4">
                  <span>Total</span>
                  <span className="text-indigo-400">${total.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/payment')}
                className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-black hover:bg-indigo-400 transition shadow-xl flex items-center justify-center group"
              >
                <span>Authorize Payment</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                <div className="flex items-center text-[9px] text-slate-500 font-black uppercase tracking-widest">
                  <svg className="w-3 h-3 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  PCI-DSS Level 1 Validated
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                  Proceeding initiates a cryptographic handshake. Data is protected by AES-256 standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
