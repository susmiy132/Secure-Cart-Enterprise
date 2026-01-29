
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { auth, logout, cart } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold bg-slate-900 text-white px-3 py-1 rounded-lg">
            S.CART
          </Link>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 transition">Market</Link>
            {auth.user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 transition font-bold">Audit Dashboard</Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>

          {auth.isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {auth.user?.fullName.charAt(0)}
                </div>
                <span className="hidden sm:inline">{auth.user?.fullName}</span>
              </Link>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
