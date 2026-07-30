# Static Deployment

## Build

```bash
npm ci
npm run release:check
npm run lighthouse
```

Deploy the contents of:

```text
out/
```

## Hosting requirements

- HTTPS only;
- correct `text/html`, JavaScript, CSS, font, SVG, and image content types;
- HTML served with short or no-cache policy;
- hashed `_next/static` assets served with long immutable caching;
- custom 404 mapped to `404.html`;
- no directory listing;
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

Keep the last known-good `out/` artifact and deploy using immutable release identifiers. A static rollback must not depend on database or backend changes.
