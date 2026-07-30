# Performance Budget

Budgets are enforced after `next build`.

```json
{
  "largestJavaScriptChunkBytes": 230000,
  "largestCssFileBytes": 90000,
  "largestHtmlFileBytes": 140000,
  "routeJavaScriptBytes": 420000,
  "routeCssBytes": 120000,
  "totalStaticAssetBytes": 2500000
}
```

## Commands

```bash
npm run build
npm run analyze:export
npm run check:performance
npm run lighthouse
```

## Principles

- Server Components remain the default.
- Verification-only client features are dynamically imported on their routes.
- No animation framework is included.
- No global state library is included.
- Outfit is self-hosted by `next/font`.
- Brand assets are local SVG files.
- Static route tests reject external network requests.
- Bundle increases require a documented reason and a reviewed budget change.
