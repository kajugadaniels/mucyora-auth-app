# Performance Baseline

## Static architecture baseline

- Root layout remains a Server Component.
- The foundation page remains a Server Component.
- Client boundaries are limited to interactive reusable controls and Sonner.
- Static export is configured through `output: "export"`.
- Images are local, dimensioned, and unoptimized for static hosting compatibility.
- Outfit is loaded through `next/font` with four selected weights.
- No animation, state, form, or icon package is loaded globally beyond Sonner's provider.

## Measurement status

Lighthouse and route-bundle measurements require an installed production build. The current
execution environment could not resolve the npm registry, so the baseline measurement must be run
on the developer machine after `npm install`: