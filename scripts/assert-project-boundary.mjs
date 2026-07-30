import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];

const required = [
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/app/(auth)/page.tsx",
  "src/app/(auth)/page.module.css",
  "src/app/(auth)/login/page.tsx",
  "src/app/(auth)/login/page.module.css",
  "src/app/(auth)/create-account/page.tsx",
  "src/app/(auth)/create-account/page.module.css",
  "src/app/(auth)/verify-email/page.tsx",
  "src/app/(auth)/verify-email/page.module.css",
  "src/app/(auth)/registration-complete/page.tsx",
  "src/app/(auth)/forgot-password/page.tsx",
  "src/app/(auth)/reset-password/page.tsx",
  "playwright.config.ts",
  "lighthouserc.json",
  "performance-budgets.json",
  "docs/accessibility-audit.md",
  "docs/backend-integration-plan.md",
  "next.config.ts",
  "src/config/ui.config.ts",
  "public/brand/logo-mark.svg",
  "public/brand/logo-full.svg",
  "src/components/ui/Button/Button.tsx",
  "src/components/ui/Input/Input.tsx",
  "src/components/ui/SelectField/SelectField.tsx",
  "src/components/ui/TextareaField/TextareaField.tsx",
  "src/components/ui/ImageField/ImageField.tsx",
  "src/components/ui/SonnerProvider/SonnerProvider.tsx",
  "src/components/accessibility/RouteAccessibilityManager/RouteAccessibilityManager.tsx",
  "src/components/ui/RouteLoadingPanel/RouteLoadingPanel.tsx",
  "src/components/auth/AuthShell/AuthShell.tsx",
  "src/components/auth/CreateAccountFlow/CreateAccountFlow.tsx",
  "src/components/auth/RegistrationStepper/RegistrationStepper.tsx",
  "src/components/forms/LoginForm/LoginForm.tsx",
  "src/components/forms/CitizenLookupForm/CitizenLookupForm.tsx",
  "src/components/forms/EmailVerificationForm/EmailVerificationForm.tsx",
  "src/components/forms/ForgotPasswordForm/ForgotPasswordForm.tsx",
  "src/components/forms/ResetPasswordForm/ResetPasswordForm.tsx",
  "src/app/(auth)/identity-verification/page.tsx",
  "src/app/(auth)/identity-verification/document/page.tsx",
  "src/app/(auth)/identity-verification/live-check/page.tsx",
  "src/app/(auth)/identity-verification/result/page.tsx",
  "src/app/(auth)/verification-required/page.tsx",
  "src/app/(auth)/session-expired/page.tsx",
  "src/app/(auth)/account-locked/page.tsx",
  "src/components/auth/VerificationStepper/VerificationStepper.tsx",
  "src/components/auth/IdentityGuide/IdentityGuide.tsx",
  "src/components/auth/SelfieFrame/SelfieFrame.tsx",
  "src/components/auth/VerificationResult/VerificationResult.tsx",
  "src/components/auth/AccountStatusPanel/AccountStatusPanel.tsx",
  "src/components/forms/IdentityDocumentForm/IdentityDocumentForm.tsx",
  "src/components/forms/LiveCheckForm/LiveCheckForm.tsx",
  "src/mocks/services/MockAuthGateway.ts",
  "src/services/auth/AuthGateway.ts",
  "src/lib/validation/auth.schemas.ts",
];

for (const file of required) {
  if (!existsSync(join(root, file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const forbidden of [
  "src/app/api",
  "src/middleware.ts",
  "middleware.ts",
  "tailwind.config.ts",
]) {
  if (existsSync(join(root, forbidden))) {
    errors.push(`Forbidden in the static frontend: ${forbidden}`);
  }
}

const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs"]);

function walk(directory, files = []) {
  if (!existsSync(directory)) return files;

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path, files);
    } else if (textExtensions.has(extname(path))) {
      files.push(path);
    }
  }

  return files;
}

for (const file of walk(join(root, "src"))) {
  const name = relative(root, file);
  const source = readFileSync(file, "utf8");

  for (const forbidden of [
    "localStorage",
    "sessionStorage",
    "document.cookie",
    "fetch(",
    "axios",
    "NEXT_PUBLIC_API_URL",
    "getUserMedia(",
    "MediaRecorder(",
  ]) {
    if (source.includes(forbidden)) {
      errors.push(`${name} contains forbidden static-phase behavior: ${forbidden}`);
    }
  }
}

const env = readFileSync(join(root, ".env.example"), "utf8");
for (const forbidden of ["API_URL", "TOKEN", "SECRET", "PASSWORD"]) {
  if (env.includes(forbidden)) {
    errors.push(`.env.example contains forbidden static-phase key fragment: ${forbidden}`);
  }
}

function assertComponentModules(componentRoot) {
  if (!existsSync(componentRoot)) return;

  for (const component of readdirSync(componentRoot)) {
    const directory = join(componentRoot, component);
    if (!statSync(directory).isDirectory()) continue;

    const componentPath = join(directory, `${component}.tsx`);
    const cssPath = join(directory, `${component}.module.css`);
    if (!existsSync(componentPath)) continue;

    if (!existsSync(cssPath)) {
      errors.push(`${relative(root, componentPath)} is missing its CSS Module.`);
      continue;
    }

    if (!readFileSync(componentPath, "utf8").includes(`./${component}.module.css`)) {
      errors.push(`${relative(root, componentPath)} does not import its CSS Module.`);
    }
  }
}

assertComponentModules(join(root, "src/components/ui"));
assertComponentModules(join(root, "src/components/auth"));
assertComponentModules(join(root, "src/components/forms"));

if (errors.length) {
  console.error("Project boundary check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Project boundary check passed.");
