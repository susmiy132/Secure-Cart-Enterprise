
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: UserRole;
  mfaSecret: string;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lockUntil?: number;
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  metadata: any;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  ipAddress: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isMfaPending: boolean;
}

export type ToastType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
