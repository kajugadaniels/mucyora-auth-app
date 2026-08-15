# Server Deployment

## Build

```bash
npm ci
npm run release:check
npm run lighthouse
```

Deploy the complete Next.js application on a supported Node.js runtime. Static
object hosting is no longer sufficient because authentication route handlers
must execute on the server.

## Hosting requirements

- HTTPS only;
- a private HTTPS route from the frontend server to `api/auth`;
- `MUCYORA_AUTH_API_ORIGIN` stored as server-only configuration;
- no public access to the backend origin from browser bundles;
- HTML served with short or no-cache policy;
- hashed `_next/static` assets served with long immutable caching;
- authentication proxy responses served with `Cache-Control: no-store`;
- no injected third-party scripts;
- no public source maps unless approved;
- a restrictive Content Security Policy appropriate for the final hosting platform.

## Suggested cache policy

```text
HTML:
Cache-Control: no-cache

/_next/static/*:
Cache-Control: public, max-age=31536000, immutable

Local brand assets:
Cache-Control: public, max-age=86400
```

## Rollback

Keep the last known-good immutable application image and configuration version.
Rollback the frontend independently without changing database state or restoring
old authentication credentials.
