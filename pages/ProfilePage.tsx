
import React, { useState } from 'react';
import { useAuth } from '../App';
import { logger } from '../services/audit.service';

const ProfilePage: React.FC = () => {
  const { auth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: auth.user?.fullName || '',
    email: auth.user?.email || '',
    phone: '+1 (555) 000-1234'
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    logger.log(auth.user?.email || 'UNKWN', 'PROFILE_UPDATE', 'SUCCESS', { updatedFields: ['fullName', 'phone'] });
    alert("Profile changes committed to secure storage.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-slate-900 flex items-center px-8">
           <h2 className="text-white text-xl font-bold tracking-tight">Identity Management</h2>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 flex items-end justify-between mb-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl border border-slate-100">
              <div className="w-full h-full bg-indigo-600 rounded-xl flex items-center justify-center text-3xl font-bold text-white">
                {profile.fullName.charAt(0)}
              </div>
            </div>
            <button 
              onClick={() => setEditing(!editing)}
              className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
            >
              {editing ? 'Discard Changes' : 'Modify Identity'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <input 
                        disabled={!editing}
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-70 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recovery Phone</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <input 
                        disabled={!editing}
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-70 font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Email (Immutable)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </span>
                    <input 
                      disabled
                      value={profile.email}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl opacity-60 cursor-not-allowed font-mono text-sm"
                    />
                  </div>
                </div>
                {editing && (
                  <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition">
                    Commit Updates
                  </button>
                )}
              </form>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Security Health
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">MFA Status</span>
                    <span className="text-emerald-600 font-bold">ENABLED</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">RBAC Role</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">{auth.user?.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Session Integrity</span>
                    <span className="text-slate-800 font-bold">HARDENED</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-slate-900 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-slate-800 transition uppercase tracking-widest">
                  Rotate Security Keys
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
