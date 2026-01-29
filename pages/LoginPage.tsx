
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { DB } from '../services/db.service';
import { logger } from '../services/audit.service';
import { User } from '../types';
import { verifyPassword } from '../services/securityService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth, setAuth, showToast } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = DB.findOne<User>('users', { email });

    if (user?.lockUntil && user.lockUntil > Date.now()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      showToast(`Account Locked: ${mins}m remain`, 'ERROR');
      setError(`Account locked. Try again in ${mins} minutes.`);
      setLoading(false);
      return;
    }

    if (user && await verifyPassword(password, user.passwordHash)) {
      DB.updateOne('users', user.id, { failedLoginAttempts: 0 });
      setAuth({ ...auth, user, isMfaPending: true });
      showToast('Phase 1 Authorized. Waiting for MFA.', 'SUCCESS');
      logger.log(email, 'LOGIN_STEP_1', 'SUCCESS');
    } else {
      if (user) {
        const attempts = (user.failedLoginAttempts || 0) + 1;
        const update: any = { failedLoginAttempts: attempts };
        if (attempts >= 5) {
          update.lockUntil = Date.now() + 300000;
          logger.log(email, 'ACCOUNT_LOCKOUT', 'WARNING');
          showToast('Account Locked: Excessive failures', 'WARNING');
        }
        DB.updateOne('users', user.id, update);
      }
      logger.log(email, 'LOGIN_FAILURE', 'FAILURE');
      showToast('Invalid credentials provided', 'ERROR');
      setError('Invalid credentials.');
    }
    setLoading(false);
  };

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode === '123456') {
      setAuth({ ...auth, isAuthenticated: true, isMfaPending: false });
      showToast(`Welcome back, ${auth.user?.fullName}`, 'SUCCESS');
      logger.log(email, 'MFA_VERIFY', 'SUCCESS');
      navigate('/');
    } else {
      logger.log(email, 'MFA_VERIFY', 'FAILURE', { code: mfaCode });
      showToast('MFA Token mismatch', 'ERROR');
      setError('Invalid MFA code.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-xl">SC</div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {auth.isMfaPending ? 'MFA Validation' : 'Vault Access'}
          </h2>
        </div>
        
        {auth.isMfaPending ? (
          <form onSubmit={handleMfa} className="space-y-6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">Multi-Factor Authenticator</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="text"
                autoFocus
                placeholder="000 000"
                className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 border-none text-center text-4xl font-black tracking-[0.4em] focus:ring-2 focus:ring-indigo-500"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
              Finalize Authentication
            </button>
            <button 
              type="button"
              onClick={() => setAuth({...auth, isMfaPending: false})}
              className="w-full text-slate-400 text-xs font-bold hover:text-slate-600 transition"
            >
              Cancel Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Identity</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="name@enterprise.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {DB.findOne<User>('users', { email }) && (
                <p className="text-[10px] text-slate-500 mt-2">Failed attempts: {DB.findOne<User>('users', { email })?.failedLoginAttempts || 0}</p>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Password</label>
                {/* Fixed: Remove invalid 'size' prop from Link component */}
                <Link to="/forgot-password" className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter hover:text-indigo-800">Recovery Required?</Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Decrypting Session...' : 'Unlock Vault'}
            </button>
            <div className="pt-6 text-center border-t border-slate-50">
              <span className="text-slate-400 text-xs font-medium">New analyst? </span>
              <Link to="/register" className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Apply for Entry</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
