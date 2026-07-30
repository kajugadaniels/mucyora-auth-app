
# Security Policy

## Current boundary

This repository is a static authentication UI foundation. It must not contact the MUCYORA Auth
backend, NIDA, object storage, email providers, or the biometric Engine during Phases 1-3.

## Prohibited data handling

Do not add code that stores passwords, National IDs, OTPs, identity images, access tokens, or
refresh tokens in localStorage, sessionStorage, URLs, analytics, logs, or mock fixtures.

## Asset security

All SVG assets in `public/brand` are local, script-free, and contain no external references.
Do not add remote SVGs without reviewing them for scripts, event handlers, embedded HTML, and
external resource references.

## Dependency and build security

- Generate and commit `package-lock.json` on the developer machine.
- Use `npm ci` after the lock file exists.
- Run `npm audit --audit-level=high` in the connected development environment.
- Keep the static-export boundary until backend integration is explicitly authorized.
- Do not publish source maps without review.

## Reporting

Report security concerns privately. Do not include credentials, real identity data, or production
system details in public issues.