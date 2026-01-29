
import { DB } from './db.service';
import { ActivityLog } from '../types';

export const logger = {
  log: (userId: string, action: string, status: 'SUCCESS' | 'FAILURE' | 'WARNING', metadata: any = {}) => {
    const entry: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      action,
      status,
      metadata,
      ipAddress: '127.0.0.1' // Simulated IP
    };
    DB.insertOne('logs', entry);
    console.warn(`[SECURITY AUDIT]: ${action} - ${status}`, entry);
  },
  
  getLogs: () => DB.findMany<ActivityLog>('logs').sort((a,b) => b.timestamp.localeCompare(a.timestamp))
};
