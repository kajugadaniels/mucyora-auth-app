# MUCYORA Auth Frontend

Production Next.js authentication frontend and same-origin gateway for
`api/auth`. It runs on port `4000`; browser requests use paths such as
`/auth/login`, while the private backend origin and port remain server-only.

## Integrated flows

- credential login with full/limited session routing;
- NID-first registration with phone, password, and four versioned consents;
- email-link verification and limited identity-enrolment session exchange;
- enumeration-safe password recovery and single-use reset links;
- live National ID and liveness provider handoffs with no file upload;
- identity attempts, completion, manual accessibility review, and fresh login;
- session, passkey, recovery-code, and step-up methods in `HttpAuthGateway`;
- 35 explicit route handlers with no caller-controlled catch-all proxy.

Access tokens exist only in JavaScript memory. Refresh credentials remain in
HttpOnly cookies, and the readable CSRF cookie is copied to the backend header.
Backend validation and business error messages are rendered without frontend
replacement.

## Configuration

Create `.env.local` from `.env.example`. The essential local values are:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:4000
NEXT_PUBLIC_MUCYORA_APP_ORIGIN=http://localhost:4001
NEXT_PUBLIC_MUCYORA_CSRF_COOKIE_NAME=mucyora_csrf
NEXT_PUBLIC_MUCYORA_IDENTITY_POLICY_VERSION=2026-07-01
NEXT_PUBLIC_MUCYORA_DOCUMENT_CAPTURE_ORIGIN=https://capture.example.rw
NEXT_PUBLIC_MUCYORA_LIVENESS_ORIGIN=https://liveness.example.rw
MUCYORA_AUTH_API_ORIGIN=http://127.0.0.1:3000
MUCYORA_AUTH_PROXY_TIMEOUT_MS=30000
```

The two provider origins must be the exact approved browser clients for the
document-capture and liveness services. Do not use wildcard or untrusted
origins. `MUCYORA_AUTH_API_ORIGIN` must never be prefixed with `NEXT_PUBLIC_`.

## Run and validate

```bash
npm install
npm run dev
```

```bash
npm run check
npm run build
npm audit --omit=dev --audit-level=high
```

## Documentation

- [Registered endpoint mappings](docs/auth-endpoint-proxy.md)
- [Backend integration](docs/backend-integration-plan.md)
- [Browser session model](docs/auth-session-browser-model.md)
- [Security policy](SECURITY.md)
- [Git rules](docs/git.md)
