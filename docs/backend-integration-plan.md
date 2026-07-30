# Backend Integration Plan

No HTTP implementation is included in this phase.

## Target adapter

```text
AuthGateway
├── MockAuthGateway          current
└── HttpAuthGateway          future explicit phase
```

`HttpAuthGateway` must implement the existing interface without changing page structure.

## Proposed endpoint mapping

The exact paths must be replaced by confirmed OpenAPI paths.

| Gateway method | Intended operation |
|---|---|
| `login` | `POST /api/v1/auth/login` |
| `lookupCitizen` | `POST /api/v1/registration/citizen/lookup` |
| `register` | `POST /api/v1/registration` |
| `verifyEmail` | `POST /api/v1/registration/email/verify` |
| `resendVerification` | `POST /api/v1/registration/email/resend` |
| `forgotPassword` | `POST /api/v1/passwords/forgot` |
| `resetPassword` | `POST /api/v1/passwords/reset` |
| identity attempt | `POST /api/v1/identity-verification/attempts` |
| upload policy/media | backend-confirmed attempt-bound endpoint |
| live-check session | `POST /api/v1/identity-verification/attempts/:id/liveness-session` |
| submit attempt | `POST /api/v1/identity-verification/attempts/:id/submit` |
| result/status | `GET /api/v1/identity-verification/attempts/:id` |

## Integration sequence

1. Export and review the backend OpenAPI document.
2. Finalize cookie, CSRF, CORS, and domain topology.
3. Reconcile every frontend type with backend DTOs.
4. Add an environment-schema module.
5. Implement one shared HTTP transport with timeouts and safe JSON parsing.
6. Implement `HttpAuthGateway`.
7. Add contract tests against a local backend test environment.
8. Replace the gateway provider behind a feature flag.
9. Integrate login and recovery first.
10. Integrate registration/NIDA challenge.
11. Integrate email verification.
12. Integrate private upload policy.
13. Integrate liveness and verification status.
14. Remove public mock scenario controls from production.
15. Complete penetration, accessibility, and failure-mode testing.

## Future environment variables

```text
NEXT_PUBLIC_MUCYORA_AUTH_API_ORIGIN
NEXT_PUBLIC_MUCYORA_AUTH_MODE
NEXT_PUBLIC_MUCYORA_USER_APP_ORIGIN
NEXT_PUBLIC_MUCYORA_SUPPORT_URL
```

Only public routing configuration may use `NEXT_PUBLIC_*`. Secrets, service credentials, signing keys, NIDA credentials, and Engine credentials never belong in the frontend.

## HTTP transport requirements

- HTTPS;
- explicit base origin;
- `credentials: include` only under the approved cookie model;
- CSRF header support;
- request timeout and abort signal;
- idempotency key support;
- response content-type validation;
- normalized safe errors;
- no token logging;
- no retry of login, registration, password reset, or biometric submission without an idempotency design.
