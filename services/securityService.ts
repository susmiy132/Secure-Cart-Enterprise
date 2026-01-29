
import { ActivityLog, UserRole } from '../types';

// In-memory simulation of database collections
let logs: ActivityLog[] = [];
let lockedAccounts: Record<string, number> = {};

export const addActivityLog = (
  userId: string,
  action: string,
  metadata: Record<string, any> = {},
  status: 'SUCCESS' | 'FAILURE' | 'WARNING' = 'SUCCESS'
) => {
  // Added missing ipAddress property
  const newLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId,
    action,
    metadata,
    status,
    ipAddress: '127.0.0.1'
  };
  logs = [newLog, ...logs].slice(0, 1000); // Keep last 1000 logs
  console.log('[SECURITY LOG]:', newLog);
};

export const getLogs = () => logs;

export const verifyPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length > 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-5
};

export const simulateMfaVerification = async (code: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return code === '123456'; // Static mock code
};

// Password hashing helpers (stubs). Replace with Argon2 in production.
export const hashPassword = async (password: string): Promise<string> => {
  // NOTE: This is a placeholder. Replace with Argon2 or similar.
  return btoa(password);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const computed = await hashPassword(password);
  return computed === hash;
};

export const checkLockout = (email: string): number | null => {
  const lockedUntil = lockedAccounts[email];
  if (lockedUntil && lockedUntil > Date.now()) {
    return lockedUntil;
  }
  return null;
};

export const recordFailedAttempt = (email: string) => {
  // In a real app, this would be per IP or per User ID in DB
  const current = localStorage.getItem(`failed_${email}`) || '0';
  const next = parseInt(current) + 1;
  localStorage.setItem(`failed_${email}`, next.toString());

  if (next >= 5) {
    const lockoutTime = Date.now() + (5 * 60 * 1000); // 5 minutes
    lockedAccounts[email] = lockoutTime;
    localStorage.removeItem(`failed_${email}`);
    addActivityLog('SYSTEM', 'ACCOUNT_LOCKOUT', { email }, 'WARNING');
  }
};

export const resetFailedAttempts = (email: string) => {
  localStorage.removeItem(`failed_${email}`);
  delete lockedAccounts[email];
};
