Add refresh token storage & revocation

Files: services/db.service.ts, services/auth.service.ts

Persist refresh tokens server-side and allow revocation on logout or theft.