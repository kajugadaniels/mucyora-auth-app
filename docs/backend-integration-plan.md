# Backend Integration Plan

## Current status

The same-origin HTTP boundary is implemented and tested. All approved public
Auth operations are available through individual Next.js route handlers. The
browser-visible paths and backend mappings are recorded in
[Auth endpoint proxy](auth-endpoint-proxy.md).

## Target adapter

```text
AuthGateway
├── MockAuthGateway          current
└── HttpAuthGateway          next integration phase
```

`HttpAuthGateway` must call only the registered same-origin paths. It must never
receive or construct the private Auth service origin.

## Gateway mapping

| Gateway method | Intended operation |
|---|---|
| `login` | `POST /auth/login` |
| `lookupCitizen` | `POST /registration/citizen/lookup` |
| `register` | `POST /registration` |
| `verifyEmail` | `POST /registration/email/verify` |
| `resendVerification` | `POST /registration/email/resend` |
| `forgotPassword` | `POST /auth/password/forgot` |
| `resetPassword` | `POST /auth/password/reset` |
| identity attempt | `POST /identity-verification/attempts` |
| live document session | `POST /identity-verification/attempts/:id/document-capture-session` |
| live-check session | `POST /identity-verification/attempts/:id/liveness-session` |
| submit attempt | `POST /identity-verification/attempts/:id/submit` |
| result/status | `GET /identity-verification/attempts/:id` |

## Integration sequence

1. Export the backend OpenAPI document and generate/reconcile frontend DTOs.
2. Extend `AuthGateway` for the complete NID-first and live-capture state model.
3. Implement `HttpAuthGateway` against same-origin paths only.
4. Keep access tokens in memory and use the approved cookie/CSRF refresh model.
5. Integrate login and password recovery.
6. Integrate NID lookup, registration, and email verification.
7. Integrate limited identity-enrolment sessions.
8. Integrate provider-backed live document and liveness sessions.
9. Integrate verification completion and the required fresh-login redirect.
10. Remove production mock controls and complete contract, accessibility,
    security, concurrency, and failure-mode testing.

## Environment boundary

```text
NEXT_PUBLIC_MUCYORA_AUTH_MODE
NEXT_PUBLIC_MUCYORA_USER_APP_ORIGIN
NEXT_PUBLIC_MUCYORA_SUPPORT_URL
MUCYORA_AUTH_API_ORIGIN
MUCYORA_AUTH_PROXY_TIMEOUT_MS
```

`MUCYORA_AUTH_API_ORIGIN` is server-only. It must never be exposed as
`NEXT_PUBLIC_*`. Secrets, service credentials, signing keys, NIDA credentials,
AWS credentials, and Engine credentials never belong in browser code.

## HTTP transport requirements

- HTTPS;
- same-origin browser paths only;
- `credentials: include` only under the approved cookie model;
- CSRF header support;
- request timeout and abort signal;
- idempotency key support;
- response content-type validation;
- exact backend business messages and constrained empty proxy failures;
- no token logging;
- no retry of login, registration, password reset, or biometric submission without an idempotency design.
