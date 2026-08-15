
# Security Policy

## Current boundary

This application is the browser-facing authentication UI and same-origin Auth
gateway. Browser code may call only registered local routes. Only server-side
route handlers may contact the configured `api/auth` origin.

The frontend must never call NIDA, object storage, mail providers, the biometric
Engine, or internal Auth endpoints directly.

## Proxy controls

- `MUCYORA_AUTH_API_ORIGIN` is server-only and must never use `NEXT_PUBLIC_`.
- Non-loopback upstream origins require HTTPS and cannot contain credentials,
  paths, queries, or fragments.
- Each approved backend operation has one explicit route file; there is no
  catch-all proxy and no caller-controlled upstream URL.
- Cross-site requests are rejected before upstream access.
- Request headers are allowlisted and bodies are bounded to the Auth service's
  256 KiB limit.
- Redirects are not followed and responses are never cached.
- Backend response bodies and user-facing messages are forwarded unchanged.
- Proxy-generated infrastructure failures contain no fabricated business error
  or success message.
- Backend cookie domains are removed. HttpOnly credentials are scoped to
  `/auth`; browser-readable CSRF cookies remain available to same-origin pages.

## Prohibited data handling

Do not add code that stores passwords, National IDs, email/reset tokens,
identity images, access tokens, or refresh tokens in localStorage,
sessionStorage, query strings, analytics, or logs. Access tokens are held only
in process memory; refresh tokens remain HttpOnly.

## Live-capture boundary

- Existing ID images and selfie uploads are not accepted.
- Provider credentials travel only in a URL fragment to an exact configured
  HTTPS provider origin.
- Completion messages must match the expected origin, popup window, event type,
  and session ID.
- The provider popup is bounded to ten minutes and closed on completion.
- Media never transits this frontend. Auth retrieves and verifies provider
  evidence server-to-server.
- Never add provider origins that are not operated or contractually approved by
  MUCYORA.

## Asset security

All SVG assets in `public/brand` are local, script-free, and contain no external references.
Do not add remote SVGs without reviewing them for scripts, event handlers, embedded HTML, and
external resource references.

## Dependency and build security

- Generate and commit `package-lock.json` on the developer machine.
- Use `npm ci` after the lock file exists.
- Run `npm audit --audit-level=high` in the connected development environment.
- Deploy with a supported Node.js runtime; static hosting cannot execute the
  same-origin route handlers.
- Do not publish source maps without review.

## Reporting

Report security concerns privately. Do not include credentials, real identity data, or production
system details in public issues.
