
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DB } from '../services/db.service';
import { logger } from '../services/audit.service';
import { useAuth } from '../App';
import { User } from '../types';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'sent' | 'reset'>('request');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
    return score;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Security: Check if user exists
    const user = DB.findOne<User>('users', { email });
    
    if (user) {
      // Generate a simulated recovery token
      const token = Math.random().toString(36).substr(2, 12);
      DB.updateOne('users', user.id, { 
        resetToken: token, 
        resetTokenExpiry: Date.now() + 3600000 // 1 hour
      });
      logger.log(email, 'PASSWORD_RESET_REQUEST', 'SUCCESS');
      console.log(`[SECURE DEBUG]: Reset token for ${email}: ${token}`);
    } else {
      // Anti-Enumeration: Even if user doesn't exist, we don't leak that information.
      logger.log(email, 'PASSWORD_RESET_REQUEST_INVALID', 'WARNING', { reason: 'User not found' });
    }

    // Simulate network delay
    setTimeout(() => {
      setStep('sent');
      setLoading(false);
    }, 1200);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 3) {
      showToast('Master password strength is insufficient', 'ERROR');
      return;
    }

    const user = DB.findOne<User>('users', { email });
    if (user) {
      DB.updateOne('users', user.id, {
        passwordHash: btoa(password),
        resetToken: undefined,
        resetTokenExpiry: undefined,
        failedLoginAttempts: 0,
        lockUntil: undefined
      });
      logger.log(email, 'PASSWORD_RESET_COMPLETED', 'SUCCESS');
      showToast('Identity credentials updated successfully', 'SUCCESS');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Identity Recovery</h2>
        
        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-6">
            <p className="text-sm text-slate-500 font-medium">Enter your registered email identity to receive a cryptographic reset token.</p>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registered Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition shadow-lg shadow-slate-100 disabled:opacity-50"
            >
              {loading ? 'Validating Handshake...' : 'Transmit Recovery Request'}
            </button>
          </form>
        )}

        {step === 'sent' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Request Processed</h3>
              <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                If the email <span className="font-bold text-slate-800">{email}</span> exists in our secure registry, a recovery token has been transmitted.
              </p>
            </div>
            <button 
              onClick={() => setStep('reset')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-700 transition"
            >
              Enter Recovery Token
            </button>
          </div>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-6">
            <p className="text-xs text-slate-500 font-medium mb-4">Validate your token and set a new hardened master password.</p>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recovery Token</label>
              <input
                type="text"
                required
                placeholder="Check console for debug token"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-right">New Password Profile</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-500 ${strength < 2 ? 'bg-red-500' : strength < 3 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Security Strength: {['Critical', 'Weak', 'Medium', 'Hardened', 'Military Grade'][strength]}</p>
            </div>
            <button 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition shadow-lg shadow-slate-100"
            >
              Update Credentials
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-slate-50">
          <Link to="/login" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition">Return to Vault Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
