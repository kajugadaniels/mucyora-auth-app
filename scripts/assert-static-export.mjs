import {
  existsSync,
  readFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd(), "out");

const expectedFiles = [
  "index.html",
  "404.html",
  "login/index.html",
  "create-account/index.html",
  "verify-email/index.html",
  "registration-complete/index.html",
  "forgot-password/index.html",
  "reset-password/index.html",
  "identity-verification/index.html",
  "identity-verification/document/index.html",
  "identity-verification/live-check/index.html",
  "identity-verification/result/index.html",
  "verification-required/index.html",
  "session-expired/index.html",
  "account-locked/index.html",
];

const errors = [];

for (const file of expectedFiles) {
  const path = join(root, file);

  if (!existsSync(path)) {
    errors.push(`Missing static export: ${file}`);
  }
}

if (existsSync(join(root, "index.html"))) {
  const home = readFileSync(
    join(root, "index.html"),
    "utf8",
  );

  if (
    !home.includes("Secure access starts here")
  ) {
    errors.push(
      "The exported home page does not contain the expected heading.",
    );
  }
}

if (errors.length) {
  console.error(
    "Static export validation failed:\n",
  );
  errors.forEach((error) =>
    console.error(`- ${error}`),
  );
  process.exit(1);
}

console.log(
  `Static export validation passed for ${expectedFiles.length} files.`,
);
