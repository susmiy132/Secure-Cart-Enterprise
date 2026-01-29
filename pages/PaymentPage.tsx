
import React, { useState } from 'react';
import { useAuth } from '../App';
import { paymentService } from '../services/payment.service';
import { useNavigate, Link } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const { auth, cart, clearCart, showToast } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + (cart.length > 0 ? 25 : 0);

  const handleFinalPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError('');
    showToast('Initiating encrypted payment tunnel...', 'INFO');

    const result = await paymentService.processSecurePayment(auth.user?.email || 'GUEST', {
      cardNumber: cardData.number,
      expiry: cardData.expiry,
      cvv: cardData.cvv,
      amount: cartTotal
    });

    if (result.success) {
      setTxId(result.transactionId || '');
      setSuccess(true);
      clearCart();
      showToast('Transaction confirmed and audit-logged.', 'SUCCESS');
    } else {
      setPaymentError(result.error || 'Payment failed.');
      showToast(result.error || 'Transaction failed', 'ERROR');
    }
    setProcessing(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Verified Transaction</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Payment finalized. Receipt ID: <span className="font-mono font-bold text-indigo-600">{txId}</span>. Temporary session data has been purged.
          </p>
          <Link 
            to="/"
            className="block w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 mb-20">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Checkout</h2>
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Liability</span>
            <span className="font-black text-indigo-600 text-2xl">${cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleFinalPayment} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Card Identity</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  required 
                  defaultValue={auth.user?.fullName} 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Card Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  required 
                  placeholder="0000 0000 0000 0000"
                  maxLength={16}
                  value={cardData.number}
                  onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g,'')})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition font-mono tracking-widest"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiry (MM/YY)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    required 
                    placeholder="12/26"
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={e => setCardData({...cardData, expiry: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security CVV</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    required 
                    placeholder="***"
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={e => setCardData({...cardData, cvv: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl flex items-start gap-3">
             <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-indigo-200">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M2.166 4.9L10 9.503l7.834-4.603a1 1 0 00-1.168-1.6L10 7.497 3.334 3.297a1 1 0 10-1.168 1.6z" clipRule="evenodd" />
               </svg>
             </div>
             <p className="text-[9px] text-indigo-700 leading-relaxed font-bold uppercase tracking-widest">
               Encrypted via Tunnel v4.2. No persistent storage of card metrics.
             </p>
          </div>

          <button 
            type="submit"
            disabled={processing || cart.length === 0}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition shadow-xl flex items-center justify-center disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center uppercase text-xs tracking-widest">
                <svg className="animate-spin h-4 w-4 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Authorize Final Transaction'}
          </button>
        </form>
        <button 
          onClick={() => navigate('/cart')}
          className="w-full mt-6 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition"
        >
          &larr; Abort to manifest
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
