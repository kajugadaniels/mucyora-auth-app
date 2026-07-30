# Browser Authentication and Session Model

## Recommended production model

### Access token

- short-lived;
- held in memory;
- never placed in localStorage or sessionStorage;
- renewed through the approved refresh mechanism;
- omitted entirely from browser JavaScript when a backend-for-frontend/session-cookie topology is selected.

### Refresh credential

Preferred browser storage:

```text
HttpOnly
Secure
SameSite=Lax or stricter after flow review
Path restricted to the refresh endpoint where practical
Domain omitted unless cross-subdomain design requires it
```

JavaScript must not read the refresh credential.

## CSRF

When cookies are used:

- validate Origin and Referer at the backend;
- use SameSite protection;
- require a CSRF token/header for state-changing requests where the topology requires it;
- never exempt refresh, logout, password, or verification operations without review.

## CORS

- exact allowlist;
- no `*` with credentials;
- only required methods and headers;
- `Access-Control-Allow-Credentials: true` only under the cookie model;
- separate development and production origins;
- preflight responses cached conservatively.

## Session transitions

```text
anonymous
  -> email verified / identity pending
  -> LIMITED session
  -> identity verified
  -> FULL session
```

The session-upgrade endpoint must rotate or revoke the limited refresh family before returning full credentials.

## Logout

- revoke the server session;
- clear refresh cookie;
- clear in-memory access state;
- redirect to a safe static sign-in route;
- do not claim logout succeeded if server revocation failed.

## Recovery

A password reset should revoke or review existing sessions under backend policy and require a fresh sign-in.
