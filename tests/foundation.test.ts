import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("static project foundation", () => {
    it("uses static export and unoptimized images", () => {
        const source = readFileSync(
            resolve(process.cwd(), "next.config.ts"),
            "utf8",
        );
        expect(source).toContain('output: "export"');
        expect(source).toContain("unoptimized: true");
    });

    it("does not define an API endpoint in the environment template", () => {
        const source = readFileSync(resolve(process.cwd(), ".env.example"), "utf8");
        expect(source).not.toContain("API_URL");
    });
});