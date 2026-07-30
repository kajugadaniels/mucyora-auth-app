# Accessibility Audit

## Target

WCAG 2.2 AA for every static authentication route.

## Controls implemented

- one visible page heading;
- route-change focus moved to the new page heading;
- polite screen-reader route announcement;
- skip link to the main authentication content;
- visible keyboard focus;
- labels and descriptions associated with controls;
- inline validation linked with `aria-describedby`;
- 44px minimum action targets;
- high-contrast and forced-colors support;
- reduced-motion support;
- no color-only status communication;
- top-center toast messages supplemented with persistent page context where recovery is required.

## Automated checks

```bash
npm run test:a11y
npm run test:e2e
```

The Playwright axe suite scans every current route using WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA tags.

## Manual audit checklist

- VoiceOver on macOS and iOS;
- NVDA on Windows;
- keyboard-only registration and verification;
- 200% browser zoom;
- 400% zoom for login and account creation;
- high-contrast/forced-colors mode;
- reduced-motion preference;
- mobile software-keyboard overlap;
- toast announcement timing;
- image-field drag, browse, replace, and remove actions.

## Status

Automated coverage and route focus management are implemented. The final manual assistive-technology audit must be performed on the developer's target devices before production integration.
