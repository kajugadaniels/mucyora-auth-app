# Responsive and UX Audit

## Tested viewports

```text
320 × 568
390 × 844
768 × 1024
1440 × 900
```

The automated test checks horizontal overflow and minimum button target height.

## Layout behavior

- desktop: two-panel authentication shell;
- tablet: reduced brand-panel width;
- mobile: single-column shell with compact branding;
- short desktop height: cards align from the top rather than being vertically clipped;
- small landscape: reduced page padding;
- 320px width: compact page padding and toast width.

## Zoom interpretation

A 400% zoom desktop experience creates an effective CSS viewport close to 320px. The project therefore treats the 320px responsive test as a required proxy and still requires a manual browser-zoom review.

## UX recovery review

Every error state must answer:

1. what happened;
2. whether account or identity data changed;
3. what the user can do next;
4. whether retry timing is controlled by the server;
5. how to reach an approved support channel when integration is active.
