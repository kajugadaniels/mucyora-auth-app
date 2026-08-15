import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROUTE_ROOT = resolve(process.cwd(), "src/app");

const expectedRoutes: Record<string, { method: string; path: string }> = {
  "auth/login/route.ts": { method: "POST", path: "auth/login" },
  "auth/logout-all/route.ts": { method: "POST", path: "auth/logout-all" },
  "auth/logout/route.ts": { method: "POST", path: "auth/logout" },
  "auth/passkeys/[credentialId]/route.ts": {
    method: "DELETE",
    path: "auth/passkeys/:credentialId",
  },
  "auth/passkeys/authentication/options/route.ts": {
    method: "POST",
    path: "auth/passkeys/authentication/options",
  },
  "auth/passkeys/authentication/verify/route.ts": {
    method: "POST",
    path: "auth/passkeys/authentication/verify",
  },
  "auth/passkeys/recovery-codes/route.ts": {
    method: "POST",
    path: "auth/passkeys/recovery-codes",
  },
  "auth/passkeys/registration/options/route.ts": {
    method: "POST",
    path: "auth/passkeys/registration/options",
  },
  "auth/passkeys/registration/verify/route.ts": {
    method: "POST",
    path: "auth/passkeys/registration/verify",
  },
  "auth/passkeys/route.ts": { method: "GET", path: "auth/passkeys" },
  "auth/password/change/route.ts": {
    method: "POST",
    path: "auth/password/change",
  },
  "auth/password/forgot/route.ts": {
    method: "POST",
    path: "auth/password/forgot",
  },
  "auth/password/reset/route.ts": {
    method: "POST",
    path: "auth/password/reset",
  },
  "auth/recovery-codes/consume/route.ts": {
    method: "POST",
    path: "auth/recovery-codes/consume",
  },
  "auth/refresh/route.ts": { method: "POST", path: "auth/refresh" },
  "auth/session/upgrade/route.ts": {
    method: "POST",
    path: "auth/session/upgrade",
  },
  "auth/sessions/[sessionId]/route.ts": {
    method: "DELETE",
    path: "auth/sessions/:sessionId",
  },
  "auth/sessions/route.ts": { method: "GET", path: "auth/sessions" },
  "identity-verification/attempts/[attemptId]/document-capture-session/route.ts": {
    method: "POST",
    path: "identity-verification/attempts/:attemptId/document-capture-session",
  },
  "identity-verification/attempts/[attemptId]/document-capture/complete/route.ts": {
    method: "POST",
    path: "identity-verification/attempts/:attemptId/document-capture/complete",
  },
  "identity-verification/attempts/[attemptId]/liveness-session/route.ts": {
    method: "POST",
    path: "identity-verification/attempts/:attemptId/liveness-session",
  },
  "identity-verification/attempts/[attemptId]/manual-review/route.ts": {
    method: "POST",
    path: "identity-verification/attempts/:attemptId/manual-review",
  },
  "identity-verification/attempts/[attemptId]/route.ts": {
    method: "GET",
    path: "identity-verification/attempts/:attemptId",
  },
  "identity-verification/attempts/[attemptId]/submit/route.ts": {
    method: "POST",
    path: "identity-verification/attempts/:attemptId/submit",
  },
  "identity-verification/attempts/route.ts": {
    method: "POST",
    path: "identity-verification/attempts",
  },
  "identity-verification/status/route.ts": {
    method: "GET",
    path: "identity-verification/status",
  },
  "registration/citizen/lookup/route.ts": {
    method: "POST",
    path: "registration/citizen/lookup",
  },
  "registration/email/resend/route.ts": {
    method: "POST",
    path: "registration/email/resend",
  },
  "registration/email/verify/route.ts": {
    method: "POST",
    path: "registration/email/verify",
  },
  "registration/identity-completion/consume/route.ts": {
    method: "POST",
    path: "registration/identity-completion/consume",
  },
  "registration/identity-session/route.ts": {
    method: "POST",
    path: "registration/identity-session",
  },
  "registration/route.ts": { method: "POST", path: "registration" },
  "step-up/challenges/[challengeId]/assertion/route.ts": {
    method: "POST",
    path: "step-up/challenges/:challengeId/assertion",
  },
  "step-up/challenges/[challengeId]/route.ts": {
    method: "GET",
    path: "step-up/challenges/:challengeId",
  },
  "step-up/challenges/route.ts": {
    method: "POST",
    path: "step-up/challenges",
  },
};

describe("registered Auth proxy routes", () => {
  it("registers every approved public endpoint in its own route file", () => {
    const actualRouteFiles = walk(ROUTE_ROOT)
      .filter((file) => file.endsWith("route.ts"))
      .map((file) => relative(ROUTE_ROOT, file))
      .sort();

    expect(actualRouteFiles).toEqual(Object.keys(expectedRoutes).sort());
  });

  for (const [file, contract] of Object.entries(expectedRoutes)) {
    it(`${contract.method} /${contract.path}`, () => {
      const source = readFileSync(join(ROUTE_ROOT, file), "utf8");
      const exports = [
        ...source.matchAll(
          /export (?:async )?function (DELETE|GET|PATCH|POST|PUT)\b/g,
        ),
      ].map((match) => match[1]);
      const proxyCall = source.match(
        /forwardAuthRequest\(request, "(DELETE|GET|PATCH|POST|PUT)", \[([^\]]+)\]\)/,
      );

      expect(exports).toEqual([contract.method]);
      expect(proxyCall?.[1]).toBe(contract.method);
      expect(readSegments(proxyCall?.[2] ?? "")).toBe(contract.path);
      expect(source).not.toMatch(/localhost|127\.0\.0\.1|:3000|NEXT_PUBLIC_/);
    });
  }
});

function readSegments(source: string): string {
  return [...source.matchAll(/"([^"]+)"|\b([a-z][A-Za-z0-9]*)\b/g)]
    .map((match) => match[1] ?? `:${match[2]}`)
    .join("/");
}

function walk(directory: string, files: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      walk(path, files);
    } else {
      files.push(path);
    }
  }
  return files;
}
