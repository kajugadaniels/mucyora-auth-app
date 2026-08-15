# Backend Integration

## Status

The browser UI is connected to `api/auth` through `HttpAuthGateway`. The
gateway calls only same-origin route handlers and never constructs or reads the
private backend origin.

## Registration and enrolment

1. Submit the Rwanda NID to `/registration/citizen/lookup`.
2. Keep the returned challenge token in memory.
3. Register email, Rwandan phone, password, and the four required consents.
4. Open the single-use email verification link.
5. Exchange its enrolment token for a limited cookie-backed session.
6. Create an identity attempt and provider-bound document capture session.
7. Complete live document and liveness provider SDK flows.
8. Submit the attempt and follow the backend `nextAction`.
9. Consume the completion reference once and require a fresh login.

## Browser security model

- access tokens are memory-only;
- refresh tokens are HttpOnly cookies;
- CSRF values come from the readable cookie and are sent as a header;
- password, NID, provider token, and biometric evidence are never persisted;
- provider windows use exact origins, URL fragments, and session-bound
  `postMessage` validation;
- backend response messages and correlation references are preserved;
- 401 responses clear in-memory access state;
- no automatic retry occurs for login, registration, password reset, or final
  identity submission.

## Provider contract

The approved document and liveness browser clients must:

- be hosted at the exact configured HTTPS origins;
- consume credentials only from the URL fragment;
- disallow existing-file and gallery uploads;
- bind capture to the supplied session ID;
- notify the opener only after provider completion using
  `MUCYORA_DOCUMENT_CAPTURE_COMPLETED` or `MUCYORA_LIVENESS_COMPLETED`;
- return the exact `sessionId` in the message;
- never send media or provider payloads through the Auth frontend.

Auth verifies provider results server-to-server before allowing the next state.
