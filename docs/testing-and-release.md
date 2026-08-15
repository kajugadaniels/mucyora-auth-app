# Testing and Server Release Readiness

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

## Release gate

```bash
npm run release:check
npm run lighthouse
```

Expected evidence:

```text
.next/
reports/playwright/
reports/lighthouse/
```

## Release restrictions

The endpoint registration layer is production-oriented, but the current forms
remain on the mock gateway until the explicit UI integration phase. Do not
present mock NIDA, email, account, camera, or biometric behavior as live.
