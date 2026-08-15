# MUCYORA Auth Frontend

Production-oriented Next.js authentication frontend for MUCYORA. It runs on
port `4000` and exposes a server-side, same-origin gateway for the public
`api/auth` contract. Browser code calls paths such as `/auth/login`; the private
Auth service origin and port are never bundled into the browser.

## Current status

- 35 public Auth endpoints are registered as individual route files.
- Internal operations, NIDA credentials, AWS credentials, Engine keys, and
  service-to-service keys are not exposed.
- Upstream status codes, JSON bodies, backend validation messages, correlation
  IDs, retry metadata, and authentication cookies are preserved.
- Business validation remains owned by `api/auth`; the proxy only enforces
  transport boundaries such as same-origin access, body limits, safe URLs, and
  timeouts.
- UI forms still use the mock gateway. Connecting those forms is the next,
  explicitly separate integration phase.

## Local configuration

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:4000
MUCYORA_AUTH_API_ORIGIN=http://127.0.0.1:3000
MUCYORA_AUTH_PROXY_TIMEOUT_MS=30000
```

`MUCYORA_AUTH_API_ORIGIN` is server-only. Never rename it with a
`NEXT_PUBLIC_` prefix.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4000`. The backend must be running separately on its
configured private origin.

## Quality gates

```bash
npm run check:structure
npm run typecheck
npm test
npm run build
```

Endpoint-specific tests:

```bash
npm test -- --run src/server/auth-proxy.test.ts tests/auth-proxy-routes.test.ts
```

## Documentation

- [Registered Auth endpoints](docs/auth-endpoint-proxy.md)
- [Backend integration plan](docs/backend-integration-plan.md)
- [Browser session model](docs/auth-session-browser-model.md)
- [Security policy](SECURITY.md)
- [Testing and release](docs/testing-and-release.md)
