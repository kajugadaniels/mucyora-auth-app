# API Error Map

The UI must map stable backend codes to recovery actions. It must not render raw provider or database messages.

| Backend code | UI behavior |
|---|---|
| `INVALID_CREDENTIALS` | generic login error |
| `EMAIL_NOT_VERIFIED` | persistent verification-required notice |
| `ACCOUNT_LOCKED` | account-restriction route |
| `CITIZEN_NOT_FOUND` | inline NID lookup error |
| `CITIZEN_ALREADY_REGISTERED` | protected already-registered guidance |
| `EMAIL_ALREADY_USED` | inline email error |
| `REGISTRATION_CHALLENGE_EXPIRED` | restart NID lookup |
| `VERIFICATION_CODE_INVALID` | inline OTP error |
| `VERIFICATION_CODE_EXPIRED` | resend action |
| `RESET_REFERENCE_EXPIRED` | expired recovery-link state |
| `RATE_LIMITED` | server-provided retry time |
| `MEDIA_REJECTED` | replace image and preserve safe local state |
| `VERIFICATION_ATTEMPT_EXPIRED` | create a new attempt |
| `CAPTURE_QUALITY_RETRY` | guidance plus retry time |
| `VERIFICATION_PENDING` | pending state with polling/notification policy |
| `IDENTITY_MATCH_FAILED` | safe failure and support/review path |
| `PROVIDER_UNAVAILABLE` | outage state, not identity failure |
| `SESSION_EXPIRED` | sign-in route |
| `CSRF_INVALID` | clear unsafe state and reload protected session context |
| `UNEXPECTED_ERROR` | generic error with correlation reference |

## Required error envelope

The final backend should expose an equivalent constrained shape:

```json
{
  "code": "RATE_LIMITED",
  "message": "A safe user-facing summary.",
  "field": "email",
  "correlationId": "opaque-reference",
  "retryAfterSeconds": 60
}
```

The frontend must ignore unrecognized internal fields.
