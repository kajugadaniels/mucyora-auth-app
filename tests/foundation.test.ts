import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Auth frontend foundation", () => {
    it("uses the Next.js server runtime and unoptimized local images", () => {
        const source = readFileSync(
            resolve(process.cwd(), "next.config.ts"),
            "utf8",
        );
        expect(source).not.toContain('output: "export"');
        expect(source).toContain("unoptimized: true");
    });

    it("keeps the Auth upstream origin server-only", () => {
        const source = readFileSync(resolve(process.cwd(), ".env.example"), "utf8");
        expect(source).toContain("MUCYORA_AUTH_API_ORIGIN=");
        expect(source).not.toContain("NEXT_PUBLIC_MUCYORA_AUTH_API_ORIGIN");
    });
});
