Add exponential backoff for failed logins

Files: services/securityService.ts

Compute progressive delays after repeated failed logins to slow brute-force attempts.