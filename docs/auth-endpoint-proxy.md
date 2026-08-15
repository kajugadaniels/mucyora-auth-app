# Auth Endpoint Proxy

## Purpose

The Auth frontend exposes stable same-origin URLs on port `4000` and forwards
them server-side to `api/auth`. The browser never receives the backend origin,
port, database URL, AWS credentials, NIDA credentials, or internal service keys.

There is intentionally no catch-all route. Every approved operation has one
route file and a fixed backend mapping.

## Registered endpoints

### Authentication and sessions

| Method | Frontend path | Backend path |
|---|---|---|
| POST | `/auth/login` | `/api/v1/auth/login` |
| POST | `/auth/refresh` | `/api/v1/auth/refresh` |
| POST | `/auth/logout` | `/api/v1/auth/logout` |
| POST | `/auth/logout-all` | `/api/v1/auth/logout-all` |
| GET | `/auth/sessions` | `/api/v1/auth/sessions` |
| DELETE | `/auth/sessions/:sessionId` | `/api/v1/auth/sessions/:sessionId` |
| POST | `/auth/session/upgrade` | `/api/v1/auth/session/upgrade` |

### Passwords and passkeys

| Method | Frontend path | Backend path |
|---|---|---|
| POST | `/auth/password/forgot` | `/api/v1/auth/password/forgot` |
| POST | `/auth/password/reset` | `/api/v1/auth/password/reset` |
| POST | `/auth/password/change` | `/api/v1/auth/password/change` |
| GET | `/auth/passkeys` | `/api/v1/auth/passkeys` |
| DELETE | `/auth/passkeys/:credentialId` | `/api/v1/auth/passkeys/:credentialId` |
| POST | `/auth/passkeys/registration/options` | `/api/v1/auth/passkeys/registration/options` |
| POST | `/auth/passkeys/registration/verify` | `/api/v1/auth/passkeys/registration/verify` |
| POST | `/auth/passkeys/authentication/options` | `/api/v1/auth/passkeys/authentication/options` |
| POST | `/auth/passkeys/authentication/verify` | `/api/v1/auth/passkeys/authentication/verify` |
| POST | `/auth/passkeys/recovery-codes` | `/api/v1/auth/passkeys/recovery-codes` |
| POST | `/auth/recovery-codes/consume` | `/api/v1/auth/recovery-codes/consume` |

### Registration

| Method | Frontend path | Backend path |
|---|---|---|
| POST | `/registration` | `/api/v1/registration` |
| POST | `/registration/citizen/lookup` | `/api/v1/registration/citizen/lookup` |
| POST | `/registration/email/verify` | `/api/v1/registration/email/verify` |
| POST | `/registration/email/resend` | `/api/v1/registration/email/resend` |
| POST | `/registration/identity-session` | `/api/v1/registration/identity-session` |
| POST | `/registration/identity-completion/consume` | `/api/v1/registration/identity-completion/consume` |

### Identity verification

| Method | Frontend path | Backend path |
|---|---|---|
| POST | `/identity-verification/attempts` | `/api/v1/identity-verification/attempts` |
| GET | `/identity-verification/attempts/:attemptId` | `/api/v1/identity-verification/attempts/:attemptId` |
| POST | `/identity-verification/attempts/:attemptId/document-capture-session` | `/api/v1/identity-verification/attempts/:attemptId/document-capture-session` |
| POST | `/identity-verification/attempts/:attemptId/document-capture/complete` | `/api/v1/identity-verification/attempts/:attemptId/document-capture/complete` |
| POST | `/identity-verification/attempts/:attemptId/liveness-session` | `/api/v1/identity-verification/attempts/:attemptId/liveness-session` |
| POST | `/identity-verification/attempts/:attemptId/submit` | `/api/v1/identity-verification/attempts/:attemptId/submit` |
| POST | `/identity-verification/attempts/:attemptId/manual-review` | `/api/v1/identity-verification/attempts/:attemptId/manual-review` |
| GET | `/identity-verification/status` | `/api/v1/identity-verification/status` |

### Step-up verification

| Method | Frontend path | Backend path |
|---|---|---|
| POST | `/step-up/challenges` | `/api/v1/step-up/challenges` |
| GET | `/step-up/challenges/:challengeId` | `/api/v1/step-up/challenges/:challengeId` |
| POST | `/step-up/challenges/:challengeId/assertion` | `/api/v1/step-up/challenges/:challengeId/assertion` |

Internal operations, health probes, and JWKS publication are not proxied for
browser use.

## Response contract

The gateway does not parse, translate, or recreate backend business envelopes.
It preserves the status, body, content type, correlation ID, retry metadata, and
authentication cookies returned by `api/auth`. Consequently, validation,
success, and business error messages remain backend-owned.

If the upstream is unreachable, times out, is misconfigured, or the request
violates the proxy transport boundary, the gateway returns an empty 4xx/5xx
response. It does not invent a user-facing message.
