# Testing and Static Release Readiness

## Unit and component tests

```bash
npm run test
npm run test:coverage
```

## Browser installation

```bash
npm run playwright:install
```

## Browser suites

```bash
npm run test:e2e
npm run test:a11y
npm run test:no-network
```

## Visual regression

Generate the initial baselines once on the approved development platform:

```bash
npm run test:visual:update
```

Review the screenshots, then commit the generated snapshot files. Future changes use:

```bash
npm run test:visual
```

CI intentionally runs visual regression only after snapshot baselines exist.

## Static release gate

```bash
npm run release:check
npm run lighthouse
```

Expected output:

```text
out/
reports/static-export-analysis.json
reports/playwright/
reports/lighthouse/
```

## Release restrictions

The static build remains a demonstration. It must not be presented as real NIDA, email, account, session, upload, camera, or biometric functionality.
