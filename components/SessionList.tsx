import React from 'react';

const SessionList: React.FC = () => {
  // Placeholder data for sessions
  const sessions = [
    { id: 's1', device: 'Chrome on Windows', lastActive: '2026-01-28 12:34' },
    { id: 's2', device: 'iPhone 14', lastActive: '2026-01-27 08:21' }
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-black text-slate-700">Active Sessions</h4>
      <ul className="space-y-2">
        {sessions.map(s => (
          <li key={s.id} className="flex justify-between items-center bg-white p-3 rounded-lg border">
            <div>
              <div className="text-sm font-bold">{s.device}</div>
              <div className="text-[11px] text-slate-400">Last active: {s.lastActive}</div>
            </div>
            <button className="text-xs font-black text-red-500">Revoke</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
