Add audit logging for auth events

Files: services/audit.service.ts

Emit LOGIN, LOCKOUT, and PASSWORD_RESET audit events for traceability.