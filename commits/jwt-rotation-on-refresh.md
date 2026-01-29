Implement JWT rotation on refresh

Files: services/auth.service.ts

Rotate access tokens on refresh and invalidate old tokens to prevent replay.