
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const bgStyles = {
    SUCCESS: 'bg-emerald-600',
    ERROR: 'bg-red-600',
    WARNING: 'bg-amber-500',
    INFO: 'bg-indigo-600'
  };

  const icons = {
    SUCCESS: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    ERROR: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    WARNING: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    INFO: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  };

  return (
    <div className={`flex items-center p-4 min-w-[300px] text-white rounded-2xl shadow-2xl animate-in slide-in-from-right-full duration-300 ${bgStyles[toast.type]}`}>
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icons[toast.type]}
        </svg>
      </div>
      <div className="flex-grow mr-4">
        <p className="text-sm font-bold tracking-tight">{toast.message}</p>
      </div>
      <button onClick={() => onClose(toast.id)} className="text-white/60 hover:text-white transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
