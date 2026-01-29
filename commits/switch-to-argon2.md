Switch to Argon2 for password hashing

Files: package.json, services/securityService.ts, pages/RegisterPage.tsx

Replace btoa pseudo-hashing with Argon2 and add verify functions.