
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, User, UserRole, CartItem, Product, ToastMessage, ToastType } from './types';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ShopPage from './pages/ShopPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import Toast from './components/Toast';
import { logger } from './services/audit.service';

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: ToastType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within Provider");
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth_session');
    return saved ? JSON.parse(saved) : {
      user: null,
      token: null,
      isAuthenticated: false,
      isMfaPending: false
    };
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('auth_session', JSON.stringify(auth));
  }, [auth]);

  const showToast = useCallback((message: string, type: ToastType = 'INFO') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to manifest`, 'SUCCESS');
    logger.log(auth.user?.email || 'GUEST', 'CART_ADD', 'SUCCESS', { productId: product.id });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item purged from manifest', 'INFO');
    logger.log(auth.user?.email || 'GUEST', 'CART_REMOVE', 'SUCCESS', { productId });
  };

  const clearCart = () => setCart([]);

  const logout = () => {
    if (auth.user) logger.log(auth.user.email, 'LOGOUT', 'SUCCESS');
    setAuth({ user: null, token: null, isAuthenticated: false, isMfaPending: false });
    clearCart();
    localStorage.removeItem('auth_session');
    showToast('Secure session terminated', 'INFO');
  };

  const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: UserRole[] }) => {
    if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && auth.user && !roles.includes(auth.user.role)) {
      logger.log(auth.user.email, 'UNAUTHORIZED_ACCESS_ATTEMPT', 'WARNING', { requestedRoles: roles });
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, cart, addToCart, removeFromCart, clearCart, showToast }}>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          
          {/* Toast Container */}
          <div className="fixed top-20 right-4 z-[9999] space-y-3 pointer-events-none">
            {toasts.map(t => (
              <div key={t.id} className="pointer-events-auto">
                <Toast toast={t} onClose={closeToast} />
              </div>
            ))}
          </div>

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={[UserRole.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="bg-white border-t py-6 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SecureCart Enterprise &bull; 256-Bit Encrypted &bull; Audit Level 3
          </footer>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
