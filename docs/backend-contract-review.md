# Backend Contract Review

## Review status

The frontend `AuthGateway` and the backend implementation plan were available for this phase. The live GitHub repository and generated OpenAPI document could not be retrieved from the current environment.

Therefore:

- the mapping below is an integration design;
- no endpoint is claimed as confirmed solely from the repository;
- the actual OpenAPI document must be exported from `mucyora/api/auth` and reconciled before `HttpAuthGateway` is implemented.

## Frontend operations requiring backend confirmation

| Frontend operation | Intended backend capability |
|---|---|
| `login` | credential login and limited/full session decision |
| `lookupCitizen` | NIDA-backed registration challenge |
| `register` | atomic challenge consumption and account creation |
| `verifyEmail` | single-use email verification |
| `resendVerification` | throttled verification resend |
| `forgotPassword` | enumeration-safe recovery request |
| `resetPassword` | single-use reset completion |
| `submitIdentityDocument` | attempt-bound private media preparation |
| `startLiveCheck` | provider-backed liveness and Engine orchestration |

## Required OpenAPI export

Before integration:

```bash
# Run in api/auth using the backend's approved command.
# Export the generated OpenAPI JSON without production secrets.
```

The exported schema must confirm:

- base path and API version;
- DTO names and exact field casing;
- cookie and CSRF requirements;
- response envelopes;
- safe error codes;
- idempotency headers;
- upload-policy flow;
- liveness-session flow;
- retry and status semantics;
- CORS origins and credential policy.
