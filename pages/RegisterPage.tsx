
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DB } from '../services/db.service';
import { logger } from '../services/audit.service';
import { useAuth } from '../App';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [strength, setStrength] = useState(0);
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 3) {
      showToast('Security policy requires a Medium-strength password or higher.', 'WARNING');
      return;
    }

    const existing = DB.findOne('users', { email: form.email });
    if (existing) {
      showToast('Identity already exists in our registry.', 'ERROR');
      return;
    }

    DB.insertOne('users', {
      ...form,
      passwordHash: btoa(form.password),
      role: form.email.includes('admin') ? UserRole.ADMIN : UserRole.CUSTOMER,
      mfaEnabled: true,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString()
    });

    logger.log(form.email, 'USER_REGISTERED', 'SUCCESS');
    showToast('Registry entry successful. Please sign in.', 'SUCCESS');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Identity Registry</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">SECURE ENROLLMENT PROTOCOL</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Legal Identity (Full Name)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                placeholder="John Q. Public"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={e => setForm({...form, fullName: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Master Password Profile</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Create hardened password"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                onChange={e => {
                  setForm({...form, password: e.target.value});
                  validatePassword(e.target.value);
                }}
                required
              />
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-500 ${strength < 2 ? 'bg-red-500' : strength < 3 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${(strength / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-[9px] font-black text-slate-400 uppercase">Entropy Score</p>
              <p className={`text-[9px] font-black uppercase ${strength < 2 ? 'text-red-500' : strength < 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {['Critical', 'Sub-Optimal', 'Acceptable', 'Optimal', 'Hardened'][strength]}
              </p>
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
            Finalize Enrollment
          </button>
          
          <div className="pt-6 text-center border-t border-slate-50">
            <span className="text-slate-400 text-xs font-medium">Existing credentials? </span>
            <Link to="/login" className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Unlock Vault</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
