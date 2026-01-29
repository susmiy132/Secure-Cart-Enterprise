import React from 'react';
import { useNavigate } from 'react-router-dom';

const MfaSetup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-3xl font-black mb-4">MFA Setup (TOTP)</h2>
      <p className="text-slate-500 text-sm mb-6">This is a UI placeholder to enroll or verify TOTP-based MFA.</p>
      <button onClick={() => navigate('/profile')} className="bg-indigo-600 text-white py-2 px-4 rounded">Back</button>
    </div>
  );
};

export default MfaSetup;
