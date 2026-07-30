# Reusable UI Component Library

All components live under `src/components/ui/<ComponentName>` and export through that directory's
`index.ts`. The package-wide barrel is `src/components/ui/index.ts`.

## Control rules

- standard controls display a semantic icon;
- control text is 12px;
- controls are at least 44px high;
- errors are associated with controls through IDs and ARIA attributes;
- disabled and loading states are explicit;
- no component persists sensitive values;
- no component performs a backend request.

## Button loading

`Button` and `IconButton` use `LoadingSpinner`. Loading disables the action, sets `aria-busy`, and
preserves the control's dimensions.

## ImageField

`ImageField` validates type and size, creates a local object-URL preview, revokes object URLs, and
exposes selection through `onChange`. It never uploads or persists the file.

## OTP

`OtpInput` supports typing, arrow navigation, backspace movement, and complete-code paste. It
exposes one combined value to its consumer.