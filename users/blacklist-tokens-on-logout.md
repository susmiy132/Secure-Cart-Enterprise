Blacklist tokens on logout

Files: services/auth.service.ts, worker/tokenCleanup.worker.ts

Invalidate tokens immediately on logout and schedule cleanup of expired tokens.