
import React, { useState, useEffect } from 'react';
import { logger } from '../services/audit.service';
import { ActivityLog } from '../types';

const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    setLogs(logger.getLogs());
    const interval = setInterval(() => setLogs(logger.getLogs()), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Security Command Center</h1>
          <p className="text-slate-500 font-medium">Real-time system integrity and transaction audit.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center">
             <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
             Firewall Active
           </div>
           <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100 flex items-center">
             <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
             IDS Enabled
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Threats</p>
          <p className="text-3xl font-black mt-1 text-slate-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Secure Transactions</p>
          <p className="text-3xl font-black mt-1 text-indigo-600">
            {logs.filter(l => l.action.includes('TRANSACTION_SUCCESS')).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Security Events</p>
          <p className="text-3xl font-black mt-1 text-slate-900">{logs.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Raw Audit Stream (Immutable)</h3>
          <span className="text-[10px] font-bold text-slate-400">SESSION ID: {Math.random().toString(36).toUpperCase().slice(2,8)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Event Time</th>
                <th className="px-8 py-5">Subject (User)</th>
                <th className="px-8 py-5">Activity Hook</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}.{new Date(log.timestamp).getMilliseconds()}
                  </td>
                  <td className="px-8 py-4 font-bold text-slate-700 text-sm">{log.userId}</td>
                  <td className="px-8 py-4">
                     <span className="font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] group-hover:bg-indigo-100 group-hover:text-indigo-700 transition">
                       {log.action}
                     </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      log.status === 'FAILURE' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-slate-300 hover:text-indigo-600 transition" title={JSON.stringify(log.metadata, null, 2)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
